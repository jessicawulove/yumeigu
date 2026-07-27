'use client';

import { useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, UserPlus, CheckCircle, Handshake, DollarSign, RefreshCw, Plus,
  Search, Filter, Edit, Mail, MoreVertical, Phone, FileText,
  Star, Users, Bell, Brain, BarChart3, PieChart as PieIcon,
  Bot, Send, MessageSquare, ClipboardList, Calendar, Download,
  Play, Settings, Shield, ChevronLeft, ChevronRight, ArrowUp, Info,
  Ban, Check, Zap, ArrowRight, UserCheck, TriangleAlert, X
} from 'lucide-react';

type TabId = 'dashboard' | 'leads' | 'pipeline' | 'customers' | 'sop' | 'email' | 'tasks' | 'analytics' | 'reports' | 'agent' | 'settings';

interface EmailConfig {
  smtpHost: string;
  smtpPort: string;
  smtpUser: string;
  smtpPass: string;
  fromName: string;
  fromEmail: string;
}

const funnelData = [
  { date: '7/1', newLeads: 12, valid: 8, deal: 1 },
  { date: '7/5', newLeads: 18, valid: 12, deal: 2 },
  { date: '7/10', newLeads: 15, valid: 10, deal: 1 },
  { date: '7/15', newLeads: 22, valid: 15, deal: 3 },
  { date: '7/20', newLeads: 15, valid: 10, deal: 0 },
  { date: '7/21', newLeads: 12, valid: 8, deal: 1 },
];

const sourceData = [
  { name: '官网询盘', value: 35, color: '#F5A623' },
  { name: 'LinkedIn', value: 28, color: '#3b82f6' },
  { name: '展会', value: 18, color: '#10b981' },
  { name: 'Facebook', value: 10, color: '#8b5cf6' },
  { name: '老客户转介', value: 6, color: '#06b6d4' },
  { name: '其他', value: 3, color: '#6b7280' },
];

const conversionData = [
  { stage: '新线索', count: 156, color: '#F5A623' },
  { stage: '已联系', count: 107, color: '#3b82f6' },
  { stage: '需求确认', count: 68, color: '#8b5cf6' },
  { stage: '报价', count: 45, color: '#06b6d4' },
  { stage: '成交', count: 20, color: '#10b981' },
];

const monthlyData = [
  { month: '1月', amount: 120 },
  { month: '2月', amount: 145 },
  { month: '3月', amount: 180 },
  { month: '4月', amount: 165 },
  { month: '5月', amount: 210 },
  { month: '6月', amount: 240 },
  { month: '7月', amount: 284 },
];

const teamData = [
  { subject: '线索开发', admin: 90, manager: 75, staff: 85 },
  { subject: '客户跟进', admin: 85, manager: 90, staff: 78 },
  { subject: '成交转化', admin: 88, manager: 82, staff: 75 },
  { subject: '邮件营销', admin: 92, manager: 78, staff: 85 },
  { subject: '视频验厂', admin: 80, manager: 95, staff: 70 },
  { subject: '报价谈判', admin: 87, manager: 85, staff: 80 },
];

const leads = [
  { name: 'AsiaFloor Partners', contact: 'Mr. Chen', country: '新加坡', source: 'LinkedIn', sourceBg: 'bg-blue-500/20 text-blue-400', product: '研磨机LJ600V, 环氧材料', score: 92, stage: '需求确认', stageBg: 'bg-purple-500/20 text-purple-400', time: '2小时前', initial: 'A', gradient: 'amber' },
  { name: 'Gulf Construction LLC', contact: 'Ahmed Al-Rashid', country: '阿联酋', source: '官网询盘', sourceBg: 'bg-emerald-500/20 text-emerald-400', product: '环氧地坪27系列', score: 88, stage: '报价中', stageBg: 'bg-cyan-500/20 text-cyan-400', time: '4小时前', initial: 'G', gradient: 'blue' },
  { name: 'EuroFlooring GmbH', contact: 'Klaus Mueller', country: '德国', source: '展会', sourceBg: 'bg-amber-500/20 text-amber-400', product: '研磨机LJ600V, 金刚石磨片', score: 85, stage: '已成交', stageBg: 'bg-emerald-500/20 text-emerald-400', time: '2小时前', initial: 'E', gradient: 'emerald' },
  { name: 'Middle East Flooring', contact: 'Omar Hassan', country: '沙特', source: 'Facebook', sourceBg: 'bg-blue-500/20 text-blue-400', product: '洗地机X510, 培训服务', score: 81, stage: '已联系', stageBg: 'bg-blue-500/20 text-blue-400', time: '昨天', initial: 'M', gradient: 'purple' },
  { name: 'African Industries', contact: 'James Okonkwo', country: '尼日利亚', source: '官网询盘', sourceBg: 'bg-emerald-500/20 text-emerald-400', product: '全品类(研磨机+材料+耗材)', score: 78, stage: '需求确认', stageBg: 'bg-purple-500/20 text-purple-400', time: '昨天', initial: 'A', gradient: 'rose' },
];

