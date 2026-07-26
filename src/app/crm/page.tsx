'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings, Users, Briefcase, UserPlus, RefreshCw, CheckCircle,
  Mail, Phone, MapPin, Building, Tag, Calendar, DollarSign,
  TrendingUp, AlertCircle, Copy, ExternalLink, Search, Filter,
  Plus, Edit, Trash2, ChevronRight, Star, Clock, Target,
  MessageSquare, Linkedin, Globe, FileText, X, Save, Zap,
} from 'lucide-react';
import {
  ZohoConfig, CRMContact, CRMDeal, CRMLead,
} from '@/lib/types';
import {
  getZohoConfig, saveZohoConfig,
  getCRMContacts, getCRMContact, saveCRMContact, deleteCRMContact,
  getCRMDeals, getCRMDeal, saveCRMDeal, deleteCRMDeal,
  getCRMLeads, saveCRMLead, deleteCRMLead,
  syncCRMToKnowledgeBase, getCRMStats,
} from '@/lib/crm-store';

type TabType = 'contacts' | 'deals' | 'leads' | 'config';

const STAGE_LABELS: Record<string, string> = {
  Qualification: '资质审核',
  'Needs Analysis': '需求分析',
  Proposal: '方案报价',
  Negotiation: '商务谈判',
  'Closed Won': '已成交',
  'Closed Lost': '已丢单',
};

const STAGE_COLORS: Record<string, string> = {
  Qualification: 'bg-slate-100 text-slate-700',
  'Needs Analysis': 'bg-blue-50 text-blue-700',
  Proposal: 'bg-amber-50 text-amber-700',
  Negotiation: 'bg-purple-50 text-purple-700',
  'Closed Won': 'bg-emerald-50 text-emerald-700',
  'Closed Lost': 'bg-red-50 text-red-700',
};

const LEAD_STATUS_LABELS: Record<string, string> = {
  New: '新建',
  Contacted: '已联系',
  Qualified: '已 qualify',
  Unqualified: '不合格',
};

const LEAD_STATUS_COLORS: Record<string, string> = {
  New: 'bg-slate-100 text-slate-700',
  Contacted: 'bg-blue-50 text-blue-700',
  Qualified: 'bg-emerald-50 text-emerald-700',
  Unqualified: 'bg-red-50 text-red-700',
};

