// ============================================================
// MOOV AI 物流助手 - Mock数据定义
// ============================================================

// 单订单详情数据结构
export interface ShipmentDetail {
  poNumber: string;
  containerNumber: string;
  status: 'pending' | 'in_transit' | 'delayed' | 'arrived';
  origin: string;
  destination: string;
  carrier: string;
  departureDate: string;
  etaDate: string;
  actualDate?: string;
  progress: number;
  delayReason?: string;
  delayDays?: number;
  timeline: TimelineEvent[];
  cargo: CargoInfo;
  documents: DocumentInfo[];
}

export interface TimelineEvent {
  stage: string;
  date: string;
  location: string;
  status: 'completed' | 'in_progress' | 'pending';
  icon: string;
}

export interface CargoInfo {
  type: string;
  quantity: number;
  weight: number;
  value: number;
}

export interface DocumentInfo {
  name: string;
  status: 'uploaded' | 'pending' | 'approved';
}

// 批量查询结果数据结构
export interface BatchQueryResult {
  customer?: string;
  destination?: string;
  totalCount: number;
  statusBreakdown: {
    in_transit: number;
    delayed: number;
    arrived: number;
    pending: number;
  };
  orders: ShipmentDetail[];
  analytics: {
    avgDeliveryTime: number;
    delayRate: number;
    topCarrier: string;
    totalValue: number;
  };
  trendData: TrendDataPoint[];
}

export interface TrendDataPoint {
  date: string;
  orders: number;
  delayed: number;
}

// 建议操作
export interface SuggestedAction {
  id: string;
  label: string;
  icon: string;
  action: string;
}

// ============================================================
// Mock数据：单订单详情
// ============================================================

