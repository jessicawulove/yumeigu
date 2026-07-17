export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  tags: string[];
  usageCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
  systemPrompt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  agentId: string;
  messages: ChatMessage[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: 'all', name: '全部', icon: '🏠' },
  { id: 'writing', name: '写作', icon: '✍️' },
  { id: 'marketing', name: '营销', icon: '📢' },
  { id: 'development', name: '研发', icon: '💻' },
  { id: 'operations', name: '运营', icon: '📊' },
  { id: 'hr', name: '人事', icon: '👥' },
  { id: 'finance', name: '财务', icon: '💰' },
  { id: 'design', name: '设计', icon: '🎨' },
];

// Knowledge Base Types
export interface DataSourceItem {
  id: string;
  sourceId: string;
  title: string;
  summary: string;
  date: string;
  tags: string[];
}

export interface KnowledgeOutputItem {
  id: string;
  outputId: string;
  title: string;
  content: string;
  date: string;
  tags: string[];
}

export interface DataSource {
  id: string;
  name: string;
  icon: string;
  description: string;
  capabilities: string[];
  outputs: string[];
}

export interface KnowledgeOutput {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const DATA_SOURCES: DataSource[] = [
  {
    id: 'inbox',
    name: '00_Inbox',
    icon: 'Inbox',
    description: '待整理的原始资料',
    capabilities: ['自动分类归档', '信息提取与结构化', '智能标签生成'],
    outputs: ['customer-profile', 'faq-library'],
  },
  {
    id: 'product',
    name: '01_产品知识',
    icon: 'Package',
    description: '参数、认证、FAQ、卖点',
    capabilities: ['产品卖点提炼', 'FAQ 自动生成', '认证文档整理', '对比分析生成'],
    outputs: ['product-scripts', 'faq-library'],
  },
  {
    id: 'market',
    name: '02_市场情报',
    icon: 'Globe',
    description: '国家政策、行业趋势、竞品',
    capabilities: ['市场趋势分析', '竞品动态追踪', '政策变化解读', '机会识别'],
    outputs: ['market-strategy', 'industry-keywords'],
  },
  {
    id: 'customer',
    name: '03_客户档案',
    icon: 'Users',
    description: '背调、决策人、需求、跟进',
    capabilities: ['客户画像构建', '决策链梳理', '需求分析', '跟进记录归档'],
    outputs: ['customer-profile', 'case-library'],
  },
  {
    id: 'outreach',
    name: '04_开发信与跟进',
    icon: 'Mail',
    description: '邮件、LinkedIn、WhatsApp 话术',
    capabilities: ['开发信模板生成', '话术库提炼', '跟进 SOP 制定', '转化率分析'],
    outputs: ['email-templates', 'follow-sop'],
  },
  {
    id: 'deals',
    name: '05_报价与成交',
    icon: 'FileText',
    description: '报价逻辑、样品、谈判、案例',
    capabilities: ['报价策略优化', '谈判要点提取', '样品反馈分析', '成交案例沉淀'],
    outputs: ['case-library', 'follow-sop'],
  },
  {
    id: 'review',
    name: '06_复盘与踩坑',
    icon: 'Award',
    description: '成单原因、丢单原因、错误判断',
    capabilities: ['成单模式提炼', '丢单原因分析', '踩坑记录归档', '复盘模板生成'],
    outputs: ['case-library', 'faq-library'],
  },
];

export const KNOWLEDGE_OUTPUTS: KnowledgeOutput[] = [
  { id: 'customer-profile', name: '客户画像', icon: 'UserCircle', description: '系统化的客户信息档案' },
  { id: 'email-templates', name: '开发信模板库', icon: 'MailPlus', description: '高转化率开发信模板' },
  { id: 'follow-sop', name: '跟进 SOP', icon: 'ListChecks', description: '标准化客户跟进流程' },
  { id: 'industry-keywords', name: '行业关键词库', icon: 'Tags', description: '行业术语和搜索关键词' },
  { id: 'case-library', name: 'A 级客户案例库', icon: 'Trophy', description: '优质客户成交案例' },
  { id: 'faq-library', name: '常见问题答疑库', icon: 'HelpCircle', description: '客户常见问题标准回答' },
  { id: 'product-scripts', name: '产品卖点话术库', icon: 'Megaphone', description: '产品优势话术整理' },
  { id: 'market-strategy', name: '市场开发策略', icon: 'Target', description: '各市场开发策略方案' },
];
