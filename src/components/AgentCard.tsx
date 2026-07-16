'use client';

import { Agent } from '@/lib/types';
import Link from 'next/link';

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <Link href={`/chat/${agent.id}`}>
      <div className="group cursor-pointer rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        {/* Icon & Name */}
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-2xl transition-colors group-hover:bg-amber-100">
            {agent.icon}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
              {agent.name}
            </h3>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                {agent.category === 'writing' ? '写作' :
                 agent.category === 'marketing' ? '营销' :
                 agent.category === 'development' ? '研发' :
                 agent.category === 'operations' ? '运营' :
                 agent.category === 'hr' ? '人事' :
                 agent.category === 'finance' ? '财务' :
                 agent.category === 'design' ? '设计' : agent.category}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {agent.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-50 pt-3">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{agent.usageCount.toLocaleString()} 次使用</span>
          </div>
          <div className="flex items-center gap-1">
            {agent.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-amber-50 px-2 py-0.5 text-xs text-amber-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
