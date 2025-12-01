'use client';

import { motion } from 'framer-motion';

interface LoadingAnimationProps {
  text?: string;
}

export default function LoadingAnimation({ text = 'AI正在分析您的查询' }: LoadingAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col items-center justify-center py-8 gap-4"
    >
      {/* 跳动的点 */}
      <div className="flex items-center gap-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-accent-purple"
            animate={{
              y: [0, -12, 0],
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: index * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* 加载文字 */}
      <motion.p
        className="text-gray-400 text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {text}...
      </motion.p>

      {/* 进度条效果 */}
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent-purple"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </motion.div>
  );
}

// 小型加载指示器
export function MiniLoader() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="w-1.5 h-1.5 rounded-full bg-primary"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.15,
          }}
        />
      ))}
    </div>
  );
}

// 脉冲加载效果
export function PulseLoader() {
  return (
    <motion.div
      className="relative w-12 h-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent-purple"
        animate={{
          scale: [1, 1.5],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
        }}
      />
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent-purple"
        animate={{
          scale: [1, 1.5],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: 0.5,
        }}
      />
      <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary to-accent-purple flex items-center justify-center">
        <span className="text-white text-lg">🚢</span>
      </div>
    </motion.div>
  );
}

// 骨架屏加载
export function SkeletonLoader({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3 w-full">
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="skeleton h-4 rounded-lg"
          style={{ width: `${100 - index * 15}%` }}
        />
      ))}
    </div>
  );
}