export default function CRMPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('contacts');
  const [config, setConfig] = useState<ZohoConfig>(getZohoConfig());
  const [contacts, setContacts] = useState<CRMContact[]>([]);
  const [deals, setDeals] = useState<CRMDeal[]>([]);
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [selectedContact, setSelectedContact] = useState<CRMContact | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<CRMDeal | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [syncResult, setSyncResult] = useState<{ count: number; items: Array<{ title: string; sourceId: string }> } | null>(null);
  const [showSyncResult, setShowSyncResult] = useState(false);
  const [editContact, setEditContact] = useState<CRMContact | null>(null);
  const [editDeal, setEditDeal] = useState<CRMDeal | null>(null);

  useEffect(() => {
    setContacts(getCRMContacts());
    setDeals(getCRMDeals());
    setLeads(getCRMLeads());
  }, []);

  const stats = getCRMStats();

  const handleSaveConfig = () => {
    saveZohoConfig({ ...config, connected: true, lastSyncTime: new Date().toISOString() });
    setConfig({ ...config, connected: true, lastSyncTime: new Date().toISOString() });
    setShowConfigPanel(false);
  };

  const handleSync = () => {
    const result = syncCRMToKnowledgeBase();
    setSyncResult(result);
    setShowSyncResult(true);
  };

  const handleSaveContact = (contact: CRMContact) => {
    saveCRMContact(contact);
    setContacts(getCRMContacts());
    setEditContact(null);
    if (selectedContact?.id === contact.id) {
      setSelectedContact(contact);
    }
  };

  const handleDeleteContact = (id: string) => {
    deleteCRMContact(id);
    setContacts(getCRMContacts());
    if (selectedContact?.id === id) {
      setSelectedContact(null);
    }
  };

  const handleSaveDeal = (deal: CRMDeal) => {
    saveCRMDeal(deal);
    setDeals(getCRMDeals());
    setEditDeal(null);
    if (selectedDeal?.id === deal.id) {
      setSelectedDeal(deal);
    }
  };

  const handleDeleteDeal = (id: string) => {
    deleteCRMDeal(id);
    setDeals(getCRMDeals());
    if (selectedDeal?.id === id) {
      setSelectedDeal(null);
    }
  };

  const filteredContacts = contacts.filter((c) => {
    const matchSearch = !searchQuery ||
      c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCountry = !filterCountry || c.country === filterCountry;
    return matchSearch && matchCountry;
  });

  const countries = [...new Set(contacts.map((c) => c.country))];

  const tabs = [
    { id: 'contacts' as TabType, label: '客户', icon: Users, count: stats.contactCount },
    { id: 'deals' as TabType, label: '商机', icon: Briefcase, count: stats.dealCount },
    { id: 'leads' as TabType, label: '线索', icon: UserPlus, count: stats.leadCount },
    { id: 'config' as TabType, label: '设置', icon: Settings, count: 0 },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                Zoho CRM 集成
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                客户管理 · 商机跟踪 · 线索培育 · 知识库联动
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSync}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-600"
              >
                <RefreshCw className="h-4 w-4" />
                同步到知识库
              </button>
              <button
                onClick={() => setShowConfigPanel(!showConfigPanel)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                <Settings className="h-4 w-4" />
                Zoho 配置
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="mx-auto max-w-7xl px-6 py-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">{stats.contactCount}</p>
                <p className="text-xs text-slate-500">客户总数</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <Briefcase className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">{stats.activeDeals}</p>
                <p className="text-xs text-slate-500">进行中商机</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">${(stats.wonValue / 10000).toFixed(1)}万</p>
                <p className="text-xs text-slate-500">已成交金额</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-slate-900">{stats.leadCount}</p>
                <p className="text-xs text-slate-500">待跟进线索</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Config Panel */}
      {showConfigPanel && (
        <div className="mx-auto max-w-7xl px-6 pb-6">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Zoho CRM API 配置</h2>
              <button onClick={() => setShowConfigPanel(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">API 域名</label>
                <input
                  type="text"
                  value={config.apiDomain}
                  onChange={(e) => setConfig({ ...config, apiDomain: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                  placeholder="https://www.zohoapis.com"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Client ID</label>
                <input
                  type="text"
                  value={config.clientId}
                  onChange={(e) => setConfig({ ...config, clientId: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                  placeholder="1000.XXXXXXXXXXXXXXXX"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Client Secret</label>
                <input
                  type="password"
                  value={config.clientSecret}
                  onChange={(e) => setConfig({ ...config, clientSecret: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                  placeholder="••••••••••••"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Auth Token</label>
                <input
                  type="password"
                  value={config.authToken}
                  onChange={(e) => setConfig({ ...config, authToken: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {config.connected ? (
                  <span className="flex items-center gap-1 text-sm text-emerald-600">
                    <CheckCircle className="h-4 w-4" />
                    已连接
                    {config.lastSyncTime && (
                      <span className="text-slate-400">
                        · 上次同步 {new Date(config.lastSyncTime).toLocaleString('zh-CN')}
                      </span>
                    )}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-slate-400">
                    <AlertCircle className="h-4 w-4" />
                    未连接
                  </span>
                )}
              </div>
              <button
                onClick={handleSaveConfig}
                className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
              >
                <Save className="h-4 w-4" />
                保存配置
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sync Result Modal */}
      {showSyncResult && syncResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowSyncResult(false)}>
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">同步完成</h3>
              <button onClick={() => setShowSyncResult(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4 text-sm text-slate-600">
              已将 <span className="font-semibold text-amber-600">{syncResult.count}</span> 条 CRM 数据同步到外贸知识库
            </p>
            <div className="max-h-60 space-y-2 overflow-y-auto">
              {syncResult.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span className="flex-1 text-slate-700">{item.title}</span>
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-700">{item.sourceId}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => { setShowSyncResult(false); router.push('/knowledge'); }}
                className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
              >
                前往知识库查看
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Contact Modal */}
      {editContact && (
        <ContactEditModal
          contact={editContact}
          onSave={handleSaveContact}
          onClose={() => setEditContact(null)}
        />
      )}

      {/* Edit Deal Modal */}
      {editDeal && (
        <DealEditModal
          deal={editDeal}
          onSave={handleSaveDeal}
          onClose={() => setEditDeal(null)}
        />
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 pb-12">
        {/* Tabs */}
        <div className="mb-6 flex items-center gap-1 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  activeTab === tab.id ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'contacts' && (
          <ContactsTab
            contacts={filteredContacts}
            countries={countries}
            searchQuery={searchQuery}
            filterCountry={filterCountry}
            onSearchChange={setSearchQuery}
            onCountryChange={setFilterCountry}
            onSelect={setSelectedContact}
            onEdit={setEditContact}
            onDelete={handleDeleteContact}
            selectedContact={selectedContact}
          />
        )}

        {activeTab === 'deals' && (
          <DealsTab
            deals={deals}
            onSelect={setSelectedDeal}
            onEdit={setEditDeal}
            onDelete={handleDeleteDeal}
            selectedDeal={selectedDeal}
          />
        )}

        {activeTab === 'leads' && (
          <LeadsTab leads={leads} />
        )}

        {activeTab === 'config' && (
          <ConfigTab config={config} onSaveConfig={(c) => { setConfig(c); saveZohoConfig(c); }} />
        )}
      </div>
    </div>
  );
}

// ============ Contacts Tab ============
function ContactsTab({
  contacts, countries, searchQuery, filterCountry,
  onSearchChange, onCountryChange, onSelect, onEdit, onDelete, selectedContact,
}: {
  contacts: CRMContact[];
  countries: string[];
  searchQuery: string;
  filterCountry: string;
  onSearchChange: (v: string) => void;
  onCountryChange: (v: string) => void;
  onSelect: (c: CRMContact) => void;
  onEdit: (c: CRMContact) => void;
  onDelete: (id: string) => void;
  selectedContact: CRMContact | null;
}) {
  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Contact List */}
      <div className="col-span-2">
        {/* Search & Filter */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索客户名称、公司、邮箱..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
            />
          </div>
          <select
            value={filterCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500"
          >
            <option value="">全部国家</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Contact Cards */}
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelect(contact)}
              className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${
                selectedContact?.id === contact.id
                  ? 'border-amber-300 bg-amber-50/50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-amber-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-medium text-white">
                    {contact.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-900">{contact.fullName}</h3>
                    <p className="text-sm text-slate-500">{contact.title} · {contact.company}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{contact.email}</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{contact.country}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => { e.stopPropagation(); onEdit(contact); }}
                    className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(contact.id); }}
                    className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {contact.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Detail */}
      <div className="col-span-1">
        {selectedContact ? (
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-xl font-medium text-white">
                {selectedContact.fullName.charAt(0)}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{selectedContact.fullName}</h3>
              <p className="text-sm text-slate-500">{selectedContact.title}</p>
              <p className="text-sm font-medium text-amber-600">{selectedContact.company}</p>
            </div>
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <InfoRow icon={<Mail className="h-4 w-4" />} label="邮箱" value={selectedContact.email} />
              <InfoRow icon={<Phone className="h-4 w-4" />} label="电话" value={selectedContact.phone} />
              <InfoRow icon={<MapPin className="h-4 w-4" />} label="国家" value={selectedContact.country} />
              <InfoRow icon={<Building className="h-4 w-4" />} label="行业" value={selectedContact.industry} />
              <InfoRow icon={<Globe className="h-4 w-4" />} label="来源" value={selectedContact.leadSource} />
              <InfoRow icon={<Users className="h-4 w-4" />} label="负责人" value={selectedContact.owner} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="创建日期" value={selectedContact.createdAt} />
              <InfoRow icon={<Clock className="h-4 w-4" />} label="最近活动" value={selectedContact.lastActivity} />
            </div>
            {selectedContact.notes && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="mb-2 text-xs font-medium text-slate-500">备注</p>
                <p className="text-sm leading-relaxed text-slate-700">{selectedContact.notes}</p>
              </div>
            )}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {selectedContact.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs text-amber-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="sticky top-24 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <Users className="mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm text-slate-400">点击左侧客户查看详情</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ Deals Tab ============
function DealsTab({
  deals, onSelect, onEdit, onDelete, selectedDeal,
}: {
  deals: CRMDeal[];
  onSelect: (d: CRMDeal) => void;
  onEdit: (d: CRMDeal) => void;
  onDelete: (id: string) => void;
  selectedDeal: CRMDeal | null;
}) {
  const stages = ['Qualification', 'Needs Analysis', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'] as const;

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Deal List */}
      <div className="col-span-2 space-y-3">
        {deals.map((deal) => (
          <div
            key={deal.id}
            onClick={() => onSelect(deal)}
            className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md ${
              selectedDeal?.id === deal.id
                ? 'border-amber-300 bg-amber-50/50 shadow-sm'
                : 'border-slate-200 bg-white hover:border-amber-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-slate-900">{deal.dealName}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STAGE_COLORS[deal.stage]}`}>
                    {STAGE_LABELS[deal.stage]}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-500">{deal.contactName} · {deal.product}</p>
                <div className="mt-2 flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1 font-medium text-slate-600">
                    <DollarSign className="h-3 w-3" />${deal.amount.toLocaleString()} {deal.currency}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" />{deal.probability}%
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />预计 {deal.expectedCloseDate}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(deal); }}
                  className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(deal.id); }}
                  className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {/* Progress bar */}
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-amber-500 transition-all"
                style={{ width: `${deal.probability}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Deal Detail */}
      <div className="col-span-1">
        {selectedDeal ? (
          <div className="sticky top-24 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-1 text-lg font-semibold text-slate-900">{selectedDeal.dealName}</h3>
            <span className={`mb-4 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STAGE_COLORS[selectedDeal.stage]}`}>
              {STAGE_LABELS[selectedDeal.stage]}
            </span>
            <div className="space-y-3 border-t border-slate-100 pt-4">
              <InfoRow icon={<Users className="h-4 w-4" />} label="联系人" value={selectedDeal.contactName} />
              <InfoRow icon={<DollarSign className="h-4 w-4" />} label="金额" value={`$${selectedDeal.amount.toLocaleString()} ${selectedDeal.currency}`} />
              <InfoRow icon={<Target className="h-4 w-4" />} label="成交概率" value={`${selectedDeal.probability}%`} />
              <InfoRow icon={<Calendar className="h-4 w-4" />} label="预计成交" value={selectedDeal.expectedCloseDate} />
              <InfoRow icon={<Briefcase className="h-4 w-4" />} label="产品" value={selectedDeal.product} />
              <InfoRow icon={<Users className="h-4 w-4" />} label="负责人" value={selectedDeal.owner} />
            </div>
            {selectedDeal.description && (
              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="mb-2 text-xs font-medium text-slate-500">描述</p>
                <p className="text-sm leading-relaxed text-slate-700">{selectedDeal.description}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="sticky top-24 flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <Briefcase className="mb-3 h-10 w-10 text-slate-300" />
            <p className="text-sm text-slate-400">点击左侧商机查看详情</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ Leads Tab ============
function LeadsTab({ leads }: { leads: CRMLead[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">姓名</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">公司</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">国家</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">来源</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">状态</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">评分</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-slate-500">负责人</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                    {lead.fullName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{lead.fullName}</p>
                    <p className="text-xs text-slate-400">{lead.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">{lead.company}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{lead.country}</td>
              <td className="px-4 py-3 text-sm text-slate-700">{lead.leadSource}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${LEAD_STATUS_COLORS[lead.status]}`}>
                  {LEAD_STATUS_LABELS[lead.status]}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${
                        lead.score >= 70 ? 'bg-emerald-500' : lead.score >= 40 ? 'bg-amber-500' : 'bg-slate-300'
                      }`}
                      style={{ width: `${lead.score}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-600">{lead.score}</span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-slate-700">{lead.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============ Config Tab ============
function ConfigTab({ config, onSaveConfig }: { config: ZohoConfig; onSaveConfig: (c: ZohoConfig) => void }) {
  const [localConfig, setLocalConfig] = useState(config);

  return (
    <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-lg font-semibold text-slate-900">Zoho CRM 连接配置</h2>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">API 域名</label>
          <input
            type="text"
            value={localConfig.apiDomain}
            onChange={(e) => setLocalConfig({ ...localConfig, apiDomain: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
          />
          <p className="mt-1 text-xs text-slate-400">中国大陆用户可使用 https://www.zohoapis.com.cn</p>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Client ID</label>
          <input
            type="text"
            value={localConfig.clientId}
            onChange={(e) => setLocalConfig({ ...localConfig, clientId: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
            placeholder="从 Zoho Developer Console 获取"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Client Secret</label>
          <input
            type="password"
            value={localConfig.clientSecret}
            onChange={(e) => setLocalConfig({ ...localConfig, clientSecret: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Auth Token / Refresh Token</label>
          <input
            type="password"
            value={localConfig.authToken}
            onChange={(e) => setLocalConfig({ ...localConfig, authToken: e.target.value })}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
          />
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2">
            {localConfig.connected ? (
              <span className="flex items-center gap-1 text-sm text-emerald-600">
                <CheckCircle className="h-4 w-4" />
                已连接
                {localConfig.lastSyncTime && (
                  <span className="text-slate-400">
                    · 上次同步 {new Date(localConfig.lastSyncTime).toLocaleString('zh-CN')}
                  </span>
                )}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-sm text-slate-400">
                <AlertCircle className="h-4 w-4" />
                未连接
              </span>
            )}
          </div>
          <button
            onClick={() => onSaveConfig({ ...localConfig, connected: true, lastSyncTime: new Date().toISOString() })}
            className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600"
          >
            <Save className="h-4 w-4" />
            保存并连接
          </button>
        </div>
      </div>

      {/* Integration Guide */}
      <div className="mt-8 rounded-lg bg-slate-50 p-4">
        <h3 className="mb-2 text-sm font-medium text-slate-700">Zoho CRM 接入说明</h3>
        <ol className="space-y-1.5 text-xs text-slate-500">
          <li>1. 登录 <a href="https://api-console.zoho.com" target="_blank" rel="noopener" className="text-amber-600 hover:underline">Zoho API Console</a> 创建 Self Client</li>
          <li>2. 获取 Client ID 和 Client Secret</li>
          <li>3. 通过 OAuth 2.0 流程获取 Access Token</li>
          <li>4. 将凭证填入上方表单并保存</li>
          <li>5. 点击「同步到知识库」将 CRM 数据推送到外贸知识库</li>
        </ol>
      </div>
    </div>
  );
}

// ============ Contact Edit Modal ============
function ContactEditModal({ contact, onSave, onClose }: { contact: CRMContact; onSave: (c: CRMContact) => void; onClose: () => void }) {
  const [form, setForm] = useState(contact);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">编辑客户</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="姓名" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
          <Field label="公司" value={form.company} onChange={(v) => setForm({ ...form, company: v })} />
          <Field label="职位" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <Field label="邮箱" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
          <Field label="电话" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
          <Field label="国家" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
          <Field label="行业" value={form.industry} onChange={(v) => setForm({ ...form, industry: v })} />
          <Field label="来源" value={form.leadSource} onChange={(v) => setForm({ ...form, leadSource: v })} />
          <Field label="负责人" value={form.owner} onChange={(v) => setForm({ ...form, owner: v })} />
          <Field label="标签 (逗号分隔)" value={form.tags.join(', ')} onChange={(v) => setForm({ ...form, tags: v.split(',').map((t) => t.trim()) })} />
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-sm font-medium text-slate-700">备注</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">取消</button>
          <button onClick={() => onSave(form)} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600">保存</button>
        </div>
      </div>
    </div>
  );
}

// ============ Deal Edit Modal ============
function DealEditModal({ deal, onSave, onClose }: { deal: CRMDeal; onSave: (d: CRMDeal) => void; onClose: () => void }) {
  const [form, setForm] = useState(deal);
  const stageKeys = Object.keys(STAGE_LABELS) as CRMDeal['stage'][];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">编辑商机</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Field label="商机名称" value={form.dealName} onChange={(v) => setForm({ ...form, dealName: v })} />
          </div>
          <Field label="联系人" value={form.contactName} onChange={(v) => setForm({ ...form, contactName: v })} />
          <Field label="产品" value={form.product} onChange={(v) => setForm({ ...form, product: v })} />
          <Field label="金额 (USD)" value={String(form.amount)} onChange={(v) => setForm({ ...form, amount: Number(v) })} />
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">阶段</label>
            <select
              value={form.stage}
              onChange={(e) => setForm({ ...form, stage: e.target.value as CRMDeal['stage'] })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500"
            >
              {stageKeys.map((s) => (
                <option key={s} value={s}>{STAGE_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <Field label="成交概率 (%)" value={String(form.probability)} onChange={(v) => setForm({ ...form, probability: Number(v) })} />
          <Field label="预计成交日期" value={form.expectedCloseDate} onChange={(v) => setForm({ ...form, expectedCloseDate: v })} />
          <Field label="负责人" value={form.owner} onChange={(v) => setForm({ ...form, owner: v })} />
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-sm font-medium text-slate-700">描述</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
          />
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">取消</button>
          <button onClick={() => onSave(form)} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600">保存</button>
        </div>
      </div>
    </div>
  );
}

// ============ Helper Components ============
function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="mt-0.5 text-slate-400">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="truncate text-sm text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10"
      />
    </div>
  );
}
