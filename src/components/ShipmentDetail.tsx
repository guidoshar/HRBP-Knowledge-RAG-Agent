'use client';

import { motion } from 'framer-motion';
import { Package, Ship, Anchor, MapPin, Clock, FileText, Scale, DollarSign, Truck } from 'lucide-react';
import { ShipmentDetail as ShipmentDetailType } from '@/utils/mockData';
import { useState, useEffect } from 'react';
import { ProgressBar } from './charts/BarChart';

interface ShipmentDetailProps {
  shipment: ShipmentDetailType;
  delay?: number;
}

export default function ShipmentDetail({ shipment, delay = 0 }: ShipmentDetailProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  // 进度动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(shipment.progress);
    }, delay);
    return () => clearTimeout(timer);
  }, [shipment.progress, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="space-y-4"
    >
      {/* 时间轴 */}
      <Timeline events={shipment.timeline} delay={delay + 200} />

      {/* 进度条 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: (delay + 400) / 1000 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-400">{shipment.origin}</span>
          <span className="text-sm text-gray-400">{shipment.destination}</span>
        </div>
        <ProgressBar
          progress={animatedProgress}
          color={shipment.status === 'delayed' ? 'warning' : shipment.status === 'arrived' ? 'success' : 'primary'}
          height={10}
          delay={delay + 500}
        />
      </motion.div>

      {/* 信息卡片网格 */}
      <InfoCardsGrid shipment={shipment} delay={delay + 600} />

      {/* 文档状态 */}
      <DocumentStatus documents={shipment.documents} delay={delay + 800} />

      {/* 延误信息（如有） */}
      {shipment.status === 'delayed' && shipment.delayReason && (
        <DelayWarning
          reason={shipment.delayReason}
          days={shipment.delayDays || 0}
          delay={delay + 900}
        />
      )}
    </motion.div>
  );
}

// 时间轴组件
function Timeline({ events, delay }: { events: ShipmentDetailType['timeline']; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000 }}
      className="glass rounded-2xl p-5"
    >
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <MapPin size={18} className="text-primary" />
        运输轨迹
      </h3>

      <div className="relative">
        {/* 连接线 */}
        <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-gray-600" />

        {/* 节点 */}
        <div className="space-y-4">
          {events.map((event, index) => (
            <motion.div
              key={event.stage}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (delay + index * 150) / 1000 }}
              className="flex items-start gap-4 relative"
            >
              {/* 节点图标 */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center z-10 text-sm
                  ${event.status === 'completed' ? 'bg-emerald-500/20 ring-2 ring-emerald-500/50' : ''}
                  ${event.status === 'in_progress' ? 'bg-primary/20 ring-2 ring-primary animate-pulse' : ''}
                  ${event.status === 'pending' ? 'bg-gray-600/50' : ''}
                `}
              >
                {event.icon}
              </div>

              {/* 内容 */}
              <div className="flex-1 pb-2">
                <div className="flex items-center justify-between">
                  <p
                    className={`font-medium ${
                      event.status === 'pending' ? 'text-gray-500' : 'text-white'
                    }`}
                  >
                    {event.stage}
                  </p>
                  {event.status === 'in_progress' && (
                    <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      当前位置
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <span>{event.date}</span>
                  <span>•</span>
                  <span>{event.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// 信息卡片网格
function InfoCardsGrid({ shipment, delay }: { shipment: ShipmentDetailType; delay: number }) {
  const cards = [
    { icon: Package, label: '数量', value: `${shipment.cargo.quantity}件`, color: 'text-blue-400' },
    { icon: Scale, label: '重量', value: `${shipment.cargo.weight}吨`, color: 'text-emerald-400' },
    { icon: DollarSign, label: '货值', value: `${shipment.cargo.value}万`, color: 'text-amber-400' },
    { icon: Ship, label: '承运商', value: shipment.carrier.split(' ')[0], color: 'text-purple-400' },
    { icon: Clock, label: 'ETA', value: shipment.etaDate, color: 'text-primary' },
    { icon: Truck, label: '集装箱', value: shipment.containerNumber.slice(0, 8) + '...', color: 'text-gray-400' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (delay + index * 80) / 1000 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="glass rounded-xl p-3 text-center cursor-default"
        >
          <card.icon size={20} className={`mx-auto mb-2 ${card.color}`} />
          <p className="text-white font-semibold text-sm truncate">{card.value}</p>
          <p className="text-gray-500 text-xs">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// 文档状态
function DocumentStatus({ documents, delay }: { documents: ShipmentDetailType['documents']; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay / 1000 }}
      className="glass rounded-2xl p-5"
    >
      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
        <FileText size={18} className="text-primary" />
        文档状态
      </h3>

      <div className="space-y-2">
        {documents.map((doc, index) => (
          <motion.div
            key={doc.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: (delay + index * 100) / 1000 }}
            className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
          >
            <span className="text-sm text-gray-300">{doc.name}</span>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                doc.status === 'approved'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : doc.status === 'pending'
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}
            >
              {doc.status === 'approved' ? '✓ 已审批' : doc.status === 'pending' ? '⏳ 待审批' : '📄 已上传'}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// 延误警告
function DelayWarning({ reason, days, delay }: { reason: string; days: number; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay / 1000 }}
      className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5"
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">⚠️</div>
        <div>
          <h4 className="text-amber-400 font-semibold mb-1">延误通知</h4>
          <p className="text-amber-300/80 text-sm mb-2">{reason}</p>
          <p className="text-amber-400 text-sm font-medium">
            预计延误 <span className="text-lg">{days}</span> 天
          </p>
        </div>
      </div>
    </motion.div>
  );
}

