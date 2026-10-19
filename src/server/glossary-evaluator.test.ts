import { afterEach, describe, expect, it, vi } from 'vitest';
import { evaluateWithOpenAI, parseAssessment } from './glossary-evaluator';
import worker from '../worker';
import { termById } from '../features/glossary/terms';

const term = termById.get('digital-signature')!;
const text = '署名者の秘密鍵で署名を作り、公開鍵で検証して改ざんを検知します。';
function assessment() { return { summary: '鍵の役割を説明できています。', criteria: term.criteria.map(c => ({ id: c.id, status: 'covered', evidence: text, feedback: '要点を正しく説明できています。' })), concerns: [] as { message: string; evidence: string }[], improvedExplanation: term.definition }; }
function upstream(raw: unknown = assessment(), extra: Record<string, unknown> = {}) { return Response.json({ status: 'completed', model: 'gpt-6-luna', output: [{ type: 'reasoning' }, { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(raw) }] }], ...extra }); }
const request = (body: unknown = { termId: term.id, text }, headers = {}) => new Request('https://example.test/api/glossary/evaluate', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.test', ...headers }, body: JSON.stringify(body) });
afterEach(() => vi.unstubAllGlobals());
describe('LLM評価の検証と集計', () => {
  it('derives coverage from the returned criteria, not a model-reported score', () => {
    const raw = assessment(); raw.criteria[1] = { ...raw.criteria[1], status: 'missing', evidence: '' };
    const result = parseAssessment(raw, term, text, 'gpt-6-luna');
    expect(result).toMatchObject({ covered: 2, total: 3, status: 'partial', engine: 'openai' });
    expect(result.criteria[0].title).toBe(term.criteria[0].title);
  });
  it('prioritizes a factual error even when all rubric items are covered', () => {
    const raw = assessment(); raw.concerns.push({ message: '鍵の役割を確認しましょう。', evidence: '公開鍵で検証' });
    expect(parseAssessment(raw, term, text, 'gpt-6-luna').status).toBe('review');
  });
  it('rejects invented quotes, empty evidence, unknown and duplicated criteria', () => {
    const invented = assessment(); invented.criteria[0].evidence = '公開鍵で署名を作る';
    expect(() => parseAssessment(invented, term, text, 'gpt-6-luna')).toThrow('引用');
    const empty = assessment(); empty.criteria[0].evidence = '';
    expect(() => parseAssessment(empty, term, text, 'gpt-6-luna')).toThrow('引用');
    const unknown = assessment(); unknown.criteria[0].id = 'not-a-criterion';
    expect(() => parseAssessment(unknown, term, text, 'gpt-6-luna')).toThrow('評価項目');
    const duplicate = assessment(); duplicate.criteria[0].id = duplicate.criteria[1].id;
    expect(() => parseAssessment(duplicate, term, text, 'gpt-6-luna')).toThrow('評価項目');
  });
  it('keeps missing explanations distinct from incorrect explanations', () => {
    const raw = assessment(); raw.criteria = raw.criteria.map(c => ({ ...c, status: 'missing', evidence: '' }));
    expect(parseAssessment(raw, term, text, 'gpt-6-luna')).toMatchObject({ status: 'unconfirmed', covered: 0, concerns: [] });
  });
});
describe('OpenAI Responses API', () => {
  it('uses Luna, strict structured output, no storage/tools, and bounded output', async () => {
    const fetcher = vi.fn().mockResolvedValue(upstream());
    const result = await evaluateWithOpenAI(term, text, 'test-key', undefined, fetcher);
    expect(result.status).toBe('covered');
    const [url, init] = fetcher.mock.calls[0]; const body = JSON.parse(init.body);
    expect(url).toBe('https://api.openai.com/v1/responses');
    expect(init.headers.Authorization).toBe('Bearer test-key');
    expect(body).toMatchObject({ model: 'gpt-6-luna', store: false, max_output_tokens: 3000, text: { format: { type: 'json_schema', strict: true } } });
    expect(body.tools).toBeUndefined();
    expect(body.instructions).toContain('否定');
    expect(JSON.parse(body.input[0].content).learnerExplanation).toBe(text);
    expect(JSON.stringify(body)).not.toContain('test-key');
    expect(body.text.format.schema.additionalProperties).toBe(false);
  });
  it('does not save incomplete outputs or refusals', async () => {
    await expect(evaluateWithOpenAI(term, text, 'key', undefined, vi.fn().mockResolvedValue(upstream(assessment(), { status: 'incomplete' })))).rejects.toThrow('完了しませんでした');
    const refusal = upstream({}, { output: [{ type: 'message', content: [{ type: 'refusal' }] }] });
    await expect(evaluateWithOpenAI(term, text, 'key', undefined, vi.fn().mockResolvedValue(refusal))).rejects.toThrow('評価を得られませんでした');
  });
  it('does not retry a rate limit or expose upstream error details', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ error: 'private provider details' }, { status: 429 }));
    await expect(evaluateWithOpenAI(term, text, 'key', undefined, fetcher)).rejects.toThrow('利用上限');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});
describe('Worker API boundary', () => {
  it('returns a real evaluation with no caching', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(upstream()));
    const res = await worker.fetch(request(), { OPENAI_API_KEY: 'test-key' });
    expect(res.status).toBe(200); expect(res.headers.get('Cache-Control')).toBe('no-store');
    expect(await res.json()).toMatchObject({ engine: 'openai', model: 'gpt-6-luna', status: 'covered' });
  });
  it('does not call a paid provider without a key, valid term and input', async () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    expect((await worker.fetch(request(), {})).status).toBe(503);
    expect((await worker.fetch(request({ termId: 'fake', text }), { OPENAI_API_KEY: 'key' })).status).toBe(404);
    expect((await worker.fetch(request({ termId: term.id, text: '短い' }), { OPENAI_API_KEY: 'key' })).status).toBe(400);
    expect((await worker.fetch(request({ termId: term.id, text, model: 'expensive' }), { OPENAI_API_KEY: 'key' })).status).toBe(400);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('rejects cross-origin and oversized requests before using the provider', async () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    expect((await worker.fetch(request(undefined, { Origin: 'https://elsewhere.test' }), { OPENAI_API_KEY: 'key' })).status).toBe(403);
    expect((await worker.fetch(request({ termId: term.id, text: 'あ'.repeat(12_000) }), { OPENAI_API_KEY: 'key' })).status).toBe(413);
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('keeps SPA assets and unknown APIs separate', async () => {
    const assets = vi.fn().mockResolvedValue(new Response('<html>app</html>'));
    expect(await (await worker.fetch(new Request('https://example.test/glossary/dns'), { ASSETS: { fetch: assets } })).text()).toBe('<html>app</html>');
    expect((await worker.fetch(new Request('https://example.test/api/unknown'), {})).status).toBe(404);
    expect((await worker.fetch(new Request('https://example.test/api/glossary/evaluate'), {})).status).toBe(405);
  });
});
