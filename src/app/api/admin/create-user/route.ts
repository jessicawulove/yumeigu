import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_DOMAIN = 'yumeigu.com';

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const supabaseUrl = process.env.COZE_SUPABASE_URL;
    const supabaseAnonKey = process.env.COZE_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.COZE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase 配置缺失' }, { status: 500 });
    }

    // 验证当前用户是否为管理员
    const client = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { authorization: authHeader } },
    });

    const { data: { user } } = await client.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '用户未登录' }, { status: 401 });
    }

    const { data: roleData } = await client
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!roleData || roleData.role !== 'admin') {
      return NextResponse.json({ error: '需要管理员权限' }, { status: 403 });
    }

    const body = await request.json();
    const email = body.email;
    const full_name = body.full_name || body.fullName;
    const password = body.password;

    if (!email || !full_name) {
      return NextResponse.json({ error: '邮箱和姓名不能为空' }, { status: 400 });
    }

    // 验证邮箱域名
    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      return NextResponse.json({ error: `只允许 ${ALLOWED_DOMAIN} 邮箱注册` }, { status: 400 });
    }

    // 使用 service_role 创建用户（绕过 RLS）
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // 检查邮箱是否已存在
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json({ error: '该邮箱已注册' }, { status: 400 });
    }

    // 使用表单密码或生成随机密码
    const tempPassword = password || (Math.random().toString(36).slice(-10) + 'A1!');

    // 创建用户
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true, // 直接确认邮箱，无需验证
      user_metadata: {
        full_name,
      },
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    // 创建 user_roles 记录
    const { error: roleError } = await adminClient.from('user_roles').insert({
      user_id: newUser.user.id,
      email,
      full_name,
      role: 'user',
    });

    if (roleError) {
      return NextResponse.json({ error: '角色创建失败: ' + roleError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: '员工账号创建成功',
      data: {
        email,
        full_name,
        role: 'user',
        temp_password: tempPassword,
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
