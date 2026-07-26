import type { Metadata } from 'next';
import './globals.css';
import { SupabaseConfigProvider } from '@/lib/supabase-config-inject';

export const metadata: Metadata = {
  title: 'YUMEIGU 智能体工具箱',
  description: '公司内部智能体管理平台，统一入口访问各类 AI 智能体',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <SupabaseConfigProvider>
          {children}
        </SupabaseConfigProvider>
      </body>
    </html>
  );
}
