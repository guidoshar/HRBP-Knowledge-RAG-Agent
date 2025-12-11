// ============================================================
// MOOV AI 物流助手 - 对话状态管理Hook
// ============================================================

import { useState, useCallback } from 'react';
import {
  ShipmentDetail,
  BatchQueryResult,
  SuggestedAction,
} from '@/utils/mockData';
import { processQuery, processAction, QueryResponse } from '@/utils/intentDetection';

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

// 模拟AI思考延迟
function simulateThinkingDelay(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));
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

    // 添加用户消息
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

    // 模拟AI思考
    await simulateThinkingDelay();

    // 处理查询
    const response: QueryResponse = processQuery(content);

    // 创建AI响应消息
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      data: response.data,
      suggestedActions: response.suggestedActions,
      responseType: response.type,
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
      isLoading: false,
      currentContext: response.data,
      conversationStage: prev.conversationStage + 1,
    }));
  }, []);

  // 处理建议操作
  const handleAction = useCallback(async (action: string) => {
    // 添加用户操作消息（可选，可以不显示）
    setState((prev) => ({
      ...prev,
      isLoading: true,
    }));

    // 模拟处理延迟
    await simulateThinkingDelay();

    // 处理动作
    const response = processAction(action, state.currentContext);

    // 创建AI响应消息
    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: response.content,
      timestamp: new Date(),
      suggestedActions: response.suggestedActions,
      responseType: response.type,
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, assistantMessage],
      isLoading: false,
      conversationStage: prev.conversationStage + 1,
    }));
  }, [state.currentContext]);

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

