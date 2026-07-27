import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient, getServerUser, getUserRole } from '@/lib/supabase-server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const currentRole = await getUserRole(currentUser.id);
    if (currentRole !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const { id } = await params;
    const { role } = await request.json();

    if (!['admin', 'user'].includes(role)) {
      return NextResponse.json({ error: '无效角色' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase
      .from('user_roles')
      .update({ role })
      .eq('user_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getServerUser();
    if (!currentUser) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }

    const currentRole = await getUserRole(currentUser.id);
    if (currentRole !== 'admin') {
      return NextResponse.json({ error: '无权限' }, { status: 403 });
    }

    const { id } = await params;

    // 不能删除自己
    if (id === currentUser.id) {
      return NextResponse.json({ error: '不能删除自己的账号' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    // 删除用户角色记录
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: '服务器错误' }, { status: 500 });
  }
}
