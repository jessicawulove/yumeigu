'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import AgentCard from '@/components/AgentCard';
import { Agent, CATEGORIES } from '@/lib/types';
import { getAgents } from '@/lib/store';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAgents(getAgents());
    setMounted(true);
  }, []);

  const filteredAgents = agents.filter((agent) => {
    if (agent.status !== 'active') return false;
    if (activeCategory !== 'all' && agent.category !== activeCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        agent.name.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            智能体广场
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            选择适合你的 AI 智能体，提升工作效率
          </p>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-150 ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Indicator */}
        {searchQuery && (
          <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
            <span>搜索结果：</span>
            <span className="font-medium text-slate-700">&quot;{searchQuery}&quot;</span>
            <span>·</span>
            <span>找到 {filteredAgents.length} 个智能体</span>
          </div>
        )}

        {/* Agent Grid */}
        {mounted && filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        ) : mounted ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 text-4xl">🔍</div>
            <p className="text-base font-medium text-slate-600">暂无匹配的智能体</p>
            <p className="mt-1 text-sm text-slate-400">
              尝试切换分类或修改搜索关键词
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-100 bg-white p-5">
                <div className="mb-3 flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-100" />
                  <div className="flex-1">
                    <div className="h-4 w-24 rounded bg-slate-100" />
                    <div className="mt-2 h-3 w-16 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="mb-4 space-y-2">
                  <div className="h-3 w-full rounded bg-slate-100" />
                  <div className="h-3 w-3/4 rounded bg-slate-100" />
                </div>
                <div className="h-3 w-20 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-slate-100 bg-white p-5">
                <div className="mb-3 flex items-start gap-3">
                  <div className="h-12 w-12 rounded-xl bg-slate-100" />
                  <div className="flex-1">
                    <div className="h-4 w-24 rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
