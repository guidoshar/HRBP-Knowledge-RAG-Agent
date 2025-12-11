'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, User, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// MOOV Logo 配置
const MOOV_LOGO = "https://guidoshar.com/wp-content/uploads/2025/12/Group-1312319561.webp";

// 模拟数据 (对接 API 后替换)
const INITIAL_MESSAGES = [
  { id: 1, role: 'assistant', content: '你好，我是 MOOV 智能物流助手。查询 PO 单号、海运班轮，或问“我的货在哪？”，我随时待命。' }
];

export default function MoovChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg = { id: Date.now(), role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = inputValue.trim();
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/dify-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: currentInput,
          provider: 'dify-chat',
          conversationId: conversationId, // 传入 conversation_id 以保持对话连续性
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.message || '调用后端失败');
      }

      const result = await response.json();
      
      // 保存 conversation_id（第一次调用会返回新的，后续调用需要传入）
      if (result.conversationId) {
        setConversationId(result.conversationId);
      }

      // 添加 AI 回复
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'assistant',
        content: result.content || '未收到回复',
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        role: 'assistant', 
        content: `❌ 出错了：${error?.message || '未知错误'}`,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end sm:bottom-10 sm:right-10 font-sans">
      
      {/* --- 聊天主窗口 --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
            className="mb-4 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] flex flex-col overflow-hidden rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl"
            style={{
              background: 'linear-gradient(180deg, rgba(5, 17, 37, 0.95) 0%, rgba(11, 26, 51, 0.98) 100%)',
              boxShadow: '0 20px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05) inset'
            }}
          >
            {/* Header: 顶部渐变与品牌 */}
            <div className="relative flex items-center justify-between px-6 py-4 border-b border-white/5 bg-gradient-to-r from-blue-900/20 to-transparent">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2 h-2 absolute top-0 right-0 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></div>
                  <img src={MOOV_LOGO} alt="Moov Logo" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">MOOV AI</h3>
                  <p className="text-[10px] text-blue-200/60 uppercase tracking-wider">Logistics Intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {conversationId && (
                  <span className="text-[10px] text-blue-300/40 px-2 py-1 bg-blue-900/20 rounded">
                    {conversationId.slice(0, 8)}...
                  </span>
                )}
              <button 
                  onClick={() => {
                    setIsOpen(false);
                    // 可选：关闭时重置对话
                    // setConversationId(undefined);
                    // setMessages(INITIAL_MESSAGES);
                  }}
                className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
              </div>
            </div>

            {/* Chat Area: 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20 rounded-br-sm'
                        : 'bg-white/5 text-blue-100 border border-white/5 shadow-sm rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-1 text-[10px] text-blue-300/50 uppercase font-bold tracking-wider">
                        <Sparkles size={10} /> AI ASSISTANT
                      </div>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                 <div className="flex justify-start">
                   <div className="bg-white/5 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-100"></span>
                     <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce delay-200"></span>
                   </div>
                 </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area: 输入框 */}
            <div className="p-4 pt-2 border-t border-white/5 bg-black/10">
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl focus-within:border-blue-500/50 focus-within:bg-white/10 transition-all duration-300">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about your shipment..."
                  className="flex-1 bg-transparent border-none text-white text-sm px-4 py-3 focus:ring-0 placeholder-white/30"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="mr-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="text-center mt-2">
                 <p className="text-[10px] text-white/20">Powered by MOOV Engine v2.0</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 悬浮按钮 (Floating Button) --- */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center cursor-pointer overflow-hidden border border-blue-400/30"
        style={{
          background: 'radial-gradient(circle at center, #1e3a8a 0%, #020617 100%)',
          boxShadow: '0 0 20px rgba(29, 78, 216, 0.5), inset 0 0 10px rgba(255,255,255,0.1)'
        }}
      >
        {/* 呼吸灯光效 */}
        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping opacity-75 duration-[3000ms]"></div>
        
        {/* Logo */}
        <div className="relative z-10 w-full h-full p-3.5 flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
            <img src={MOOV_LOGO} alt="Chat" className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </div>
      </motion.button>
    </div>
  );
}