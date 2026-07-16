import { Agent, ChatMessage, ChatSession } from './types';

const AGENTS_KEY = 'yumeigu_agents';
const CHATS_KEY = 'yumeigu_chats';

const DEFAULT_AGENTS: Agent[] = [
  {
    id: 'agent-001',
    name: '文案大师',
    description: '专业营销文案撰写，支持广告语、品牌故事、社交媒体文案等多种格式，帮你快速产出高质量内容。',
    icon: '✍️',
    category: 'writing',
    tags: ['文案', '营销', '创意'],
    usageCount: 3842,
    status: 'active',
    createdAt: '2024-01-15',
    systemPrompt: '你是一位资深文案创意总监，擅长撰写各类营销文案。请根据用户的需求，提供专业、有创意、有感染力的文案内容。',
  },
  {
    id: 'agent-002',
    name: '代码助手',
    description: '全栈开发助手，支持代码生成、Bug 排查、代码审查和技术方案讨论，覆盖主流编程语言和框架。',
    icon: '💻',
    category: 'development',
    tags: ['编程', '调试', '技术'],
    usageCount: 5621,
    status: 'active',
    createdAt: '2024-01-10',
    systemPrompt: '你是一位全栈高级工程师，精通各种编程语言和框架。请帮助用户解决编程问题，提供清晰、可运行的代码示例。',
  },
  {
    id: 'agent-003',
    name: '数据分析师',
    description: '帮助用户进行数据分析、报表解读、趋势预测，支持 Excel/CSV 数据格式，输出可视化建议。',
    icon: '📊',
    category: 'operations',
    tags: ['数据', '分析', '报表'],
    usageCount: 2156,
    status: 'active',
    createdAt: '2024-02-01',
    systemPrompt: '你是一位资深数据分析师，擅长从数据中发现洞察。请用通俗易懂的语言解读数据，提供可行的业务建议。',
  },
  {
    id: 'agent-004',
    name: 'HR 政策顾问',
    description: '解答员工关于公司人事制度、考勤休假、薪酬福利、入离职流程等常见问题，提供政策指引。',
    icon: '👥',
    category: 'hr',
    tags: ['人事', '制度', '咨询'],
    usageCount: 1893,
    status: 'active',
    createdAt: '2024-02-10',
    systemPrompt: '你是一位专业的人力资源顾问，熟悉各类企业人事管理制度。请耐心解答员工关于人事政策的问题，给出准确、规范的指引。',
  },
  {
    id: 'agent-005',
    name: '财务报表助手',
    description: '协助处理报销流程指引、发票规范、预算编制、费用分析等财务相关问题，提升财务效率。',
    icon: '💰',
    category: 'finance',
    tags: ['财务', '报销', '预算'],
    usageCount: 1452,
    status: 'active',
    createdAt: '2024-02-15',
    systemPrompt: '你是一位专业的财务顾问，精通企业财务管理。请用简洁清晰的语言解答财务相关问题，提供合规的建议。',
  },
  {
    id: 'agent-006',
    name: '营销策划师',
    description: '从市场调研到方案落地，提供完整的营销策划支持，包括活动策划、渠道分析、ROI 预估等。',
    icon: '📢',
    category: 'marketing',
    tags: ['策划', '活动', '推广'],
    usageCount: 2780,
    status: 'active',
    createdAt: '2024-01-20',
    systemPrompt: '你是一位经验丰富的营销策划专家。请根据用户的产品和目标，提供系统、可执行的营销方案，包含策略分析和执行建议。',
  },
  {
    id: 'agent-007',
    name: 'UI 设计评审',
    description: '对设计稿提供专业评审意见，包括视觉一致性、交互合理性、可访问性检查，助力设计质量提升。',
    icon: '🎨',
    category: 'design',
    tags: ['设计', '评审', 'UI'],
    usageCount: 987,
    status: 'active',
    createdAt: '2024-03-01',
    systemPrompt: '你是一位资深 UI/UX 设计师，具备出色的审美和设计系统思维。请从专业角度评审设计方案，给出具体、建设性的改进建议。',
  },
  {
    id: 'agent-008',
    name: '周报生成器',
    description: '输入本周工作要点，自动生成结构清晰、重点突出的周报，支持多种格式模板，告别周报焦虑。',
    icon: '📝',
    category: 'writing',
    tags: ['周报', '效率', '模板'],
    usageCount: 4215,
    status: 'active',
    createdAt: '2024-01-25',
    systemPrompt: '你是一位职场效率专家。请根据用户提供的工作要点，生成结构清晰、语言精练的周报，突出成果和下一步计划。',
  },
  {
    id: 'agent-009',
    name: 'API 文档生成器',
    description: '根据代码或接口描述，自动生成规范的 API 文档，支持 RESTful/GraphQL 风格，含示例和错误码说明。',
    icon: '📄',
    category: 'development',
    tags: ['文档', 'API', '规范'],
    usageCount: 1634,
    status: 'active',
    createdAt: '2024-02-20',
    systemPrompt: '你是一位技术文档专家。请根据用户提供的接口信息，生成清晰、规范的 API 文档，包含请求参数、响应格式、示例和错误码。',
  },
  {
    id: 'agent-010',
    name: '用户运营助手',
    description: '支持用户增长策略制定、留存分析、用户分层、活动策划等运营场景，提供数据驱动的运营建议。',
    icon: '🚀',
    category: 'operations',
    tags: ['增长', '留存', '策略'],
    usageCount: 2340,
    status: 'active',
    createdAt: '2024-02-05',
    systemPrompt: '你是一位资深用户运营专家，精通增长黑客方法论。请根据用户的业务场景，提供数据驱动、可落地的运营策略和方案。',
  },
];

