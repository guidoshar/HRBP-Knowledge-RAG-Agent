'use client';

import { motion } from 'framer-motion';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface StatusData {
  in_transit: number;
  delayed: number;
  arrived: number;
  pending: number;
}

interface PieChartProps {
  data: StatusData;
  delay?: number;
}

const COLORS = {
  in_transit: '#3b82f6', // 蓝色 - 运输中
  delayed: '#f59e0b',    // 橙色 - 延误
  arrived: '#10b981',    // 绿色 - 已到达
  pending: '#6b7280',    // 灰色 - 待发货
};

const LABELS = {
  in_transit: '运输中',
  delayed: '延误',
  arrived: '已到达',
  pending: '待发货',
};

export default function StatusPieChart({ data, delay = 0 }: PieChartProps) {
  // 转换数据格式
  const chartData = Object.entries(data)
    .filter(([_, value]) => value > 0)
    .map(([key, value]) => ({
      name: LABELS[key as keyof typeof LABELS],
      value,
      color: COLORS[key as keyof typeof COLORS],
    }));

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg px-3 py-2 text-sm">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-gray-300">{payload[0].value} 个订单</p>
        </div>
      );
    }
    return null;
  };

  // 自定义Legend
  const CustomLegend = ({ payload }: any) => (
    <div className="flex flex-wrap justify-center gap-4 mt-4">
      {payload?.map((entry: any, index: number) => (
        <motion.div
          key={entry.value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: (delay + index * 100) / 1000 }}
          className="flex items-center gap-2"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-300">{entry.value}</span>
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="glass rounded-2xl p-6"
    >
      <h3 className="text-white font-semibold mb-4 text-center">📈 状态分布</h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPie>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
              animationBegin={delay}
              animationDuration={1000}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </RechartsPie>
        </ResponsiveContainer>
      </div>

      {/* 中心数字 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center mt-[-20px]">
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: (delay + 500) / 1000 }}
            className="text-2xl font-bold text-white"
          >
            {Object.values(data).reduce((a, b) => a + b, 0)}
          </motion.p>
          <p className="text-xs text-gray-400">总订单</p>
        </div>
      </div>
    </motion.div>
  );
}

