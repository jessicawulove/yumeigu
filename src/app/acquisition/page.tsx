'use client';

import dynamic from 'next/dynamic';

const AcquisitionContent = dynamic(() => import('./AcquisitionContent'), {
  loading: () => (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 text-sm">加载获客系统中...</p>
      </div>
    </div>
  ),
  ssr: false,
});

export default function AcquisitionPage() {
  return <AcquisitionContent />;
}
