'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { Agent, CATEGORIES } from '@/lib/types';
import { getAgents, addAgent, updateAgent, deleteAgent } from '@/lib/store';

type ModalMode = 'create' | 'edit' | null;

interface FormData {
  name: string;
  description: string;
  icon: string;
  category: string;
  tags: string;
  systemPrompt: string;
}

const EMPTY_FORM: FormData = {
  name: '',
  description: '',
  icon: '🤖',
  category: 'writing',
  tags: '',
  systemPrompt: '',
};

const ICON_OPTIONS = ['🤖', '✍️', '💻', '📊', '👥', '💰', '📢', '🎨', '📝', '📄', '🚀', '🔧', '📚', '🎯', '💡', '🔍'];

export default function AdminPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setAgents(getAgents());
    setMounted(true);
  }, []);

  const refreshAgents = () => setAgents(getAgents());

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setModalMode('create');
  };

  const openEdit = (agent: Agent) => {
    setForm({
      name: agent.name,
      description: agent.description,
      icon: agent.icon,
      category: agent.category,
      tags: agent.tags.join(', '),
      systemPrompt: agent.systemPrompt,
    });
    setEditingId(agent.id);
    setModalMode('edit');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim()) return;

    const tags = form.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (modalMode === 'create') {
      const newAgent: Agent = {
        id: `agent-${Date.now()}`,
        name: form.name.trim(),
        description: form.description.trim(),
        icon: form.icon,
        category: form.category,
        tags,
        usageCount: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        systemPrompt: form.systemPrompt.trim(),
      };
      addAgent(newAgent);
    } else if (modalMode === 'edit' && editingId) {
      updateAgent(editingId, {
        name: form.name.trim(),
        description: form.description.trim(),
        icon: form.icon,
        category: form.category,
        tags,
        systemPrompt: form.systemPrompt.trim(),
      });
    }

    setModalMode(null);
    refreshAgents();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个智能体吗？')) {
      deleteAgent(id);
      refreshAgents();
    }
  };

  const handleToggleStatus = (agent: Agent) => {
    updateAgent(agent.id, {
      status: agent.status === 'active' ? 'inactive' : 'active',
    });
    refreshAgents();
  };

  // Stats
  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const totalUsage = agents.reduce((sum, a) => sum + a.usageCount, 0);
  const categoryStats = CATEGORIES.filter((c) => c.id !== 'all').map((cat) => ({
    ...cat,
    count: agents.filter((a) => a.category === cat.id).length,
  }));

  // Employee management
  const [activeTab, setActiveTab] = useState<'agents' | 'employees'>('agents');
  const [employees, setEmployees] = useState<{ id: string; email: string; fullName: string; role: string; createdAt: string }[]>([]);
  const [showCreateEmployee, setShowCreateEmployee] = useState(false);
  const [empForm, setEmpForm] = useState({ email: '', fullName: '', password: '' });
  const [empLoading, setEmpLoading] = useState(false);
  const [empMsg, setEmpMsg] = useState('');

  useEffect(() => {
    if (activeTab === 'employees') loadEmployees();
  }, [activeTab]);

  const loadEmployees = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data.users || []);
      }
    } catch {}
  };

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.email.endsWith('@yumeigu.com')) {
      setEmpMsg('只能使用 @yumeigu.com 邮箱');
      return;
    }
    setEmpLoading(true);
    setEmpMsg('');
    try {
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(empForm),
      });
      const data = await res.json();
      if (res.ok) {
        setEmpMsg('创建成功！');
        setEmpForm({ email: '', fullName: '', password: '' });
        setShowCreateEmployee(false);
        loadEmployees();
      } else {
        setEmpMsg(data.error || '创建失败');
      }
    } catch {
      setEmpMsg('网络错误');
    }
    setEmpLoading(false);
  };

  const handleDeleteEmployee = async (userId: string, email: string) => {
    if (!confirm(`确定删除员工 ${email} 吗？`)) return;
    try {
      const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' });
      if (res.ok) loadEmployees();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              管理后台
            </h1>
            <p className="mt-1.5 text-sm text-slate-500">
              管理平台智能体和员工账号
            </p>
          </div>
          {activeTab === 'agents' ? (
            <button
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新建智能体
            </button>
          ) : (
            <button
              onClick={() => setShowCreateEmployee(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              创建员工账号
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-slate-100 p-1 w-fit">
          <button
            onClick={() => setActiveTab('agents')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'agents' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            智能体管理
          </button>
          <button
            onClick={() => setActiveTab('employees')}
            className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'employees' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            员工管理
          </button>
        </div>

        {activeTab === 'agents' ? (
        <>
        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">智能体总数</div>
            <div className="mt-1 text-3xl font-bold text-slate-900">{totalAgents}</div>
            <div className="mt-1 text-xs text-slate-400">
              已上架 {activeAgents} 个
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="text-sm text-slate-500">累计使用次数</div>
            <div className="mt-1 text-3xl font-bold text-slate-900">
              {totalUsage.toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-slate-400">
              所有智能体合计
            </div>
          </div>
          <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-2 text-sm text-slate-500">分类分布</div>
            <div className="flex flex-wrap gap-1.5">
              {categoryStats
                .filter((c) => c.count > 0)
                .map((cat) => (
                  <span
                    key={cat.id}
                    className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                  >
                    {cat.icon} {cat.name} {cat.count}
                  </span>
                ))}
            </div>
          </div>
        </div>

        {/* Agent List */}
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">
              智能体列表
            </h2>
          </div>
          {mounted && agents.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/50"
                >
                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-xl">
                    {agent.icon}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-slate-900">
                        {agent.name}
                      </h3>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          agent.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {agent.status === 'active' ? '已上架' : '已下架'}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-500">
                      {agent.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="hidden shrink-0 text-right sm:block">
                    <div className="text-sm font-medium text-slate-700">
                      {agent.usageCount.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400">次使用</div>
                  </div>

                  {/* Category */}
                  <div className="hidden shrink-0 sm:block">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                      {CATEGORIES.find((c) => c.id === agent.category)?.name || agent.category}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      onClick={() => handleToggleStatus(agent)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                        agent.status === 'active'
                          ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                          : 'text-amber-600 hover:bg-amber-50'
                      }`}
                    >
                      {agent.status === 'active' ? '下架' : '上架'}
                    </button>
                    <button
                      onClick={() => openEdit(agent)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => handleDelete(agent.id)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-slate-400">
              暂无智能体，点击上方按钮创建
            </div>
          )}
        </div>
        </>
        ) : (
        /* Employees Section */
        <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="text-base font-semibold text-slate-900">员工列表</h2>
          </div>
          {employees.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {employees.map((emp) => (
                <div key={emp.id} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-slate-50/50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-700">
                    {(emp.fullName || emp.email)[0].toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-sm font-semibold text-slate-900">{emp.fullName || emp.email}</h3>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${emp.role === 'admin' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'}`}>
                        {emp.role === 'admin' ? '管理员' : '员工'}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-500">{emp.email}</p>
                  </div>
                  <div className="text-xs text-slate-400">{emp.createdAt}</div>
                  {emp.role !== 'admin' && (
                    <button onClick={() => handleDeleteEmployee(emp.id, emp.email)} className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600">删除</button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-slate-400">暂无员工，点击上方按钮创建</div>
          )}
        </div>
        )}
      </main>

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                {modalMode === 'create' ? '新建智能体' : '编辑智能体'}
              </h2>
              <button
                onClick={() => setModalMode(null)}
                className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Icon Selection */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  图标
                </label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, icon }))}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-all ${
                        form.icon === icon
                          ? 'bg-amber-100 ring-2 ring-amber-500'
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="输入智能体名称"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  描述 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="描述智能体的功能"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  分类
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  标签
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                  placeholder="用逗号分隔，如：写作, 营销, 创意"
                  className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                />
              </div>

              {/* System Prompt */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  系统提示词
                </label>
                <textarea
                  value={form.systemPrompt}
                  onChange={(e) => setForm((f) => ({ ...f, systemPrompt: e.target.value }))}
                  placeholder="定义智能体的角色和行为"
                  rows={3}
                  className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
                >
                  {modalMode === 'create' ? '创建' : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Employee Modal */}
      {showCreateEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">创建员工账号</h2>
              <button onClick={() => { setShowCreateEmployee(false); setEmpMsg(''); }} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleCreateEmployee} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">邮箱 <span className="text-red-500">*</span></label>
                <input type="email" value={empForm.email} onChange={(e) => setEmpForm((f) => ({ ...f, email: e.target.value }))} placeholder="employee@yumeigu.com" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10" required />
                <p className="mt-1 text-xs text-slate-400">只能使用 @yumeigu.com 邮箱</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">姓名</label>
                <input type="text" value={empForm.fullName} onChange={(e) => setEmpForm((f) => ({ ...f, fullName: e.target.value }))} placeholder="员工姓名" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">初始密码 <span className="text-red-500">*</span></label>
                <input type="password" value={empForm.password} onChange={(e) => setEmpForm((f) => ({ ...f, password: e.target.value }))} placeholder="至少6位" className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10" required minLength={6} />
              </div>
              {empMsg && <p className={`text-sm ${empMsg.includes('成功') ? 'text-emerald-600' : 'text-red-500'}`}>{empMsg}</p>}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateEmployee(false); setEmpMsg(''); }} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">取消</button>
                <button type="submit" disabled={empLoading} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50">{empLoading ? '创建中...' : '创建'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