export const mockShipmentDetails: Record<string, ShipmentDetail> = {
  // 数据1：正常运输中
  'PO#12345': {
    poNumber: 'PO#12345',
    containerNumber: 'COSU1234567',
    status: 'in_transit',
    origin: '上海港',
    destination: '洛杉矶港',
    carrier: 'COSCO (中远海运)',
    departureDate: '2024-12-01',
    etaDate: '2024-12-15',
    progress: 60,
    timeline: [
      { stage: '订单确认', date: '2024-11-25', location: '上海', status: 'completed', icon: '✓' },
      { stage: '货物装船', date: '2024-12-01', location: '上海港', status: 'completed', icon: '📦' },
      { stage: '离港', date: '2024-12-02', location: '上海港', status: 'completed', icon: '🚢' },
      { stage: '运输中', date: '进行中', location: '太平洋', status: 'in_progress', icon: '🌊' },
      { stage: '预计到港', date: '2024-12-15', location: '洛杉矶港', status: 'pending', icon: '🏁' },
    ],
    cargo: {
      type: '电子产品',
      quantity: 500,
      weight: 12.5,
      value: 85,
    },
    documents: [
      { name: '提单 (Bill of Lading)', status: 'approved' },
      { name: '商业发票', status: 'approved' },
      { name: '装箱单', status: 'approved' },
    ],
  },

  // 数据2：延误订单
  'PO#12347': {
    poNumber: 'PO#12347',
    containerNumber: 'MSCU7654321',
    status: 'delayed',
    origin: '宁波港',
    destination: '鹿特丹港',
    carrier: 'MSC (地中海航运)',
    departureDate: '2024-11-20',
    etaDate: '2024-12-10',
    actualDate: '2024-12-15',
    progress: 75,
    delayReason: '宁波港天气影响（70%）+ 船期调整（30%）',
    delayDays: 5,
    timeline: [
      { stage: '订单确认', date: '2024-11-15', location: '宁波', status: 'completed', icon: '✓' },
      { stage: '货物装船', date: '2024-11-20', location: '宁波港', status: 'completed', icon: '📦' },
      { stage: '天气延误', date: '2024-11-22', location: '宁波港', status: 'completed', icon: '⚠️' },
      { stage: '运输中', date: '进行中', location: '印度洋', status: 'in_progress', icon: '🌊' },
      { stage: '新ETA到港', date: '2024-12-15', location: '鹿特丹港', status: 'pending', icon: '🏁' },
    ],
    cargo: {
      type: '纺织品',
      quantity: 1200,
      weight: 8.3,
      value: 42,
    },
    documents: [
      { name: '提单', status: 'approved' },
      { name: '原产地证明', status: 'pending' },
    ],
  },

  // 数据3：已到达
  'PO#12340': {
    poNumber: 'PO#12340',
    containerNumber: 'HLCU9876543',
    status: 'arrived',
    origin: '深圳港',
    destination: '纽约港',
    carrier: 'Hapag-Lloyd',
    departureDate: '2024-11-10',
    etaDate: '2024-11-28',
    actualDate: '2024-11-27',
    progress: 100,
    timeline: [
      { stage: '订单确认', date: '2024-11-05', location: '深圳', status: 'completed', icon: '✓' },
      { stage: '货物装船', date: '2024-11-10', location: '深圳港', status: 'completed', icon: '📦' },
      { stage: '离港', date: '2024-11-11', location: '深圳港', status: 'completed', icon: '🚢' },
      { stage: '到达', date: '2024-11-27', location: '纽约港', status: 'completed', icon: '🏁' },
      { stage: '清关完成', date: '2024-11-28', location: '纽约', status: 'completed', icon: '📋' },
    ],
    cargo: {
      type: '机械设备',
      quantity: 50,
      weight: 25.8,
      value: 150,
    },
    documents: [
      { name: '提单', status: 'approved' },
      { name: '清关文件', status: 'approved' },
    ],
  },

  // 数据4：待发货
  'PO#12350': {
    poNumber: 'PO#12350',
    containerNumber: 'EGLV1122334',
    status: 'pending',
    origin: '青岛港',
    destination: '汉堡港',
    carrier: 'Evergreen',
    departureDate: '2024-12-10',
    etaDate: '2024-12-28',
    progress: 15,
    timeline: [
      { stage: '订单确认', date: '2024-12-01', location: '青岛', status: 'completed', icon: '✓' },
      { stage: '备货中', date: '进行中', location: '青岛', status: 'in_progress', icon: '📦' },
      { stage: '计划装船', date: '2024-12-10', location: '青岛港', status: 'pending', icon: '🚢' },
      { stage: '预计到港', date: '2024-12-28', location: '汉堡港', status: 'pending', icon: '🏁' },
    ],
    cargo: {
      type: '家具',
      quantity: 800,
      weight: 35.2,
      value: 68,
    },
    documents: [
      { name: '商业发票', status: 'uploaded' },
      { name: '提单', status: 'pending' },
    ],
  },

  // 数据5：运输中 - 另一个
  'PO#12346': {
    poNumber: 'PO#12346',
    containerNumber: 'MAEU5566778',
    status: 'in_transit',
    origin: '厦门港',
    destination: '长滩港',
    carrier: 'Maersk (马士基)',
    departureDate: '2024-11-28',
    etaDate: '2024-12-18',
    progress: 45,
    timeline: [
      { stage: '订单确认', date: '2024-11-20', location: '厦门', status: 'completed', icon: '✓' },
      { stage: '货物装船', date: '2024-11-28', location: '厦门港', status: 'completed', icon: '📦' },
      { stage: '离港', date: '2024-11-29', location: '厦门港', status: 'completed', icon: '🚢' },
      { stage: '运输中', date: '进行中', location: '太平洋', status: 'in_progress', icon: '🌊' },
      { stage: '预计到港', date: '2024-12-18', location: '长滩港', status: 'pending', icon: '🏁' },
    ],
    cargo: {
      type: '服装鞋帽',
      quantity: 2500,
      weight: 15.6,
      value: 120,
    },
    documents: [
      { name: '提单', status: 'approved' },
      { name: '商业发票', status: 'approved' },
      { name: '质检报告', status: 'approved' },
    ],
  },
};

// ============================================================
// Mock数据：批量查询结果
// ============================================================

// 30天趋势数据
const generateTrendData = (): TrendDataPoint[] => {
  const data: TrendDataPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    data.push({
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      orders: Math.floor(Math.random() * 8) + 3,
      delayed: Math.floor(Math.random() * 3),
    });
  }
  return data;
};

