// ============================================================
// MOOV AI 物流助手 - 对话状态管理Hook
// ============================================================

import { useState, useCallback } from 'react';
import { ShipmentDetail, BatchQueryResult, SuggestedAction } from '@/utils/mockData';

// 对话消息类型
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  data?: ShipmentDetail | BatchQueryResult;
  suggestedActions?: SuggestedAction[];
  responseType?: 'po_detail' | 'batch_result' | 'action_response' | 'error';
}

// 对话状态
export interface ConversationState {
  messages: Message[];
  isLoading: boolean;
  currentContext?: ShipmentDetail | BatchQueryResult;
  conversationStage: number;
}

// Hook返回类型
export interface UseConversationReturn {
  messages: Message[];
  isLoading: boolean;
  currentContext?: ShipmentDetail | BatchQueryResult;
  sendMessage: (content: string) => Promise<void>;
  handleAction: (action: string) => Promise<void>;
  resetConversation: () => void;
  hasMessages: boolean;
}

// 生成唯一ID
function generateId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

async function callChatBackend(query: string) {
  const response = await fetch('/api/dify-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody?.message || '调用后端失败，请稍后重试');
  }

  return response.json();
}

export function useConversation(): UseConversationReturn {
  const [state, setState] = useState<ConversationState>({
    messages: [],
    isLoading: false,
    currentContext: undefined,
    conversationStage: 0,
  });

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const result = await callChatBackend(content.trim());

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: result.content || '后端未返回内容',
        timestamp: new Date(),
        data: result.data,
        suggestedActions: result.suggestedActions,
        responseType: result.responseType || 'action_response',
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        currentContext: result.data,
        conversationStage: prev.conversationStage + 1,
      }));
    } catch (error: any) {
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: `❌ 出错了：${error?.message || '未知错误'}`,
        timestamp: new Date(),
        responseType: 'error',
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    }
  }, []);

  // 处理建议操作
  const handleAction = useCallback(
    async (action: string) => {
      // 简单复用同一后端接口，未来可扩展到特定动作
      await sendMessage(action);
    },
    [sendMessage]
  );

  // 重置对话
  const resetConversation = useCallback(() => {
    setState({
      messages: [],
      isLoading: false,
      currentContext: undefined,
      conversationStage: 0,
    });
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    currentContext: state.currentContext,
    sendMessage,
    handleAction,
    resetConversation,
    hasMessages: state.messages.length > 0,
  };
}

export default useConversation;

