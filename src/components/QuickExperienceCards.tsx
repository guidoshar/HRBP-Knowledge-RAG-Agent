'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Modal, useOverlayState } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus, faDoorOpen, faGift, faCalendarCheck,
  faPlane, faChartSimple, faArrowRight, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import { hrQuickCards, type HRQuickCard } from '@/utils/hrMockData';

const iconMap = {
  'fa-gift':           faGift,
  'fa-calendar-check': faCalendarCheck,
  'fa-plane':          faPlane,
  'fa-user-plus':      faUserPlus,
  'fa-door-open':      faDoorOpen,
  'fa-chart-simple':   faChartSimple,
};

function QuickModal({ card }: { card: HRQuickCard }) {
  const state = useOverlayState();
  const icon  = iconMap[card.icon as keyof typeof iconMap];

  return (
    <>
      {/* Card trigger */}
      <button
        onClick={state.open}
        className="block w-full h-full text-left group"
      >
        <div
          className="h-full bg-[#161616] border border-white/[0.06] hover:border-orange-500/40 rounded-2xl transition-all duration-300 p-5 flex flex-col gap-4"
        >
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
          >
            <FontAwesomeIcon icon={icon} style={{ color: card.color }} className="text-lg" />
          </div>

          {/* Title + subtitle */}
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors">
              {card.title}
            </h3>
            <p className="text-sm text-white/50 leading-relaxed">{card.subtitle}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {card.tags.map(tag => (
              <span key={tag} className="bg-white/[0.04] text-white/40 text-xs h-5 rounded-full px-2 inline-flex items-center">
                {tag}
              </span>
            ))}
          </div>

          {/* Preview + arrow */}
          <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
            <span className="text-xs text-white/30 italic truncate max-w-[85%]">{card.previewLine}</span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="text-white/20 group-hover:text-orange-500 group-hover:translate-x-1 transition-all duration-300 text-sm"
            />
          </div>
        </div>
      </button>

      {/* Modal */}
      <Modal state={state}>
        <Modal.Backdrop
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          isDismissable
        />
        <Modal.Container
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          placement="center"
        >
          <Modal.Dialog className="w-full max-w-2xl bg-[#141414] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
            {/* Header */}
            <Modal.Header className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] shrink-0">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${card.color}18`, border: `1px solid ${card.color}30` }}
              >
                <FontAwesomeIcon icon={icon} style={{ color: card.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <Modal.Heading className="text-lg font-bold text-white leading-tight">{card.title}</Modal.Heading>
                <p className="text-xs text-white/40 mt-0.5">{card.subtitle}</p>
              </div>
              <span className="bg-orange-500/10 text-orange-400 text-xs px-2 py-0.5 rounded-full inline-flex items-center shrink-0">Mock 演示</span>
              <Modal.CloseTrigger className="p-2 text-white/30 hover:text-white transition-colors rounded-lg hover:bg-white/[0.06]">
                <FontAwesomeIcon icon={faXmark} />
              </Modal.CloseTrigger>
            </Modal.Header>

            {/* Body */}
            <Modal.Body className="flex-1 overflow-y-auto px-6 py-5">
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {card.markdown}
                </ReactMarkdown>
              </div>
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/[0.06] shrink-0">
              <Modal.CloseTrigger className="px-4 py-2 rounded-xl bg-white/[0.05] text-white/50 hover:text-white/80 text-sm transition-colors flex items-center gap-2">
                <FontAwesomeIcon icon={faXmark} />
                关闭
              </Modal.CloseTrigger>
              <button
                onClick={state.close}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowRight} />
                向 AI 进一步提问
              </button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal>
    </>
  );
}

export default function QuickExperienceCards() {
  return (
    <section id="quick" className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-1 h-4 rounded-full bg-orange-500 inline-block" />
          <span className="text-xs uppercase tracking-widest text-orange-500 font-medium">快速体验</span>
        </div>
        <h2 className="text-2xl font-bold text-white">6 个常见 HR 场景</h2>
        <p className="text-white/40 mt-1 text-sm">点击任意卡片，查看全 Mock 富媒体示例内容</p>
      </motion.div>

      {/* Card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hrQuickCards.map((card, idx) => (
          <motion.div
            key={card.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.08, duration: 0.5 }}
            className="h-full"
          >
            <QuickModal card={card} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
