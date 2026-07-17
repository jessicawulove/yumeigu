import { DataSourceItem, KnowledgeOutputItem } from './types';

const KB_SOURCES_KEY = 'yumeigu_kb_sources';
const KB_OUTPUTS_KEY = 'yumeigu_kb_outputs';

const DEFAULT_SOURCE_ITEMS: DataSourceItem[] = [
  // 00_Inbox - 待整理的原始资料
  { id: 'ds-001', sourceId: 'inbox', title: '展会收集的名片资料 - 未分类', summary: '广交会收集的 30 张名片，待整理归档到对应目录', date: '2024-03-15', tags: ['展会', '待整理'] },
  { id: 'ds-002', sourceId: 'inbox', title: '客户来访会议纪要', summary: '德国客户 Mueller GmbH 来访，讨论了产品认证和交期问题', date: '2024-03-10', tags: ['德国', '来访', '待整理'] },
  // 01_产品知识 - 参数、认证、FAQ、卖点
  { id: 'ds-003', sourceId: 'product', title: '智能家居产品线 V3.0 技术参数', summary: '12 款新品的技术规格、认证信息和核心卖点整理', date: '2024-03-13', tags: ['智能家居', '新品', '认证'] },
  { id: 'ds-004', sourceId: 'product', title: 'CE/FDA/RoHS 认证文件汇总', summary: '核心产品的各项认证证书和检测报告', date: '2024-03-09', tags: ['认证', '合规'] },
  { id: 'ds-005', sourceId: 'product', title: '产品 FAQ - 客户高频问题 Top 20', summary: '整理客户最常问的 20 个产品问题及标准回答', date: '2024-03-07', tags: ['FAQ', '产品'] },
  // 02_市场情报 - 国家政策、行业趋势、竞品
  { id: 'ds-006', sourceId: 'market', title: '2024 东南亚市场分析报告', summary: '东南亚市场增长率 18%，重点关注越南和印尼的政策利好', date: '2024-03-14', tags: ['东南亚', '市场分析'] },
  { id: 'ds-007', sourceId: 'market', title: '竞品动态 - 同行 A 公司新品发布', summary: '竞争对手推出低价产品线，需关注对东南亚市场的影响', date: '2024-03-06', tags: ['竞品', '动态'] },
  { id: 'ds-008', sourceId: 'market', title: '欧盟新能效标准解读', summary: '2024 年 7 月生效的新能效标准，影响产品出口策略', date: '2024-03-05', tags: ['欧盟', '政策', '能效'] },
  // 03_客户档案 - 背调、决策人、需求、跟进
  { id: 'ds-009', sourceId: 'customer', title: '德国 Mueller GmbH 客户背调', summary: '年营收 5000 万欧元，采购总监 Hans Schmidt 为关键决策人', date: '2024-03-12', tags: ['德国', '背调', '决策人'] },
  { id: 'ds-010', sourceId: 'customer', title: '巴西 Silva Trading 需求分析', summary: '价格敏感型客户，年采购量 200 万美元，关注性价比', date: '2024-03-10', tags: ['巴西', '需求分析'] },
  { id: 'ds-011', sourceId: 'customer', title: '印尼经销商渠道评估', summary: '年采购量 500 万美元，覆盖东南亚 5 国分销网络', date: '2024-03-11', tags: ['印尼', '经销商', '大客户'] },
  // 04_开发信与跟进 - 邮件、LinkedIn、WhatsApp 话术
  { id: 'ds-012', sourceId: 'outreach', title: '展会后续开发信 - 30 封', summary: '广交会后发出的跟进邮件，回复率 35%', date: '2024-03-14', tags: ['展会', '开发信', '邮件'] },
  { id: 'ds-013', sourceId: 'outreach', title: 'WhatsApp 沟通记录 - 中东紧急订单', summary: '客户要求 15 天交货，通过 WhatsApp 快速确认细节', date: '2024-03-08', tags: ['中东', '紧急订单', 'WhatsApp'] },
  { id: 'ds-014', sourceId: 'outreach', title: 'LinkedIn 主动开发话术库', summary: '针对采购经理的 5 套 LinkedIn 私信话术模板', date: '2024-03-09', tags: ['LinkedIn', '话术'] },
  // 05_报价与成交 - 报价逻辑、样品、谈判、案例
  { id: 'ds-015', sourceId: 'deals', title: '报价单 Q-2024-089 - 澳洲客户', summary: '500 件定制订单，含 Logo 印刷，FOB 报价 $12.5/件', date: '2024-03-14', tags: ['澳洲', '定制', '报价'] },
  { id: 'ds-016', sourceId: 'deals', title: '样品反馈 - 日本客户确认通过', summary: '样品通过客户测试，等待正式订单，预计 2000 件', date: '2024-03-11', tags: ['日本', '样品', '通过'] },
  { id: 'ds-017', sourceId: 'deals', title: '价格谈判记录 - 巴西客户 3 轮压价', summary: '从 $15 谈到 $12.8，通过增加 MOQ 守住利润', date: '2024-03-10', tags: ['巴西', '谈判', '价格'] },
  // 06_复盘与踩坑 - 成单原因、丢单原因、错误判断
  { id: 'ds-018', sourceId: 'review', title: '成交复盘 - 法国客户年度框架', summary: '6 个月跟进签下年度框架，关键在技术支持响应速度', date: '2024-03-13', tags: ['法国', '成交', '框架'] },
  { id: 'ds-019', sourceId: 'review', title: '丢单复盘 - 北美客户转向竞品', summary: '因交期延误 2 周导致客户流失，需改进供应链管理', date: '2024-03-05', tags: ['北美', '丢单', '交期'] },
  { id: 'ds-020', sourceId: 'review', title: '踩坑记录 - 汇率波动损失', summary: '未锁汇导致利润缩水 8%，后续需建立汇率风险管理机制', date: '2024-03-03', tags: ['汇率', '踩坑', '风控'] },
];

