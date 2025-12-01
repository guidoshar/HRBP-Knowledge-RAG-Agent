'use client';

import { motion } from 'framer-motion';
import { Ship, AlertTriangle, CheckCircle, Clock, TrendingUp, Truck, DollarSign } from 'lucide-react';
import { BatchQueryResult as BatchQueryResultType, ShipmentDetail } from '@/utils/mockData';
import StatusPieChart from './charts/PieChart';
import TrendBarChart from './charts/BarChart';
import { useState } from 'react';

interface BatchQueryResultProps {
  result: BatchQueryResultType;
  onSelectOrder?: (order: ShipmentDetail) => void;
  delay?: number;
}

type FilterType = 'all' | 'in_transit' | 'delayed' | 'arrived' | 'pending';

export default function BatchQueryResult({ result, onSelectOrder, delay = 0 }: BatchQueryResultProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  // 筛选订单
  const filteredOrders = filter === 'all'
    ? result.orders
    : result.orders.filter((order) => order.status === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="space-y-4"
    >
      {/* 分析卡片 */}
      <AnalyticsCards analytics={result.analytics} delay={delay + 100} />

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StatusPieChart data={result.statusBreakdown} delay={delay + 200} />
        <TrendBarChart data={result.trendData} delay={delay + 300} />
      </div>

      {/* 订单列表 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: (delay + 400) / 1000 }}
        className="glass rounded-2xl p-5"
      >
        {/* 筛选器 */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <h3 className="text-white font-semibold">📦 订单列表</h3>
          <FilterTabs
            active={filter}
            onChange={setFilter}
            counts={result.statusBreakdown}
          />
        </div>

        {/* 订单卡片 */}
        <div className="space-y-3">
          {filteredOrders.slice(0, 5).map((order, index) => (
            <OrderCard
              key={order.poNumber}
              order={order}
              index={index}
              delay={delay + 500 + index * 100}
              onClick={() => onSelectOrder?.(order)}
            />
          ))}
        </div>

        {/* 查看更多 */}
        {filteredOrders.length > 5 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: (delay + 1000) / 1000 }}
            className="w-full mt-4 py-3 text-center text-primary hover:text-primary-light transition-colors text-sm border border-primary/20 rounded-xl hover:bg-primary/5"
          >
            查看更多 ({filteredOrders.length - 5} 个订单)
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}

// 分析卡片
function AnalyticsCards({ analytics, delay }: { analytics: BatchQueryResultType['analytics']; delay: number }) {
  const cards = [
    {
      icon: Clock,
      label: '平均运输时间',
      value: `${analytics.avgDeliveryTime}天`,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: AlertTriangle,
      label: '延误率',
      value: `${analytics.delayRate}%`,
      color: analytics.delayRate > 20 ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-emerald-600',
    },
    {
      icon: Truck,
      label: '主要承运商',
      value: analytics.topCarrier,
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: DollarSign,
      label: '总货值',
      value: `${analytics.totalValue}万`,
      color: 'from-amber-500 to-amber-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (delay + index * 100) / 1000 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="glass rounded-xl p-4"
        >
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
            <card.icon size={20} className="text-white" />
          </div>
          <p className="text-white font-semibold text-lg">{card.value}</p>
          <p className="text-gray-500 text-xs">{card.label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// 筛选标签
function FilterTabs({
  active,
  onChange,
  counts,
}: {
  active: FilterType;
  onChange: (filter: FilterType) => void;
  counts: BatchQueryResultType['statusBreakdown'];
}) {
  const tabs: { key: FilterType; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: '全部', icon: null },
    { key: 'in_transit', label: `运输中 (${counts.in_transit})`, icon: <Ship size={14} /> },
    { key: 'delayed', label: `延误 (${counts.delayed})`, icon: <AlertTriangle size={14} /> },
    { key: 'arrived', label: `已到达 (${counts.arrived})`, icon: <CheckCircle size={14} /> },
  ];

  return (
    <div className="flex gap-2 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap
            transition-all duration-200
            ${active === tab.key
              ? 'bg-primary/20 text-primary border border-primary/30'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
            }
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// 订单卡片
function OrderCard({
  order,
  index,
  delay,
  onClick,
}: {
  order: ShipmentDetail;
  index: number;
  delay: number;
  onClick?: () => void;
}) {
  // 计算ETA
  const etaDate = new Date(order.etaDate);
  const today = new Date();
  const daysRemaining = Math.ceil((etaDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const statusConfig = {
    in_transit: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Ship, label: '运输中' },
    delayed: { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: AlertTriangle, label: '延误' },
    arrived: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle, label: '已到达' },
    pending: { color: 'text-gray-400', bg: 'bg-gray-500/10', icon: Clock, label: '待发货' },
  };

  const status = statusConfig[order.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay / 1000 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="glass-dark rounded-xl p-4 cursor-pointer hover:bg-white/5 transition-all group"
    >
      <div className="flex items-center justify-between">
        {/* 左侧信息 */}
        <div className="flex items-center gap-4">
          {/* 状态图标 */}
          <div className={`w-10 h-10 rounded-lg ${status.bg} flex items-center justify-center`}>
            <StatusIcon size={20} className={status.color} />
          </div>

          {/* 订单信息 */}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-medium">{order.poNumber}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>
                {status.label}
              </span>
            </div>
            <p className="text-gray-500 text-sm mt-0.5">
              {order.origin} → {order.destination}
            </p>
          </div>
        </div>

        {/* 右侧信息 */}
        <div className="text-right">
          <p className="text-white font-medium">
            {order.status === 'delayed'
              ? `延误${order.delayDays}天`
              : order.status === 'arrived'
              ? '已完成'
              : `${daysRemaining}天后到达`}
          </p>
          <p className="text-gray-500 text-sm">进度 {order.progress}%</p>
        </div>

        {/* 箭头 */}
        <motion.div
          className="ml-4 text-gray-600 group-hover:text-primary transition-colors"
          animate={{ x: [0, 4, 0] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          →
        </motion.div>
      </div>

      {/* 进度条 */}
      <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${order.progress}%` }}
          transition={{ duration: 1, delay: delay / 1000 }}
          className={`h-full rounded-full ${
            order.status === 'delayed'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500'
              : 'bg-gradient-to-r from-primary to-accent-purple'
          }`}
        />
      </div>
    </motion.div>
  );
}

