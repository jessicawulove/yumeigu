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
