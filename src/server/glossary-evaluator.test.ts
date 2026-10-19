import { afterEach, describe, expect, it, vi } from 'vitest';
import { evaluateWithOpenAI, parseAssessment } from './glossary-evaluator';
import worker from '../worker';
import { termById } from '../features/glossary/terms';
import { extraTerm } from '../features/glossary/model';

const term = termById.get('digital-signature')!;
const text = '署名者の秘密鍵で署名を作り、公開鍵で検証して改ざんを検知します。';
function assessment() { return { summary: '鍵の役割を説明できています。', criteria: term.criteria.map(c => ({ id: c.id, title: '', level: c.level ?? 'B', status: 'covered', evidence: text, feedback: '要点を正しく説明できています。' })), definition: '', followUp: { name: 'ハッシュ関数', reason: '署名の前に使われるため。', termId: 'hash' } }; }
function upstream(raw: unknown = assessment(), extra: Record<string, unknown> = {}) { return Response.json({ status: 'completed', model: 'gpt-6-luna', output: [{ type: 'reasoning' }, { type: 'message', content: [{ type: 'output_text', text: JSON.stringify(raw) }] }], ...extra }); }
const request = (body: unknown = { termId: term.id, text }, headers = {}) => new Request('https://example.test/api/glossary/evaluate', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.test', ...headers }, body: JSON.stringify(body) });
afterEach(() => vi.unstubAllGlobals());
describe('LLM評価の検証と集計', () => {
  it('derives coverage from the returned criteria, not a model-reported score', () => {
    const raw = assessment(); raw.criteria[1] = { ...raw.criteria[1], status: 'missing', evidence: '' };
    const result = parseAssessment(raw, term, text, 'gpt-6-luna');
    expect(result).toMatchObject({ covered: 2, total: 3, status: 'partial', grade: 'C', engine: 'openai' });
    expect(result.criteria[0].title).toBe(term.criteria[0].title);
  });
  it('grades B as the minimum line and A/S on top of it', () => {
    const grade = (missing: string[]) => { const raw = assessment(); raw.criteria = raw.criteria.map(c => missing.includes(c.id) ? { ...c, status: 'missing', evidence: '' } : c); return parseAssessment(raw, term, text, 'gpt-6-luna').grade; };
    expect(grade([])).toBe('S');
    expect(grade(['timestamp'])).toBe('A');
    expect(grade(['certificate'])).toBe('B');
    expect(grade(['certificate', 'timestamp'])).toBe('B');
    expect(grade(['verify'])).toBe('C');
    // S without A still stays at B
    expect(grade(['digest'])).toBe('B');
    const wrong = assessment(); wrong.criteria[4] = { ...wrong.criteria[4], status: 'review', evidence: '公開鍵で検証' };
    expect(parseAssessment(wrong, term, text, 'gpt-6-luna').grade).toBe('C');
  });
  it('uses the term level, not the one the AI returned', () => {
    const raw = assessment(); raw.criteria = raw.criteria.map(c => ({ ...c, level: 'B' }));
    expect(parseAssessment(raw, term, text, 'gpt-6-luna').criteria.map(c => c.level)).toEqual(term.criteria.map(c => c.level ?? 'B'));
  });
  it('prioritizes a factual error over coverage', () => {
    const raw = assessment(); raw.criteria[0] = { ...raw.criteria[0], status: 'review', evidence: '公開鍵で検証' };
    expect(parseAssessment(raw, term, text, 'gpt-6-luna').status).toBe('review');
  });
  it('links a follow-up only to a known, different term', () => {
    expect(parseAssessment(assessment(), term, text, 'gpt-6-luna').followUp).toEqual({ name: 'ハッシュ関数', reason: '署名の前に使われるため。', termId: 'hash' });
    const self = assessment(); self.followUp.termId = term.id;
    expect(parseAssessment(self, term, text, 'gpt-6-luna').followUp?.termId).toBeUndefined();
    const unknown = assessment(); unknown.followUp = { name: 'Kerberos認証', reason: 'チケットの役割が説明にないため。', termId: 'kerberos' };
    expect(parseAssessment(unknown, term, text, 'gpt-6-luna').followUp).toEqual({ name: 'Kerberos認証', reason: 'チケットの役割が説明にないため。', termId: undefined });
  });
  it('lets the AI write criteria and a definition for a suggested term outside the list', () => {
    const extra = extraTerm('公開鍵基盤');
    const raw = { ...assessment(), definition: '公開鍵とその持ち主を認証局が証明書で結び付ける仕組みです。', criteria: [{ id: 'ca', title: '認証局が証明書を発行する', level: 'B', status: 'covered', evidence: text, feedback: 'OK' }, { id: 'binding', title: '公開鍵と持ち主を結び付ける', level: 'B', status: 'missing', evidence: '', feedback: '何と何を結び付けるかが足りません。' }, { id: 'chain', title: '証明書チェーンをルート証明書までたどる', level: 'A', status: 'missing', evidence: '', feedback: '信頼の連鎖が足りません。' }, { id: 'revoke', title: 'CRLやOCSPで失効を確認する', level: 'S', status: 'missing', evidence: '', feedback: '失効確認が足りません。' }] };
    expect(parseAssessment(raw, extra, text, 'gpt-6-luna')).toMatchObject({ status: 'partial', grade: 'C', covered: 1, total: 2, definition: raw.definition, criteria: [{ title: '認証局が証明書を発行する', level: 'B' }, { level: 'B' }, { level: 'A' }, { level: 'S' }] });
    expect(parseAssessment({ ...raw, criteria: raw.criteria.slice(1) }, extra, text, 'gpt-6-luna')).toMatchObject({ grade: 'C', covered: 0, total: 1 });
    expect(parseAssessment({ ...raw, criteria: raw.criteria.slice(0, 3) }, extra, text, 'gpt-6-luna')).toMatchObject({ grade: 'C', covered: 1, total: 2 });
    expect(() => parseAssessment({ ...raw, criteria: raw.criteria.slice(2) }, extra, text, 'gpt-6-luna')).toThrow('評価項目');
    expect(() => parseAssessment({ ...raw, criteria: [raw.criteria[0], raw.criteria[0]] }, extra, text, 'gpt-6-luna')).toThrow('評価項目');
    expect(() => parseAssessment({ ...raw, criteria: [{ ...raw.criteria[0], title: ' ' }] }, extra, text, 'gpt-6-luna')).toThrow('評価項目');
    expect(() => parseAssessment({ ...raw, definition: '' }, extra, text, 'gpt-6-luna')).toThrow('評価項目');
  });
  it('accepts a single B point for built-in and generated terms and keeps the grade at B', () => {
    const serverCertificate = termById.get('certificates')!;
    const raw = { ...assessment(), definition: '', criteria: serverCertificate.criteria.map(c => ({ id: c.id, title: '', level: 'B', status: 'covered', evidence: text, feedback: '説明できています。' })) };
    expect(parseAssessment(raw, serverCertificate, text, 'gpt-6-luna')).toMatchObject({ grade: 'B', status: 'covered', covered: 1, total: 1 });
    const generated = { ...raw, definition: '公開鍵とその持ち主を認証局が証明書で結び付ける仕組みです。', criteria: [{ ...raw.criteria[0], title: '公開鍵と持ち主を結び付ける' }] };
    expect(parseAssessment(generated, extraTerm('公開鍵基盤'), text, 'gpt-6-luna')).toMatchObject({ grade: 'B', covered: 1, total: 1 });
    generated.criteria[0].evidence = '入力にない引用';
    expect(() => parseAssessment(generated, extraTerm('公開鍵基盤'), text, 'gpt-6-luna')).toThrow('引用');
  });
  it('accepts a crashing explanation without requiring fast tracking or other compression techniques', () => {
    const crashing = termById.get('schedule-compression')!;
    const explanation = 'クリティカルパス上の作業に人員などの資源を追加して、期間を短縮することです。';
    const raw = { ...assessment(), criteria: [{ id: 'meaning', title: '', level: 'B', status: 'covered', evidence: explanation, feedback: '説明できています。' }] };
    const result = parseAssessment(raw, crashing, explanation, 'gpt-6-luna');
    expect(result).toMatchObject({ status: 'covered', grade: 'B', covered: 1, total: 1 });
    expect(result.criteria).toHaveLength(1);
    expect(result.criteria[0].title).not.toContain('ファストトラッキング');
  });
  it('accepts the CIA overview without requiring definitions of authenticity or other properties', () => {
    const overview = termById.get('security-properties')!;
    const explanation = '情報セキュリティの基本の3要素は、機密性・完全性・可用性です。';
    const raw = { ...assessment(), criteria: [{ id: 'cia', title: '', level: 'B', status: 'covered', evidence: explanation, feedback: '基本の3要素を挙げられています。' }] };
    const result = parseAssessment(raw, overview, explanation, 'gpt-6-luna');
    expect(result).toMatchObject({ status: 'covered', grade: 'B', covered: 1, total: 1 });
    expect(result.criteria).toHaveLength(1);
    expect(result.criteria[0].title).not.toContain('真正性');
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
    expect(parseAssessment(raw, term, text, 'gpt-6-luna')).toMatchObject({ status: 'unconfirmed', covered: 0 });
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
    expect(body.instructions).toContain('否定'); expect(body.instructions).toContain('誤字'); expect(body.instructions).toContain('めったに問われない');
    expect(JSON.parse(body.input[0].content).knownTerms).toContainEqual({ id: 'hash', name: 'ハッシュ関数' });
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
  it('evaluates a suggested term outside the built-in list', async () => {
    const raw = { ...assessment(), definition: '公開鍵とその持ち主を認証局が証明書で結び付ける仕組みです。', criteria: [{ id: 'ca', title: '認証局', level: 'B', status: 'covered', evidence: text, feedback: 'OK' }, { id: 'binding', title: '結び付け', level: 'B', status: 'covered', evidence: text, feedback: 'OK' }, { id: 'chain', title: 'チェーン', level: 'A', status: 'covered', evidence: text, feedback: 'OK' }, { id: 'revoke', title: '失効', level: 'S', status: 'missing', evidence: '', feedback: '失効確認が足りません。' }] };
    const fetcher = vi.fn().mockResolvedValue(upstream(raw)); vi.stubGlobal('fetch', fetcher);
    const res = await worker.fetch(request({ termId: 'extra:公開鍵基盤', text }), { OPENAI_API_KEY: 'key' });
    expect(res.status).toBe(200); expect(await res.json()).toMatchObject({ status: 'covered', grade: 'A', definition: raw.definition });
    expect(JSON.parse(JSON.parse(fetcher.mock.calls[0][1].body).input[0].content).term).toMatchObject({ name: '公開鍵基盤', criteria: [] });
    expect((await worker.fetch(request({ termId: `extra:${'あ'.repeat(41)}`, text }), { OPENAI_API_KEY: 'key' })).status).toBe(404);
  });
  it('does not call a paid provider without a key, valid term and input', async () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    expect((await worker.fetch(request(), {})).status).toBe(503);
    expect((await worker.fetch(request({ termId: 'fake', text }), { OPENAI_API_KEY: 'key' })).status).toBe(404);
    expect((await worker.fetch(request({ termId: term.id, text: '短い' }), { OPENAI_API_KEY: 'key' })).status).toBe(400);
    expect((await worker.fetch(request({ termId: term.id, text: 'あ'.repeat(1000) }), {})).status).toBe(503);
    const tooLong = await worker.fetch(request({ termId: term.id, text: 'あ'.repeat(1001) }), { OPENAI_API_KEY: 'key' });
    expect(tooLong.status).toBe(400); expect(await tooLong.json()).toEqual({ error: '用語と10〜1,000文字の説明を送信してください。' });
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
