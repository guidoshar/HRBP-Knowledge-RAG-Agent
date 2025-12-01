'use client';

import { motion } from 'framer-motion';
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';

interface TrendDataPoint {
  date: string;
  orders: number;
  delayed: number;
}

interface TrendBarChartProps {
  data: TrendDataPoint[];
  delay?: number;
}

export default function TrendBarChart({ data, delay = 0 }: TrendBarChartProps) {
  // 只显示最近15天的数据
  const displayData = data.slice(-15);

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg px-4 py-3 text-sm">
          <p className="text-white font-medium mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-blue-400">
              📦 订单数: {payload[0]?.value || 0}
            </p>
            <p className="text-amber-400">
              ⚠️ 延误: {payload[1]?.value || 0}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-white font-semibold mb-4">📊 近15天订单趋势</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={displayData}>
            <defs>
              <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="delayGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              vertical={false}
            />
            
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            
            <Bar
              dataKey="orders"
              fill="url(#orderGradient)"
              radius={[4, 4, 0, 0]}
              animationBegin={delay}
              animationDuration={1000}
            />
            
            <Bar
              dataKey="delayed"
              fill="url(#delayGradient)"
              radius={[4, 4, 0, 0]}
              animationBegin={delay + 200}
              animationDuration={1000}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 图例 */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-sm text-gray-400">订单数</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span className="text-sm text-gray-400">延误数</span>
        </div>
      </div>
    </motion.div>
  );
}

// 简化版进度条组件
export function ProgressBar({
  progress,
  color = 'primary',
  height = 8,
  showLabel = true,
  delay = 0,
}: {
  progress: number;
  color?: 'primary' | 'success' | 'warning' | 'error';
  height?: number;
  showLabel?: boolean;
  delay?: number;
}) {
  const colorClasses = {
    primary: 'from-primary to-accent-purple',
    success: 'from-emerald-500 to-emerald-400',
    warning: 'from-amber-500 to-orange-500',
    error: 'from-red-500 to-red-400',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-gray-400">进度</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay / 1000 }}
            className="text-white font-medium"
          >
            {progress}%
          </motion.span>
        </div>
      )}
      
      <div
        className="w-full bg-white/10 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, delay: delay / 1000, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full relative`}
        >
          {/* 光效 */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
}