export default function AcquisitionPage() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [selectedLead, setSelectedLead] = useState<typeof leads[0] | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmailConfig, setShowEmailConfig] = useState(false);
  const [editingLead, setEditingLead] = useState<typeof leads[0] | null>(null);
  const [emailConfig, setEmailConfig] = useState({
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    fromName: '钰美固',
    fromEmail: '',
  });

  const sidebarItems: { id: TabId; icon: React.ReactNode; label: string; badge?: number; badgeColor?: string }[] = [
    { id: 'dashboard', icon: <TrendingUp size={18} />, label: '数据总览' },
    { id: 'leads', icon: <DollarSign size={18} />, label: '线索池', badge: 23 },
    { id: 'pipeline', icon: <Zap size={18} />, label: '销售管道' },
    { id: 'customers', icon: <Users size={18} />, label: '客户档案' },
    { id: 'sop', icon: <Bot size={18} />, label: '跟进SOP' },
    { id: 'email', icon: <Mail size={18} />, label: '邮件营销' },
    { id: 'tasks', icon: <ClipboardList size={18} />, label: '任务中心', badge: 7, badgeColor: 'bg-red-500' },
    { id: 'analytics', icon: <PieIcon size={18} />, label: '转化分析' },
    { id: 'reports', icon: <BarChart3 size={18} />, label: '数据报表' },
    { id: 'agent', icon: <Brain size={18} />, label: 'Agent总控台', badge: 6, badgeColor: 'bg-purple-500' },
    { id: 'settings', icon: <Settings size={18} />, label: '邮件配置' },
  ];

  const getScoreClass = (score: number) => {
    if (score >= 85) return 'bg-gradient-to-r from-emerald-500 to-emerald-600';
    if (score >= 70) return 'bg-gradient-to-r from-amber-500 to-amber-600';
    return 'bg-gradient-to-r from-slate-500 to-slate-600';
  };

  const getGradientBg = (gradient: string) => {
    const map: Record<string, string> = {
      amber: 'from-amber-400 to-amber-600 text-slate-900',
      blue: 'from-blue-400 to-blue-600 text-white',
      emerald: 'from-emerald-400 to-emerald-600 text-white',
      purple: 'from-purple-400 to-purple-600 text-white',
      rose: 'from-rose-400 to-rose-600 text-white',
    };
    return map[gradient] || map.amber;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-lg font-bold text-slate-900">Y</div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">YUMEIGU <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">智能获客系统</span></h1>
              <p className="text-xs text-slate-400">Grind Smarter, Build Stronger</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell size={18} className="text-slate-400 transition hover:text-amber-400" />
              <span className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-red-500 text-[10px] text-white">5</span>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-800 px-4 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-slate-900">管</div>
              <span className="text-sm font-medium">管理员</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-14 h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-slate-700 bg-slate-800">
          <div className="p-4">
            <SidebarSection title="获客引擎">
              {sidebarItems.slice(0, 4).map(item => (
                <SidebarItem key={item.id} item={item} active={activeTab} onClick={() => setActiveTab(item.id)} />
              ))}
            </SidebarSection>
            <SidebarSection title="自动化">
              {sidebarItems.slice(4, 7).map(item => (
                <SidebarItem key={item.id} item={item} active={activeTab} onClick={() => setActiveTab(item.id)} />
              ))}
            </SidebarSection>
            <SidebarSection title="分析">
              {sidebarItems.slice(7, 9).map(item => (
                <SidebarItem key={item.id} item={item} active={activeTab} onClick={() => setActiveTab(item.id)} />
              ))}
            </SidebarSection>
            <SidebarSection title="AI智能体">
              {sidebarItems.slice(9).map(item => (
                <SidebarItem key={item.id} item={item} active={activeTab} onClick={() => setActiveTab(item.id)} />
              ))}
            </SidebarSection>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-3.5rem)] flex-1 overflow-auto p-6">
          {activeTab === 'dashboard' && <DashboardTab getScoreClass={getScoreClass} getGradientBg={getGradientBg} />}
          {activeTab === 'leads' && (
            <LeadsTab 
              getScoreClass={getScoreClass} 
              getGradientBg={getGradientBg}
              onRowClick={(lead) => { setSelectedLead(lead); setShowDetailModal(true); }}
              onEditClick={(lead) => { setEditingLead(lead); setShowEditModal(true); }}
              onAddClick={() => setShowAddModal(true)}
            />
          )}
          {activeTab === 'pipeline' && <PipelineTab getScoreClass={getScoreClass} />}
          {activeTab === 'customers' && <CustomersTab />}
          {activeTab === 'sop' && <SOPTab />}
          {activeTab === 'email' && <EmailTab />}
          {activeTab === 'tasks' && <TasksTab />}
          {activeTab === 'analytics' && <AnalyticsTab />}
          {activeTab === 'reports' && <ReportsTab />}
          {activeTab === 'agent' && <AgentTab />}
          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">系统设置</h2>
              <div className="grid gap-6">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">邮件服务配置</h3>
                      <p className="text-sm text-slate-400 mt-1">配置 SMTP 服务器以发送邮件</p>
                    </div>
                    <button
                      onClick={() => setShowEmailConfig(true)}
                      className="px-4 py-2 bg-amber-500 text-slate-900 rounded-lg font-semibold hover:bg-amber-600 transition"
                    >
                      配置
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <div className={`w-2 h-2 rounded-full ${emailConfig.smtpHost ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
                    {emailConfig.smtpHost ? '已配置' : '未配置'}
                  </div>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                  <h3 className="text-lg font-semibold text-white mb-4">数据统计</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-500">156</p>
                      <p className="text-sm text-slate-400">总线索数</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-emerald-500">23</p>
                      <p className="text-sm text-slate-400">高意向线索</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-500">20</p>
                      <p className="text-sm text-slate-400">已成交</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowDetailModal(false)}>
          <div className="w-full max-w-2xl rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
              <h3 className="text-lg font-bold text-white">客户详情</h3>
              <button onClick={() => setShowDetailModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className={`flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br text-xl font-bold ${getGradientBg(selectedLead.gradient)}`}>{selectedLead.initial}</div>
                <div>
                  <h4 className="text-xl font-bold text-white">{selectedLead.name}</h4>
                  <p className="text-slate-400">{selectedLead.contact} · {selectedLead.country}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-slate-900/50 p-4">
                  <p className="text-xs text-slate-500 mb-1">来源渠道</p>
                  <p className="font-semibold text-white">{selectedLead.source}</p>
                </div>
                <div className="rounded-lg bg-slate-900/50 p-4">
                  <p className="text-xs text-slate-500 mb-1">意向产品</p>
                  <p className="font-semibold text-white">{selectedLead.product}</p>
                </div>
                <div className="rounded-lg bg-slate-900/50 p-4">
                  <p className="text-xs text-slate-500 mb-1">评分</p>
                  <p className="font-semibold text-white">{selectedLead.score}</p>
                </div>
                <div className="rounded-lg bg-slate-900/50 p-4">
                  <p className="text-xs text-slate-500 mb-1">阶段</p>
                  <p className="font-semibold text-white">{selectedLead.stage}</p>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <button className="flex-1 rounded-lg bg-amber-500 py-2 font-semibold text-slate-900 hover:bg-amber-600 transition">发送邮件</button>
                <button className="flex-1 rounded-lg border border-slate-700 py-2 font-semibold text-white hover:bg-slate-700 transition">安排跟进</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
              <h3 className="text-lg font-bold text-white">编辑线索</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">公司名称</label>
                <input type="text" defaultValue={editingLead.name} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">联系人</label>
                <input type="text" defaultValue={editingLead.contact} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">国家</label>
                <input type="text" defaultValue={editingLead.country} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">阶段</label>
                <select defaultValue={editingLead.stage} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none">
                  <option>新线索</option>
                  <option>已联系</option>
                  <option>需求确认</option>
                  <option>报价中</option>
                  <option>已成交</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowEditModal(false)} className="flex-1 rounded-lg border border-slate-700 py-2 font-semibold text-white hover:bg-slate-700 transition">取消</button>
                <button onClick={() => setShowEditModal(false)} className="flex-1 rounded-lg bg-amber-500 py-2 font-semibold text-slate-900 hover:bg-amber-600 transition">保存</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
              <h3 className="text-lg font-bold text-white">新增线索</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">公司名称 *</label>
                <input type="text" placeholder="输入公司名称" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">联系人 *</label>
                <input type="text" placeholder="输入联系人姓名" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">国家/地区</label>
                <input type="text" placeholder="输入国家或地区" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">来源渠道</label>
                <select className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none">
                  <option>官网询盘</option>
                  <option>LinkedIn</option>
                  <option>展会</option>
                  <option>Facebook</option>
                  <option>老客户转介</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">意向产品</label>
                <input type="text" placeholder="输入意向产品" className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-lg border border-slate-700 py-2 font-semibold text-white hover:bg-slate-700 transition">取消</button>
                <button onClick={() => setShowAddModal(false)} className="flex-1 rounded-lg bg-amber-500 py-2 font-semibold text-slate-900 hover:bg-amber-600 transition">创建</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Config Modal */}
      {showEmailConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowEmailConfig(false)}>
          <div className="w-full max-w-lg rounded-2xl bg-slate-800 p-6 shadow-2xl border border-slate-700" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">邮件服务配置</h2>
              <button onClick={() => setShowEmailConfig(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">SMTP 服务器</label>
                <input
                  type="text"
                  value={emailConfig.smtpHost}
                  onChange={e => setEmailConfig({...emailConfig, smtpHost: e.target.value})}
                  placeholder="smtp.example.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">SMTP 端口</label>
                <input
                  type="text"
                  value={emailConfig.smtpPort}
                  onChange={e => setEmailConfig({...emailConfig, smtpPort: e.target.value})}
                  placeholder="587"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">邮箱账号</label>
                <input
                  type="email"
                  value={emailConfig.smtpUser}
                  onChange={e => setEmailConfig({...emailConfig, smtpUser: e.target.value})}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-1">邮箱密码/授权码</label>
                <input
                  type="password"
                  value={emailConfig.smtpPass}
                  onChange={e => setEmailConfig({...emailConfig, smtpPass: e.target.value})}
                  placeholder="输入密码或授权码"
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">发件人名称</label>
                  <input
                    type="text"
                    value={emailConfig.fromName}
                    onChange={e => setEmailConfig({...emailConfig, fromName: e.target.value})}
                    placeholder="钰美固"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">发件邮箱</label>
                  <input
                    type="email"
                    value={emailConfig.fromEmail}
                    onChange={e => setEmailConfig({...emailConfig, fromEmail: e.target.value})}
                    placeholder="sales@yumeigu.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                <p className="text-xs text-slate-400 mb-1">💡 提示</p>
                <p className="text-xs text-slate-500">推荐使用阿里云邮件推送、SendGrid 或 QQ/163 邮箱 SMTP 服务。如果使用 QQ/163 邮箱，请使用授权码而非登录密码。</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowEmailConfig(false)} className="flex-1 rounded-lg border border-slate-700 py-2 font-semibold text-white hover:bg-slate-700 transition">取消</button>
                <button 
                  onClick={async () => { 
                    try {
                      const res = await fetch('/api/email-config', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(emailConfig)
                      });
                      const data = await res.json();
                      if (data.success) {
                        setShowEmailConfig(false);
                        alert('邮件配置已保存到服务器');
                      } else {
                        alert('保存失败：' + (data.error || '未知错误'));
                      }
                    } catch (error) {
                      alert('保存失败：' + error);
                    }
                  }} 
                  className="flex-1 rounded-lg bg-amber-500 py-2 font-semibold text-slate-900 hover:bg-amber-600 transition"
                >
                  保存配置
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== Sidebar Components ========== */
function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function SidebarItem({ item, active, onClick }: { item: { id: TabId; icon: React.ReactNode; label: string; badge?: number; badgeColor?: string }; active: TabId; onClick: () => void }) {
  const isActive = active === item.id;
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-all ${
        isActive
          ? 'border-l-3 border-amber-500 bg-amber-500/15 text-amber-500'
          : 'border-l-3 border-transparent text-slate-300 hover:border-amber-500 hover:bg-amber-500/10'
      }`}
    >
      {item.icon}
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${item.badgeColor || 'bg-amber-500'} ${item.badgeColor === 'bg-red-500' || item.badgeColor === 'bg-purple-500' ? 'text-white' : 'text-slate-900'}`}>
          {item.badge}
        </span>
      )}
    </button>
  );
}

/* ========== Dashboard Tab ========== */
function DashboardTab({ getScoreClass, getGradientBg }: { getScoreClass: (s: number) => string; getGradientBg: (g: string) => string }) {
  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">数据总览</h2>
          <p className="mt-1 text-sm text-slate-400">实时追踪获客漏斗与成交转化</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm transition hover:border-amber-500">
            <RefreshCw size={14} />刷新数据
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-900">
            <Plus size={14} />录入新线索
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard icon={<UserPlus className="text-amber-400" />} iconBg="bg-amber-500/20" label="本月新增线索" value="156" change="23%" />
        <KPICard icon={<CheckCircle className="text-emerald-400" />} iconBg="bg-emerald-500/20" label="有效线索率" value="68.4%" change="5.2%" />
        <KPICard icon={<Handshake className="text-blue-400" />} iconBg="bg-blue-500/20" label="成交转化率" value="12.8%" change="1.8%" />
        <KPICard icon={<DollarSign className="text-purple-400" />} iconBg="bg-purple-500/20" label="本月成交金额" value="$284K" change="18.5%" />
      </div>

      {/* Charts Row */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">获客漏斗趋势</h3>
            <select className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-sm"><option>近30天</option><option>近90天</option><option>本年度</option></select>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={funnelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
              <Legend wrapperStyle={{ color: '#94a3b8' }} />
              <Line type="monotone" dataKey="newLeads" name="新增线索" stroke="#F5A623" strokeWidth={2} fill="rgba(245,166,35,0.1)" dot={false} />
              <Line type="monotone" dataKey="valid" name="有效线索" stroke="#10b981" strokeWidth={2} fill="rgba(16,185,129,0.1)" dot={false} />
              <Line type="monotone" dataKey="deal" name="成交" stroke="#3b82f6" strokeWidth={2} fill="rgba(59,130,246,0.1)" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 font-bold">线索来源分布</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={2}>
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} layout="vertical" align="right" verticalAlign="middle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800 p-5">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-bold">销售管道概览</h3>
          <button className="text-sm text-amber-400 transition hover:text-amber-300" onClick={() => {}}>查看详情 <ArrowRight size={12} className="ml-1 inline" /></button>
        </div>
        <div className="grid grid-cols-5 gap-4">
          <PipelineRing count={42} label="新线索" amount="$0" color="#F5A623" offset={35} />
          <PipelineRing count={28} label="已联系" amount="$45K" color="#3b82f6" offset={70} />
          <PipelineRing count={18} label="需求确认" amount="$120K" color="#8b5cf6" offset={105} />
          <PipelineRing count={12} label="报价/谈判" amount="$380K" color="#06b6d4" offset={140} />
          <PipelineRing count={8} label="成交 Won" amount="$284K" color="#10b981" offset={160} amountColor="text-emerald-400" />
        </div>
      </div>

      {/* Recent Activity & Top Leads */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 font-bold">最近动态</h3>
          <div className="space-y-4">
            <ActivityItem icon={<Check size={12} />} iconBg="bg-emerald-500/20" iconColor="text-emerald-400" text={<><span className="font-semibold">EuroFlooring GmbH</span> 已成交 — 研磨机LJ600V x3台</>} time="2小时前 · 成交金额 $18,500" />
            <ActivityItem icon={<Mail size={12} />} iconBg="bg-blue-500/20" iconColor="text-blue-400" text={<><span className="font-semibold">Gulf Construction LLC</span> 发送报价单 — 环氧材料27系列</>} time="4小时前 · 报价金额 $32,000" />
            <ActivityItem icon={<Star size={12} />} iconBg="bg-amber-500/20" iconColor="text-amber-400" text={<><span className="font-semibold">AsiaFloor Partners</span> 线索评分升级至 92分 (高意向)</>} time="6小时前 · 自动触发SOP-3" />
            <ActivityItem icon={<Phone size={12} />} iconBg="bg-purple-500/20" iconColor="text-purple-400" text={<><span className="font-semibold">African Industries</span> 完成首次视频验厂</>} time="昨天 · 评分: 78分" />
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-bold">高意向线索 TOP 5</h3>
            <span className="cursor-pointer text-xs text-amber-400">查看全部</span>
          </div>
          <div className="space-y-3">
            {leads.map(lead => (
              <div key={lead.name} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-900/50 p-3 transition hover:border-amber-500/50">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold ${getGradientBg(lead.gradient)}`}>{lead.initial}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-semibold">{lead.name}</p>
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-bold text-white ${getScoreClass(lead.score)}`}>{lead.score}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400">{lead.country} · {lead.contact} · {lead.product.split(',')[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, iconBg, label, value, change }: { icon: React.ReactNode; iconBg: string; label: string; value: string; change: string }) {
  return (
    <div className="card-hover rounded-xl border border-slate-700 bg-slate-800 p-5 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <h3 className="mt-1 text-2xl font-bold">{value}</h3>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>{icon}</div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-emerald-400"><ArrowUp size={12} className="mr-1 inline" />{change}</span>
        <span className="text-slate-500">较上月</span>
      </div>
    </div>
  );
}

function PipelineRing({ count, label, amount, color, offset, amountColor }: { count: number; label: string; amount: string; color: string; offset: number; amountColor?: string }) {
  return (
    <div className="text-center">
      <div className="relative mx-auto mb-2 h-16 w-16">
        <svg className="h-16 w-16 -rotate-90">
          <circle cx="32" cy="32" r="28" stroke="#1e293b" strokeWidth="4" fill="none" />
          <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="4" fill="none" strokeDasharray="175.9" strokeDashoffset={offset} strokeLinecap="round" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">{count}</span>
      </div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className={`mt-1 text-xs ${amountColor || 'text-slate-600'}`}>{amount}</p>
    </div>
  );
}

function ActivityItem({ icon, iconBg, iconColor, text, time }: { icon: React.ReactNode; iconBg: string; iconColor: string; text: React.ReactNode; time: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconBg} ${iconColor}`}>{icon}</div>
      <div className="flex-1">
        <p className="text-sm">{text}</p>
        <p className="mt-1 text-xs text-slate-500">{time}</p>
      </div>
    </div>
  );
}

