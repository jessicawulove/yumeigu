'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClientWithRetry, waitForConfig } from '@/lib/supabase-browser';

const ALLOWED_DOMAIN = 'yumeigu.com';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [configReady, setConfigReady] = useState(false);
  const [configError, setConfigError] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'error' | 'success'>('error');

  useEffect(() => {
    waitForConfig().then((ready) => {
      setConfigReady(ready);
      if (!ready) setConfigError(true);
    }).catch(() => setConfigError(true));
  }, []);

  useEffect(() => {
    if (configReady) {
      getSupabaseBrowserClientWithRetry().then((supabase) => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            const cb = searchParams.get('callback') || '/';
            router.push(cb);
          }
        });
      });
    }
  }, [configReady, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const supabase = await getSupabaseBrowserClientWithRetry();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setMessageType('error');
        if (error.message.includes('Invalid login credentials')) {
          setMessage('邮箱或密码错误');
        } else if (error.message.includes('Email not confirmed')) {
          setMessage('邮箱未验证，请联系管理员');
        } else {
          setMessage(error.message);
        }
      } else if (data.user) {
        const cb = searchParams.get('callback') || '/';
        router.push(cb);
      }
    } catch {
      setMessageType('error');
      setMessage('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!registerEmail.endsWith('@' + ALLOWED_DOMAIN)) {
      setMessageType('error');
      setMessage(`只允许 @${ALLOWED_DOMAIN} 邮箱注册`);
      setLoading(false);
      return;
    }

    try {
      const supabase = await getSupabaseBrowserClientWithRetry();
      const { error } = await supabase.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: { data: { full_name: registerName } },
      });

      if (error) {
        setMessageType('error');
        setMessage(error.message);
      } else {
        setMessageType('success');
        setMessage('注册成功！正在登录...');
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: registerEmail,
          password: registerPassword,
        });
        if (!loginError) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await fetch('/api/users', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user_id: user.id, email: registerEmail, full_name: registerName }),
            });
          }
          const cb = searchParams.get('callback') || '/';
          router.push(cb);
        }
      }
    } catch {
      setMessageType('error');
      setMessage('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  if (!configReady && !configError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-amber-600 text-lg">加载中...</div>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-red-500 text-lg">配置加载失败，请刷新页面重试</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl shadow-lg mb-4">
            <span className="text-white text-2xl font-bold">Y</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">YUMEIGU</h1>
          <p className="text-slate-500 mt-1">智能体管理平台</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            {showRegister ? '注册账号' : '登录账号'}
          </h2>

          {!showRegister ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">邮箱</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={`your@${ALLOWED_DOMAIN}`}
                    required
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">密码</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="请输入密码"
                      required
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all pr-12"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                {message && (
                  <div className={`text-sm px-3 py-2 rounded-lg ${messageType === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message}</div>
                )}
                <button type="submit" disabled={loading} className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                  {loading ? '登录中...' : '登录'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  没有账号？{' '}
                  <button onClick={() => { setShowRegister(true); setMessage(''); }} className="text-amber-600 hover:text-amber-700 font-medium">点击注册</button>
                </p>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">姓名</label>
                  <input type="text" value={registerName} onChange={(e) => setRegisterName(e.target.value)} placeholder="请输入姓名" required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">邮箱</label>
                  <input type="email" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} placeholder={`your@${ALLOWED_DOMAIN}`} required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">密码</label>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} value={registerPassword} onChange={(e) => setRegisterPassword(e.target.value)} placeholder="请设置密码（至少6位）" required minLength={6} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all pr-12" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      )}
                    </button>
                  </div>
                </div>
                {message && (
                  <div className={`text-sm px-3 py-2 rounded-lg ${messageType === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>{message}</div>
                )}
                <button type="submit" disabled={loading} className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
                  {loading ? '注册中...' : '注册'}
                </button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  已有账号？{' '}
                  <button onClick={() => { setShowRegister(false); setMessage(''); }} className="text-amber-600 hover:text-amber-700 font-medium">返回登录</button>
                </p>
              </div>
            </>
          )}
        </div>

        <p className="text-center text-xs text-amber-700/40 mt-6">
          YUMEIGU 智能体管理平台 · 内部系统
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-amber-600 text-lg">加载中...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
