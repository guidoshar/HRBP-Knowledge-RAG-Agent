'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Sparkles } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function QueryInput({ onSubmit, isLoading, disabled }: QueryInputProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxLength = 200;

  // 自动聚焦
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading && !disabled) {
      onSubmit(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="relative">
        {/* 发光背景效果 */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent-purple/30 to-primary/30 rounded-2xl blur-xl"
            />
          )}
        </AnimatePresence>

        {/* 输入框容器 */}
        <motion.div
          className={`
            relative glass-strong rounded-2xl overflow-hidden
            transition-all duration-300
            ${isFocused ? 'glow-border-focus' : 'glow-border'}
            ${disabled ? 'opacity-50' : ''}
          `}
          animate={{
            borderColor: isFocused 
              ? 'rgba(59, 130, 246, 0.5)' 
              : 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center">
            {/* 搜索图标 */}
            <div className="pl-5 pr-2 text-gray-400">
              <Search size={22} />
            </div>

            {/* 输入框 */}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value.slice(0, maxLength))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
              disabled={isLoading || disabled}
              placeholder="输入PO单号、集装箱号，或问「我的货在哪？」"
              className="
                flex-1 bg-transparent text-white text-lg py-5 px-3
                placeholder:text-gray-500 focus:outline-none
                disabled:cursor-not-allowed
              "
              aria-label="查询输入框"
            />

            {/* 字符计数 */}
            <AnimatePresence>
              {query.length > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-xs text-gray-500 pr-3"
                >
                  {query.length}/{maxLength}
                </motion.span>
              )}
            </AnimatePresence>

            {/* 提交按钮 */}
            <motion.button
              type="submit"
              disabled={!query.trim() || isLoading || disabled}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                m-2 px-6 py-3 rounded-xl font-medium text-white
                flex items-center gap-2 transition-all duration-300
                ${query.trim() && !isLoading && !disabled
                  ? 'btn-gradient'
                  : 'bg-gray-700/50 cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>分析中</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Query</span>
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* 提示文字 */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-gray-500 text-sm mt-4"
        >
          按 <kbd className="px-2 py-1 bg-white/10 rounded text-gray-400">Enter</kbd> 快速查询
        </motion.p>
      </div>
    </motion.form>
  );
}