const DEFAULT_OUTPUT_ITEMS: KnowledgeOutputItem[] = [
  { id: 'ko-001', outputId: 'customer-profile', title: '欧洲客户画像模板', content: '包含采购偏好、决策链、付款方式、认证需求等维度的客户画像模板', date: '2024-03-15', tags: ['欧洲', '模板'] },
  { id: 'ko-002', outputId: 'customer-profile', title: '东南亚经销商画像', content: '针对东南亚经销商的画像分析，包含渠道特征、价格敏感度、合作模式', date: '2024-03-12', tags: ['东南亚', '经销商'] },
  { id: 'ko-003', outputId: 'email-templates', title: '首次开发信 - 展会后续', content: '展会后跟进邮件模板，突出产品优势和下一步合作意向', date: '2024-03-14', tags: ['展会', '开发信'] },
  { id: 'ko-004', outputId: 'email-templates', title: '报价跟进邮件 - 未回复客户', content: '报价后 7 天未回复的跟进邮件，包含价值补充和限时优惠策略', date: '2024-03-10', tags: ['跟进', '报价'] },
  { id: 'ko-005', outputId: 'follow-sop', title: '新客户跟进 SOP - 7 步法', content: '从首次接触到成交的 7 步标准跟进流程，含时间节点和关键动作', date: '2024-03-13', tags: ['SOP', '流程'] },
  { id: 'ko-006', outputId: 'follow-sop', title: '价格谈判 SOP', content: '应对客户压价的标准流程，包含让步策略和底线设定', date: '2024-03-09', tags: ['谈判', '价格'] },
  { id: 'ko-007', outputId: 'industry-keywords', title: '智能家居行业关键词', content: '覆盖产品描述、技术术语、市场趋势的 200+ 关键词库', date: '2024-03-11', tags: ['智能家居', '关键词'] },
  { id: 'ko-008', outputId: 'industry-keywords', title: '消费电子搜索热词', content: 'LinkedIn 和 Google 搜索常用热词整理，按市场分类', date: '2024-03-08', tags: ['消费电子', '搜索'] },
  { id: 'ko-009', outputId: 'case-library', title: '法国客户年度框架成交案例', content: '6 个月跟进周期，通过技术支持响应速度赢得信任，年采购额 200 万欧元', date: '2024-03-13', tags: ['法国', '成交', '框架'] },
  { id: 'ko-010', outputId: 'case-library', title: '德国展会客户转化案例', content: '从展会认识到成交的全流程复盘，关键节点和策略分析', date: '2024-03-10', tags: ['德国', '展会'] },
  { id: 'ko-011', outputId: 'faq-library', title: '产品认证常见问题', content: 'CE/FDA/RoHS 等认证的 FAQ 整理，含标准回答和文件模板', date: '2024-03-12', tags: ['认证', 'FAQ'] },
  { id: 'ko-012', outputId: 'faq-library', title: '交期与物流常见问题', content: '关于生产周期、物流方式、紧急订单处理的 FAQ', date: '2024-03-07', tags: ['交期', '物流'] },
  { id: 'ko-013', outputId: 'product-scripts', title: '智能家居产品卖点话术', content: '针对 12 款新品的核心卖点话术，按客户类型分类', date: '2024-03-14', tags: ['智能家居', '话术'] },
  { id: 'ko-014', outputId: 'product-scripts', title: '价格异议应对话术', content: '应对客户"太贵了"的 5 种话术策略', date: '2024-03-09', tags: ['价格', '话术'] },
  { id: 'ko-015', outputId: 'market-strategy', title: '东南亚市场开发策略', content: '重点市场选择、渠道策略、定价策略、本地化建议', date: '2024-03-11', tags: ['东南亚', '策略'] },
  { id: 'ko-016', outputId: 'market-strategy', title: '欧洲市场准入指南', content: '认证要求、合规标准、渠道特点、竞争格局分析', date: '2024-03-06', tags: ['欧洲', '准入'] },
];