export const mockBatchResults: Record<string, BatchQueryResult> = {
  // Nike客户查询
  nike: {
    customer: 'Nike',
    totalCount: 8,
    statusBreakdown: {
      in_transit: 3,
      delayed: 2,
      arrived: 2,
      pending: 1,
    },
    orders: [
      mockShipmentDetails['PO#12345'],
      mockShipmentDetails['PO#12347'],
      mockShipmentDetails['PO#12340'],
      mockShipmentDetails['PO#12350'],
      mockShipmentDetails['PO#12346'],
    ],
    analytics: {
      avgDeliveryTime: 18,
      delayRate: 25,
      topCarrier: 'COSCO',
      totalValue: 650,
    },
    trendData: generateTrendData(),
  },

  // 洛杉矶目的地查询
  '洛杉矶': {
    destination: '洛杉矶',
    totalCount: 5,
    statusBreakdown: {
      in_transit: 2,
      delayed: 1,
      arrived: 1,
      pending: 1,
    },
    orders: [
      mockShipmentDetails['PO#12345'],
      mockShipmentDetails['PO#12346'],
      mockShipmentDetails['PO#12340'],
    ],
    analytics: {
      avgDeliveryTime: 15,
      delayRate: 20,
      topCarrier: 'COSCO',
      totalValue: 320,
    },
    trendData: generateTrendData(),
  },

  // 延误订单查询
  delayed: {
    totalCount: 3,
    statusBreakdown: {
      in_transit: 0,
      delayed: 3,
      arrived: 0,
      pending: 0,
    },
    orders: [mockShipmentDetails['PO#12347']],
    analytics: {
      avgDeliveryTime: 22,
      delayRate: 100,
      topCarrier: 'MSC',
      totalValue: 180,
    },
    trendData: generateTrendData(),
  },

  // 默认查询（所有订单）
  all: {
    totalCount: 12,
    statusBreakdown: {
      in_transit: 5,
      delayed: 2,
      arrived: 3,
      pending: 2,
    },
    orders: Object.values(mockShipmentDetails),
    analytics: {
      avgDeliveryTime: 17,
      delayRate: 17,
      topCarrier: 'COSCO',
      totalValue: 850,
    },
    trendData: generateTrendData(),
  },
};

// ============================================================
// 建议操作配置
// ============================================================

export const suggestedActionsForPO: SuggestedAction[] = [
  { id: '1', label: '查看详细运输轨迹', icon: '📍', action: 'view_trajectory' },
  { id: '2', label: '查看货物保险信息', icon: '🛡️', action: 'view_insurance' },
  { id: '3', label: '设置到达提醒', icon: '🔔', action: 'set_reminder' },
  { id: '4', label: '查询同批次其他订单', icon: '📦', action: 'view_batch' },
];

export const suggestedActionsForBatch: SuggestedAction[] = [
  { id: '1', label: '查看延误订单详情', icon: '⚠️', action: 'view_delayed' },
  { id: '2', label: '对比承运商表现', icon: '📊', action: 'compare_carriers' },
  { id: '3', label: '导出订单报表', icon: '📄', action: 'export_report' },
  { id: '4', label: '设置批量提醒', icon: '🔔', action: 'set_batch_reminder' },
];

export const suggestedActionsForDelayed: SuggestedAction[] = [
  { id: '1', label: '联系承运商', icon: '📞', action: 'contact_carrier' },
  { id: '2', label: '通知收货方', icon: '✉️', action: 'notify_receiver' },
  { id: '3', label: '查看替代方案', icon: '🔄', action: 'view_alternatives' },
  { id: '4', label: '申请延误补偿', icon: '💰', action: 'claim_compensation' },
];

export const defaultSuggestedActions: SuggestedAction[] = [
  { id: '1', label: '查询其他订单', icon: '🔍', action: 'new_query' },
  { id: '2', label: '设置提醒', icon: '🔔', action: 'set_reminder' },
  { id: '3', label: '导出报告', icon: '📄', action: 'export_report' },
  { id: '4', label: '联系客服', icon: '💬', action: 'contact_support' },
];

// ============================================================
// 快捷查询示例
// ============================================================

export const quickExamples = [
  {
    id: '1',
    title: '查询PO单号',
    query: 'PO#12345',
    icon: '📦',
    description: '输入PO单号查询货物详情',
  },
  {
    id: '2',
    title: 'Nike订单概览',
    query: 'Nike的所有订单',
    icon: '👟',
    description: '查看Nike客户的全部订单',
  },
  {
    id: '3',
    title: '延误订单',
    query: '哪些订单延误了？',
    icon: '⚠️',
    description: '筛选并查看延误的货物',
  },
  {
    id: '4',
    title: '目的地查询',
    query: '发往洛杉矶的货物',
    icon: '🌴',
    description: '按目的地筛选订单',
  },
];

// ============================================================
// AI回答模板生成函数
// ============================================================

