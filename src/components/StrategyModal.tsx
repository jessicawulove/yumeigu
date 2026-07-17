'use client';

import { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Mail,
  MessageSquare,
  FileText,
  Loader2,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { DataSourceItem } from '@/lib/types';
import { getSourceItems, addSourceItem } from '@/lib/knowledge-store';

type StrategyModalProps = {
  customerItem: DataSourceItem;
  onClose: () => void;
};

type StrategyResult = {
  confirmedFacts: { fact: string; source: string }[];
  customerAnalysis: {
    type: string;
    needs: string;
    entryPoint: string;
  };
  needsVerification: string[];
  email: string;
  followUp: {
    linkedin: string;
    whatsapp: string;
  };
  nextSteps: string;
};

function generateStrategy(customer: DataSourceItem): StrategyResult {
  const allItems = getSourceItems();
  const productItems = allItems.filter((i) => i.sourceId === 'product');
  const marketItems = allItems.filter((i) => i.sourceId === 'market');
  const caseItems = allItems.filter((i) => i.sourceId === 'deal');

  const productContext = productItems.length > 0 ? productItems[0] : null;
  const marketContext = marketItems.find((i) =>
    customer.tags.some((t) => i.tags.includes(t))
  );
  const caseContext = caseItems.length > 0 ? caseItems[0] : null;

  return {
    confirmedFacts: [
      {
        fact: `客户名称：${customer.title}`,
        source: '03_客户档案',
      },
      {
        fact: customer.summary || '客户基本信息已录入档案',
        source: '03_客户档案',
      },
      ...(marketContext
        ? [
            {
              fact: `${marketContext.title}，${marketContext.summary}`,
              source: '02_市场情报',
            },
          ]
        : []),
      ...(productContext
        ? [
            {
              fact: `主营产品：${productContext.title}`,
              source: '01_产品知识',
            },
          ]
        : []),
    ],
    customerAnalysis: {
      type: customer.tags.includes('B2B')
        ? 'B2B 采购商'
        : customer.tags.includes('distributor')
          ? '区域分销商'
          : '潜在终端客户',
      needs:
        customer.tags.includes('price')
          ? '价格敏感，关注性价比和批量折扣'
          : customer.tags.includes('quality')
            ? '注重产品品质和认证资质'
            : '需要定制化解决方案',
      entryPoint:
        marketContext
          ? `结合${marketContext.title}的市场趋势，以差异化产品优势切入`
          : '以免费样品和快速响应建立初步信任',
    },
    needsVerification: [
      '客户年采购量和预算范围',
      '决策链条和关键决策人',
      '现有供应商及合作痛点',
      '目标市场的具体认证要求',
    ],
    email: `Dear [Name],

I noticed ${customer.title} is expanding in the ${customer.tags[0] || 'regional'} market. We've helped similar companies reduce sourcing costs by 20% while maintaining ISO-certified quality.

Our ${productContext?.title || 'product line'} has been successfully deployed in ${marketContext?.tags[0] || 'your'} market with proven results.

Would you be open to a brief call this week to explore how we can support your growth?

Best regards,
[Your Name]`,
    followUp: {
      linkedin: `1. 发送个性化连接请求，提及${customer.tags[0] || '行业'}领域的共同关注点\n2. 分享一篇与${marketContext?.title || '市场趋势'}相关的行业洞察文章\n3. 3天后发送简短消息，询问是否收到开发信\n4. 每周分享一条有价值的行业信息，保持弱连接`,
      whatsapp: `1. 先通过 LinkedIn 建立联系后再添加 WhatsApp\n2. 首条消息：简短自我介绍 + 一个与客户痛点相关的数据点\n3. 避免群发感，每条消息针对客户具体情况定制\n4. 控制频率：每周不超过2条，以价值输出为主`,
    },
    nextSteps: `[${new Date().toLocaleDateString()}] AI 生成开发策略\n- 客户类型：${customer.tags.includes('B2B') ? 'B2B 采购商' : '潜在客户'}\n- 核心切入点：${marketContext ? `结合${marketContext.title}趋势` : '样品+快速响应'}\n- 待核实：年采购量、决策人、现有供应商\n- 下一步：发送开发信后 3 天内 LinkedIn 跟进\n- 状态：等待人工确认`,
  };
}

export default function StrategyModal({ customerItem, onClose }: StrategyModalProps) {
  const [step, setStep] = useState<'loading' | 'result'>('loading');
  const [strategy, setStrategy] = useState<StrategyResult | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const result = generateStrategy(customerItem);
      setStrategy(result);
      setStep('result');
    }, 1500);
    return () => clearTimeout(timer);
  }, [customerItem]);

  const handleCopy = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleSaveNextSteps = () => {
    if (!strategy) return;
    const newItem: DataSourceItem = {
      id: `ds-${Date.now()}`,
      sourceId: 'customer',
      title: `${customerItem.title} - 下一步动作`,
      summary: strategy.nextSteps,
      date: new Date().toISOString().split('T')[0],
      tags: ['AI策略', '待确认', customerItem.title],
    };
    addSourceItem(newItem);
    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="mx-4 flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">AI 客户开发策略</h2>
              <p className="text-xs text-slate-400">
                基于 {customerItem.title} · 综合产品/市场/案例数据
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'loading' ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
              <p className="mt-4 text-sm text-slate-500">正在分析客户档案，交叉引用产品、市场与历史案例...</p>
              <div className="mt-3 flex gap-2">
                {['客户档案', '产品知识', '市场情报', '成交案例'].map((label, i) => (
                  <span
                    key={label}
                    className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ) : strategy ? (
            <div className="space-y-6">
              {/* Step 1: Confirmed Facts */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">1</span>
                  <h3 className="text-sm font-semibold text-slate-900">已确认事实</h3>
                </div>
                <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                  {strategy.confirmedFacts.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      <div>
                        <span className="text-slate-700">{item.fact}</span>
                        <span className="ml-2 rounded bg-slate-200 px-1.5 py-0.5 text-xs text-slate-500">
                          {item.source}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Step 2: Customer Analysis */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">2</span>
                  <h3 className="text-sm font-semibold text-slate-900">客户分析</h3>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-white p-3">
                    <p className="mb-1 text-xs text-slate-400">客户类型</p>
                    <p className="text-sm font-medium text-slate-900">{strategy.customerAnalysis.type}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white p-3">
                    <p className="mb-1 text-xs text-slate-400">潜在需求</p>
                    <p className="text-sm font-medium text-slate-900">{strategy.customerAnalysis.needs}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white p-3">
                    <p className="mb-1 text-xs text-slate-400">合作切入点</p>
                    <p className="text-sm font-medium text-slate-900">{strategy.customerAnalysis.entryPoint}</p>
                  </div>
                </div>
              </section>

              {/* Step 3: Needs Verification */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-700">3</span>
                  <h3 className="text-sm font-semibold text-slate-900">仍需核实的信息</h3>
                </div>
                <div className="space-y-2 rounded-xl border border-amber-100 bg-amber-50/30 p-4">
                  {strategy.needsVerification.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-amber-800">
                      <AlertCircle className="h-4 w-4 shrink-0 text-amber-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                  <p className="mt-2 text-xs text-amber-600">以上信息不得自行补全，需通过沟通确认</p>
                </div>
              </section>

              {/* Step 4: Email Draft */}
              <section>
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">4</span>
                    <h3 className="text-sm font-semibold text-slate-900">英文开发信（120 词以内）</h3>
                  </div>
                  <button
                    onClick={() => handleCopy(strategy.email, 'email')}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-500 transition-colors hover:bg-slate-100"
                  >
                    {copiedSection === 'email' ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-500" />
                        <span className="text-emerald-600">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        复制
                      </>
                    )}
                  </button>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {strategy.email}
                </div>
              </section>

              {/* Step 5: Follow-up */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">5</span>
                  <h3 className="text-sm font-semibold text-slate-900">后续触达思路</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-blue-500" />
                      <span className="text-sm font-medium text-slate-900">LinkedIn</span>
                    </div>
                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600">
                      {strategy.followUp.linkedin}
                    </p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-white p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-900">WhatsApp</span>
                    </div>
                    <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600">
                      {strategy.followUp.whatsapp}
                    </p>
                  </div>
                </div>
              </section>

              {/* Step 6: Next Steps */}
              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-xs font-bold text-rose-700">6</span>
                  <h3 className="text-sm font-semibold text-slate-900">下一步动作（写回客户档案）</h3>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
                    {strategy.nextSteps}
                  </pre>
                </div>
              </section>

              {/* Warning */}
              <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50/50 p-3">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <div className="text-xs text-red-700">
                  <p className="font-medium">安全约束</p>
                  <p className="mt-0.5">禁止自动发送邮件、修改报价或对客户作出承诺。所有输出需经人工确认后执行。</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        {step === 'result' && strategy && (
          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
            <p className="text-xs text-slate-400">
              策略基于现有知识库数据生成，仅供参考
            </p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-slate-100"
              >
                关闭
              </button>
              <button
                onClick={handleSaveNextSteps}
                disabled={saved}
                className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all ${
                  saved
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700'
                }`}
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    已写回档案
                  </>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" />
                    写回客户档案
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
