'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSupabaseBrowserClientAsync } from '@/lib/supabase-browser';

export interface AuthUser {
  user: { id: string; email?: string; user_metadata?: { full_name?: string } };
  role: 'admin' | 'user';
}

interface AuthContextType {
  authUser: AuthUser | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ authUser: null, isLoading: true, signOut: async () => {} });

export const useAuth = () => useContext(AuthContext);

const PUBLIC_PATHS = ['/login'];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        const supabase = await getSupabaseBrowserClientAsync();
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (mounted) {
            setAuthUser({
              user: session.user,
              role: (roleData?.role as 'admin' | 'user') || 'user',
            });
          }
        } else if (mounted && !PUBLIC_PATHS.includes(pathname)) {
          router.replace('/login?redirect=' + encodeURIComponent(pathname));
          return;
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (!mounted) return;
            if (event === 'SIGNED_OUT') {
              setAuthUser(null);
              if (!PUBLIC_PATHS.includes(pathname)) {
                router.replace('/login');
              }
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
  }, [pathname, router]);

  const signOut = async () => {
    try {
      const supabase = await getSupabaseBrowserClientAsync();
      await supabase.auth.signOut();
      setAuthUser(null);
      router.push('/login');
    } catch {
      // ignore
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="text-amber-600 text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ authUser, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