export function getSourceItems(sourceId?: string): DataSourceItem[] {
  if (typeof window === 'undefined') return DEFAULT_SOURCE_ITEMS;
  const stored = localStorage.getItem(KB_SOURCES_KEY);
  if (!stored) {
    localStorage.setItem(KB_SOURCES_KEY, JSON.stringify(DEFAULT_SOURCE_ITEMS));
    return sourceId ? DEFAULT_SOURCE_ITEMS.filter((i) => i.sourceId === sourceId) : DEFAULT_SOURCE_ITEMS;
  }
  const items = JSON.parse(stored) as DataSourceItem[];
  return sourceId ? items.filter((i) => i.sourceId === sourceId) : items;
}

export function getOutputItems(outputId?: string): KnowledgeOutputItem[] {
  if (typeof window === 'undefined') return DEFAULT_OUTPUT_ITEMS;
  const stored = localStorage.getItem(KB_OUTPUTS_KEY);
  if (!stored) {
    localStorage.setItem(KB_OUTPUTS_KEY, JSON.stringify(DEFAULT_OUTPUT_ITEMS));
    return outputId ? DEFAULT_OUTPUT_ITEMS.filter((i) => i.outputId === outputId) : DEFAULT_OUTPUT_ITEMS;
  }
  const items = JSON.parse(stored) as KnowledgeOutputItem[];
  return outputId ? items.filter((i) => i.outputId === outputId) : items;
}

export function addSourceItem(item: DataSourceItem): void {
  if (typeof window === 'undefined') return;
  const items = getSourceItems();
  items.push(item);
  localStorage.setItem(KB_SOURCES_KEY, JSON.stringify(items));
}

export function addOutputItem(item: KnowledgeOutputItem): void {
  if (typeof window === 'undefined') return;
  const items = getOutputItems();
  items.push(item);
  localStorage.setItem(KB_OUTPUTS_KEY, JSON.stringify(items));
}