export function generatePOResponseContent(shipment: ShipmentDetail): string {
  const statusEmoji = {
    pending: '⏳',
    in_transit: '🚢',
    delayed: '⚠️',
    arrived: '✅',
  };

  const statusText = {
    pending: '待发货',
    in_transit: '运输中',
    delayed: '延误中',
    arrived: '已到达',
  };

  // 计算剩余天数
  const etaDate = new Date(shipment.etaDate);
  const today = new Date();
  const daysRemaining = Math.ceil((etaDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  let content = '';

  if (shipment.status === 'delayed') {
    content = `⚠️ 订单 **${shipment.poNumber}** 当前有延误

**🚨 延误信息**
- 延误原因：${shipment.delayReason}
- 延误时长：**${shipment.delayDays}天**
- 原ETA：${shipment.etaDate}
- 新ETA：**${shipment.actualDate}**

**📦 货物信息**
- 类型：${shipment.cargo.type}
- 数量：${shipment.cargo.quantity}件
- 出发地：${shipment.origin} → 目的地：${shipment.destination}
- 承运商：${shipment.carrier}

**📅 当前进度**：**${shipment.progress}%** 完成（${statusText[shipment.status]}）

**📋 文档状态**
${shipment.documents.map(doc => `${doc.status === 'approved' ? '✓' : '⏳'} ${doc.name} (${doc.status === 'approved' ? '已审批' : '待审批'})`).join('\n')}`;
  } else if (shipment.status === 'arrived') {
    content = `✅ 订单 **${shipment.poNumber}** 已顺利到达

**📦 货物信息**
- 类型：${shipment.cargo.type}
- 数量：${shipment.cargo.quantity}件
- 重量：${shipment.cargo.weight}吨
- 货值：${shipment.cargo.value}万美元

**🚢 运输信息**
- 出发地：${shipment.origin} → 目的地：${shipment.destination}
- 承运商：${shipment.carrier}
- 集装箱号：${shipment.containerNumber}

**📅 时间信息**
- 离港日期：${shipment.departureDate}
- 预计到达：${shipment.etaDate}
- 实际到达：**${shipment.actualDate}** ${shipment.actualDate && shipment.actualDate < shipment.etaDate ? '(提前1天) 🎉' : ''}

**📋 文档状态**
${shipment.documents.map(doc => `✓ ${doc.name} (已审批)`).join('\n')}

✨ 货物已完成全部运输流程`;
  } else {
    content = `✅ 已找到订单 **${shipment.poNumber}**

**📦 货物信息**
- 类型：${shipment.cargo.type}
- 数量：${shipment.cargo.quantity}件
- 重量：${shipment.cargo.weight}吨
- 货值：${shipment.cargo.value}万美元

**🚢 运输状态**：${statusText[shipment.status]} ${statusEmoji[shipment.status]}
- 出发地：${shipment.origin} → 目的地：${shipment.destination}
- 承运商：${shipment.carrier}
- 集装箱号：${shipment.containerNumber}

**📅 时间信息**
- 离港日期：${shipment.departureDate}
- 预计到达：${shipment.etaDate} (还有 **${daysRemaining > 0 ? daysRemaining : 0}天**)
- 当前进度：**${shipment.progress}%** 完成

**📋 文档状态**
${shipment.documents.map(doc => `${doc.status === 'approved' ? '✓' : '⏳'} ${doc.name} (${doc.status === 'approved' ? '已审批' : doc.status === 'pending' ? '待审批' : '已上传'})`).join('\n')}

✨ 一切正常，无延误风险`;
  }

  return content;
}

export function generateBatchResponseContent(result: BatchQueryResult): string {
  const title = result.customer
    ? `📊 为您找到 **${result.customer}** 的 **${result.totalCount}个** 活跃订单`
    : result.destination
    ? `📊 为您找到发往 **${result.destination}** 的 **${result.totalCount}个** 订单`
    : `📊 找到 **${result.totalCount}个** 延误订单`;

  const { statusBreakdown, analytics } = result;

  let content = `${title}

**📈 状态概览**
🚢 运输中：${statusBreakdown.in_transit}个
⚠️ 延误：${statusBreakdown.delayed}个
✅ 已到达：${statusBreakdown.arrived}个
⏳ 待发货：${statusBreakdown.pending}个

**📉 运营分析**
- 平均运输时间：${analytics.avgDeliveryTime}天
- 延误率：${analytics.delayRate}% ${analytics.delayRate > 15 ? '(高于行业平均15%)' : '(行业平均：15%)'}
- 最常用承运商：${analytics.topCarrier}
- 总货值：${analytics.totalValue}万美元

---

**🔍 重点订单**

`;

  // 添加前3个订单摘要
  result.orders.slice(0, 3).forEach((order, index) => {
    const statusIcon = order.status === 'delayed' ? '⚠️' : order.status === 'arrived' ? '✅' : '🚢';
    const etaDate = new Date(order.etaDate);
    const today = new Date();
    const daysRemaining = Math.ceil((etaDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    content += `**${index + 1}. ${order.poNumber}** - ${statusIcon} ${
      order.status === 'delayed'
        ? `已延误${order.delayDays}天`
        : order.status === 'arrived'
        ? '已到达'
        : `预计 ${daysRemaining}天后到达`
    }
   ${order.origin} → ${order.destination} | 进度${order.progress}%

`;
  });

  return content;
}
