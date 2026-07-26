import { ZohoConfig, CRMContact, CRMDeal, CRMLead } from './types';

const ZOHO_CONFIG_KEY = 'yumeigu_zoho_config';
const CRM_CONTACTS_KEY = 'yumeigu_crm_contacts';
const CRM_DEALS_KEY = 'yumeigu_crm_deals';
const CRM_LEADS_KEY = 'yumeigu_crm_leads';

const DEFAULT_ZOHO_CONFIG: ZohoConfig = {
  apiDomain: 'https://www.zohoapis.com',
  clientId: '',
  clientSecret: '',
  authToken: '',
};

const DEFAULT_CONTACTS: CRMContact[] = [
  { id: 'crm-c001', name: 'Hans Schmidt', email: 'h.schmidt@mueller-gmbh.de', phone: '+49 89 1234567', company: 'Mueller GmbH', title: '采购总监', country: '德国', tags: ['大客户', '欧洲', '决策人'], notes: '年营收 5000 万欧元，对 CE 认证有严格要求', owner: '张经理', isActive: true, createdAt: '2024-01-15' },
  { id: 'crm-c002', name: 'Carlos Silva', email: 'carlos@silva-trading.com.br', phone: '+55 11 987654321', company: 'Silva Trading', title: '进口经理', country: '巴西', tags: ['价格敏感', '南美', '复购客户'], notes: '价格敏感型客户，年采购量 200 万美元', owner: '李经理', isActive: true, createdAt: '2024-02-01' },
  { id: 'crm-c003', name: 'Ahmed Hassan', email: 'ahmed@gulf-electronics.ae', phone: '+971 4 5551234', company: 'Gulf Electronics LLC', title: 'CEO', country: '阿联酋', tags: ['中东', '紧急订单', '高潜力'], notes: '要求 15 天交货，已发样品', owner: '王经理', isActive: true, createdAt: '2024-02-20' },
  { id: 'crm-c004', name: 'Yuki Tanaka', email: 'y.tanaka@tokyo-imports.jp', phone: '+81 3 12345678', company: 'Tokyo Imports Co.', title: '采购部长', country: '日本', tags: ['日本', '样品通过', '等待订单'], notes: '样品已通过测试，等待正式订单 2000 件', owner: '张经理', isActive: true, createdAt: '2024-01-20' },
  { id: 'crm-c005', name: 'Sarah Johnson', email: 'sarah@aussie-wholesale.com.au', phone: '+61 2 98765432', company: 'Aussie Wholesale', title: '采购经理', country: '澳大利亚', tags: ['澳洲', '定制需求', '新客'], notes: '500 件定制订单，FOB 报价 $12.5/件', owner: '李经理', isActive: true, createdAt: '2024-03-01' },
  { id: 'crm-c006', name: 'Pierre Dubois', email: 'p.dubois@euro-distribution.fr', phone: '+33 1 45678901', company: 'Euro Distribution', title: '供应链总监', country: '法国', tags: ['欧洲', '分销商', '大客户'], notes: '覆盖法比卢三国分销网络，年采购量 800 万美元', owner: '王经理', isActive: true, createdAt: '2024-01-10' },
];

const DEFAULT_DEALS: CRMDeal[] = [
  { id: 'crm-d001', name: 'Mueller GmbH - 智能家居首批订单', contactId: 'crm-c001', contactName: 'Hans Schmidt', amount: 150000, stage: 'negotiation', probability: 70, expectedCloseDate: '2024-04-15', notes: '首批 5000 件订单，正在谈判价格和交期', owner: '张经理', createdAt: '2024-02-01' },
  { id: 'crm-d002', name: 'Silva Trading - Q2 补货订单', contactId: 'crm-c002', contactName: 'Carlos Silva', amount: 85000, stage: 'proposal', probability: 80, expectedCloseDate: '2024-03-30', notes: 'Q2 季度补货，客户已确认产品清单', owner: '李经理', createdAt: '2024-02-15' },
  { id: 'crm-d003', name: 'Gulf Electronics - 紧急订单', contactId: 'crm-c003', contactName: 'Ahmed Hassan', amount: 45000, stage: 'needs_analysis', probability: 50, expectedCloseDate: '2024-03-25', notes: '15 天交货的紧急订单，正在确认生产可行性', owner: '王经理', createdAt: '2024-03-01' },
  { id: 'crm-d004', name: 'Tokyo Imports - 正式订单', contactId: 'crm-c004', contactName: 'Yuki Tanaka', amount: 120000, stage: 'closed_won', probability: 100, expectedCloseDate: '2024-03-20', notes: '样品通过后正式下单，2000 件', owner: '张经理', createdAt: '2024-01-20' },
  { id: 'crm-d005', name: 'Aussie Wholesale - 定制订单', contactId: 'crm-c005', contactName: 'Sarah Johnson', amount: 6250, stage: 'qualification', probability: 40, expectedCloseDate: '2024-04-30', notes: '500 件定制订单，含 Logo 印刷', owner: '李经理', createdAt: '2024-03-05' },
];

