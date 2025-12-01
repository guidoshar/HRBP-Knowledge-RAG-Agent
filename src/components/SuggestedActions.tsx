'use client';

import { motion } from 'framer-motion';
import { SuggestedAction } from '@/utils/mockData';

interface SuggestedActionsProps {
  actions: SuggestedAction[];
  onSelect: (action: string) => void;
  delay?: number;
}

export default function SuggestedActions({ actions, onSelect, delay = 0 }: SuggestedActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay / 1000 }}
      className="mt-6"
    >
      {/* 分隔线 */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <span className="text-xs text-gray-500">💬 您可能还想了解</span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      {/* 操作按钮网格 */}
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (delay + index * 100) / 1000 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(action.action)}
            className="
              relative overflow-hidden
              glass rounded-xl p-4 text-left
              border border-transparent
              hover:border-primary/30 hover:bg-primary/5
              transition-all duration-300 group
            "
          >
            {/* 背景渐变效果 */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent-purple/10" />
            </div>

            {/* 内容 */}
            <div className="relative flex items-center gap-3">
              {/* 图标 */}
              <span className="text-2xl">{action.icon}</span>

              {/* 文字 */}
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                {action.label}
              </span>

              {/* 箭头 */}
              <motion.span
                className="ml-auto text-gray-600 group-hover:text-primary"
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </div>
          </motion.button>
        ))}
      </div>

      {/* 底部提示 */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: (delay + 500) / 1000 }}
        className="text-center text-gray-600 text-xs mt-4"
      >
        点击上方按钮或输入新的问题继续对话
      </motion.p>
    </motion.div>
  );
}

// 紧凑版建议操作（用于对话流中）
export function CompactSuggestedActions({
  actions,
  onSelect,
  delay = 0,
}: SuggestedActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000 }}
      className="flex flex-wrap gap-2 mt-4"
    >
      {actions.slice(0, 4).map((action, index) => (
        <motion.button
          key={action.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (delay + index * 80) / 1000 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(action.action)}
          className="
            inline-flex items-center gap-2 px-4 py-2
            bg-white/5 hover:bg-primary/10
            border border-white/10 hover:border-primary/30
            rounded-full text-sm text-gray-300 hover:text-white
            transition-all duration-200
          "
        >
          <span>{action.icon}</span>
          <span>{action.label}</span>
        </motion.button>
      ))}
    </motion.div>
  );
}

// 快捷回复建议
export function QuickReplySuggestions({
  suggestions,
  onSelect,
  delay = 0,
}: {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000 }}
      className="flex flex-wrap gap-2"
    >
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: (delay + index * 50) / 1000 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(suggestion)}
          className="
            px-3 py-1.5 text-xs
            bg-primary/10 hover:bg-primary/20
            border border-primary/20 hover:border-primary/40
            text-primary rounded-full
            transition-all duration-200
          "
        >
          {suggestion}
        </motion.button>
      ))}
    </motion.div>
  );
}

