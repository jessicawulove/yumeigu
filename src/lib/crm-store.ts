import { ZohoConfig, CRMContact, CRMDeal, CRMLead } from './types';

const ZOHO_CONFIG_KEY = 'yumeigu_zoho_config';
const CRM_CONTACTS_KEY = 'yumeigu_crm_contacts';
const CRM_DEALS_KEY = 'yumeigu_crm_deals';
const CRM_LEADS_KEY = 'yumeigu_crm_leads';

// Default Zoho config (empty - user needs to configure)
const DEFAULT_ZOHO_CONFIG: ZohoConfig = {
  apiDomain: 'https://www.zohoapis.com',
  clientId: '',
  clientSecret: '',
  authToken: '',
  connected: false,
};

// Mock CRM data - simulating Zoho CRM response
const DEFAULT_CONTACTS: CRMContact[] = [
  {
    id: 'crm-c001',
    fullName: 'Hans Schmidt',
    email: 'h.schmidt@mueller-gmbh.de',
    phone: '+49 89 1234567',
    company: 'Mueller GmbH',
    title: '采购总监',
    country: '德国',
    industry: '智能家居',
    leadSource: '展会',
    owner: '张经理',
    createdAt: '2024-01-15',
    lastActivity: '2024-03-12',
    tags: ['大客户', '欧洲', '决策人'],
    notes: '年营收 5000 万欧元，对 CE 认证有严格要求，正在评估 3 家供应商',
  },
  {
    id: 'crm-c002',
    fullName: 'Carlos Silva',
    email: 'carlos@silva-trading.com.br',
    phone: '+55 11 987654321',
    company: 'Silva Trading',
    title: '进口经理',
    country: '巴西',
    industry: '消费电子',
    leadSource: 'LinkedIn',
    owner: '李经理',
    createdAt: '2024-02-01',
    lastActivity: '2024-03-10',
    tags: ['价格敏感', '南美', '复购客户'],
    notes: '价格敏感型客户，年采购量 200 万美元，已合作 2 年',
  },
  {
    id: 'crm-c003',
    fullName: 'Ahmed Hassan',
    email: 'ahmed@gulf-electronics.ae',
    phone: '+971 4 5551234',
    company: 'Gulf Electronics LLC',
    title: 'CEO',
    country: '阿联酋',
    industry: '电子产品',
    leadSource: '官网询盘',
    owner: '王经理',
    createdAt: '2024-02-20',
    lastActivity: '2024-03-14',
    tags: ['中东', '紧急订单', '高潜力'],
    notes: '要求 15 天交货，通过 WhatsApp 快速沟通，已发样品',
  },
  {
    id: 'crm-c004',
    fullName: 'Yuki Tanaka',
    email: 'y.tanaka@tokyo-imports.jp',
    phone: '+81 3 12345678',
    company: 'Tokyo Imports Co.',
    title: '采购部长',
    country: '日本',
    industry: '家用电器',
    leadSource: '展会',
    owner: '张经理',
    createdAt: '2024-01-20',
    lastActivity: '2024-03-11',
    tags: ['日本', '样品通过', '等待订单'],
    notes: '样品已通过测试，等待正式订单，预计 2000 件',
  },
  {
    id: 'crm-c005',
    fullName: 'Sarah Johnson',
    email: 'sarah@aussie-wholesale.com.au',
    phone: '+61 2 98765432',
    company: 'Aussie Wholesale',
    title: '采购经理',
    country: '澳大利亚',
    industry: '家居用品',
    leadSource: '阿里巴巴',
    owner: '李经理',
    createdAt: '2024-03-01',
    lastActivity: '2024-03-14',
    tags: ['澳洲', '定制需求', '新客'],
    notes: '500 件定制订单，含 Logo 印刷，FOB 报价 $12.5/件',
  },
  {
    id: 'crm-c006',
    fullName: 'Pierre Dubois',
    email: 'p.dubois@euro-distribution.fr',
    phone: '+33 1 45678901',
    company: 'Euro Distribution',
    title: '供应链总监',
    country: '法国',
    industry: '分销',
    leadSource: '展会',
    owner: '王经理',
    createdAt: '2024-01-10',
    lastActivity: '2024-03-08',
    tags: ['欧洲', '分销商', '大客户'],
    notes: '覆盖法国、比利时、卢森堡三国分销网络，年采购量 800 万美元',
  },
];

