import { evaluationSchema, explanationInputSchema, type Evaluation, type Term } from './model';

// Only the current explanation leaves the browser. Credentials and model selection stay on the server.
export async function evaluateExplanation(term: Term, input: string): Promise<Evaluation> {
  const text = explanationInputSchema.parse(input);
  let response: Response;
  try {
    response = await fetch('/api/glossary/evaluate', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ termId: term.id, text }), signal: AbortSignal.timeout(60_000),
    });
  } catch {
    throw new Error('AIの評価を受け取れませんでした。入力した説明は残っています。通信状態を確認して再試行してください。');
  }
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = body && typeof body === 'object' && 'error' in body ? body.error : undefined;
    throw new Error(typeof error === 'string' ? error : 'AIの評価を取得できませんでした。文章を残したまま、もう一度お試しください。');
  }
  const parsed = evaluationSchema.safeParse(body);
  if (!parsed.success) throw new Error('AIからの評価を読み込めませんでした。説明は保存したまま再試行できます。');
  return parsed.data;
}
