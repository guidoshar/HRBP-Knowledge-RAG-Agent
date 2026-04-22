'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass, faComments, faDatabase,
  faFileCircleCheck, faBolt,
} from '@fortawesome/free-solid-svg-icons';

const FEATURES = [
  { icon: faComments,        label: '智能问答' },
  { icon: faDatabase,        label: '知识库检索' },
  { icon: faFileCircleCheck, label: '政策查询' },
  { icon: faBolt,            label: '快速回应' },
];

const QUICK_QUERIES = [
  '我的年假还剩多少？',
  '差旅住宿标准是多少？',
  '入职需要哪些材料？',
  '绩效评估怎么计算奖金？',
];

export default function HeroSection() {
  const [inputVal, setInputVal] = useState('');

  const handleSearch = () => {
    /* FABAgent is globally mounted; we could emit an event to prefill it */
    const event = new CustomEvent('hrbp:query', { detail: inputVal.trim() });
    window.dispatchEvent(event);
  };

  return (
    <section className="relative min-h-[88vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-orange-500/[0.06] blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-orange-600/[0.04] blur-[100px]" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(249,115,22,0.4) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(249,115,22,0.4) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium border border-orange-500/25 bg-orange-500/8 text-orange-400">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />
            基于 Azure GPT-5 · HR_Policy 知识库驱动
          </span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-5 leading-[1.08]"
        >
          <span className="text-white">HR</span>
          <span className="gradient-text">智能助手</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-white/50 max-w-xl mx-auto mb-10 leading-relaxed"
        >
          用自然语言提问，AI 为您
          <span className="text-orange-400 font-medium"> 快速解答</span>
          员工福利与政策问题
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {FEATURES.map(f => (
            <span
              key={f.label}
              className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] text-white/60 text-xs px-3 py-1.5 rounded-full"
            >
              <FontAwesomeIcon icon={f.icon} className="text-orange-500 text-xs" />
              {f.label}
            </span>
          ))}
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="relative mb-4"
        >
          <div
            className="flex items-center gap-3 rounded-2xl border border-white/[0.1] focus-within:border-orange-500/50 transition-all duration-300 px-5 py-4"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(20px)' }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-white/30 text-base shrink-0" />
            <input
              type="text"
              value={inputVal}
              onChange={e => setInputVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="输入问题或关键词，例如「员工福利」「年假申请」"
              className="flex-1 bg-transparent border-none outline-none text-white text-sm sm:text-base placeholder-white/25 leading-relaxed"
            />
            <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.06] text-white/25 text-xs shrink-0">
              ↵ 搜索
            </kbd>
          </div>
        </motion.div>

        {/* Quick query pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {QUICK_QUERIES.map(q => (
            <button
              key={q}
              onClick={() => {
                setInputVal(q);
                const event = new CustomEvent('hrbp:query', { detail: q });
                window.dispatchEvent(event);
              }}
              className="text-xs px-3.5 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-white/40 hover:border-orange-500/40 hover:text-orange-400 hover:bg-orange-500/[0.05] transition-all duration-200"
            >
              {q}
            </button>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-16 flex flex-col items-center gap-1"
        >
          <span className="text-[11px] text-white/25 uppercase tracking-widest">↓ 快速体验</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/10 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
