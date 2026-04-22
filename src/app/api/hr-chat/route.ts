import { NextRequest, NextResponse } from 'next/server';
import { retrieveHRContext } from '@/lib/hrKnowledge';

const AZURE_ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const AZURE_API_KEY = process.env.AZURE_OPENAI_API_KEY;
const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-5';
const AZURE_API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2025-01-01-preview';

function buildSystemPrompt(context: string): string {
  return [
    '你是 SharkNinja 的 HRBP 智能助手。',
    '请用专业、清晰、可执行的中文回答。',
    '你只能依据提供的 HR_Policy 知识库回答，严禁编造政策条款。',
    '若知识库无明确依据，请明确说明“在 HR_Policy 中未找到明确依据”，并给出下一步建议。',
    '',
    '以下是可用知识库片段：',
    context || '（暂无匹配知识片段）',
  ].join('\n');
}

export async function POST(req: NextRequest) {
  try {
    if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
      return NextResponse.json({ message: '后端未配置 Azure OpenAI 环境变量' }, { status: 500 });
    }

    const body = await req.json();
    const query = String(body?.query || '').trim();
    const history = Array.isArray(body?.history) ? body.history : [];

    if (!query) {
      return NextResponse.json({ message: '缺少 query 参数' }, { status: 400 });
    }

    const context = await retrieveHRContext(query);
    const url = `${AZURE_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;

    const messages = [
      { role: 'system', content: buildSystemPrompt(context) },
      ...history.slice(-8).map((item: { role?: string; content?: string }) => ({
        role: item.role === 'assistant' ? 'assistant' : 'user',
        content: String(item.content || ''),
      })),
      { role: 'user', content: query },
    ];

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY,
      },
      body: JSON.stringify({
        messages,
        max_tokens: 1200,
      }),
      cache: 'no-store',
    });

    const data = await resp.json();
    if (!resp.ok) {
      const message = data?.error?.message || data?.message || 'Azure 调用失败';
      throw new Error(message);
    }

    const content = data?.choices?.[0]?.message?.content || '未返回有效回答';

    return NextResponse.json({
      content,
      contextSource: 'HR_Policy',
    });
  } catch (error: any) {
    return NextResponse.json({ message: error?.message || '服务端异常' }, { status: 500 });
  }
}
