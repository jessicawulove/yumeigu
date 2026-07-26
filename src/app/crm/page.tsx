'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSupabaseConfig } from '@/lib/supabase-config-inject';
import { getSupabaseBrowserClientWithRetry } from '@/lib/supabase-browser';
import type { CRMContact, CRMDeal, CRMLead, ZohoConfig } from '@/lib/types';
import { crmStore } from '@/lib/crm-store';
import {
  Users,
  TrendingUp,
  Target,
  Settings,
  Plus,
  Edit3,
  Trash2,
  Search,
  X,
  Save,
  Database,
  CheckCircle,
  AlertCircle,
  Building2,
  Globe,
  Phone,
  Mail,
  User,
  DollarSign,
  BarChart3,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
  MessageSquare,
  Star,
  Tag,
  Calendar,
  Eye,
  EyeOff,
} from 'lucide-react';

type TabType = 'contacts' | 'deals' | 'leads' | 'settings';

export default function CRMPage() {
  const { isLoading: configLoading } = useSupabaseConfig();
  const [activeTab, setActiveTab] = useState<TabType>('contacts');
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [deals, setDeals] = useState<CRMDeal[]>([]);
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'contact' | 'deal' | 'lead'>('contact');
  const [editingItem, setEditingItem] = useState<CRMContact | CRMDeal | CRMLead | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ contacts: number; deals: number } | null>(null);
  const [zohoConfig, setZohoConfig] = useState<ZohoConfig>({
    apiDomain: 'https://www.zohoapis.com',
    clientId: '',
    clientSecret: '',
    authToken: '',
  });
  const [configSaved, setConfigSaved] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      setContacts(crmStore.getAllContacts());
      setDeals(crmStore.getAllDeals());
      setLeads(crmStore.getAllLeads());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    const saved = localStorage.getItem('zoho_config');
    if (saved) {
      try {
        setZohoConfig(JSON.parse(saved));
      } catch { /* ignore */ }
    }
  }, [loadData]);

  const handleSaveContact = (contact: CRMContact) => {
    crmStore.saveContact(contact);
    setContacts(crmStore.getAllContacts());
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSaveDeal = (deal: CRMDeal) => {
    crmStore.saveDeal(deal);
    setDeals(crmStore.getAllDeals());
    setShowModal(false);
    setEditingItem(null);
  };

  const handleSaveLead = (lead: CRMLead) => {
    crmStore.saveLead(lead);
    setLeads(crmStore.getAllLeads());
    setShowModal(false);
    setEditingItem(null);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('确定要删除该客户吗？')) {
      crmStore.deleteContact(id);
      setContacts(crmStore.getAllContacts());
    }
  };

  const handleDeleteDeal = (id: string) => {
    if (confirm('确定要删除该商机吗？')) {
      crmStore.deleteDeal(id);
      setDeals(crmStore.getAllDeals());
    }
  };

  const handleDeleteLead = (id: string) => {
    if (confirm('确定要删除该线索吗？')) {
      crmStore.deleteLead(id);
      setLeads(crmStore.getAllLeads());
    }
  };

  const handleSyncToKnowledge = () => {
    setSyncing(true);
    setTimeout(() => {
      const result = crmStore.syncToKnowledgeBase();
      setSyncResult(result);
      setSyncing(false);
      setTimeout(() => setSyncResult(null), 5000);
    }, 1500);
  };

  const handleSaveConfig = () => {
    localStorage.setItem('zoho_config', JSON.stringify(zohoConfig));
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 2000);
  };

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.country?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDeals = deals.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.contactName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.company?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalDealAmount = deals.reduce((sum, d) => sum + Number(d.amount || 0), 0);
  const activeDeals = deals.filter((d) => d.stage !== 'closed_won' && d.stage !== 'closed_lost');

  const stageLabels: Record<string, string> = {
    qualification: '资质审核',
    needs_analysis: '需求分析',
    proposal: '方案报价',
    negotiation: '商务谈判',
    closed_won: '已成交',
    closed_lost: '已丢单',
  };

  const stageColors: Record<string, string> = {
    qualification: 'bg-slate-100 text-slate-700',
    needs_analysis: 'bg-blue-100 text-blue-700',
    proposal: 'bg-amber-100 text-amber-700',
    negotiation: 'bg-purple-100 text-purple-700',
    closed_won: 'bg-emerald-100 text-emerald-700',
    closed_lost: 'bg-red-100 text-red-700',
  };

  const leadStatusLabels: Record<string, string> = {
    new: '新建',
    contacted: '已联系',
    qualified: '已 Qualify',
    unqualified: '不合格',
  };

  const leadStatusColors: Record<string, string> = {
    new: 'bg-slate-100 text-slate-700',
    contacted: 'bg-blue-100 text-blue-700',
    qualified: 'bg-emerald-100 text-emerald-700',
    unqualified: 'bg-red-100 text-red-700',
  };

  if (configLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-amber-600">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">客户总数</p>
              <p className="text-2xl font-bold text-slate-900">{contacts.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">进行中商机</p>
              <p className="text-2xl font-bold text-slate-900">{activeDeals.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">商机总金额</p>
              <p className="text-2xl font-bold text-slate-900">${totalDealAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">活跃线索</p>
              <p className="text-2xl font-bold text-slate-900">{leads.filter((l) => l.status !== 'unqualified').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-slate-100">
          {[
            { key: 'contacts' as TabType, label: '客户管理', icon: Users },
            { key: 'deals' as TabType, label: '商机管理', icon: TrendingUp },
            { key: 'leads' as TabType, label: '线索管理', icon: Target },
            { key: 'settings' as TabType, label: 'Zoho 配置', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setSearchQuery('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {activeTab !== 'settings' && (
            <>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="搜索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent w-48"
                />
              </div>
              <button
                onClick={() => {
                  setModalType(activeTab === 'contacts' ? 'contact' : activeTab === 'deals' ? 'deal' : 'lead');
                  setEditingItem(null);
                  setShowModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors shadow-sm"
              >
                <Plus className="w-4 h-4" />
                新增
              </button>
            </>
          )}
          {activeTab === 'settings' && (
            <button
              onClick={handleSyncToKnowledge}
              disabled={syncing}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? '同步中...' : '同步到知识库'}
            </button>
          )}
        </div>
      </div>

      {/* Sync Result Toast */}
      {syncResult && (
        <div className="fixed top-20 right-4 z-50 bg-white rounded-xl shadow-lg border border-emerald-200 p-4 flex items-center gap-3 animate-in slide-in-from-right">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <div>
            <p className="text-sm font-medium text-slate-800">同步成功</p>
            <p className="text-xs text-slate-500">
              推送 {syncResult.contacts} 条客户 + {syncResult.deals} 条商机到知识库
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-amber-600">加载中...</div>
        </div>
      ) : activeTab === 'contacts' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">客户名称</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">公司</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">国家</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">联系方式</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 text-sm font-medium">
                          {contact.name.charAt(0)}
                        </div>
                        <span className="font-medium text-slate-900">{contact.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{contact.company || '-'}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{contact.country || '-'}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">
                      <div className="space-y-0.5">
                        {contact.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{contact.email}</div>}
                        {contact.phone && <div className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{contact.phone}</div>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${contact.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {contact.isActive ? '活跃' : '非活跃'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditingItem(contact); setModalType('contact'); setShowModal(true); }}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteContact(contact.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredContacts.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>暂无客户数据</p>
            </div>
          )}
        </div>
      ) : activeTab === 'deals' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">商机名称</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">关联客户</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">阶段</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">金额</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">概率</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">预计成交</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredDeals.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{deal.name}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{deal.contactName || '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${stageColors[deal.stage] || 'bg-slate-100 text-slate-600'}`}>
                        {stageLabels[deal.stage] || deal.stage}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-slate-900">${Number(deal.amount || 0).toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: `${deal.probability}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{deal.probability}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{deal.expectedCloseDate || '-'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditingItem(deal); setModalType('deal'); setShowModal(true); }}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDeal(deal.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredDeals.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>暂无商机数据</p>
            </div>
          )}
        </div>
      ) : activeTab === 'leads' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">姓名</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">公司</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">来源</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">评分</th>
                  <th className="text-left px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">负责人</th>
                  <th className="text-right px-5 py-3 text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-900">{lead.name}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{lead.company || '-'}</td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{lead.source || '-'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${leadStatusColors[lead.status] || 'bg-slate-100 text-slate-600'}`}>
                        {leadStatusLabels[lead.status] || lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${Number(lead.score) >= 70 ? 'bg-emerald-500' : Number(lead.score) >= 40 ? 'bg-amber-500' : 'bg-red-400'}`} style={{ width: `${lead.score}%` }} />
                        </div>
                        <span className="text-xs text-slate-500">{lead.score}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-slate-600">{lead.owner || '-'}</td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setEditingItem(lead); setModalType('lead'); setShowModal(true); }}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredLeads.length === 0 && (
            <div className="py-16 text-center text-slate-400">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>暂无线索数据</p>
            </div>
          )}
        </div>
      ) : (
        /* Settings Tab */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Zoho Config */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Zoho CRM 连接配置</h3>
            <p className="text-sm text-slate-500 mb-6">配置 Zoho CRM API 凭证以同步数据</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">API 域名</label>
                <input
                  type="text"
                  value={zohoConfig.apiDomain}
                  onChange={(e) => setZohoConfig({ ...zohoConfig, apiDomain: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://www.zohoapis.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client ID</label>
                <input
                  type="text"
                  value={zohoConfig.clientId}
                  onChange={(e) => setZohoConfig({ ...zohoConfig, clientId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="从 Zoho Developer Console 获取"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Client Secret</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={zohoConfig.clientSecret}
                    onChange={(e) => setZohoConfig({ ...zohoConfig, clientSecret: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent pr-10"
                    placeholder="从 Zoho Developer Console 获取"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Auth Token</label>
                <input
                  type="password"
                  value={zohoConfig.authToken}
                  onChange={(e) => setZohoConfig({ ...zohoConfig, authToken: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="OAuth 2.0 Access Token"
                />
              </div>

              <button
                onClick={handleSaveConfig}
                className="w-full py-2.5 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center gap-2"
              >
                {configSaved ? <><CheckCircle className="w-4 h-4" />已保存</> : <><Save className="w-4 h-4" />保存配置</>}
              </button>
            </div>
          </div>

          {/* Integration Guide */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">接入说明</h3>
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                  <p>前往 <span className="font-medium text-slate-800">Zoho Developer Console</span> 创建 OAuth 客户端，获取 Client ID 和 Client Secret</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                  <p>使用 OAuth 2.0 授权码流程获取 Access Token，填入上方配置</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</div>
                  <p>点击「同步到知识库」将 CRM 数据推送到外贸知识库模块</p>
                </div>
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">4</div>
                  <p>中国大陆用户可使用 <code className="px-1.5 py-0.5 bg-slate-100 rounded text-xs">zohoapis.com.cn</code> 域名</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 p-6">
              <h3 className="text-sm font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                数据同步说明
              </h3>
              <ul className="space-y-2 text-sm text-amber-800/80">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  客户数据同步到「03_客户档案」目录
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  商机数据同步到「05_报价与成交」目录
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  线索数据同步到「00_Inbox」待整理目录
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setShowModal(false); setEditingItem(null); }} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingItem ? '编辑' : '新增'} {modalType === 'contact' ? '客户' : modalType === 'deal' ? '商机' : '线索'}
              </h3>
              <button onClick={() => { setShowModal(false); setEditingItem(null); }} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-6">
              {modalType === 'contact' && (
                <ContactForm
                  initial={editingItem as CRMContact}
                  onSave={handleSaveContact}
                  onCancel={() => { setShowModal(false); setEditingItem(null); }}
                />
              )}
              {modalType === 'deal' && (
                <DealForm
                  initial={editingItem as CRMDeal}
                  contacts={contacts}
                  onSave={handleSaveDeal}
                  onCancel={() => { setShowModal(false); setEditingItem(null); }}
                />
              )}
              {modalType === 'lead' && (
                <LeadForm
                  initial={editingItem as CRMLead}
                  onSave={handleSaveLead}
                  onCancel={() => { setShowModal(false); setEditingItem(null); }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Contact Form Component
function ContactForm({ initial, onSave, onCancel }: { initial: CRMContact | null; onSave: (c: CRMContact) => void; onCancel: () => void }) {
  const [form, setForm] = useState<CRMContact>(initial || {
    id: '',
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    title: '',
    tags: [],
    notes: '',
    isActive: true,
    createdAt: new Date().toISOString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: form.id || crypto.randomUUID() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">客户名称 *</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">职位</label>
          <input type="text" value={form.title || ''} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">公司</label>
          <input type="text" value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">国家/地区</label>
          <input type="text" value={form.country || ''} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">邮箱</label>
          <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">电话</label>
          <input type="text" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">标签（逗号分隔）</label>
        <input type="text" value={(form.tags || []).join(', ')} onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="重要客户, 欧洲市场" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">备注</label>
        <textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-slate-300 text-amber-500 focus:ring-amber-500" />
        <label htmlFor="isActive" className="text-sm text-slate-700">活跃客户</label>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">取消</button>
        <button type="submit" className="flex-1 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">保存</button>
      </div>
    </form>
  );
}

// Deal Form Component
function DealForm({ initial, contacts, onSave, onCancel }: { initial: CRMDeal | null; contacts: CRMContact[]; onSave: (d: CRMDeal) => void; onCancel: () => void }) {
  const [form, setForm] = useState<CRMDeal>(initial || {
    id: '',
    name: '',
    contactId: '',
    contactName: '',
    stage: 'qualification',
    amount: 0,
    probability: 0,
    expectedCloseDate: '',
    notes: '',
    createdAt: new Date().toISOString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = contacts.find(c => c.id === form.contactId);
    onSave({ ...form, id: form.id || crypto.randomUUID(), contactName: contact?.name || form.contactName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">商机名称 *</label>
        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">关联客户</label>
        <select value={form.contactId || ''} onChange={(e) => setForm({ ...form, contactId: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
          <option value="">-- 选择客户 --</option>
          {contacts.map(c => <option key={c.id} value={c.id}>{c.name} {c.company ? `(${c.company})` : ''}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">阶段</label>
          <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value as CRMDeal['stage'] })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
            <option value="qualification">资质审核</option>
            <option value="needs_analysis">需求分析</option>
            <option value="proposal">方案报价</option>
            <option value="negotiation">商务谈判</option>
            <option value="closed_won">已成交</option>
            <option value="closed_lost">已丢单</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">金额 (USD)</label>
          <input type="number" value={form.amount || 0} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">成交概率 (%)</label>
          <input type="number" min="0" max="100" value={form.probability || 0} onChange={(e) => setForm({ ...form, probability: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">预计成交日期</label>
          <input type="date" value={form.expectedCloseDate || ''} onChange={(e) => setForm({ ...form, expectedCloseDate: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">备注</label>
        <textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">取消</button>
        <button type="submit" className="flex-1 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">保存</button>
      </div>
    </form>
  );
}

// Lead Form Component
function LeadForm({ initial, onSave, onCancel }: { initial: CRMLead | null; onSave: (l: CRMLead) => void; onCancel: () => void }) {
  const [form, setForm] = useState<CRMLead>(initial || {
    id: '',
    name: '',
    company: '',
    email: '',
    phone: '',
    country: '',
    source: '',
    status: 'new',
    score: 0,
    owner: '',
    notes: '',
    createdAt: new Date().toISOString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: form.id || crypto.randomUUID() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">姓名 *</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">公司</label>
          <input type="text" value={form.company || ''} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">邮箱</label>
          <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">电话</label>
          <input type="text" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">国家/地区</label>
          <input type="text" value={form.country || ''} onChange={(e) => setForm({ ...form, country: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">来源</label>
          <input type="text" value={form.source || ''} onChange={(e) => setForm({ ...form, source: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" placeholder="展会/官网/推荐..." />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">状态</label>
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CRMLead['status'] })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
            <option value="new">新建</option>
            <option value="contacted">已联系</option>
            <option value="qualified">已 Qualify</option>
            <option value="unqualified">不合格</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">评分 (0-100)</label>
          <input type="number" min="0" max="100" value={form.score || 0} onChange={(e) => setForm({ ...form, score: Number(e.target.value) })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">负责人</label>
        <input type="text" value={form.owner || ''} onChange={(e) => setForm({ ...form, owner: e.target.value })} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">备注</label>
        <textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">取消</button>
        <button type="submit" className="flex-1 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">保存</button>
      </div>
    </form>
  );
}