const DEFAULT_LEADS: CRMLead[] = [
  { id: 'crm-l001', name: 'Maria Garcia', email: 'maria@latam-imports.mx', phone: '+52 55 12345678', company: 'Latam Imports', country: '墨西哥', source: '展会', status: 'contacted', score: 65, owner: '张经理', notes: '对智能家居产品线感兴趣', createdAt: '2024-03-10' },
  { id: 'crm-l002', name: 'James Wilson', email: 'j.wilson@uk-retail.co.uk', phone: '+44 20 71234567', company: 'UK Retail Group', country: '英国', source: '官网询盘', status: 'qualified', score: 80, owner: '李经理', notes: '年采购预算 50 万英镑', createdAt: '2024-03-08' },
  { id: 'crm-l003', name: 'Kim Soo-jin', email: 'soojin@korea-tech.kr', phone: '+82 2 12345678', company: 'Korea Tech', country: '韩国', source: 'LinkedIn', status: 'new', score: 45, owner: '王经理', notes: '初步接触，待跟进', createdAt: '2024-03-12' },
  { id: 'crm-l004', name: 'Anna Kowalski', email: 'anna@poland-wholesale.pl', phone: '+48 22 1234567', company: 'Poland Wholesale', country: '波兰', source: '推荐', status: 'unqualified', score: 20, owner: '张经理', notes: '预算不足，暂不符合', createdAt: '2024-03-05' },
];

function getFromStorage<T>(key: string, defaults: T[]): T[] {
  if (typeof window === 'undefined') return defaults;
  const stored = localStorage.getItem(key);
  if (stored) {
    try { return JSON.parse(stored); } catch { /* ignore */ }
  }
  localStorage.setItem(key, JSON.stringify(defaults));
  return defaults;
}

function saveToStorage<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

export const crmStore = {
  // Zoho Config
  getZohoConfig: (): ZohoConfig => {
    if (typeof window === 'undefined') return DEFAULT_ZOHO_CONFIG;
    const stored = localStorage.getItem(ZOHO_CONFIG_KEY);
    if (stored) { try { return JSON.parse(stored); } catch { /* ignore */ } }
    return DEFAULT_ZOHO_CONFIG;
  },
  saveZohoConfig: (config: ZohoConfig) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ZOHO_CONFIG_KEY, JSON.stringify(config));
  },

  // Contacts
  getAllContacts: (): CRMContact[] => getFromStorage(CRM_CONTACTS_KEY, DEFAULT_CONTACTS),
  saveContact: (contact: CRMContact) => {
    const contacts = crmStore.getAllContacts();
    const idx = contacts.findIndex(c => c.id === contact.id);
    if (idx >= 0) { contacts[idx] = { ...contact, updatedAt: new Date().toISOString() }; }
    else { contacts.push({ ...contact, createdAt: new Date().toISOString() }); }
    saveToStorage(CRM_CONTACTS_KEY, contacts);
  },
  deleteContact: (id: string) => {
    const contacts = crmStore.getAllContacts().filter(c => c.id !== id);
    saveToStorage(CRM_CONTACTS_KEY, contacts);
  },

  // Deals
  getAllDeals: (): CRMDeal[] => getFromStorage(CRM_DEALS_KEY, DEFAULT_DEALS),
  saveDeal: (deal: CRMDeal) => {
    const deals = crmStore.getAllDeals();
    const idx = deals.findIndex(d => d.id === deal.id);
    if (idx >= 0) { deals[idx] = { ...deal, updatedAt: new Date().toISOString() }; }
    else { deals.push({ ...deal, createdAt: new Date().toISOString() }); }
    saveToStorage(CRM_DEALS_KEY, deals);
  },
  deleteDeal: (id: string) => {
    const deals = crmStore.getAllDeals().filter(d => d.id !== id);
    saveToStorage(CRM_DEALS_KEY, deals);
  },

  // Leads
  getAllLeads: (): CRMLead[] => getFromStorage(CRM_LEADS_KEY, DEFAULT_LEADS),
  saveLead: (lead: CRMLead) => {
    const leads = crmStore.getAllLeads();
    const idx = leads.findIndex(l => l.id === lead.id);
    if (idx >= 0) { leads[idx] = { ...lead, updatedAt: new Date().toISOString() }; }
    else { leads.push({ ...lead, createdAt: new Date().toISOString() }); }
    saveToStorage(CRM_LEADS_KEY, leads);
  },
  deleteLead: (id: string) => {
    const leads = crmStore.getAllLeads().filter(l => l.id !== id);
    saveToStorage(CRM_LEADS_KEY, leads);
  },

  // Sync to Knowledge Base
  syncToKnowledgeBase: (): { contacts: number; deals: number } => {
    const contacts = crmStore.getAllContacts();
    const deals = crmStore.getAllDeals();
    const knowledgeItems = JSON.parse(localStorage.getItem('yumeigu_knowledge_data') || '[]');

    const newItems = [
      ...contacts.map(c => ({
        id: `sync-c-${c.id}`,
        sourceId: 'customer_files',
        title: `${c.name} - ${c.company || '未知公司'}`,
        summary: `客户档案：${c.name}，${c.country}，${c.title || '未知职位'}。${c.notes || ''}`,
        tags: [...(c.tags || []), 'CRM同步', c.country || ''],
        date: c.createdAt,
      })),
      ...deals.filter(d => d.stage === 'closed_won').map(d => ({
        id: `sync-d-${d.id}`,
        sourceId: 'pricing_deals',
        title: d.name,
        summary: `成交商机：${d.contactName || ''}，金额 $${Number(d.amount || 0).toLocaleString()}。${d.notes || ''}`,
        tags: ['CRM同步', '成交案例'],
        date: d.createdAt,
      })),
    ];

    const merged = [...knowledgeItems, ...newItems];
    localStorage.setItem('yumeigu_knowledge_data', JSON.stringify(merged));
    return { contacts: contacts.length, deals: deals.filter(d => d.stage === 'closed_won').length };
  },
};
