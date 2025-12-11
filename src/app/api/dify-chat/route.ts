'use server';

import { NextRequest, NextResponse } from 'next/server';

const DIFY_BASE_URL = process.env.DIFY_BASE_URL || 'https://api.dify.ai/v1';
const DIFY_WORKFLOW_ID = process.env.DIFY_WORKFLOW_ID || 'app-gl0ctQj0y6go5V9RoNDhr9VR';
const DIFY_CHAT_APP_ID = process.env.DIFY_CHAT_APP_ID || 'app-DKqa5oYRshjwrAxlCYFeRMPR';
const DIFY_API_KEY = process.env.DIFY_API_KEY;

const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-5';
const AZURE_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview';

async function callDify(query: string) {
  if (!DIFY_API_KEY) {
    throw new Error('后端未配置 DIFY_API_KEY，请在 .env.local 中设置');
  }

  const url = `${DIFY_BASE_URL}/workflows/${DIFY_WORKFLOW_ID}/run`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DIFY_API_KEY}`,
    },
    body: JSON.stringify({
      inputs: { query },
      response_mode: 'blocking',
      user: 'moov-demo',
    }),
    cache: 'no-store',
  });

  const data = await resp.json();
  if (!resp.ok) {
    const message = data?.message || data?.error || 'Dify 调用失败';
    throw new Error(message);
  }

  const content =
    data?.data?.outputs?.text ||
    data?.data?.outputs?.output ||
    data?.outputs?.text ||
    data?.text ||
    'Dify 未返回文本内容';

  return {
    content,
    data: data?.data?.outputs,
    responseType: 'action_response',
  };
}

async function callDifyChat(query: string, conversationId?: string) {
  if (!DIFY_API_KEY) {
    throw new Error('后端未配置 DIFY_API_KEY，请在 .env.local 中设置');
  }

  const url = `${DIFY_BASE_URL}/chat-messages`;
  const body: any = {
    inputs: {},
    query: query,
    response_mode: 'streaming', // Agent Chat App 必须使用 streaming 模式
    user: 'moov-demo',
  };

  // 如果有 conversation_id，则传入以保持对话连续性
  if (conversationId) {
    body.conversation_id = conversationId;
  }

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DIFY_API_KEY}`,
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!resp.ok) {
    const errorData = await resp.json().catch(() => ({}));
    const message = errorData?.message || errorData?.error || 'Dify 对话调用失败';
    throw new Error(message);
  }

  // 处理流式响应 (Server-Sent Events)
  const reader = resp.body?.getReader();
  const decoder = new TextDecoder();
  let fullContent = '';
  let newConversationId = conversationId;
  let buffer = '';

  if (!reader) {
    throw new Error('无法读取响应流');
  }

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      
      // 保留最后一个不完整的行
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;

        // 处理 SSE 格式: event: xxx 或 data: {...}
        if (line.startsWith('event:')) {
          // 跳过 event 行，我们主要关注 data
          continue;
        } else if (line.startsWith('data:')) {
          const dataStr = line.substring(5).trim();
          if (!dataStr || dataStr === '[DONE]') continue;

          try {
            const data = JSON.parse(dataStr);
            
            // 提取答案内容 - 尝试多个可能的字段
            if (data.answer !== undefined) {
              // 如果是增量内容，累加；如果是完整内容，替换
              if (typeof data.answer === 'string') {
                fullContent += data.answer;
              }
            } else if (data.message?.answer) {
              fullContent += data.message.answer;
            } else if (data.text) {
              fullContent += data.text;
            } else if (data.content) {
              fullContent += data.content;
            }
            
            // 提取 conversation_id
            if (data.conversation_id) {
              newConversationId = data.conversation_id;
            } else if (data.id) {
              // 有些情况下 id 就是 conversation_id
              newConversationId = data.id;
            }
            
            // 处理错误
            if (data.event === 'error' || data.status === 'error') {
              throw new Error(data.message || data.error || 'Dify 返回错误');
            }
          } catch (e) {
            // 忽略 JSON 解析错误（可能是部分数据或格式问题）
            if (e instanceof SyntaxError) {
              // 可能是数据不完整，继续处理下一行
              continue;
            }
            throw e;
          }
        }
      }
    }
    
    // 处理最后剩余的数据
    if (buffer.trim()) {
      if (buffer.startsWith('data:')) {
        const dataStr = buffer.substring(5).trim();
        if (dataStr && dataStr !== '[DONE]') {
          try {
            const data = JSON.parse(dataStr);
            if (data.answer) fullContent += data.answer;
            if (data.conversation_id) newConversationId = data.conversation_id;
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  return {
    content: fullContent || 'Dify 未返回文本内容',
    conversationId: newConversationId,
    data: {},
    responseType: 'action_response' as const,
  };
}

async function callAzure(query: string) {
  if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
    throw new Error('后端未配置 Azure OpenAI，请在 .env.local 中设置');
  }

  const url = `${AZURE_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': AZURE_API_KEY,
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: '你是荷瑞物流平台的正式风格助手，请使用中文回答，并保持简洁。',
        },
        { role: 'user', content: query },
      ],
      temperature: 0.3,
      max_tokens: 800,
    }),
    cache: 'no-store',
  });

  const data = await resp.json();
  if (!resp.ok) {
    const message = data?.message || data?.error?.message || 'Azure 调用失败';
    throw new Error(message);
  }

  const content =
    data?.choices?.[0]?.message?.content || 'Azure 未返回内容';

  return {
    content,
    data,
    responseType: 'action_response' as const,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = body?.query?.trim();
    const provider = body?.provider || 'dify';
    const conversationId = body?.conversationId; // 对话型应用需要 conversation_id

    if (!query) {
      return NextResponse.json({ message: '缺少 query 参数' }, { status: 400 });
    }

    let result;
    if (provider === 'azure') {
      result = await callAzure(query);
    } else if (provider === 'dify-chat') {
      // 对话型应用
      result = await callDifyChat(query, conversationId);
    } else {
      // 工作流应用
      result = await callDify(query);
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || '服务端异常',
      },
      { status: 500 }
    );
  }
}

