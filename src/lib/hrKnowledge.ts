import fs from 'fs/promises';
import path from 'path';
import mammoth from 'mammoth';

interface KnowledgeChunk {
  text: string;
  source: string;
  keywords: string[];
}

let cachedChunks: KnowledgeChunk[] | null = null;

function normalizeText(input: string): string {
  return input.replace(/\s+/g, ' ').trim();
}

function splitChunks(text: string, size = 800): string[] {
  const normalized = normalizeText(text);
  if (!normalized) return [];

  const chunks: string[] = [];
  for (let index = 0; index < normalized.length; index += size) {
    chunks.push(normalized.slice(index, index + size));
  }
  return chunks;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9\u4e00-\u9fa5]+/g)
    .map((item) => item.trim())
    .filter((item) => item.length > 1);
}

async function parseDocx(filePath: string): Promise<string> {
  const fileBuffer = await fs.readFile(filePath);
  const result = await mammoth.extractRawText({ buffer: fileBuffer });
  return result.value || '';
}

async function loadKnowledgeChunks(): Promise<KnowledgeChunk[]> {
  if (cachedChunks) {
    return cachedChunks;
  }

  const policyDir = path.join(process.cwd(), 'HR_policy');
  const fileNames = await fs.readdir(policyDir);
  const docxFiles = fileNames.filter((name) => name.toLowerCase().endsWith('.docx'));

  const allChunks: KnowledgeChunk[] = [];

  for (const fileName of docxFiles) {
    const fullPath = path.join(policyDir, fileName);
    const content = await parseDocx(fullPath);
    const chunks = splitChunks(content, 800);
    for (const chunk of chunks) {
      allChunks.push({
        text: chunk,
        source: fileName,
        keywords: tokenize(chunk),
      });
    }
  }

  cachedChunks = allChunks;
  return allChunks;
}

function scoreChunk(queryTokens: string[], chunk: KnowledgeChunk): number {
  const tokenSet = new Set(chunk.keywords);
  let score = 0;
  for (const token of queryTokens) {
    if (tokenSet.has(token)) {
      score += 1;
    }
  }
  return score;
}

export async function retrieveHRContext(query: string): Promise<string> {
  const chunks = await loadKnowledgeChunks();
  if (!chunks.length) {
    return '';
  }

  const queryTokens = tokenize(query);
  const ranked = chunks
    .map((chunk) => ({ chunk, score: scoreChunk(queryTokens, chunk) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ chunk }) => `来源: ${chunk.source}\n${chunk.text}`);

  return ranked.join('\n\n---\n\n');
}
