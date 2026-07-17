'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import {
  DATA_SOURCES,
  KNOWLEDGE_OUTPUTS,
  DataSourceItem,
  KnowledgeOutputItem,
} from '@/lib/types';
import { getSourceItems, getOutputItems, addSourceItem } from '@/lib/knowledge-store';
import StrategyModal from '@/components/StrategyModal';
import {
  Users,
  Mail,
  Linkedin,
  Package,
  Globe,
  FileText,
  Award,
  UserCircle,
  MailPlus,
  ListChecks,
  Tags,
  Trophy,
  HelpCircle,
  Megaphone,
  Target,
  Brain,
  BookOpen,
  Zap,
  Link2,
  Archive,
  ArrowRight,
  X,
  Plus,
  BrainCircuit,
  Network,
  TrendingUp,
  Lightbulb,
  Repeat,
  GraduationCap,
  Share2,
  ChevronRight,
  Inbox,
  Sparkles,
} from 'lucide-react';

const SOURCE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Inbox, Package, Globe, Users, Mail, FileText, Award,
};

const OUTPUT_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  UserCircle, MailPlus, ListChecks, Tags, Trophy, HelpCircle, Megaphone, Target,
};

type DetailPanel = {
  type: 'source' | 'output';
  id: string;
  name: string;
  items: DataSourceItem[] | KnowledgeOutputItem[];
} | null;

