import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ALLOWED_DOMAIN = 'yumeigu.com';

export async function POST(request: NextRequest) {
  try {
    const { email, full_name, role } = await request.json();

    if (!email || !full_name) {
      return NextResponse.json({ error: '邮箱和姓名不能为空' }, { status: 400 });
    }

    // 验证邮箱域名
    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      return NextResponse.json({ error: `只允许 ${ALLOWED_DOMAIN} 邮箱注册` }, { status: 400 });
    }

    const supabaseUrl = process.env.COZE_SUPABASE_URL;
    const supabaseServiceKey = process.env.COZE_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase 配置缺失' }, { status: 500 });
    }

    // 使用 service_role 创建用户（绕过 RLS）
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // 检查邮箱是否已存在
    const { data: existingUsers } = await adminClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json({ error: '该邮箱已注册' }, { status: 400 });
    }

    // 生成随机密码
    const tempPassword = Math.random().toString(36).slice(-10) + 'A1!';

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
      role: role || 'user',
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
        role: role || 'user',
        temp_password: tempPassword,
      },
    });
  } catch (error) {
    console.error('Create user error:', error);
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