const DEFAULT_DEALS: CRMDeal[] = [
  {
    id: 'crm-d001',
    dealName: 'Mueller GmbH - 智能家居首批订单',
    contactId: 'crm-c001',
    contactName: 'Hans Schmidt',
    amount: 150000,
    currency: 'USD',
    stage: 'Negotiation',
    probability: 70,
    expectedCloseDate: '2024-04-15',
    product: '智能家居产品线 V3.0',
    owner: '张经理',
    createdAt: '2024-02-01',
    description: '首批 5000 件订单，正在谈判价格和交期',
  },
  {
    id: 'crm-d002',
    dealName: 'Silva Trading - Q2 补货订单',
    contactId: 'crm-c002',
    contactName: 'Carlos Silva',
    amount: 85000,
    currency: 'USD',
    stage: 'Proposal',
    probability: 80,
    expectedCloseDate: '2024-03-30',
    product: '消费电子系列',
    owner: '李经理',
    createdAt: '2024-02-15',
    description: 'Q2 季度补货，客户已确认产品清单',
  },
  {
    id: 'crm-d003',
    dealName: 'Gulf Electronics - 紧急订单',
    contactId: 'crm-c003',
    contactName: 'Ahmed Hassan',
    amount: 45000,
    currency: 'USD',
    stage: 'Needs Analysis',
    probability: 50,
    expectedCloseDate: '2024-03-25',
    product: '电子产品定制',
    owner: '王经理',
    createdAt: '2024-03-01',
    description: '15 天交货的紧急订单，正在确认生产可行性',
  },
  {
    id: 'crm-d004',
    dealName: 'Tokyo Imports - 正式订单',
    contactId: 'crm-c004',
    contactName: 'Yuki Tanaka',
    amount: 120000,
    currency: 'USD',
    stage: 'Closed Won',
    probability: 100,
    expectedCloseDate: '2024-03-20',
    product: '家用电器系列',
    owner: '张经理',
    createdAt: '2024-01-20',
    description: '样品通过后正式下单，2000 件',
  },
  {
    id: 'crm-d005',
    dealName: 'Aussie Wholesale - 定制订单',
    contactId: 'crm-c005',
    contactName: 'Sarah Johnson',
    amount: 6250,
    currency: 'USD',
    stage: 'Qualification',
    probability: 40,
    expectedCloseDate: '2024-04-30',
    product: '家居用品定制',
    owner: '李经理',
    createdAt: '2024-03-05',
    description: '500 件定制订单，含 Logo 印刷',
  },
];

const DEFAULT_LEADS: CRMLead[] = [
  {
    id: 'crm-l001',
    fullName: 'Maria Garcia',
    email: 'maria@latam-imports.mx',
    phone: '+52 55 12345678',
    company: 'Latam Imports',
    country: '墨西哥',
    status: 'Qualified',
    leadSource: '展会',
    owner: '张经理',
    createdAt: '2024-03-10',
    score: 85,
  },
  {
    id: 'crm-l002',
    fullName: 'John Smith',
    email: 'john@uk-retail.co.uk',
    phone: '+44 20 79460958',
    company: 'UK Retail Ltd',
    country: '英国',
    status: 'Contacted',
    leadSource: 'LinkedIn',
    owner: '李经理',
    createdAt: '2024-03-12',
    score: 60,
  },
  {
    id: 'crm-l003',
    fullName: 'Kim Min-jun',
    email: 'mj.kim@seoul-tech.kr',
    phone: '+82 2 12345678',
    company: 'Seoul Tech',
    country: '韩国',
    status: 'New',
    leadSource: '官网询盘',
    owner: '王经理',
    createdAt: '2024-03-14',
    score: 45,
  },
  {
    id: 'crm-l004',
    fullName: 'Anna Kowalski',
    email: 'anna@poland-wholesale.pl',
    phone: '+48 22 1234567',
    company: 'Poland Wholesale',
    country: '波兰',
    status: 'Unqualified',
    leadSource: '阿里巴巴',
    owner: '张经理',
    createdAt: '2024-03-08',
    score: 20,
  },
];

// Zoho Config
export function getZohoConfig(): ZohoConfig {
  if (typeof window === 'undefined') return DEFAULT_ZOHO_CONFIG;
  const stored = localStorage.getItem(ZOHO_CONFIG_KEY);
  if (stored) return JSON.parse(stored);
  return DEFAULT_ZOHO_CONFIG;
}

