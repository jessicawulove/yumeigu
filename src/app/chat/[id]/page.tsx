'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Agent, ChatMessage } from '@/lib/types';
import {
  getAgentById,
  getChatSession,
  saveChatMessage,
  clearChatSession,
  incrementUsage,
} from '@/lib/store';

function generateReply(agent: Agent, userMessage: string): string {
  const replies: Record<string, string[]> = {
    'agent-001': [
      '好的，让我来帮你构思这段文案。根据你提供的信息，我建议从用户痛点切入，用情感共鸣来建立连接。以下是我的建议方案...',
      '这个文案方向很有潜力！我们可以尝试用对比手法来突出产品优势，同时加入一些数据支撑来增强说服力。',
      '文案的核心在于"说人话"。我建议把这段内容改得更口语化一些，让读者感觉像是在和朋友聊天。',
    ],
    'agent-002': [
      '我来帮你分析这段代码。从逻辑上看，这里可能存在一个边界条件未处理的问题。建议添加空值检查...',
      '这个功能可以用更优雅的方式实现。推荐使用设计模式中的策略模式来替代当前的 if-else 链。',
      '代码审查完毕，整体结构清晰。有几个小建议：1) 变量命名可以更语义化 2) 建议抽取公共逻辑为工具函数',
    ],
    default: [
      '感谢你的提问！让我来帮你分析一下这个问题。基于我的专业知识，这里有几个建议供你参考...',
      '这是一个很好的问题。根据我的分析，我建议从以下几个方面来考虑和解决...',
      '明白了你的需求。以下是我的专业建议，希望对你有帮助。如果需要更详细的方案，请告诉我更多细节。',
    ],
  };

  const agentReplies = replies[agent.id] || replies['default'];
  const index = userMessage.length % agentReplies.length;
  return agentReplies[index];
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;

  const [agent, setAgent] = useState<Agent | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const found = getAgentById(agentId);
    if (!found) {
      router.push('/');
      return;
    }
    setAgent(found);
    const session = getChatSession(agentId);
    setMessages(session.messages);
  }, [agentId, router]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = () => {
    if (!inputValue.trim() || !agent || isTyping) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    saveChatMessage(agentId, userMessage);
    incrementUsage(agentId);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI reply
    setTimeout(() => {
      const reply = generateReply(agent, userMessage.content);
      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      saveChatMessage(agentId, assistantMessage);
      setIsTyping(false);
    }, 800 + Math.random() * 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    clearChatSession(agentId);
    setMessages([]);
  };

  if (!agent) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <div className="text-slate-400">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-slate-50">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Agent Info */}
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white lg:block">
          <div className="flex h-full flex-col p-6">
            {/* Back Button */}
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-blue-600"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回广场
            </Link>

            {/* Agent Info */}
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                {agent.icon}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{agent.name}</h2>
                <span className="text-xs text-slate-400">
                  {agent.usageCount.toLocaleString()} 次使用
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                简介
              </h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {agent.description}
              </p>
            </div>

            {/* Tags */}
            <div className="mb-6">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
                标签
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {agent.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto">
              <button
                onClick={handleClearChat}
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-red-600 hover:border-red-200"
              >
                清空对话记录
              </button>
            </div>
          </div>
        </aside>

        {/* Right - Chat Area */}
        <div className="flex flex-1 flex-col">
          {/* Chat Header (mobile) */}
          <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-6 py-3 lg:hidden">
            <Link href="/" className="text-slate-500 hover:text-blue-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xl">{agent.icon}</span>
              <span className="font-medium text-slate-900">{agent.name}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="mb-4 text-5xl">{agent.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">
                  {agent.name}
                </h3>
                <p className="mb-6 max-w-sm text-sm text-slate-500">
                  {agent.description}
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {['帮我写一段产品介绍', '分析一下这个方案', '有什么好的建议'].map(
                    (prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setInputValue(prompt)}
                        className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {prompt}
                      </button>
                    )
                  )}
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-3xl space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Avatar */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm ${
                        msg.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white'
                          : 'bg-blue-50 text-lg'
                      }`}
                    >
                      {msg.role === 'user' ? '我' : agent.icon}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-100 bg-white text-slate-700'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-lg">
                      {agent.icon}
                    </div>
                    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-3">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 animate-bounce rounded-full bg-slate-300" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-200 bg-white px-6 py-4">
            <div className="mx-auto flex max-w-3xl items-end gap-3">
              <div className="relative flex-1">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入消息... (Enter 发送, Shift+Enter 换行)"
                  rows={1}
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/10"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