export function getAgents(): Agent[] {
  if (typeof window === 'undefined') return DEFAULT_AGENTS;
  const stored = localStorage.getItem(AGENTS_KEY);
  if (!stored) {
    localStorage.setItem(AGENTS_KEY, JSON.stringify(DEFAULT_AGENTS));
    return DEFAULT_AGENTS;
  }
  return JSON.parse(stored) as Agent[];
}

export function getAgentById(id: string): Agent | undefined {
  const agents = getAgents();
  return agents.find((a) => a.id === id);
}

export function saveAgents(agents: Agent[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AGENTS_KEY, JSON.stringify(agents));
}

export function addAgent(agent: Agent): void {
  const agents = getAgents();
  agents.push(agent);
  saveAgents(agents);
}

export function updateAgent(id: string, updates: Partial<Agent>): void {
  const agents = getAgents();
  const index = agents.findIndex((a) => a.id === id);
  if (index !== -1) {
    agents[index] = { ...agents[index], ...updates };
    saveAgents(agents);
  }
}

export function deleteAgent(id: string): void {
  const agents = getAgents().filter((a) => a.id !== id);
  saveAgents(agents);
}

export function incrementUsage(id: string): void {
  const agents = getAgents();
  const agent = agents.find((a) => a.id === id);
  if (agent) {
    agent.usageCount += 1;
    saveAgents(agents);
  }
}

export function getChatSession(agentId: string): ChatSession {
  if (typeof window === 'undefined') return { agentId, messages: [] };
  const stored = localStorage.getItem(`${CHATS_KEY}_${agentId}`);
  if (!stored) return { agentId, messages: [] };
  return JSON.parse(stored) as ChatSession;
}

export function saveChatMessage(agentId: string, message: ChatMessage): void {
  if (typeof window === 'undefined') return;
  const session = getChatSession(agentId);
  session.messages.push(message);
  localStorage.setItem(`${CHATS_KEY}_${agentId}`, JSON.stringify(session));
}

export function clearChatSession(agentId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${CHATS_KEY}_${agentId}`);
}
