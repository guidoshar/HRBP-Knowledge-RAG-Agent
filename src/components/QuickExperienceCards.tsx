'use client';

import { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faDoorOpen,
  faGift,
  faCalendarCheck,
  faPlane,
  faChartSimple,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { hrQuickCards } from '@/utils/hrMockData';

const iconMap = {
  'user-plus': faUserPlus,
  'door-open': faDoorOpen,
  gift: faGift,
  'calendar-check': faCalendarCheck,
  plane: faPlane,
  'chart-simple': faChartSimple,
};

export default function QuickExperienceCards() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activeCard = useMemo(() => hrQuickCards.find((item) => item.id === activeId) || null, [activeId]);

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">快速体验（全 Mock）</h2>
          <p className="text-white/60 mt-1">点击任一卡片，查看富媒体示例内容。</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {hrQuickCards.map((card) => (
            <button
              key={card.id}
              onClick={() => setActiveId(card.id)}
              className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5 text-left hover:border-[#C8102E] transition-colors"
            >
              <FontAwesomeIcon icon={iconMap[card.icon as keyof typeof iconMap]} className="text-[#C8102E] text-xl mb-3" />
              <h3 className="text-lg font-semibold mb-1">{card.title}</h3>
              <p className="text-sm text-white/60">{card.summary}</p>
            </button>
          ))}
        </div>
      </section>

      {activeCard ? (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[85vh] overflow-auto rounded-2xl border border-white/20 bg-[#141414] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{activeCard.title}</h3>
              <button onClick={() => setActiveId(null)} className="text-white/70 hover:text-white">
                <FontAwesomeIcon icon={faXmark} className="text-xl" />
              </button>
            </div>
            <div className="markdown-content">
              <ReactMarkdown>{activeCard.markdown}</ReactMarkdown>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