/* ========== Leads Tab ========== */
function LeadsTab({ 
  getScoreClass, 
  getGradientBg,
  onRowClick,
  onEditClick,
  onAddClick 
}: { 
  getScoreClass: (s: number) => string; 
  getGradientBg: (g: string) => string;
  onRowClick: (lead: typeof leads[0]) => void;
  onEditClick: (lead: typeof leads[0]) => void;
  onAddClick: () => void;
}) {
  const filters = ['全部线索 (156)', '高意向 (23)', '待跟进 (45)', '已联系 (38)', '沉睡线索 (28)', '无效线索 (22)'];
  const [activeFilter, setActiveFilter] = useState(0);

  const filteredLeads = leads.filter(lead => {
    if (activeFilter === 0) return true;
    if (activeFilter === 1) return lead.score >= 85;
    if (activeFilter === 2) return lead.stage === '需求确认' || lead.stage === '报价中';
    if (activeFilter === 3) return lead.stage === '已联系';
    if (activeFilter === 4) return lead.score < 60;
    if (activeFilter === 5) return lead.stage === '无效';
    return true;
  });

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div><h2 className="text-2xl font-bold">线索池</h2><p className="mt-1 text-sm text-slate-400">全渠道线索聚合与智能评分</p></div>
        <div className="flex gap-3">
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" placeholder="搜索客户/公司/国家..." className="w-64 rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" /></div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm transition hover:border-amber-500"><Filter size={14} />筛选</button>
          <button onClick={onAddClick} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-900 hover:from-amber-600 hover:to-amber-700 transition"><Plus size={14} />新增线索</button>
        </div>
      </div>
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        {filters.map((f, i) => (
          <button key={f} onClick={() => setActiveFilter(i)} className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-semibold transition ${i === activeFilter ? 'bg-amber-500 text-slate-900' : 'border border-slate-700 bg-slate-800 hover:border-amber-500'}`}>{f}</button>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900/50 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium"><input type="checkbox" className="rounded border-slate-600 bg-slate-700" /></th>
              <th className="px-4 py-3 text-left font-medium">客户信息</th>
              <th className="px-4 py-3 text-left font-medium">来源渠道</th>
              <th className="px-4 py-3 text-left font-medium">意向产品</th>
              <th className="px-4 py-3 text-left font-medium">评分</th>
              <th className="px-4 py-3 text-left font-medium">阶段</th>
              <th className="px-4 py-3 text-left font-medium">最近互动</th>
              <th className="px-4 py-3 text-left font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {filteredLeads.map(lead => (
              <tr key={lead.name} onClick={() => onRowClick(lead)} className="cursor-pointer transition hover:bg-slate-700/30">
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded border-slate-600 bg-slate-700" /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold ${getGradientBg(lead.gradient)}`}>{lead.initial}</div>
                    <div><p className="font-semibold">{lead.name}</p><p className="text-xs text-slate-400">{lead.contact} · {lead.country}</p></div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className={`rounded px-2 py-1 text-xs ${lead.sourceBg}`}>{lead.source}</span></td>
                <td className="px-4 py-3 text-slate-300">{lead.product}</td>
                <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-bold text-white ${getScoreClass(lead.score)}`}>{lead.score}</span></td>
                <td className="px-4 py-3"><span className={`rounded px-2 py-1 text-xs ${lead.stageBg}`}>{lead.stage}</span></td>
                <td className="px-4 py-3 text-xs text-slate-400">{lead.time}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={e => { e.stopPropagation(); onEditClick(lead); }} className="text-slate-400 hover:text-amber-400"><Edit size={14} /></button>
                    <button onClick={e => e.stopPropagation()} className="text-slate-400 hover:text-amber-400"><Mail size={14} /></button>
                    <button onClick={e => e.stopPropagation()} className="text-slate-400 hover:text-amber-400"><MoreVertical size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-between border-t border-slate-700 px-4 py-3">
          <span className="text-xs text-slate-500">显示 1-{filteredLeads.length} 共 {filteredLeads.length} 条</span>
          <div className="flex gap-2">
            <button className="rounded bg-slate-900 px-3 py-1 text-xs text-slate-400 hover:text-white"><ChevronLeft size={14} /></button>
            <button className="rounded bg-amber-500 px-3 py-1 text-xs font-bold text-slate-900">1</button>
            <button className="rounded bg-slate-900 px-3 py-1 text-xs text-slate-400 hover:text-white">2</button>
            <button className="rounded bg-slate-900 px-3 py-1 text-xs text-slate-400 hover:text-white">3</button>
            <button className="rounded bg-slate-900 px-3 py-1 text-xs text-slate-400 hover:text-white"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Pipeline Tab ========== */
function PipelineTab({ getScoreClass }: { getScoreClass: (s: number) => string }) {
  const columns = [
    { title: '新线索', color: 'bg-amber-500', count: 42, amount: '$0', cards: [
      { name: 'AsiaFloor Partners', country: '新加坡', product: '研磨机LJ600V, 环氧材料', score: 92, assignee: '管', time: '2天前' },
      { name: 'South America Floors', country: '巴西', product: '环氧材料27系列', score: 65, assignee: '李', time: '5天前' },
      { name: 'IndoFloor Tech', country: '印度', product: '金刚石磨片', score: 45, assignee: '王', time: '1周前' },
    ]},
    { title: '已联系', color: 'bg-blue-500', count: 28, amount: '$45K', cards: [
      { name: 'Middle East Flooring', country: '沙特', product: '洗地机X510, 培训', score: 81, assignee: '管', time: '待回复' },
      { name: 'AusFloor Solutions', country: '澳大利亚', product: '工业吸尘器LJ400', score: 72, assignee: '李', time: '已回复' },
    ]},
    { title: '需求确认', color: 'bg-purple-500', count: 18, amount: '$120K', cards: [
      { name: 'African Industries', country: '尼日利亚', product: '全品类(研磨机+材料+耗材)', score: 78, assignee: '管/王', time: '视频验厂完成' },
      { name: 'LatAm Flooring Co.', country: '墨西哥', product: '环氧材料+研磨机', score: 70, assignee: '李', time: '待样品确认' },
    ]},
    { title: '报价/谈判', color: 'bg-cyan-500', count: 12, amount: '$380K', cards: [
      { name: 'Gulf Construction LLC', country: '阿联酋', product: '环氧地坪27系列 — $32K', score: 88, assignee: '管', time: '等待反馈' },
      { name: 'UK Industrial Floors', country: '英国', product: '研磨机LJ640V+耗材 — $28K', score: 75, assignee: '王', time: '价格谈判中' },
    ]},
    { title: '成交 Won', color: 'bg-emerald-500', count: 8, amount: '$284K', isWon: true, cards: [
      { name: 'EuroFlooring GmbH', country: '德国', product: '研磨机LJ600V x3 — $18,500', score: 0, assignee: '管', time: 'PI已签' },
      { name: 'Malaysia Epoxy Pro', country: '马来西亚', product: '环氧材料27系列 — $45,000', score: 0, assignee: '李', time: '生产中' },
    ]},
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div><h2 className="text-2xl font-bold">销售管道</h2><p className="mt-1 text-sm text-slate-400">可视化拖拽管理，追踪每个成交机会</p></div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm transition hover:border-amber-500"><Calendar size={14} />本月视图</button>
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-900"><Plus size={14} />新增商机</button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4 overflow-x-auto" style={{ minHeight: '600px' }}>
        {columns.map(col => (
          <div key={col.title} className="flex min-w-[240px] flex-col rounded-xl border border-slate-700 bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-700 p-3">
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${col.color}`} />
                <span className="text-sm font-semibold">{col.title}</span>
                <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs">{col.count}</span>
              </div>
              <span className={`text-xs ${(col as { isWon?: boolean }).isWon ? 'font-bold text-emerald-400' : 'text-slate-500'}`}>{col.amount}</span>
            </div>
            <div className="space-y-2 overflow-y-auto p-2">
              {col.cards.map(card => (
                <div key={card.name} className={`rounded-lg border bg-slate-900 p-3 transition hover:border-amber-500/50 ${(col as { isWon?: boolean }).isWon ? 'border-emerald-500/30 hover:border-emerald-500' : 'border-slate-700'}`}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs text-slate-400">{card.country}</span>
                    {card.score > 0 ? (
                      <span className={`rounded px-1.5 py-0.5 text-xs font-bold text-white ${getScoreClass(card.score)}`}>{card.score}</span>
                    ) : (
                      <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-xs text-emerald-400">已成交</span>
                    )}
                  </div>
                  <p className="mb-1 text-sm font-semibold">{card.name}</p>
                  <p className="mb-2 text-xs text-slate-400">{card.product}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1">
                      {card.assignee.split('/').map((a, i) => (
                        <div key={i} className={`flex h-5 w-5 items-center justify-center rounded-full border border-slate-900 text-[8px] font-bold ${a === '管' ? 'bg-amber-500 text-slate-900' : a === '李' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'}`}>{a}</div>
                      ))}
                    </div>
                    <span className={`text-xs ${(col as { isWon?: boolean }).isWon ? 'text-emerald-400' : col.color === 'bg-blue-500' ? (card.time === '已回复' ? 'text-emerald-400' : 'text-blue-400') : col.color === 'bg-cyan-500' ? 'text-cyan-400' : col.color === 'bg-purple-500' ? 'text-purple-400' : 'text-slate-500'}`}>{card.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========== Customers Tab ========== */
function CustomersTab() {
  const customers = [
    { name: 'EuroFlooring GmbH', info: '德国 · 3次成交 · $128K', status: '活跃', statusColor: 'text-emerald-400', initial: 'E', gradient: 'from-amber-400 to-amber-600', textColor: 'text-slate-900', active: true },
    { name: 'Gulf Construction LLC', info: '阿联酋 · 1次成交 · $32K', status: '谈判中', statusColor: 'text-amber-400', initial: 'G', gradient: 'from-blue-400 to-blue-600', textColor: 'text-white', active: false },
    { name: 'Malaysia Epoxy Pro', info: '马来西亚 · 2次成交 · $67K', status: '活跃', statusColor: 'text-emerald-400', initial: 'M', gradient: 'from-emerald-400 to-emerald-600', textColor: 'text-white', active: false },
    { name: 'AsiaFloor Partners', info: '新加坡 · 0次成交 · 高意向', status: '跟进中', statusColor: 'text-blue-400', initial: 'A', gradient: 'from-purple-400 to-purple-600', textColor: 'text-white', active: false },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div><h2 className="text-2xl font-bold">客户档案</h2><p className="mt-1 text-sm text-slate-400">360度客户画像与历史交易记录</p></div>
        <div className="flex gap-3">
          <div className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" placeholder="搜索客户..." className="w-64 rounded-lg border border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20" /></div>
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-900"><Plus size={14} />新增客户</button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-800 lg:col-span-1">
          <div className="border-b border-slate-700 p-3"><p className="text-xs font-semibold uppercase text-slate-500">客户列表</p></div>
          <div className="max-h-[600px] overflow-y-auto">
            {customers.map((c, i) => (
              <div key={c.name} className={`cursor-pointer border-b border-slate-700/50 p-3 transition hover:bg-slate-700/30 ${c.active ? 'border-l-2 border-l-amber-500 bg-slate-700/20' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold ${c.gradient} ${c.textColor}`}>{c.initial}</div>
                  <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{c.name}</p><p className="text-xs text-slate-400">{c.info}</p></div>
                  <span className={`text-xs font-semibold ${c.statusColor}`}>{c.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-6 lg:col-span-2">
          <div className="mb-6 flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-2xl font-bold text-slate-900">E</div>
              <div>
                <h3 className="text-xl font-bold">EuroFlooring GmbH</h3>
                <p className="text-sm text-slate-400">德国 · 工业地坪承包商 · 成立于2010年</p>
                <div className="mt-2 flex gap-2">
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">活跃客户</span>
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">VIP</span>
                  <span className="rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-400">年采购&gt;$50K</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-1 rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"><Mail size={14} /> 发邮件</button>
              <button className="flex items-center gap-1 rounded-lg bg-slate-700 px-3 py-1.5 text-sm hover:bg-slate-600"><Phone size={14} /> 打电话</button>
              <button className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-sm font-semibold text-slate-900"><FileText size={14} /> 新建报价</button>
            </div>
          </div>
          <div className="mb-6 grid grid-cols-2 gap-4">
            <InfoCard title="主要联系人" lines={['Klaus Mueller', '技术总监 / 采购决策人', 'klaus.mueller@euroflooring.de']} lastColor="text-amber-400" />
            <InfoCard title="公司信息" lines={['www.euroflooring.de', '员工120+ · 年营收EUR 8M', '主营: 工业/商业地坪工程']} />
            <InfoCard title="采购偏好" lines={['研磨机 + 环氧材料', '季度采购 · 批量订单', '付款方式: TT 30%定金']} lastColor="text-emerald-400" />
            <InfoCard title="客户价值" lines={['$128,450', '累计成交3次 · 平均客单价$42K', '复购率: 100%']} lastColor="text-emerald-400" />
          </div>
          <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-4">
            <p className="mb-4 text-xs font-semibold uppercase text-slate-500">跟进时间线</p>
            <div className="relative space-y-4 pl-8">
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 to-amber-600" />
              <TimelineItem color="bg-emerald-500" title="订单成交 — 研磨机LJ600V x3台" time="2026-07-18 · 成交金额 $18,500 · PI已签" />
              <TimelineItem color="bg-cyan-500" title="发送正式报价单" time="2026-07-15 · 报价金额 $19,200 · 含运费" />
              <TimelineItem color="bg-purple-500" title="视频验厂通过" time="2026-07-10 · 工厂参观+产品演示" />
              <TimelineItem color="bg-blue-500" title="首封开发信触达" time="2026-07-05 · 邮件打开率 85% · 2天后回复" />
              <TimelineItem color="bg-amber-500" title="线索录入系统" time="2026-07-01 · 来源: Hannover Messe展会" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, lines, lastColor }: { title: string; lines: string[]; lastColor?: string }) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-4">
      <p className="mb-1 text-xs text-slate-500">{title}</p>
      {lines.map((line, i) => (
        <p key={i} className={`${i === 0 ? 'font-semibold text-sm' : 'text-xs text-slate-400'} ${i === lines.length - 1 && lastColor ? `mt-1 ${lastColor}` : ''}`}>{line}</p>
      ))}
    </div>
  );
}

function TimelineItem({ color, title, time }: { color: string; title: string; time: string }) {
  return (
    <div className="relative">
      <div className={`absolute -left-5 top-0 h-4 w-4 rounded-full border-2 border-slate-800 ${color}`} />
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-slate-400">{time}</p>
      </div>
    </div>
  );
}

/* ========== SOP Tab ========== */
function SOPTab() {
  const sopSteps = [
    { num: 1, color: 'bg-amber-500 text-slate-900', title: '首触达 — 业务匹配切入', trigger: '线索评分>=70分', action: '发送首封开发信(邮件+LinkedIn)', interval: '即时触发' },
    { num: 2, color: 'bg-blue-500 text-white', title: '二次跟进 — 新品补充机会', trigger: '首封邮件已读/回复', action: '发送产品目录+视频验厂邀请', interval: '3天后' },
    { num: 3, color: 'bg-purple-500 text-white', title: '深度培育 — 差异化方案', trigger: '视频验厂完成/样品确认', action: '发送定制化报价单+技术方案', interval: '5天后' },
    { num: 4, color: 'bg-cyan-500 text-white', title: '成交推进 — 临门一脚', trigger: '报价已发送/谈判中', action: '发送PI+生产周期确认', interval: '7天后' },
  ];

  const templates = [
    { title: '首封开发信 — 直接高效型', tag: '适配中小进口商', tagColor: 'text-amber-400', desc: '120-160词 · 聚焦1个核心价值 · 引用客户业务动态' },
    { title: '首封开发信 — 顾问专业型', tag: '适配中大型品牌', tagColor: 'text-blue-400', desc: '技术方案切入 · 行业洞察 · 长期合作视角' },
    { title: '首封开发信 — 产品机会型', tag: '适配新品扩张客户', tagColor: 'text-purple-400', desc: '新品推介 · 市场空白分析 · 试单优惠' },
    { title: 'LinkedIn 私信模板', tag: '轻量化触达', tagColor: 'text-emerald-400', desc: '80-120词 · 碎片化阅读 · 温和CTA' },
    { title: 'WhatsApp 跟进文案', tag: '短平快触达', tagColor: 'text-cyan-400', desc: '50-80词 · 即时响应 · 行动导向' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div><h2 className="text-2xl font-bold">跟进SOP</h2><p className="mt-1 text-sm text-slate-400">自动化跟进流程与话术模板</p></div>
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-900"><Plus size={14} />新建SOP</button>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 font-bold">YUMEIGU 标准跟进SOP</h3>
          <div className="space-y-4">
            {sopSteps.map(step => (
              <div key={step.num} className="cursor-pointer rounded-lg border border-slate-700/50 bg-slate-900/50 p-4 transition hover:border-amber-500/50">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${step.color}`}>{step.num}</span>
                    <span className="font-semibold">{step.title}</span>
                  </div>
                  <span className="text-xs text-emerald-400">已启用</span>
                </div>
                <p className="text-xs text-slate-400">触发条件: {step.trigger}</p>
                <p className="text-xs text-slate-400">动作: {step.action}</p>
                <p className="text-xs text-slate-400">间隔: {step.interval}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 font-bold">话术模板库</h3>
          <div className="space-y-3">
            {templates.map(t => (
              <div key={t.title} className="cursor-pointer rounded-lg border border-slate-700/50 bg-slate-900/50 p-3 transition hover:border-amber-500/50">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm font-semibold">{t.title}</span>
                  <span className={`text-xs ${t.tagColor}`}>{t.tag}</span>
                </div>
                <p className="text-xs text-slate-400">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Email Tab ========== */
function EmailTab() {
  const campaigns = [
    { name: '7月地坪研磨机新品推广', status: '已发送', statusColor: 'bg-emerald-500', statusText: 'text-emerald-400', time: '2026-07-15', target: '高意向研磨机客户', sent: '156', open: '89 (57%)', reply: '23 (15%)' },
    { name: '环氧材料27系列全球推广', status: '已发送', statusColor: 'bg-emerald-500', statusText: 'text-emerald-400', time: '2026-07-10', target: '中东+东南亚客户', sent: '234', open: '112 (48%)', reply: '34 (15%)' },
    { name: '洗地机X510培训服务推广', status: '发送中', statusColor: 'bg-amber-500', statusText: 'text-amber-400', time: '2026-07-20', target: '已购机客户', sent: '89/120', open: '45 (51%)', reply: '12 (13%)' },
    { name: '8月展会预热 — Hannover Messe', status: '草稿', statusColor: 'bg-slate-500', statusText: 'text-slate-500', time: '2026-08-01', target: '欧洲潜在客户', sent: '预计300' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div><h2 className="text-2xl font-bold">邮件营销</h2><p className="mt-1 text-sm text-slate-400">批量邮件发送与效果追踪</p></div>
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-900"><Plus size={14} />新建邮件</button>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 lg:col-span-1">
          <h3 className="mb-4 font-bold">邮件统计</h3>
          <div className="space-y-4">
            <StatBar label="本月发送" value="1,248" percent={78} barColor="bg-gradient-to-r from-amber-500 to-amber-600" />
            <StatBar label="打开率" value="42.3%" valueColor="text-emerald-400" percent={42} barColor="bg-emerald-500" />
            <StatBar label="回复率" value="18.7%" valueColor="text-blue-400" percent={19} barColor="bg-blue-500" />
            <StatBar label="退信率" value="2.1%" valueColor="text-red-400" percent={2} barColor="bg-red-500" />
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 lg:col-span-2">
          <h3 className="mb-4 font-bold">邮件活动列表</h3>
          <div className="space-y-3">
            {campaigns.map(c => (
              <div key={c.name} className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-4 transition hover:border-amber-500/50">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${c.statusColor}`} />
                    <span className="text-sm font-semibold">{c.name}</span>
                  </div>
                  <span className={`text-xs ${c.statusText}`}>{c.status}</span>
                </div>
                <p className="mb-2 text-xs text-slate-400">发送时间: {c.time} · 目标: {c.target}</p>
                <div className="flex gap-4 text-xs">
                  <span className="text-slate-400">发送: {c.sent}</span>
                  {c.open && <span className="text-emerald-400">打开: {c.open}</span>}
                  {c.reply && <span className="text-blue-400">回复: {c.reply}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value, valueColor, percent, barColor }: { label: string; value: string; valueColor?: string; percent: number; barColor: string }) {
  return (
    <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span className={`text-lg font-bold ${valueColor || ''}`}>{value}</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
        <div className={`h-2 rounded-full ${barColor}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

/* ========== Tasks Tab ========== */
function TasksTab() {
  const tasks = [
    { title: '跟进 Gulf Construction LLC — 确认报价反馈', deadline: '今天 17:00', priority: '高', priorityColor: 'bg-red-500/20 text-red-400', urgent: '紧急', checked: false },
    { title: '发送 AsiaFloor Partners 技术方案', deadline: '今天 18:00', priority: '高', priorityColor: 'bg-amber-500/20 text-amber-400', urgent: '高', checked: false },
    { title: '视频验厂 — African Industries', deadline: '明天 10:00', priority: '中', priorityColor: 'bg-blue-500/20 text-blue-400', urgent: '中', checked: false },
    { title: '更新 EuroFlooring GmbH 生产进度', deadline: '明天 15:00', priority: '中', priorityColor: 'bg-blue-500/20 text-blue-400', urgent: '中', checked: false },
    { title: '整理7月获客数据复盘报告', deadline: '周五 17:00', priority: '低', priorityColor: 'bg-slate-500/20 text-slate-400', urgent: '低', checked: false },
  ];

  const team = [
    { name: '管理员', initial: '管', bg: 'bg-amber-500', textColor: 'text-slate-900', pending: 3, done: 12 },
    { name: '李经理', initial: '李', bg: 'bg-blue-500', textColor: 'text-white', pending: 2, done: 8 },
    { name: '王专员', initial: '王', bg: 'bg-emerald-500', textColor: 'text-white', pending: 2, done: 15 },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div><h2 className="text-2xl font-bold">任务中心</h2><p className="mt-1 text-sm text-slate-400">今日待办与团队任务分配</p></div>
        <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-900"><Plus size={14} />新建任务</button>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5 lg:col-span-2">
          <h3 className="mb-4 font-bold">今日待办 (7)</h3>
          <div className="space-y-3">
            {tasks.map((t, i) => (
              <div key={i} className="flex items-center gap-4 rounded-lg border border-slate-700/50 bg-slate-900/50 p-4">
                <div className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded border-2 ${t.checked ? 'border-amber-500 bg-amber-500' : 'border-slate-600'}`}>
                  {t.checked && <Check size={12} className="text-white" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{t.title}</p>
                  <p className="text-xs text-slate-400">截止时间: {t.deadline} · 优先级: {t.priority}</p>
                </div>
                <span className={`rounded px-2 py-1 text-xs ${t.priorityColor}`}>{t.urgent}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 font-bold">团队任务概览</h3>
          <div className="space-y-4">
            {team.map(m => (
              <div key={m.name} className="flex items-center gap-3 rounded-lg border border-slate-700/50 bg-slate-900/50 p-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${m.bg} text-xs font-bold ${m.textColor}`}>{m.initial}</div>
                <div className="flex-1"><p className="text-sm font-semibold">{m.name}</p><p className="text-xs text-slate-400">待办: {m.pending} · 已完成: {m.done}</p></div>
              </div>
            ))}
            <div className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-3">
              <p className="mb-2 text-xs text-slate-500">本周完成率</p>
              <div className="h-3 w-full overflow-hidden rounded-full bg-slate-700">
                <div className="h-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600" style={{ width: '76%' }} />
              </div>
              <p className="mt-1 text-right text-xs text-amber-400">76%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== Analytics Tab ========== */
function AnalyticsTab() {
  const stages = [
    { color: 'bg-amber-500', label: '新线索 → 已联系', time: '2.3天' },
    { color: 'bg-blue-500', label: '已联系 → 需求确认', time: '5.7天' },
    { color: 'bg-purple-500', label: '需求确认 → 报价', time: '8.2天' },
    { color: 'bg-cyan-500', label: '报价 → 成交', time: '12.5天' },
    { color: 'bg-emerald-500', label: '总周期 (线索→成交)', time: '28.7天', highlight: true },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div><h2 className="text-2xl font-bold">转化分析</h2><p className="mt-1 text-sm text-slate-400">全链路数据洞察与优化建议</p></div>
        <div className="flex gap-3">
          <select className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm"><option>近30天</option><option>近90天</option><option>本年度</option></select>
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-900"><Download size={14} />导出报告</button>
        </div>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 font-bold">获客漏斗转化率</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={conversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="stage" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
              <Bar dataKey="count" name="人数" radius={[4, 4, 0, 0]}>
                {conversionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 font-bold">各阶段平均停留时间</h3>
          <div className="space-y-4">
            {stages.map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <div className={`h-3 w-3 rounded-full ${s.color}`} />
                <span className={`flex-1 text-sm ${s.highlight ? 'font-bold text-emerald-400' : ''}`}>{s.label}</span>
                <span className={`text-sm font-bold ${s.highlight ? 'text-emerald-400' : ''}`}>{s.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <AnalyticsRank title="高转化来源TOP5" items={[['展会 (Hannover Messe)', '28.5%'], ['官网询盘', '22.1%'], ['LinkedIn', '18.3%'], ['老客户转介绍', '15.7%'], ['Facebook', '8.2%']]} />
        <AnalyticsRank title="高转化国家/地区" items={[['德国', '32.1%'], ['阿联酋', '24.5%'], ['马来西亚', '19.8%'], ['新加坡', '14.2%'], ['沙特', '9.4%']]} />
        <AnalyticsRank title="高转化产品" items={[['研磨机LJ600V', '35.2%'], ['环氧材料27系列', '28.7%'], ['金刚石磨片', '18.4%'], ['洗地机X510', '12.3%'], ['工业吸尘器LJ400', '5.4%']]} />
      </div>
    </div>
  );
}

function AnalyticsRank({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
      <h3 className="mb-4 font-bold">{title}</h3>
      <div className="space-y-3">
        {items.map(([label, val]) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-sm">{label}</span>
            <span className="text-sm font-bold text-emerald-400">{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========== Reports Tab ========== */
function ReportsTab() {
  const reportData = [
    { date: '2026-07-21', newLeads: 12, valid: 8, contacted: 5, quoted: 2, deal: 1, amount: '$18,500', source: 'LinkedIn', sourceBg: 'bg-blue-500/20 text-blue-400' },
    { date: '2026-07-20', newLeads: 15, valid: 10, contacted: 7, quoted: 3, deal: 0, amount: '-', source: '官网', sourceBg: 'bg-emerald-500/20 text-emerald-400' },
    { date: '2026-07-19', newLeads: 8, valid: 5, contacted: 4, quoted: 1, deal: 1, amount: '$45,000', source: '展会', sourceBg: 'bg-amber-500/20 text-amber-400' },
    { date: '2026-07-18', newLeads: 18, valid: 12, contacted: 8, quoted: 4, deal: 2, amount: '$62,000', source: 'LinkedIn', sourceBg: 'bg-blue-500/20 text-blue-400' },
    { date: '2026-07-17', newLeads: 10, valid: 7, contacted: 5, quoted: 2, deal: 0, amount: '-', source: '官网', sourceBg: 'bg-emerald-500/20 text-emerald-400' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div><h2 className="text-2xl font-bold">数据报表</h2><p className="mt-1 text-sm text-slate-400">每日开发数据复盘与归档</p></div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm transition hover:border-amber-500"><Calendar size={14} />选择日期</button>
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-900"><Download size={14} />导出Excel</button>
        </div>
      </div>
      <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800 p-5">
        <h3 className="mb-4 font-bold">7月获客复盘表</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-900/50 text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">日期</th>
                <th className="px-4 py-3 text-left font-medium">新增线索</th>
                <th className="px-4 py-3 text-left font-medium">有效线索</th>
                <th className="px-4 py-3 text-left font-medium">已联系</th>
                <th className="px-4 py-3 text-left font-medium">报价</th>
                <th className="px-4 py-3 text-left font-medium">成交</th>
                <th className="px-4 py-3 text-left font-medium">成交金额</th>
                <th className="px-4 py-3 text-left font-medium">主要来源</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {reportData.map(r => (
                <tr key={r.date} className="transition hover:bg-slate-700/30">
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3">{r.newLeads}</td>
                  <td className="px-4 py-3 text-emerald-400">{r.valid}</td>
                  <td className="px-4 py-3">{r.contacted}</td>
                  <td className="px-4 py-3">{r.quoted}</td>
                  <td className="px-4 py-3 font-bold text-emerald-400">{r.deal}</td>
                  <td className="px-4 py-3 text-emerald-400">{r.amount}</td>
                  <td className="px-4 py-3"><span className={`rounded px-2 py-1 text-xs ${r.sourceBg}`}>{r.source}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 font-bold">月度趋势</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#e2e8f0' }} />
              <Bar dataKey="amount" name="成交金额($K)" fill="#F5A623" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 font-bold">团队绩效对比</h3>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={teamData}>
              <PolarGrid stroke="#1e293b" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
              <PolarRadiusAxis tick={false} axisLine={false} />
              <Radar name="管理员" dataKey="admin" stroke="#F5A623" fill="#F5A623" fillOpacity={0.2} />
              <Radar name="李经理" dataKey="manager" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Radar name="王专员" dataKey="staff" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

/* ========== Agent Tab ========== */
function AgentTab() {
  const agents = [
    { icon: <Search size={18} />, iconColor: 'text-amber-400', iconBg: 'bg-amber-500/20', name: '挖掘Agent', status: '运行中', statusColor: 'text-emerald-400', detail: '今日: 45条' },
    { icon: <Filter size={18} />, iconColor: 'text-blue-400', iconBg: 'bg-blue-500/20', name: '清洗Agent', status: '运行中', statusColor: 'text-emerald-400', detail: '待处理: 23条' },
    { icon: <Zap size={18} />, iconColor: 'text-purple-400', iconBg: 'bg-purple-500/20', name: '文案Agent', status: '运行中', statusColor: 'text-emerald-400', detail: '待审: 8封' },
    { icon: <Send size={18} />, iconColor: 'text-cyan-400', iconBg: 'bg-cyan-500/20', name: '发送Agent', status: '运行中', statusColor: 'text-emerald-400', detail: '队列: 12封' },
    { icon: <MessageSquare size={18} />, iconColor: 'text-rose-400', iconBg: 'bg-rose-500/20', name: '对话Agent', status: '3条待回复', statusColor: 'text-amber-400', detail: 'A级: 2 | B级: 5' },
    { icon: <Bell size={18} />, iconColor: 'text-emerald-400', iconBg: 'bg-emerald-500/20', name: '通知Agent', status: '运行中', statusColor: 'text-emerald-400', detail: '今日推送: 5' },
  ];

  const workflow = [
    { icon: <Search size={16} />, color: 'text-amber-400', border: 'border-amber-500/30', label: '挖掘', sub: '原始线索' },
    { icon: <Filter size={16} />, color: 'text-blue-400', border: 'border-blue-500/30', label: '清洗', sub: '精准清单' },
    { icon: <Zap size={16} />, color: 'text-purple-400', border: 'border-purple-500/30', label: '文案', sub: '定制开发信' },
    { icon: <Send size={16} />, color: 'text-cyan-400', border: 'border-cyan-500/30', label: '发送', sub: '节奏推送' },
    { icon: <MessageSquare size={16} />, color: 'text-rose-400', border: 'border-rose-500/30', label: '对话', sub: '意向评估' },
    { icon: <Bell size={16} />, color: 'text-emerald-400', border: 'border-emerald-500/30', label: '通知', sub: '推送人工' },
  ];

  const logs = [
    { agent: '挖掘Agent', color: 'text-amber-400', time: '2分钟前', msg: '完成德国市场扫描，新增线索12条（研磨机需求8条，环氧材料4条）' },
    { agent: '清洗Agent', color: 'text-blue-400', time: '5分钟前', msg: '校验通过8条，标记A级3条、B级5条；剔除4条（官网失效2条，纯中间商2条）' },
    { agent: '文案Agent', color: 'text-purple-400', time: '8分钟前', msg: '为EuroFlooring GmbH生成3版开发信，引用其官网迪拜项目动态，待人工审阅' },
    { agent: '对话Agent', color: 'text-rose-400', time: '15分钟前', msg: 'Gulf Construction LLC回复询问CE认证，已标记【移交人工】，通知Agent已推送业务员' },
    { agent: '通知Agent', color: 'text-emerald-400', time: '20分钟前', msg: '推送A级客户2名至业务员：AsiaFloor Partners(92分)、African Industries(78分)' },
  ];

  const perfData = [
    { label: '挖掘Agent — 线索采集', current: 45, total: 50, color: 'bg-gradient-to-r from-amber-500 to-amber-600' },
    { label: '清洗Agent — 有效线索', current: 31, total: 45, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
    { label: '文案Agent — 开发信产出', current: 18, total: 25, color: 'bg-purple-500', textColor: 'text-purple-400' },
    { label: '发送Agent — 邮件送达', current: 42, total: 45, color: 'bg-cyan-500', textColor: 'text-cyan-400' },
    { label: '对话Agent — 客户回复', current: 8, total: 12, color: 'bg-rose-500', textColor: 'text-rose-400' },
    { label: '通知Agent — 人工推送', current: 5, total: 5, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
  ];

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Agent总控台</h2>
          <p className="mt-1 text-sm text-slate-400">6大智能体协同工作，全链路自动化获客</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm transition hover:border-amber-500"><Play size={14} />启动全链路</button>
          <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-sm font-semibold text-slate-900"><Settings size={14} />系统配置</button>
        </div>
      </div>

      {/* Agent Status Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {agents.map(a => (
          <div key={a.name} className="card-hover rounded-xl border border-slate-700 bg-slate-800 p-4 text-center transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10">
            <div className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full ${a.iconBg} ${a.iconColor}`}>{a.icon}</div>
            <h3 className="text-sm font-bold">{a.name}</h3>
            <p className={`mt-1 text-xs ${a.statusColor}`}>{a.status}</p>
            <p className="mt-1 text-xs text-slate-500">{a.detail}</p>
          </div>
        ))}
      </div>

      {/* Workflow Pipeline */}
      <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800 p-5">
        <h3 className="mb-4 font-bold">Agent协作工作流</h3>
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center gap-2">
            {workflow.map((w, i) => (
              <div key={w.label} className="flex flex-1 items-center gap-2">
                <div className={`flex-1 rounded-lg border ${w.border} bg-slate-900 p-3 text-center`}>
                  <div className={`mb-1 ${w.color}`}>{w.icon}</div>
                  <p className="text-xs font-semibold">{w.label}</p>
                  <p className="text-xs text-slate-500">{w.sub}</p>
                </div>
                {i < workflow.length - 1 && <ArrowRight size={16} className="shrink-0 text-slate-600" />}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
          <span><UserCheck size={12} className="mr-1 inline text-amber-400" />人工复核点</span>
          <span><TriangleAlert size={12} className="mr-1 inline text-red-400" />价格/交期/认证 → 强制移交</span>
          <span><Ban size={12} className="mr-1 inline text-red-400" />禁止AI擅自报价</span>
        </div>
      </div>

      {/* Agent Details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 font-bold">Agent运行日志</h3>
          <div className="max-h-[400px] space-y-3 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className="rounded-lg border border-slate-700/50 bg-slate-900/50 p-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className={`text-xs font-semibold ${log.color}`}>[{log.agent}]</span>
                  <span className="text-xs text-slate-500">{log.time}</span>
                </div>
                <p className="text-xs text-slate-300">{log.msg}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h3 className="mb-4 font-bold">今日Agent绩效</h3>
          <div className="space-y-4">
            {perfData.map(p => (
              <div key={p.label}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-sm">{p.label}</span>
                  <span className={`text-sm font-bold ${p.textColor || ''}`}>{p.current}/{p.total}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
                  <div className={`h-2 rounded-full ${p.color}`} style={{ width: `${(p.current / p.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-slate-700/50 bg-slate-900/50 p-3">
            <p className="text-xs text-slate-400"><Info size={12} className="mr-1 inline text-amber-400" /> 文案Agent有8封开发信待人工审阅，发送Agent队列中有3封邮件因时区限制延迟至明日发送</p>
          </div>
        </div>
      </div>

      {/* Global Rules */}
      <div className="mt-6 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-900/30 to-amber-900/30 p-5">
        <div className="flex items-start gap-3">
          <Shield size={20} className="mt-1 shrink-0 text-red-400" />
          <div>
            <h3 className="mb-2 font-bold text-red-400">全局强制规则</h3>
            <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
              {[
                '严禁捏造企业信息，所有输出附带可溯源链接',
                '价格/交期/认证问题 → 100%移交人工',
                '禁止AI擅自报价或承诺交付周期',
                '开发信必须引用客户真实业务动态',
                '每日发送量<=50封，避免反垃圾机制',
                'A级客户24小时内人工必须跟进',
              ].map(rule => (
                <div key={rule} className="flex items-center gap-2">
                  <Check size={14} className="shrink-0 text-emerald-400" />
                  <span className="text-slate-300">{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
