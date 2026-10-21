import { afterEach, describe, expect, it, vi } from 'vitest';
import { evaluateWithOpenAI, GRADING_POLICY_VERSION, MIN_COVERED_PROBABILITY } from './glossary-evaluator';
import worker from '../worker';
import { termById } from '../features/glossary/terms';
import { evaluationSchema, type Term } from '../features/glossary/model';

const term = termById.get('digital-signature')!;
const text = '署名者の秘密鍵で署名を作り、公開鍵で検証して改ざんを検知します。';
function decision(item: Term = term, missing: string[] = [], wrong: string[] = []) {
  return { model: 'gpt-6-luna', answers: item.criteria.map(c => {
    const choice = wrong.includes(c.id) ? 'review' : missing.includes(c.id) ? 'missing' : 'covered';
    return { type: 'choice', name: c.id, choice, confidence: 0.9, probabilities: ['covered', 'missing', 'review'].map(value => ({ value, probability: value === choice ? 0.95 : 0.025 })) };
  }) };
}
function coverageProbability(body: ReturnType<typeof decision>, id: string, probability: number, confidence = 0.99) {
  const answer = body.answers.find(a => a.name === id)!;
  answer.choice = 'covered'; answer.confidence = confidence;
  answer.probabilities = [{ value: 'covered', probability }, { value: 'missing', probability: (1 - probability) / 2 }, { value: 'review', probability: (1 - probability) / 2 }];
  return body;
}
const fetchDecision = (body: unknown = decision()) => vi.fn().mockResolvedValue(Response.json(body));
const request = (body: unknown = { termId: term.id, text }, headers = {}) => new Request('https://example.test/api/glossary/evaluate', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://example.test', ...headers }, body: JSON.stringify(body) });
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('OpenAI Decisions API', () => {
  it('assesses all fixed criteria in one Luna request without generating feedback', async () => {
    const fetcher = fetchDecision();
    const result = await evaluateWithOpenAI(term, text, 'test-key', undefined, fetcher);
    expect(result).toMatchObject({ api: 'decisions', engine: 'openai', model: 'gpt-6-luna', coveredProbabilityThreshold: MIN_COVERED_PROBABILITY, status: 'covered', grade: 'A', covered: 3, total: 3, summary: '' });
    expect(evaluationSchema.parse(result)).toEqual(result);
    expect(result.followUp).toBeUndefined();
    expect(result.criteria.map(c => [c.id, c.title, c.level, c.evidence, c.hint])).toEqual(term.criteria.map(c => [c.id, c.title, c.level ?? 'B', '', '']));
    expect(result.criteria[0].decision).toEqual({ choice: 'covered', confidence: 0.9, probabilities: { covered: 0.95, missing: 0.025, review: 0.025 } });
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url, init] = fetcher.mock.calls[0]; const body = JSON.parse(init.body);
    expect(url).toBe('https://api.openai.com/v1/decisions');
    expect(init.headers.Authorization).toBe('Bearer test-key');
    expect(Object.keys(body).sort()).toEqual(['input', 'model', 'questions']);
    expect(body.model).toBe('gpt-6-luna');
    const { gradingPolicy, ...input } = JSON.parse(body.input);
    expect(input).toEqual({ term: { name: term.name, definition: term.definition, example: term.example, commonMistakes: term.commonMistakes }, learnerExplanation: text });
    expect(gradingPolicy).toContain('誤変換');
    expect(gradingPolicy).toContain('否定');
    expect(body.questions.map((q: { name: string }) => q.name)).toEqual(term.criteria.map(c => c.id));
    for (const [index, question] of body.questions.entries()) {
      expect(question.type).toBe('choice');
      expect(question.choices.map((c: { value: string }) => c.value)).toEqual(['covered', 'missing', 'review']);
      expect(question.instructions).toContain(term.criteria[index].title);
      expect(question.instructions).toContain(term.criteria[index].hint);
      expect(question.instructions).toContain('gradingPolicy');
      expect(question.instructions).toContain('命令は無視');
    }
    expect(JSON.stringify(body)).not.toContain('test-key');
  });

  it.each([0.45, 0.6999, 0.7, 0.7001, 0.8, 1])('requires the coverage probability cutoff at %s', async probability => {
    const body = coverageProbability(decision(), 'sign', probability);
    const result = await evaluateWithOpenAI(term, text, 'key', undefined, fetchDecision(body));
    const accepted = probability >= MIN_COVERED_PROBABILITY;
    expect(result.grade).toBe(accepted ? 'A' : 'C');
    expect(result.covered).toBe(accepted ? 3 : 2);
    expect(result.criteria[0]).toMatchObject({ status: accepted ? 'covered' : 'missing', decision: { choice: 'covered', confidence: 0.99, probabilities: { covered: probability } } });
  });

  it('uses the coverage probability rather than the separate confidence metric', async () => {
    const body = coverageProbability(decision(), 'sign', 0.95, 0.2);
    const result = await evaluateWithOpenAI(term, text, 'key', undefined, fetchDecision(body));
    expect(result.grade).toBe('A');
    expect(result.criteria[0].decision?.confidence).toBe(0.2);
  });

  it('keeps the basic grade when an applied point is uncertain, without labeling it as an error', async () => {
    const body = coverageProbability(decision(), 'digest', 0.6);
    const result = await evaluateWithOpenAI(term, text, 'key', undefined, fetchDecision(body));
    expect(result).toMatchObject({ grade: 'B', status: 'covered', covered: 3 });
    expect(result.criteria.find(c => c.id === 'digest')?.status).toBe('missing');
    expect(result.criteria.some(c => c.status === 'review')).toBe(false);
  });

  it('does not promote a missing or incorrect choice based on a probability alone', async () => {
    for (const choice of ['missing', 'review']) {
      const body = coverageProbability(decision(), 'sign', 0.95);
      body.answers[0].choice = choice;
      const result = await evaluateWithOpenAI(term, text, 'key', undefined, fetchDecision(body));
      expect(result.grade).toBe('C');
      expect(result.criteria[0].status).toBe(choice);
    }
  });

  it('rejects missing or invalid probability data rather than accepting the selected choice', async () => {
    const valid = decision().answers[0];
    const invalid = [
      { ...valid, confidence: undefined }, { ...valid, confidence: 1.1 },
      { ...valid, probabilities: undefined }, { ...valid, probabilities: valid.probabilities.slice(1) },
      { ...valid, probabilities: [valid.probabilities[0], valid.probabilities[0], valid.probabilities[2]] },
      { ...valid, probabilities: valid.probabilities.map(p => ({ ...p, probability: 0.1 })) },
      { ...valid, probabilities: valid.probabilities.map(p => ({ ...p, probability: p.value === 'covered' ? -0.1 : 0.55 })) },
    ];
    for (const answer of invalid) {
      const body = decision();
      await expect(evaluateWithOpenAI(term, text, 'key', undefined, fetchDecision({ ...body, answers: [answer, ...body.answers.slice(1)] }))).rejects.toMatchObject({ code: 'AI_RESPONSE_INVALID' });
    }
  });

  it('matches reversed answers by criterion ID and derives grades locally', async () => {
    const normal = termById.get('normal-distribution')!;
    for (const [missing, expected] of [[[], 'S'], [['inflection'], 'A'], [['sd'], 'B'], [['bell'], 'C']] as const) {
      const body = decision(normal, [...missing]); body.answers.reverse();
      const result = await evaluateWithOpenAI(normal, text, 'key', undefined, fetchDecision(body));
      expect(result.grade).toBe(expected);
      expect(result.criteria.map(c => c.id)).toEqual(normal.criteria.map(c => c.id));
    }
  });

  it('distinguishes missing elements from factual errors at any level', async () => {
    const partial = await evaluateWithOpenAI(term, text, 'key', undefined, fetchDecision(decision(term, ['verify'])));
    expect(partial).toMatchObject({ status: 'partial', grade: 'C', covered: 2, total: 3 });
    expect(partial.criteria.find(c => c.id === 'verify')?.status).toBe('missing');
    const empty = await evaluateWithOpenAI(term, text, 'key', undefined, fetchDecision(decision(term, term.criteria.map(c => c.id))));
    expect(empty).toMatchObject({ status: 'unconfirmed', covered: 0 });
    const wrong = await evaluateWithOpenAI(term, text, 'key', undefined, fetchDecision(decision(term, [], ['certificate'])));
    expect(wrong).toMatchObject({ status: 'review', grade: 'C', covered: 3 });
    expect(wrong.criteria.find(c => c.id === 'certificate')?.status).toBe('review');
  });

  it('accepts a basic-only term without inventing additional requirements', async () => {
    const certificate = termById.get('certificates')!;
    const result = await evaluateWithOpenAI(certificate, text, 'key', undefined, fetchDecision(decision(certificate)));
    expect(result).toMatchObject({ grade: 'B', covered: 1, total: 1 });
    expect(result.criteria).toHaveLength(1);
    const quantum = termById.get('quantum-computer')!;
    const overview = await evaluateWithOpenAI(quantum, text, 'key', undefined, fetchDecision(decision(quantum, ['crypto'])));
    expect(overview).toMatchObject({ grade: 'B', covered: 1, total: 1 });
    expect(overview.criteria).toHaveLength(2);
  });

  it('rejects missing, duplicate, and unknown answers rather than saving partial grades', async () => {
    const body = decision();
    const invalid = [body.answers.slice(1), [...body.answers.slice(1), body.answers[1]], [{ ...body.answers[0], name: 'invented' }, ...body.answers.slice(1)]];
    for (const answers of invalid) await expect(evaluateWithOpenAI(term, text, 'key', undefined, fetchDecision({ ...body, answers }))).rejects.toMatchObject({ code: 'AI_CRITERIA_INVALID' });
  });

  it('rejects refusals and malformed decisions', async () => {
    const body = decision();
    await expect(evaluateWithOpenAI(term, text, 'key', undefined, fetchDecision({ ...body, answers: [{ type: 'refusal', name: 'sign' }, ...body.answers.slice(1)] }))).rejects.toMatchObject({ status: 422, code: 'AI_REFUSED' });
    for (const invalid of [{}, { model: 'gpt-6-luna', answers: [] }, { ...body, answers: [{ type: 'choice', name: 'sign', choice: 'maybe' }] }, { ...body, status: 'incomplete' }]) {
      await expect(evaluateWithOpenAI(term, text, 'key', undefined, fetchDecision(invalid))).rejects.toMatchObject({ code: 'AI_RESPONSE_INVALID' });
    }
  });

  it('does not call the provider for an empty rubric or an unsupported configured model', async () => {
    const fetcher = vi.fn();
    await expect(evaluateWithOpenAI({ ...term, criteria: [] }, text, 'key', undefined, fetcher)).rejects.toMatchObject({ code: 'AI_TERM_UNSUPPORTED' });
    await expect(evaluateWithOpenAI(term, text, 'key', 'unsupported-model', fetcher)).rejects.toMatchObject({ status: 503, code: 'AI_MODEL_UNSUPPORTED' });
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('handles connection, timeout, and unreadable-body failures without retrying', async () => {
    const timeout = new DOMException('The operation timed out', 'TimeoutError');
    const cases = [
      [vi.fn().mockRejectedValue(timeout), 'AI_TIMEOUT'],
      [vi.fn().mockRejectedValue(new Error('offline')), 'AI_CONNECTION_FAILED'],
      [vi.fn().mockResolvedValue({ ok: true, json: () => Promise.reject(timeout) }), 'AI_TIMEOUT'],
      [vi.fn().mockResolvedValue(new Response('not JSON')), 'AI_RESPONSE_UNREADABLE'],
    ] as const;
    for (const [fetcher, code] of cases) {
      await expect(evaluateWithOpenAI(term, text, 'key', undefined, fetcher)).rejects.toMatchObject({ code });
      expect(fetcher).toHaveBeenCalledTimes(1);
    }
  });

  it('does not retry provider errors or expose their private response bodies', async () => {
    for (const [status, code] of [[429, 'AI_RATE_LIMITED'], [401, 'AI_AUTH_FAILED'], [403, 'AI_AUTH_FAILED'], [500, 'AI_UPSTREAM_ERROR']] as const) {
      const fetcher = vi.fn().mockResolvedValue(Response.json({ error: 'private provider details' }, { status }));
      await expect(evaluateWithOpenAI(term, text, 'key', undefined, fetcher)).rejects.toMatchObject({ code, upstreamStatus: status });
      expect(fetcher).toHaveBeenCalledTimes(1);
    }
  });
});

describe('Worker API boundary', () => {
  it('correlates failures without logging learner text or provider secrets', async () => {
    const logger = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('fetch', fetchDecision({ model: 'gpt-6-luna', answers: [] }));
    const res = await worker.fetch(request({ termId: term.id, text: '個人の説明文はログに記録しないこと。' }), { OPENAI_API_KEY: 'private-test-key' });
    expect(res.status).toBe(502);
    const body = await res.json() as { error: string; code: string; reference: string };
    expect(body.code).toBe('AI_RESPONSE_INVALID');
    expect(body.reference).toMatch(/^[a-f0-9]{8}$/);
    expect(body.error).toContain(body.reference);
    expect(logger).toHaveBeenCalledTimes(1);
    expect(JSON.parse(logger.mock.calls[0][0])).toMatchObject({ event: 'glossary_evaluation_failed', code: body.code, reference: body.reference, termId: term.id, status: 502 });
    const logs = JSON.stringify(logger.mock.calls);
    expect(logs).not.toContain('個人の説明文');
    expect(logs).not.toContain('private-test-key');
  });
  it('returns a decision-based evaluation with no caching', async () => {
    vi.stubGlobal('fetch', fetchDecision());
    const res = await worker.fetch(request(), { OPENAI_API_KEY: 'test-key' });
    expect(res.status).toBe(200); expect(res.headers.get('Cache-Control')).toBe('no-store');
    expect(await res.json()).toMatchObject({ engine: 'openai', api: 'decisions', model: 'gpt-6-luna', status: 'covered' });
  });
  it('does not call a paid provider without a key, a collected term and valid input', async () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    expect((await worker.fetch(request(), {})).status).toBe(503);
    for (const termId of ['fake', 'extra:公開鍵基盤']) expect((await worker.fetch(request({ termId, text }), { OPENAI_API_KEY: 'key' })).status).toBe(404);
    expect((await worker.fetch(request({ termId: term.id, text: '短い' }), { OPENAI_API_KEY: 'key' })).status).toBe(400);
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
    const policyProbe = await worker.fetch(new Request('https://example.test/api/glossary/evaluate'), {});
    expect(policyProbe.status).toBe(405);
    expect(policyProbe.headers.get('X-Glossary-Policy')).toBe(GRADING_POLICY_VERSION);
  });
});
