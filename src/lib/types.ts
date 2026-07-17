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
    id: 'customer-dev',
    name: '客户开发记录',
    icon: 'Users',
    description: '客户开发过程中的沟通记录、跟进日志',
    capabilities: ['自动整理客户信息', '提炼客户痛点', '生成客户画像'],
    outputs: ['customer-profile', 'case-library'],
  },
  {
    id: 'email-whatsapp',
    name: '邮件往来 / WhatsApp 沟通',
    icon: 'Mail',
    description: '邮件和即时通讯工具中的沟通记录',
    capabilities: ['提取关键对话', '生成跟进 SOP', '话术模板提炼'],
    outputs: ['email-templates', 'follow-sop'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn 线索',
    icon: 'Linkedin',
    description: 'LinkedIn 上的潜在客户线索和互动记录',
    capabilities: ['线索质量评估', '行业标签分类', '开发策略建议'],
    outputs: ['industry-keywords', 'market-strategy'],
  },
  {
    id: 'product-info',
    name: '产品资料 / 目录',
    icon: 'Package',
    description: '产品规格、目录、技术参数等资料',
    capabilities: ['产品卖点提炼', '对比分析生成', '话术库构建'],
    outputs: ['product-scripts', 'industry-keywords'],
  },
  {
    id: 'market-intel',
    name: '市场情报 / 行业信息',
    icon: 'Globe',
    description: '市场趋势、行业动态、竞品信息',
    capabilities: ['市场趋势分析', '竞品信息整理', '策略建议生成'],
    outputs: ['market-strategy', 'industry-keywords'],
  },
  {
    id: 'quotation',
    name: '报价单 / 样品反馈',
    icon: 'FileText',
    description: '报价记录和样品反馈信息',
    capabilities: ['报价策略优化', '反馈归类分析', '成功案例提取'],
    outputs: ['case-library', 'follow-sop'],
  },
  {
    id: 'deals-review',
    name: '成交案例 / 失败复盘',
    icon: 'Award',
    description: '成功和失败的业务案例复盘',
    capabilities: ['经验自动沉淀', '失败原因分析', '复盘模板生成'],
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
