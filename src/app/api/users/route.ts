import { NextResponse } from 'next/server';
import { createSupabaseServerClient, getServerUser, getUserRole } from '@/lib/supabase-server';

export async function GET() {
  try {
    const user = await getServerUser();
    if (!user) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const role = await getUserRole(user.id);
    if (role !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const supabase = await createSupabaseServerClient();

    // 获取所有用户角色
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: true });

    if (rolesError) {
      return NextResponse.json({ error: rolesError.message }, { status: 500 });
    }

    return NextResponse.json({ users: roles || [] });
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
