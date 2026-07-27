'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { LogOut, ShieldCheck, Users } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { authUser, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const navItems = [
    { href: '/', label: '智能体广场' },
    { href: '/acquisition', label: '获客系统' },
    { href: '/knowledge', label: '外贸知识库' },
    { href: '/crm', label: 'CRM' },
    { href: '/blog', label: '博客' },
    { href: '/admin', label: '管理后台' },
  ];

  const userInitial = authUser
    ? (authUser.user.user_metadata?.full_name || authUser.user.email || '?').charAt(0).toUpperCase()
    : '?';

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500 text-sm font-bold text-white">
            Y
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-900">
            YUMEIGU
          </span>
          <span className="hidden text-sm text-slate-400 sm:inline">
            智能体工具箱
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === item.href || (item.href === '/' && pathname === '')
                  ? 'bg-amber-50 text-amber-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <form onSubmit={handleSearch} className="ml-auto flex-1 max-w-md">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="搜索智能体..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-500/10"
            />
          </div>
        </form>

        {/* User Menu */}
        <div className="relative flex shrink-0 items-center">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-50"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white ${
              authUser?.role === 'admin'
                ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                : 'bg-gradient-to-br from-slate-400 to-slate-500'
            }`}>
              {userInitial}
            </div>
            {authUser && (
              <span className="hidden text-sm text-slate-600 md:inline">
                {authUser.user.email?.split('@')[0]}
              </span>
            )}
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white py-2 shadow-lg">
                {authUser && (
                  <>
                    <div className="border-b px-4 py-3">
                      <p className="text-sm font-medium text-slate-900">
                        {authUser.user.email}
                      </p>
                      <div className="mt-1 flex items-center gap-1">
                        {authUser.role === 'admin' ? (
                          <>
                            <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />
                            <span className="text-xs text-amber-600">管理员</span>
                          </>
                        ) : (
                          <>
                            <Users className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-xs text-slate-500">普通用户</span>
                          </>
                        )}
                      </div>
                    </div>
                    {authUser.role === 'admin' && (
                      <Link
                        href="/admin/users"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        用户权限管理
                      </Link>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      退出登录
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
