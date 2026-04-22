'use client';

import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaperPlane, faRobot, faXmark, faRotateRight, faCircle,
} from '@fortawesome/free-solid-svg-icons';
import { mockAgentResponses } from '@/utils/hrMockData';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED = [
  '我有多少天年假？',
  '差旅住宿报销标准？',
  '入职需要准备什么？',
];

const INIT_MSG: ChatMessage = {
  id: 'init',
  role: 'assistant',
  content: '你好！我是 **SharkNinja HRBP 智能助手**，可以帮你查询入职离职流程、员工福利、差旅报销、请假制度等 HR 政策问题。\n\n请问有什么可以帮您？',
};

export default function FABAgent() {
  const [open, setOpen]         = useState(false);
  const [query, setQuery]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INIT_MSG]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  /* Listen for prefill events from HeroSection quick search */
  useEffect(() => {
    const handler = (e: Event) => {
      const q = (e as CustomEvent<string>).detail;
      if (q) { setQuery(q); setOpen(true); }
    };
    window.addEventListener('hrbp:query', handler);
    return () => window.removeEventListener('hrbp:query', handler);
  }, []);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: q };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setQuery('');
    setLoading(true);

    try {
      const resp = await fetch('/api/hr-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, history: messages }),
      });
      const data = await resp.json();
      const replyContent = resp.ok
        ? (data?.content ?? '未返回有效内容')
        : `> ⚠️ **AI 暂未配置**\n\n${mockAgentResponses.default}`;

      setMessages([...nextMessages, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyContent,
      }]);
    } catch {
      setMessages([...nextMessages, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: mockAgentResponses.default,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => setMessages([{ ...INIT_MSG, id: 'init-' + Date.now() }]);

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ duration: 0.22, type: 'spring', stiffness: 300, damping: 25 }}
            className="w-[360px] sm:w-[400px] flex flex-col rounded-2xl overflow-hidden"
            style={{
              height: '580px',
              background: 'linear-gradient(180deg, #111111 0%, #0d0d0d 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(249,115,22,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0"
              style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.08) 0%, transparent 100%)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
                  <FontAwesomeIcon icon={faRobot} className="text-orange-400 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">SharkNinja HR助手</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <FontAwesomeIcon icon={faCircle} className="text-green-400" style={{ fontSize: '6px' }} />
                    <span className="text-[10px] text-white/40">在线 · FAB Agent</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="bg-orange-500/10 text-orange-400 text-[10px] px-2 h-5 rounded-full inline-flex items-center">
                  {messages.length - 1} 条对话
                </span>
                <button onClick={reset} className="p-2 text-white/30 hover:text-white/70 transition-colors" title="重置对话">
                  <FontAwesomeIcon icon={faRotateRight} className="text-xs" />
                </button>
                <button onClick={() => setOpen(false)} className="p-2 text-white/30 hover:text-white/70 transition-colors">
                  <FontAwesomeIcon icon={faXmark} className="text-sm" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'none' }}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0 mr-2 mt-1">
                      <FontAwesomeIcon icon={faRobot} className="text-orange-400" style={{ fontSize: '10px' }} />
                    </div>
                  )}
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm ${
                      msg.role === 'user'
                        ? 'bg-orange-500 text-white rounded-br-sm'
                        : 'bg-white/[0.05] border border-white/[0.07] rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="markdown-content text-sm leading-relaxed">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <span className="leading-relaxed">{msg.content}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Loading dots */}
              {loading && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center shrink-0 mr-2">
                    <FontAwesomeIcon icon={faRobot} className="text-orange-400" style={{ fontSize: '10px' }} />
                  </div>
                  <div className="bg-white/[0.05] border border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                    {[0, 1, 2].map(i => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && !loading && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {SUGGESTED.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/50 hover:border-orange-500/40 hover:text-orange-400 transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="px-4 pb-4 pt-2 border-t border-white/[0.06] shrink-0">
              <div className="flex gap-2 items-end">
                <textarea
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(query); }
                  }}
                  placeholder="输入 HR 问题… (Enter 发送)"
                  rows={1}
                  className="flex-1 resize-none rounded-xl bg-white/[0.05] border border-white/[0.1] focus:border-orange-500/50 text-white text-sm px-4 py-3 outline-none placeholder-white/25 transition-colors leading-relaxed"
                  style={{ minHeight: '44px', maxHeight: '100px' }}
                />
                <button
                  onClick={() => send(query)}
                  disabled={!query.trim() || loading}
                  className="h-11 w-11 rounded-xl shrink-0 flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)' }}
                >
                  <FontAwesomeIcon icon={faPaperPlane} className="text-white text-sm" />
                </button>
              </div>
              <p className="text-center text-[10px] text-white/20 mt-2">
                Powered by SharkNinja HRBP Engine · Azure GPT-5
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => setOpen(v => !v)}
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
          boxShadow: '0 0 24px rgba(249,115,22,0.45), 0 4px 16px rgba(0,0,0,0.4)',
        }}
        aria-label="HRBP 智能助手"
      >
        <span
          className="absolute inset-0 rounded-2xl bg-orange-500/30 animate-ping opacity-60"
          style={{ animationDuration: '2.5s' }}
        />
        <FontAwesomeIcon
          icon={open ? faXmark : faRobot}
          className="text-white text-xl relative z-10"
        />
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-black" />
        )}
      </motion.button>
    </div>
  );
}
