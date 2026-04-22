'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faRobot, faXmark } from '@fortawesome/free-solid-svg-icons';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function FABAgent() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: '你好，我是 SharkNinja HRBP 智能助手。你可以问我 HR 政策问题。' },
  ]);

  const sendMessage = async () => {
    const text = query.trim();
    if (!text || loading) return;

    const nextHistory = [...messages, { role: 'user' as const, content: text }];
    setMessages(nextHistory);
    setQuery('');
    setLoading(true);

    try {
      const resp = await fetch('/api/hr-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          history: messages,
        }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data?.message || '调用失败');
      }
      setMessages([...nextHistory, { role: 'assistant', content: data?.content || '未返回内容' }]);
    } catch (error: any) {
      setMessages([...nextHistory, { role: 'assistant', content: `请求失败：${error?.message || '未知错误'}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed right-6 bottom-6 z-50">
      {open ? (
        <div className="w-[360px] h-[560px] bg-[#111] border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-white/10 bg-[#1a1a1a] flex items-center justify-between">
            <p className="font-semibold">FAB Agent</p>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white">
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-3">
            {messages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <div
                  className={`inline-block max-w-[92%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === 'user' ? 'bg-[#C8102E] text-white' : 'bg-[#1e1e1e] border border-white/10'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="markdown-content">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {loading ? <p className="text-xs text-white/60">AI 正在生成...</p> : null}
          </div>

          <div className="p-3 border-t border-white/10 bg-[#181818]">
            <div className="flex gap-2">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => (e.key === 'Enter' ? sendMessage() : null)}
                placeholder="输入 HR 政策问题..."
                className="flex-1 rounded-lg border border-white/15 bg-[#262626] px-3 py-2 text-sm outline-none focus:border-[#C8102E]"
              />
              <button onClick={sendMessage} className="rounded-lg bg-[#C8102E] px-3 hover:bg-[#b10d28]">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <button
        onClick={() => setOpen((v) => !v)}
        className="ml-auto mt-4 w-14 h-14 rounded-full bg-[#C8102E] hover:bg-[#b10d28] shadow-lg flex items-center justify-center"
        aria-label="Open FAB Agent"
      >
        <FontAwesomeIcon icon={faRobot} className="text-xl" />
      </button>
    </div>
  );
}
