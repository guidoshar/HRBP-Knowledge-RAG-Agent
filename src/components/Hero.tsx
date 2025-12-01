'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QueryInput from './QueryInput';
import AIResponse from './AIResponse';
import QuickExamples from './QuickExamples';
import useConversation from '@/hooks/useConversation';
import { ShipmentDetail } from '@/utils/mockData';

export default function Hero() {
  const {
    messages,
    isLoading,
    sendMessage,
    handleAction,
    resetConversation,
    hasMessages,
  } = useConversation();

  // 处理查询
  const handleQuery = useCallback(
    async (query: string) => {
      await sendMessage(query);
    },
    [sendMessage]
  );

  // 处理建议操作
  const handleSuggestedAction = useCallback(
    async (action: string) => {
      if (action === 'new_query') {
        resetConversation();
      } else {
        await handleAction(action);
      }
    },
    [handleAction, resetConversation]
  );

  // 处理选择订单（从批量查询结果中）
  const handleSelectOrder = useCallback(
    (order: ShipmentDetail) => {
      sendMessage(order.poNumber);
    },
    [sendMessage]
  );

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* 背景效果 */}
      <BackgroundEffects />

      {/* 主内容区 */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            // 初始状态：标题 + 输入框 + 快捷示例
            <motion.div
              key="initial"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              {/* 主标题 */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm text-gray-300">AI 智能物流追踪系统 v2.0</span>
                </motion.div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                  <span className="text-white">MOOV AI</span>
                  <br />
                  <span className="gradient-text">智能物流助手</span>
                </h1>

                <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                  输入单号或用自然语言提问，AI 为您
                  <span className="text-primary">实时追踪</span>
                  全球货物动态
                </p>

                {/* 功能亮点 */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-wrap justify-center gap-4 mb-8"
                >
                  {[
                    { icon: '🔍', text: '智能意图识别' },
                    { icon: '📊', text: '数据可视化' },
                    { icon: '💬', text: '多轮对话' },
                    { icon: '⚡', text: '实时追踪' },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 text-sm text-gray-400"
                    >
                      <span>{feature.icon}</span>
                      <span>{feature.text}</span>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>

              {/* 查询输入框 */}
              <QueryInput onSubmit={handleQuery} isLoading={isLoading} />

              {/* 快捷示例 */}
              <QuickExamples onSelect={handleQuery} />

              {/* 滚动提示 */}
              <ScrollHint />
            </motion.div>
          ) : (
            // 对话状态
            <motion.div
              key="conversation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* 紧凑标题 */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold">
                  <span className="text-white">MOOV AI</span>
                  <span className="gradient-text ml-2">智能物流助手</span>
                </h2>
              </motion.div>

              {/* 小型输入框 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <QueryInput
                  onSubmit={handleQuery}
                  isLoading={isLoading}
                  disabled={isLoading}
                />
              </motion.div>

              {/* AI对话区域 */}
              <AIResponse
                messages={messages}
                isLoading={isLoading}
                onReset={resetConversation}
                onAction={handleSuggestedAction}
                onSelectOrder={handleSelectOrder}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

// 背景效果组件
function BackgroundEffects() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* 渐变光晕 */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[128px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      
      {/* 额外的动态光效 */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-conic from-primary/10 via-transparent to-accent-purple/10 rounded-full blur-[100px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

// 滚动提示
function ScrollHint() {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: [0, 10, 0] }}
      transition={{
        opacity: { delay: 1.5 },
        y: { duration: 2, repeat: Infinity },
      }}
    >
      <div className="flex flex-col items-center gap-2 text-gray-600">
        <span className="text-xs">向下滚动了解更多</span>
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
        </svg>
      </div>
    </motion.div>
  );
}