export default function KnowledgePage() {
  const [activeSourceId, setActiveSourceId] = useState<string | null>(null);
  const [detailPanel, setDetailPanel] = useState<DetailPanel>(null);
  const [sourceItems, setSourceItems] = useState<DataSourceItem[]>([]);
  const [outputItems, setOutputItems] = useState<KnowledgeOutputItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', summary: '', tags: '' });
  const [mounted, setMounted] = useState(false);
  const [strategyCustomer, setStrategyCustomer] = useState<DataSourceItem | null>(null);

  useEffect(() => {
    setSourceItems(getSourceItems());
    setOutputItems(getOutputItems());
    setMounted(true);
  }, []);

  const activeSource = DATA_SOURCES.find((s) => s.id === activeSourceId);
  const filteredSourceItems = activeSourceId
    ? sourceItems.filter((i) => i.sourceId === activeSourceId)
    : sourceItems;

  const handleSourceClick = (sourceId: string) => {
    setActiveSourceId(sourceId === activeSourceId ? null : sourceId);
  };

  const handleOutputClick = (outputId: string) => {
    const output = KNOWLEDGE_OUTPUTS.find((o) => o.id === outputId);
    if (!output) return;
    const items = getOutputItems(outputId);
    setDetailPanel({ type: 'output', id: outputId, name: output.name, items });
  };

  const handleSourceDetailClick = (sourceId: string) => {
    const source = DATA_SOURCES.find((s) => s.id === sourceId);
    if (!source) return;
    const items = getSourceItems(sourceId);
    setDetailPanel({ type: 'source', id: sourceId, name: source.name, items });
  };

  const handleAddItem = () => {
    if (!newItem.title.trim() || !activeSourceId) return;
    const item: DataSourceItem = {
      id: `ds-${Date.now()}`,
      sourceId: activeSourceId,
      title: newItem.title.trim(),
      summary: newItem.summary.trim(),
      date: new Date().toISOString().split('T')[0],
      tags: newItem.tags.split(',').map((t) => t.trim()).filter(Boolean),
    };
    addSourceItem(item);
    setSourceItems(getSourceItems());
    setNewItem({ title: '', summary: '', tags: '' });
    setShowAddForm(false);
  };

  const aiCapabilities = [
    {
      title: 'AI 整理能力',
      subtitle: 'Codex 智能层',
      icon: BrainCircuit,
      items: ['自动整理信息', '提炼客户痛点', '生成开发信', '生成跟进 SOP', '标签分类/总结复盘', '自动输出模板'],
      gradient: 'from-blue-600 to-indigo-700',
      bgAccent: 'bg-blue-500/10',
      textAccent: 'text-blue-400',
    },
    {
      title: '知识沉淀能力',
      subtitle: 'Obsidian 知识层',
      icon: Network,
      items: ['双向链接', '知识图谱', '永久沉淀', '项目归档', '标签管理', '可视化关联'],
      gradient: 'from-amber-500 to-orange-600',
      bgAccent: 'bg-amber-500/10',
      textAccent: 'text-amber-400',
    },
  ];

  const threeFeatures = [
    { icon: Archive, label: '结构化沉淀', desc: '信息有序归类，不再散落' },
    { icon: Link2, label: '智能关联', desc: '自动发现知识间的隐藏联系' },
    { icon: TrendingUp, label: '持续进化', desc: '知识随业务增长不断迭代' },
  ];

  const finalValues = [
    { icon: Lightbulb, title: '经验自动沉淀', desc: '不再依赖个人记忆，团队智慧永久留存' },
    { icon: Repeat, title: '客户开发可复用', desc: '模板/方法/话术一键复用，效率翻倍' },
    { icon: GraduationCap, title: '新人快速上手', desc: '缩短学习曲线，快速出单' },
    { icon: Share2, title: '团队知识共享', desc: '统一标准，协同增效' },
  ];

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Data Sources */}
        <aside className="w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white">
          <div className="p-4">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              数据来源
            </h2>
            <p className="mb-4 text-xs text-slate-400">输入层 / Input</p>
            <div className="space-y-1">
              {DATA_SOURCES.map((source) => {
                const Icon = SOURCE_ICON_MAP[source.icon] || FileText;
                const count = sourceItems.filter((i) => i.sourceId === source.id).length;
                const isActive = activeSourceId === source.id;
                return (
                  <button
                    key={source.id}
                    onClick={() => handleSourceClick(source.id)}
                    className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all ${
                      isActive
                        ? 'bg-amber-50 text-amber-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-amber-500' : 'text-slate-400 group-hover:text-slate-500'}`} />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{source.name}</span>
                    <span className={`shrink-0 text-xs ${isActive ? 'text-amber-500' : 'text-slate-400'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Source Items Preview */}
          {activeSourceId && mounted && (
            <div className="border-t border-slate-100 p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-slate-500">数据条目</h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700"
                >
                  <Plus className="h-3 w-3" />
                  添加
                </button>
              </div>

              {showAddForm && (
                <div className="mb-3 space-y-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3">
                  <input
                    type="text"
                    placeholder="标题"
                    value={newItem.title}
                    onChange={(e) => setNewItem((n) => ({ ...n, title: e.target.value }))}
                    className="w-full rounded border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-amber-400"
                  />
                  <textarea
                    placeholder="摘要"
                    value={newItem.summary}
                    onChange={(e) => setNewItem((n) => ({ ...n, summary: e.target.value }))}
                    rows={2}
                    className="w-full resize-none rounded border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-amber-400"
                  />
                  <input
                    type="text"
                    placeholder="标签 (逗号分隔)"
                    value={newItem.tags}
                    onChange={(e) => setNewItem((n) => ({ ...n, tags: e.target.value }))}
                    className="w-full rounded border border-slate-200 px-2 py-1.5 text-xs outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleAddItem}
                    className="w-full rounded bg-amber-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-600"
                  >
                    保存
                  </button>
                </div>
              )}

              <div className="space-y-2">
                {filteredSourceItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="group/item rounded-lg border border-slate-100 transition-colors hover:border-amber-200 hover:bg-amber-50/30"
                  >
                    <button
                      onClick={() => handleSourceDetailClick(item.sourceId)}
                      className="block w-full p-2.5 text-left"
                    >
                      <p className="truncate text-xs font-medium text-slate-700">{item.title}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-400">{item.summary}</p>
                      <div className="mt-1.5 flex items-center gap-1">
                        {item.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                            {tag}
                          </span>
                        ))}
                        <span className="ml-auto text-[10px] text-slate-400">{item.date}</span>
                      </div>
                    </button>
                    {item.sourceId === 'customer' && (
                      <div className="border-t border-slate-50 px-2.5 py-1.5">
                        <button
                          onClick={() => setStrategyCustomer(item)}
                          className="flex w-full items-center justify-center gap-1 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1 text-[10px] font-medium text-white transition-all hover:from-amber-600 hover:to-orange-600"
                        >
                          <Sparkles className="h-3 w-3" />
                          生成开发策略
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {filteredSourceItems.length > 5 && (
                  <button
                    onClick={() => handleSourceDetailClick(activeSourceId)}
                    className="flex w-full items-center justify-center gap-1 rounded-lg py-2 text-xs text-amber-600 hover:bg-amber-50"
                  >
                    查看全部 {filteredSourceItems.length} 条
                    <ChevronRight className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* Center Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-4xl px-8 py-8">
            {/* Hero Title */}
            <div className="mb-8 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-amber-400">
                <Zap className="h-3 w-3" />
                Trade Knowledge Base
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                外贸知识库
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                将散落的业务经验转化为可复用的团队智慧
              </p>
            </div>

            {/* AI Capabilities */}
            <div className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Brain className="h-4 w-4 text-amber-500" />
                核心能力
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {aiCapabilities.map((cap) => {
                  const CapIcon = cap.icon;
                  return (
                    <div
                      key={cap.title}
                      className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                    >
                      <div className={`absolute inset-0 ${cap.bgAccent} opacity-0 transition-opacity group-hover:opacity-100`} />
                      <div className="relative">
                        <div className="mb-3 flex items-center gap-3">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${cap.gradient}`}>
                            <CapIcon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-slate-900">{cap.title}</h3>
                            <p className="text-xs text-slate-400">{cap.subtitle}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {cap.items.map((item) => (
                            <div key={item} className="flex items-center gap-1.5 text-xs text-slate-600">
                              <div className="h-1 w-1 rounded-full bg-amber-400" />
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Three Features */}
            <div className="mb-8">
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <BookOpen className="h-4 w-4 text-amber-500" />
                三大特性
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {threeFeatures.map((feat) => {
                  const FeatIcon = feat.icon;
                  return (
                    <div
                      key={feat.label}
                      className="flex flex-col items-center rounded-xl border border-slate-100 bg-gradient-to-b from-white to-slate-50/50 p-5 text-center shadow-sm"
                    >
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900">
                        <FeatIcon className="h-5 w-5 text-amber-400" />
                      </div>
                      <h3 className="mb-1 text-sm font-semibold text-slate-900">{feat.label}</h3>
                      <p className="text-xs text-slate-500">{feat.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Final Values */}
            <div>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Target className="h-4 w-4 text-amber-500" />
                最终价值
              </h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {finalValues.map((val) => {
                  const ValIcon = val.icon;
                  return (
                    <div
                      key={val.title}
                      className="group rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-all hover:border-amber-200 hover:shadow-md"
                    >
                      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 transition-colors group-hover:bg-amber-100">
                        <ValIcon className="h-4 w-4 text-amber-600" />
                      </div>
                      <h3 className="mb-1 text-sm font-semibold text-slate-900">{val.title}</h3>
                      <p className="text-xs leading-relaxed text-slate-500">{val.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </main>

        {/* Right Sidebar - Knowledge Outputs */}
        <aside className="w-64 shrink-0 overflow-y-auto border-l border-slate-200 bg-white">
          <div className="p-4">
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
              知识产出
            </h2>
            <p className="mb-4 text-xs text-slate-400">输出层 / Output</p>
            <div className="space-y-1">
              {KNOWLEDGE_OUTPUTS.map((output) => {
                const Icon = OUTPUT_ICON_MAP[output.icon] || FileText;
                const count = outputItems.filter((i) => i.outputId === output.id).length;
                return (
                  <button
                    key={output.id}
                    onClick={() => handleOutputClick(output.id)}
                    className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-slate-600 transition-all hover:bg-amber-50 hover:text-amber-700"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-amber-500" />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{output.name}</span>
                    <span className="shrink-0 text-xs text-slate-400">{count}</span>
                    <ArrowRight className="h-3 w-3 shrink-0 text-slate-300 transition-colors group-hover:text-amber-400" />
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Strategy Modal */}
      {strategyCustomer && (
        <StrategyModal
          customerItem={strategyCustomer}
          onClose={() => setStrategyCustomer(null)}
        />
      )}

      {/* Detail Panel Overlay */}
      {detailPanel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 flex max-h-[80vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{detailPanel.name}</h2>
                <p className="text-xs text-slate-400">
                  {detailPanel.type === 'source' ? '数据来源详情' : '知识产出详情'} · 共 {detailPanel.items.length} 条
                </p>
              </div>
              <button
                onClick={() => setDetailPanel(null)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-3">
                {detailPanel.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-100 p-4 transition-colors hover:border-amber-200 hover:bg-amber-50/20"
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <h3 className="text-sm font-semibold text-slate-900">{item.title}</h3>
                      <span className="shrink-0 text-xs text-slate-400">{item.date}</span>
                    </div>
                    <p className="mb-3 text-sm leading-relaxed text-slate-600">
                      {'content' in item ? (item as KnowledgeOutputItem).content : (item as DataSourceItem).summary}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