export function saveZohoConfig(config: ZohoConfig): void {
  localStorage.setItem(ZOHO_CONFIG_KEY, JSON.stringify(config));
}

// Contacts
export function getCRMContacts(): CRMContact[] {
  if (typeof window === 'undefined') return DEFAULT_CONTACTS;
  const stored = localStorage.getItem(CRM_CONTACTS_KEY);
  if (stored) return JSON.parse(stored);
  return DEFAULT_CONTACTS;
}

export function getCRMContact(id: string): CRMContact | undefined {
  return getCRMContacts().find((c) => c.id === id);
}

export function saveCRMContact(contact: CRMContact): void {
  const contacts = getCRMContacts();
  const index = contacts.findIndex((c) => c.id === contact.id);
  if (index >= 0) {
    contacts[index] = contact;
  } else {
    contacts.push(contact);
  }
  localStorage.setItem(CRM_CONTACTS_KEY, JSON.stringify(contacts));
}

export function deleteCRMContact(id: string): void {
  const contacts = getCRMContacts().filter((c) => c.id !== id);
  localStorage.setItem(CRM_CONTACTS_KEY, JSON.stringify(contacts));
}

// Deals
export function getCRMDeals(): CRMDeal[] {
  if (typeof window === 'undefined') return DEFAULT_DEALS;
  const stored = localStorage.getItem(CRM_DEALS_KEY);
  if (stored) return JSON.parse(stored);
  return DEFAULT_DEALS;
}

export function getCRMDeal(id: string): CRMDeal | undefined {
  return getCRMDeals().find((d) => d.id === id);
}

export function saveCRMDeal(deal: CRMDeal): void {
  const deals = getCRMDeals();
  const index = deals.findIndex((d) => d.id === deal.id);
  if (index >= 0) {
    deals[index] = deal;
  } else {
    deals.push(deal);
  }
  localStorage.setItem(CRM_DEALS_KEY, JSON.stringify(deals));
}

export function deleteCRMDeal(id: string): void {
  const deals = getCRMDeals().filter((d) => d.id !== id);
  localStorage.setItem(CRM_DEALS_KEY, JSON.stringify(deals));
}

// Leads
export function getCRMLeads(): CRMLead[] {
  if (typeof window === 'undefined') return DEFAULT_LEADS;
  const stored = localStorage.getItem(CRM_LEADS_KEY);
  if (stored) return JSON.parse(stored);
  return DEFAULT_LEADS;
}

export function saveCRMLead(lead: CRMLead): void {
  const leads = getCRMLeads();
  const index = leads.findIndex((l) => l.id === lead.id);
  if (index >= 0) {
    leads[index] = lead;
  } else {
    leads.push(lead);
  }
  localStorage.setItem(CRM_LEADS_KEY, JSON.stringify(leads));
}

export function deleteCRMLead(id: string): void {
  const leads = getCRMLeads().filter((l) => l.id !== id);
  localStorage.setItem(CRM_LEADS_KEY, JSON.stringify(leads));
}

// Sync CRM data to knowledge base
export function syncCRMToKnowledgeBase(): { count: number; items: Array<{ title: string; sourceId: string }> } {
  const contacts = getCRMContacts();
  const deals = getCRMDeals();
  const items: Array<{ title: string; sourceId: string }> = [];

  // Sync contacts to customer archive
  contacts.forEach((contact) => {
    items.push({
      title: `${contact.company} - ${contact.fullName} 客户档案`,
      sourceId: 'customer',
    });
  });

  // Sync deals to deals directory
  deals.forEach((deal) => {
    items.push({
      title: `${deal.dealName} - 商机记录`,
      sourceId: 'deals',
    });
  });

  return { count: items.length, items };
}

// Get stats
export function getCRMStats() {
  const contacts = getCRMContacts();
  const deals = getCRMDeals();
  const leads = getCRMLeads();
  const totalDealValue = deals.reduce((sum, d) => sum + d.amount, 0);
  const wonDeals = deals.filter((d) => d.stage === 'Closed Won');
  const wonValue = wonDeals.reduce((sum, d) => sum + d.amount, 0);

  return {
    contactCount: contacts.length,
    dealCount: deals.length,
    leadCount: leads.length,
    totalDealValue,
    wonDealCount: wonDeals.length,
    wonValue,
    activeDeals: deals.filter((d) => !['Closed Won', 'Closed Lost'].includes(d.stage)).length,
  };
}
