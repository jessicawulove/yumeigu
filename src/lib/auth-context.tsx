'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { getSupabaseBrowserClientAsync } from '@/lib/supabase-browser';

interface AuthUser {
  user: User;
  role: 'admin' | 'user';
}

interface AuthContextType {
  authUser: AuthUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  authUser: null,
  isLoading: true,
  signOut: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const supabase = await getSupabaseBrowserClientAsync();

        // 获取当前用户
        const { data: { user } } = await supabase.auth.getUser();
        if (user && mounted) {
          // 查询用户角色
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .maybeSingle();

          setAuthUser({
            user,
            role: (roleData?.role as 'admin' | 'user') || 'user',
          });
        }

        // 监听认证状态变化
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;

            if (event === 'SIGNED_OUT') {
              setAuthUser(null);
            } else if (session?.user) {
              const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', session.user.id)
                .maybeSingle();

              setAuthUser({
                user: session.user,
                role: (roleData?.role as 'admin' | 'user') || 'user',
              });
            }
          }
        );

        if (mounted) setIsLoading(false);

        return () => {
          subscription.unsubscribe();
        };
      } catch {
        if (mounted) {
          setIsLoading(false);
          setAuthUser(null);
        }
      }
    }

    initAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signOut = async () => {
    try {
      const supabase = await getSupabaseBrowserClientAsync();
      await supabase.auth.signOut();
      setAuthUser(null);
    } catch {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ authUser, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
