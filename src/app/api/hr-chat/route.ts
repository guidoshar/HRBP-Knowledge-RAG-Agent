import { NextRequest, NextResponse } from 'next/server';
import { retrieveHRContext } from '@/lib/hrKnowledge';

/* ─── Read from environment (server-side only, never sent to browser) ─── */
const AZURE_ENDPOINT   = (process.env.AZURE_OPENAI_ENDPOINT ?? '').replace(/\/$/, '');
const AZURE_API_KEY    = process.env.AZURE_OPENAI_API_KEY ?? '';
const AZURE_DEPLOYMENT = process.env.AZURE_OPENAI_DEPLOYMENT ?? 'gpt-5';
const AZURE_API_VER    = process.env.AZURE_OPENAI_API_VERSION ?? '2025-01-01-preview';

function buildSystemPrompt(context: string): string {
  return [
    '你是 SharkNinja 的 HRBP 智能助手，专门解答员工 HR 相关政策问题。',
    '请用专业、清晰、可执行的中文回答，适当使用 Markdown 格式（加粗、列表、表格等）便于阅读。',
    '回答依据：仅限以下 HR_Policy 知识库片段，严禁编造或推测政策条款。',
    '若知识库无明确依据，请说明"HR_Policy 中未找到明确记载"，并建议联系 HR 部门确认。',
    '',
    '=== HR_Policy 知识库片段 ===',
    context || '（本次查询未检索到匹配的知识库片段）',
    '===',
  ].join('\n');
}

export async function POST(req: NextRequest) {
  try {
    /* 检查配置 */
    if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
      return NextResponse.json(
        { message: '服务端未配置 Azure OpenAI 连接信息，请联系管理员' },
        { status: 503 },
      );
    }

    const body  = await req.json();
    const query = String(body?.query ?? '').trim();
    const history: Array<{ role?: string; content?: string }> = Array.isArray(body?.history)
      ? body.history
      : [];

    if (!query) {
      return NextResponse.json({ message: '缺少 query 参数' }, { status: 400 });
    }

    /* RAG：检索相关知识库片段 */
    const context = await retrieveHRContext(query);

    /* 构建对话历史（最多保留最近 8 条，避免超出 token 限制） */
    const messages = [
      { role: 'system', content: buildSystemPrompt(context) },
      ...history
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .slice(-8)
        .map(m => ({ role: m.role as string, content: String(m.content ?? '') })),
      { role: 'user', content: query },
    ];

    /* 调用 Azure OpenAI - GPT-5 不支持 temperature 参数，不传 */
    const url = `${AZURE_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VER}`;

    const azureResp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY,
      },
      body: JSON.stringify({
        messages,
        max_completion_tokens: 1500,
      }),
      cache: 'no-store',
    });

    const data = await azureResp.json();

    if (!azureResp.ok) {
      const errMsg = data?.error?.message ?? data?.message ?? `Azure 返回 ${azureResp.status}`;
      console.error('[hr-chat] Azure error:', errMsg);
      return NextResponse.json({ message: `AI 服务异常：${errMsg}` }, { status: 502 });
    }

    const content = data?.choices?.[0]?.message?.content ?? '未获取到有效回答';

    return NextResponse.json({ content, source: 'HR_Policy_RAG' });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '服务端未知异常';
    console.error('[hr-chat] error:', msg);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
