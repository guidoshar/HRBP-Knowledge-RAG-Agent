// ============================================================
// MOOV AI 物流助手 - 智能意图识别
// ============================================================

import {
  mockShipmentDetails,
  mockBatchResults,
  ShipmentDetail,
  BatchQueryResult,
  suggestedActionsForPO,
  suggestedActionsForBatch,
  suggestedActionsForDelayed,
  defaultSuggestedActions,
  generatePOResponseContent,
  generateBatchResponseContent,
  SuggestedAction,
} from './mockData';

// 意图类型
export type IntentType = 'po_query' | 'batch_query' | 'action' | 'unknown';

// 意图识别结果
export interface IntentResult {
  type: IntentType;
  params: {
    poNumber?: string;
    customer?: string;
    destination?: string;
    status?: string;
    action?: string;
  };
  confidence: number; // 置信度 0-1
}

// 查询响应
export interface QueryResponse {
  type: 'po_detail' | 'batch_result' | 'action_response' | 'error';
  content: string;
  data?: ShipmentDetail | BatchQueryResult;
  suggestedActions: SuggestedAction[];
}

// ============================================================
// 意图识别函数
// ============================================================

export function detectQueryIntent(input: string): IntentResult {
  const cleaned = input.trim();
  const lowerCased = cleaned.toLowerCase();

  // 场景1：PO号查询
  // 匹配 PO#12345, PO 12345, PO12345, 12345
  const poPattern = /po[#\s]*(\d+)|^(\d{5,})$/i;
  const poMatch = cleaned.match(poPattern);
  if (poMatch) {
    const poNumber = poMatch[1] || poMatch[2];
    return {
      type: 'po_query',
      params: { poNumber: `PO#${poNumber}` },
      confidence: 0.95,
    };
  }

  // 检查是否包含"订单"、"单号"等关键词 + 数字
  const orderKeywordPattern = /(订单|单号|货物|集装箱)[^\d]*(\d{4,})/;
  const orderMatch = cleaned.match(orderKeywordPattern);
  if (orderMatch) {
    return {
      type: 'po_query',
      params: { poNumber: `PO#${orderMatch[2]}` },
      confidence: 0.85,
    };
  }

  // 场景2：客户名称查询
  const customerNames = ['nike', 'adidas', 'apple', 'samsung', 'zara', 'h&m', 'uniqlo'];
  const foundCustomer = customerNames.find((name) => lowerCased.includes(name));
  if (foundCustomer) {
    return {
      type: 'batch_query',
      params: { customer: foundCustomer },
      confidence: 0.9,
    };
  }

  // 场景3：目的地查询
  const locations = [
    '洛杉矶',
    '纽约',
    '鹿特丹',
    '汉堡',
    '新加坡',
    '东京',
    '长滩',
    'los angeles',
    'new york',
    'rotterdam',
    'hamburg',
  ];
  const foundLocation = locations.find((loc) => lowerCased.includes(loc.toLowerCase()));
  if (foundLocation) {
    // 标准化位置名称
    const normalizedLocation = foundLocation.toLowerCase().includes('los')
      ? '洛杉矶'
      : foundLocation.toLowerCase().includes('new')
      ? '纽约'
      : foundLocation;
    return {
      type: 'batch_query',
      params: { destination: normalizedLocation },
      confidence: 0.85,
    };
  }

  // 场景4：状态查询 - 延误
  if (
    lowerCased.includes('延误') ||
    lowerCased.includes('delay') ||
    lowerCased.includes('延迟') ||
    lowerCased.includes('晚了')
  ) {
    return {
      type: 'batch_query',
      params: { status: 'delayed' },
      confidence: 0.9,
    };
  }

  // 场景5：查询所有订单
  if (
    lowerCased.includes('所有') ||
    lowerCased.includes('全部') ||
    lowerCased.includes('all') ||
    lowerCased.includes('概览') ||
    lowerCased.includes('什么时候到')
  ) {
    return {
      type: 'batch_query',
      params: { status: 'all' },
      confidence: 0.75,
    };
  }

  // 未识别
  return {
    type: 'unknown',
    params: {},
    confidence: 0.3,
  };
}

// ============================================================
// 查询处理函数
// ============================================================

export function processQuery(input: string): QueryResponse {
  const intent = detectQueryIntent(input);

  switch (intent.type) {
    case 'po_query': {
      const poNumber = intent.params.poNumber || '';
      const shipment = mockShipmentDetails[poNumber];

      if (shipment) {
        return {
          type: 'po_detail',
          content: generatePOResponseContent(shipment),
          data: shipment,
          suggestedActions:
            shipment.status === 'delayed' ? suggestedActionsForDelayed : suggestedActionsForPO,
        };
      } else {
        // 尝试模糊匹配
        const availablePOs = Object.keys(mockShipmentDetails);
        const fuzzyMatch = availablePOs.find((po) =>
          po.toLowerCase().includes(poNumber.replace('PO#', '').toLowerCase())
        );

        if (fuzzyMatch) {
          const matchedShipment = mockShipmentDetails[fuzzyMatch];
          return {
            type: 'po_detail',
            content: generatePOResponseContent(matchedShipment),
            data: matchedShipment,
            suggestedActions:
              matchedShipment.status === 'delayed'
                ? suggestedActionsForDelayed
                : suggestedActionsForPO,
          };
        }

        return {
          type: 'error',
          content: `❌ 未找到订单 **${poNumber}**

请检查单号是否正确，或尝试以下方式查询：
- 输入完整的PO单号（如：PO#12345）
- 输入集装箱号
- 描述您的货物信息

**可用的示例单号**：${availablePOs.join('、')}`,
          suggestedActions: defaultSuggestedActions,
        };
      }
    }

    case 'batch_query': {
      let result: BatchQueryResult | undefined;
      const { customer, destination, status } = intent.params;

      if (customer) {
        result = mockBatchResults[customer.toLowerCase()] || mockBatchResults['all'];
        if (result) result.customer = customer.toUpperCase();
      } else if (destination) {
        result = mockBatchResults[destination] || mockBatchResults['all'];
        if (result) result.destination = destination;
      } else if (status === 'delayed') {
        result = mockBatchResults['delayed'];
      } else {
        result = mockBatchResults['all'];
      }

      if (result) {
        return {
          type: 'batch_result',
          content: generateBatchResponseContent(result),
          data: result,
          suggestedActions:
            status === 'delayed' ? suggestedActionsForDelayed : suggestedActionsForBatch,
        };
      }

      return {
        type: 'error',
        content: '❌ 未找到相关订单，请尝试其他查询条件。',
        suggestedActions: defaultSuggestedActions,
      };
    }

    case 'unknown':
    default: {
      // 智能猜测用户意图
      const lowerInput = input.toLowerCase();
      
      // 如果包含数字，可能是想查PO号
      const hasNumbers = /\d+/.test(input);
      if (hasNumbers) {
        const numbers = input.match(/\d+/);
        if (numbers) {
          return processQuery(`PO#${numbers[0]}`);
        }
      }

      return {
        type: 'error',
        content: `🤔 我不太理解您的问题："${input}"

您可以尝试：
- **查询单个订单**：输入 PO#12345 或 12345
- **查询客户订单**：输入 "Nike的订单" 或 "Adidas所有货物"
- **查询目的地**：输入 "发往洛杉矶的货物"
- **查询延误**：输入 "哪些订单延误了"

💡 **提示**：直接输入数字也可以查询订单哦！`,
        suggestedActions: defaultSuggestedActions,
      };
    }
  }
}

// ============================================================
// 动作处理函数
// ============================================================

export function processAction(action: string, context?: ShipmentDetail | BatchQueryResult): QueryResponse {
  switch (action) {
    case 'view_trajectory':
      return {
        type: 'action_response',
        content: `📍 **详细运输轨迹**

正在加载实时GPS追踪数据...

当前货物位于 **太平洋中部**
- 经度：-150.234°
- 纬度：23.456°
- 航速：18节
- 预计剩余航程：5,200海里

🗺️ 轨迹地图功能即将上线，敬请期待！`,
        suggestedActions: defaultSuggestedActions,
      };

    case 'view_insurance':
      return {
        type: 'action_response',
        content: `🛡️ **货物保险信息**

**保险类型**：综合物流保险
**保险公司**：中国平安
**保单号**：PA2024120001
**保险金额**：100万美元
**保险期限**：2024-12-01 至 2024-12-31

**承保范围**：
✓ 运输途中货物损失
✓ 自然灾害
✓ 船舶沉没
✓ 盗窃抢劫

如需理赔，请联系：insurance@moov.com`,
        suggestedActions: defaultSuggestedActions,
      };

    case 'set_reminder':
      return {
        type: 'action_response',
        content: `🔔 **提醒设置成功！**

已为您设置以下提醒：
- 📧 到达前3天邮件提醒
- 📱 到达当天短信提醒
- ⚠️ 状态异常实时推送

提醒将发送至：user@example.com

您可以在个人中心修改提醒设置。`,
        suggestedActions: defaultSuggestedActions,
      };

    case 'contact_carrier':
      return {
        type: 'action_response',
        content: `📞 **承运商联系方式**

**COSCO (中远海运)**
- 客服热线：400-888-6000
- 邮箱：service@cosco.com
- 在线客服：www.cosco.com/chat

**MSC (地中海航运)**
- 客服热线：400-820-8888
- 邮箱：info@msc.com

需要我帮您发起联系吗？`,
        suggestedActions: defaultSuggestedActions,
      };

    case 'export_report':
      return {
        type: 'action_response',
        content: `📄 **报表导出**

正在生成订单报表...

✓ 数据收集完成
✓ 图表生成完成
✓ PDF格式化完成

📥 下载链接已发送至您的邮箱！

报表包含：
- 订单状态汇总
- 运输时效分析
- 承运商对比
- 延误风险预警`,
        suggestedActions: defaultSuggestedActions,
      };

    case 'new_query':
      return {
        type: 'action_response',
        content: `🔍 **开始新查询**

请输入您想查询的内容：
- PO单号（如：PO#12345）
- 客户名称（如：Nike）
- 目的地（如：洛杉矶）
- 或用自然语言描述`,
        suggestedActions: defaultSuggestedActions,
      };

    default:
      return {
        type: 'action_response',
        content: `✨ **功能开发中**

该功能正在紧锣密鼓地开发中，即将上线！

感谢您的耐心等待 🙏`,
        suggestedActions: defaultSuggestedActions,
      };
  }
}

