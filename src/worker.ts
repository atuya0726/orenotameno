import { z } from 'zod';
import { explanationInputSchema } from './features/glossary/model';
import { termById } from './features/glossary/terms';
import { DEFAULT_MODEL, EvaluationError, evaluateWithOpenAI, GRADING_POLICY_VERSION } from './server/glossary-evaluator';

export type Env = {
  OPENAI_API_KEY?: string; OPENAI_MODEL?: string;
  ASSETS?: { fetch: (request: Request) => Promise<Response> };
};
const inputSchema = z.object({ termId: z.string(), text: explanationInputSchema }).strict();
const json = (body: unknown, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Glossary-Policy': GRADING_POLICY_VERSION } });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/')) return env.ASSETS ? env.ASSETS.fetch(request) : new Response('Not found', { status: 404 });
    if (url.pathname !== '/api/glossary/evaluate') return json({ error: 'APIが見つかりません。' }, 404);
    if (request.method !== 'POST') return json({ error: 'POSTで送信してください。' }, 405);
    const origin = request.headers.get('Origin');
    if ((origin && origin !== url.origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site') return json({ error: 'このサイトの画面から評価してください。' }, 403);
    if (!request.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return json({ error: 'JSON形式で送信してください。' }, 415);
    const started = Date.now();
    let evaluatedTermId: string | undefined;
    try {
      // Bound the body as it arrives; a missing/forged Content-Length cannot bypass the limit.
      const reader = request.body?.getReader();
      if (!reader) return json({ error: '説明を入力してください。' }, 400);
      const chunks: Uint8Array[] = []; let size = 0;
      while (true) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > 32_000) { await reader.cancel(); return json({ error: '説明が長すぎます。1,000文字以内で入力してください。' }, 413); } chunks.push(value); }
      const bytes = new Uint8Array(size); let offset = 0;
      for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
      let body: unknown;
      try { body = JSON.parse(new TextDecoder().decode(bytes)); } catch { return json({ error: '入力した説明を読み込めませんでした。' }, 400); }
      const input = inputSchema.safeParse(body);
      if (!input.success) return json({ error: '用語と10〜1,000文字の説明を送信してください。' }, 400);
      const term = termById.get(input.data.termId);
      if (!term) return json({ error: '用語が見つかりません。' }, 404);
      evaluatedTermId = term.id;
      if (!env.OPENAI_API_KEY?.trim()) return json({ error: 'AI評価の接続設定がまだありません。説明はブラウザに保存されているので、設定後に続けられます。' }, 503);
      return json(await evaluateWithOpenAI(term, input.data.text, env.OPENAI_API_KEY, env.OPENAI_MODEL || DEFAULT_MODEL));
    } catch (error) {
      const status = error instanceof EvaluationError ? error.status : 500;
      const code = error instanceof EvaluationError ? error.code : 'AI_INTERNAL_ERROR';
      const message = error instanceof EvaluationError ? error.message : 'AIの評価中にエラーが発生しました。入力した説明は残っています。';
      const reference = crypto.randomUUID().slice(0, 8);
      // Never log learner text, custom term names, API keys, or upstream response bodies.
      console.error(JSON.stringify({ event: 'glossary_evaluation_failed', reference, code, status, upstreamStatus: error instanceof EvaluationError ? error.upstreamStatus : undefined, termId: evaluatedTermId, elapsedMs: Date.now() - started }));
      return json({ error: `${message}（確認番号: ${reference}）`, code, reference }, status);
    }
  },
};
