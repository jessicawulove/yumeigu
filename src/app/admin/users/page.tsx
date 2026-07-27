'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClientAsync } from '@/lib/supabase-browser';
import { Shield, ShieldCheck, Trash2, Users, Loader2, ArrowLeft } from 'lucide-react';

interface UserRole {
  user_id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'user';
  created_at: string;
}

export default function UserManagementPage() {
  const { authUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login');
      return;
    }
    if (authUser && authUser.role !== 'admin') {
      router.push('/');
      return;
    }
    if (authUser?.role === 'admin') {
      fetchUsers();
    }
  }, [authUser, authLoading, router]);

  async function fetchUsers() {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(userId: string, newRole: 'admin' | 'user') {
    setUpdatingId(userId);
    try {
      const res = await fetch(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        setUsers(prev =>
          prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u)
        );
      }
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  async function deleteUser(userId: string, email: string) {
    if (!confirm(`确定要删除用户 ${email} 吗？该操作仅移除权限记录，不会删除 Supabase 账号。`)) {
      return;
    }
    try {
      const res = await fetch(`/api/users/${userId}/role`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(prev => prev.filter(u => u.user_id !== userId));
      }
    } catch {
      // ignore
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );
  }

  if (!authUser || authUser.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-6 py-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/')}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">用户权限管理</h1>
              <p className="mt-1 text-sm text-slate-500">
                管理系统用户权限，只有管理员可以访问此页面
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-amber-50 p-2.5">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{users.length}</p>
                <p className="text-sm text-slate-500">总用户数</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2.5">
                <ShieldCheck className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {users.filter(u => u.role === 'admin').length}
                </p>
                <p className="text-sm text-slate-500">管理员</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2.5">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">
                  {users.filter(u => u.role === 'user').length}
                </p>
                <p className="text-sm text-slate-500">普通用户</p>
              </div>
            </div>
          </div>
        </div>

        {/* User List */}
        <div className="rounded-xl bg-white shadow-sm">
          <div className="border-b px-6 py-4">
            <h2 className="text-lg font-semibold text-slate-900">用户列表</h2>
          </div>

          {users.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-slate-300" />
              <p className="mt-4 text-slate-500">暂无用户数据</p>
              <p className="mt-1 text-sm text-slate-400">
                新用户注册后将自动出现在此列表中
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {users.map(user => (
                <div
                  key={user.user_id}
                  className="flex items-center justify-between px-6 py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium text-white ${
                      user.role === 'admin' ? 'bg-amber-500' : 'bg-slate-400'
                    }`}>
                      {(user.full_name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900">
                          {user.full_name || user.email.split('@')[0]}
                        </p>
                        {user.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                            <ShieldCheck className="h-3 w-3" />
                            管理员
                          </span>
                        )}
                        {user.user_id === authUser.user.id && (
                          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">
                            当前用户
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      <p className="text-xs text-slate-400">
                        注册时间：{new Date(user.created_at).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {user.role === 'user' ? (
                      <button
                        onClick={() => updateRole(user.user_id, 'admin')}
                        disabled={updatingId === user.user_id}
                        className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50"
                      >
                        设为管理员
                      </button>
                    ) : user.user_id !== authUser.user.id ? (
                      <button
                        onClick={() => updateRole(user.user_id, 'user')}
                        disabled={updatingId === user.user_id}
                        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                      >
                        取消管理员
                      </button>
                    ) : null}

                    {user.user_id !== authUser.user.id && (
                      <button
                        onClick={() => deleteUser(user.user_id, user.email)}
                        className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                        title="删除用户"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tip */}
        <div className="mt-6 rounded-xl bg-amber-50 border border-amber-100 px-5 py-4">
          <p className="text-sm text-amber-800">
            <strong>提示：</strong>第一个注册的用户自动成为管理员。管理员可以设置其他用户为管理员或普通用户。
            新用户注册后需要在此页面中手动添加到系统。
          </p>
        </div>
      </div>
    </div>
  );
}
