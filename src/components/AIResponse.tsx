'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Bot, User, RotateCcw, Copy, Check, Sparkles } from 'lucide-react';
import { ShipmentDetail as ShipmentDetailType, BatchQueryResult as BatchQueryResultType, SuggestedAction } from '@/utils/mockData';
import { Message } from '@/hooks/useConversation';
import LoadingAnimation from './LoadingAnimation';
import ShipmentDetail from './ShipmentDetail';
import BatchQueryResult from './BatchQueryResult';
import SuggestedActions, { CompactSuggestedActions } from './SuggestedActions';

interface AIResponseProps {
  messages: Message[];
  isLoading: boolean;
  onReset: () => void;
  onAction: (action: string) => void;
  onSelectOrder?: (order: ShipmentDetailType) => void;
}

export default function AIResponse({
  messages,
  isLoading,
  onReset,
  onAction,
  onSelectOrder,
}: AIResponseProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto mt-8"
    >
      <div className="glass-strong rounded-3xl overflow-hidden">
        {/* 对话头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent-purple flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <span className="text-white font-medium">MOOV AI 助手</span>
            <span className="text-xs text-gray-500 ml-2">
              {messages.length} 条消息
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            title="新对话"
          >
            <RotateCcw size={18} />
          </motion.button>
        </div>

        {/* 对话内容 */}
        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {messages.map((message, index) => (
            <MessageBubble
              key={message.id}
              message={message}
              isLast={index === messages.length - 1}
              onAction={onAction}
              onSelectOrder={onSelectOrder}
            />
          ))}

          {/* 加载状态 */}
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent-purple flex items-center justify-center flex-shrink-0">
                <Bot size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <LoadingAnimation />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 底部操作栏 */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-between items-center">
          <p className="text-xs text-gray-500">
            AI 生成的内容仅供参考
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="flex items-center gap-2 text-sm text-primary hover:text-primary-light transition-colors"
          >
            <Sparkles size={14} />
            发起新查询
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// 单条消息气泡
function MessageBubble({
  message,
  isLast,
  onAction,
  onSelectOrder,
}: {
  message: Message;
  isLast: boolean;
  onAction: (action: string) => void;
  onSelectOrder?: (order: ShipmentDetailType) => void;
}) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [copied, setCopied] = useState(false);

  // 打字机效果 - 只对最新的AI消息生效
  useEffect(() => {
    if (message.role === 'assistant' && isLast) {
      setDisplayedContent('');
      setIsTyping(true);
      setShowVisualization(false);

      const content = message.content;
      let index = 0;
      const typeSpeed = 20;

      const typingInterval = setInterval(() => {
        if (index < content.length) {
          setDisplayedContent(content.substring(0, index + 1));
          index++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
          setTimeout(() => setShowVisualization(true), 300);
        }
      }, typeSpeed);

      return () => clearInterval(typingInterval);
    } else {
      // 历史消息直接显示
      setDisplayedContent(message.content);
      setShowVisualization(true);
    }
  }, [message, isLast]);

  // 复制内容
  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex gap-4"
      >
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
          <User size={16} className="text-gray-400" />
        </div>
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-1">您</p>
          <p className="text-white">{message.content}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent-purple flex items-center justify-center flex-shrink-0">
        <Bot size={16} className="text-white" />
      </div>
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-sm">MOOV AI</p>
          <button
            onClick={handleCopy}
            className="text-gray-500 hover:text-white transition-colors"
            title="复制"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
          </button>
        </div>

        {/* Markdown内容 */}
        <div className="markdown-content">
          <ReactMarkdown>{displayedContent}</ReactMarkdown>
          {isTyping && <span className="typing-cursor" />}
        </div>

        {/* 数据可视化 */}
        <AnimatePresence>
          {showVisualization && message.data && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              {message.responseType === 'po_detail' && (
                <ShipmentDetail
                  shipment={message.data as ShipmentDetailType}
                  delay={0}
                />
              )}

              {message.responseType === 'batch_result' && (
                <BatchQueryResult
                  result={message.data as BatchQueryResultType}
                  onSelectOrder={onSelectOrder}
                  delay={0}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 建议操作 */}
        <AnimatePresence>
          {showVisualization && message.suggestedActions && isLast && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <CompactSuggestedActions
                actions={message.suggestedActions}
                onSelect={onAction}
                delay={300}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
