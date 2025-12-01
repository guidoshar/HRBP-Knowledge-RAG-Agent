'use client';

import { motion } from 'framer-motion';
import { quickExamples } from '@/utils/mockData';

interface QuickExamplesProps {
  onSelect: (query: string) => void;
}

export default function QuickExamples({ onSelect }: QuickExamplesProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="w-full max-w-4xl mx-auto mt-12"
    >
      {/* 标题 */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="text-center text-gray-400 text-sm mb-6"
      >
        ✨ 快速体验
      </motion.p>

      {/* 示例卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickExamples.map((example, index) => (
          <motion.button
            key={example.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(example.query)}
            className="glass rounded-2xl p-5 text-left group hover:glow-border transition-all duration-300 relative overflow-hidden"
          >
            {/* 悬浮渐变背景 */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-accent-purple/0 group-hover:from-primary/5 group-hover:via-primary/10 group-hover:to-accent-purple/5 transition-all duration-500" />

            {/* 图标 */}
            <motion.div
              className="text-3xl mb-3 relative z-10"
              whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.4 }}
            >
              {example.icon}
            </motion.div>

            {/* 标题 */}
            <h3 className="text-white font-medium mb-1 group-hover:text-primary transition-colors relative z-10">
              {example.title}
            </h3>

            {/* 描述 */}
            <p className="text-gray-500 text-sm line-clamp-2 relative z-10">
              {example.description}
            </p>

            {/* 查询内容预览 */}
            <motion.div
              className="mt-3 pt-3 border-t border-white/10 relative z-10"
              initial={{ opacity: 0.5 }}
              whileHover={{ opacity: 1 }}
            >
              <p className="text-xs text-primary/70 truncate">
                "{example.query}"
              </p>
            </motion.div>

            {/* 点击指示箭头 */}
            <motion.span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        ))}
      </div>

      {/* 底部提示 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center text-gray-600 text-xs mt-8"
      >
        点击任意卡片快速体验 AI 查询能力，或在输入框中输入您自己的问题
      </motion.p>
    </motion.div>
  );
}
