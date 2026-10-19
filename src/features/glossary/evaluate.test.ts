import { afterEach, describe, expect, it, vi } from 'vitest';
import { terms, termById } from './terms';
import { evaluateExplanation } from './evaluate';
import { parseGlossaryBackup, serializeGlossary } from './db';
import { explanationInputSchema, glossaryAttemptSchema, type Evaluation } from './model';
import { transcripts, speechErrorMessage, mergeTranscript } from './useSpeech';

const term = termById.get('digital-signature')!;
const text = '署名者の秘密鍵で署名を作り、公開鍵で検証し、データの改ざんを検知します。';
const evaluation: Evaluation = {
  version: 1, engine: 'openai', model: 'gpt-6-luna', status: 'covered', covered: 3, total: 3,
  criteria: term.criteria.map(c => ({ id: c.id, title: c.title, status: 'covered', evidence: text, hint: '鍵の関係を説明できています。' })),
  concerns: [], summary: '生成と検証の役割を説明できています。', improvedExplanation: term.definition,
};
afterEach(() => vi.unstubAllGlobals());
describe('AI評価のクライアント', () => {
  it('sends only term ID and current explanation; no credentials or history', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json(evaluation)); vi.stubGlobal('fetch', fetcher);
    expect(await evaluateExplanation(term, ` ${text} `)).toEqual(evaluation);
    const [url, init] = fetcher.mock.calls[0];
    expect(url).toBe('/api/glossary/evaluate');
    expect(JSON.parse(init.body)).toEqual({ termId: term.id, text });
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
  });
  it('rejects invalid input before making a paid request', async () => {
    const fetcher = vi.fn(); vi.stubGlobal('fetch', fetcher);
    await expect(evaluateExplanation(term, '短い')).rejects.toThrow();
    expect(explanationInputSchema.safeParse('あ'.repeat(1000)).success).toBe(true);
    await expect(evaluateExplanation(term, 'あ'.repeat(1001))).rejects.toThrow('1,000文字以内');
    expect(fetcher).not.toHaveBeenCalled();
  });
  it('shows configuration errors without inventing offline grades or retrying', async () => {
    const fetcher = vi.fn().mockResolvedValue(Response.json({ error: '接続設定がまだありません。' }, { status: 503 })); vi.stubGlobal('fetch', fetcher);
    await expect(evaluateExplanation(term, text)).rejects.toThrow('接続設定がまだありません');
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('handles connection errors and malformed successful responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(evaluateExplanation(term, text)).rejects.toThrow('説明は残っています');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ summary: 'incomplete' })));
    await expect(evaluateExplanation(term, text)).rejects.toThrow('評価を読み込めませんでした');
  });
  it('has unique IDs and valid related links across the glossary', () => {
    expect(new Set(terms.map(t => t.id)).size).toBe(terms.length);
    for (const item of terms) {
      expect(item.criteria.length).toBeGreaterThan(0);
      expect(item.criteria.some(c => !c.level || c.level === 'B'), item.name).toBe(true);
      expect(new Set(item.criteria.map(c => c.id)).size).toBe(item.criteria.length);
      for (const id of item.related) expect(termById.has(id)).toBe(true);
    }
  });
});
describe('用語学習のバックアップ', () => {
  it('round-trips explanations and LLM feedback separately from quiz records', () => {
    const attempt = glossaryAttemptSchema.parse({ id: 'test-attempt', termId: term.id, termName: term.name, text, answeredAt: '2026-10-19T03:00:00.000Z', usedVoice: true, referenceViewed: false, evaluation, reference: term.definition });
    expect(parseGlossaryBackup(serializeGlossary({ attempts: [attempt], drafts: [] })).attempts).toEqual([attempt]);
    const olderAttempt = { ...attempt, text: 'あ'.repeat(5000) };
    expect(parseGlossaryBackup(serializeGlossary({ attempts: [olderAttempt], drafts: [] })).attempts[0].text).toBe(olderAttempt.text);
    expect(() => parseGlossaryBackup(JSON.stringify({ version: 1, kind: 'quiz', attempts: [] }))).toThrow();
    expect(() => parseGlossaryBackup('{broken')).toThrow();
  });
});
describe('音声の文字起こし', () => {
  it('separates final and interim text without duplicating final results', () => {
    expect(transcripts([{ isFinal: true, 0: { transcript: '秘密鍵で署名します。' }, length: 1 }, { isFinal: false, 0: { transcript: '公開鍵で' }, length: 1 }])).toEqual({ final: '秘密鍵で署名します。', interim: '公開鍵で' });
    expect(transcripts([{ isFinal: true, 0: { transcript: '秘密鍵で署名します。' }, length: 1 }, { isFinal: true, 0: { transcript: '公開鍵で検証します。' }, length: 1 }]).final).toBe('秘密鍵で署名します。公開鍵で検証します。');
    // Android Chrome repeats earlier text inside later results
    expect(mergeTranscript('秘密鍵で署名', '署名を作ります')).toBe('秘密鍵で署名を作ります');
    expect(mergeTranscript('秘密鍵で署名します。', '公開鍵で検証します。')).toBe('秘密鍵で署名します。公開鍵で検証します。');
    expect(transcripts([{ isFinal: true, 0: { transcript: '秘密鍵で' }, length: 1 }, { isFinal: true, 0: { transcript: '秘密鍵で署名します' }, length: 1 }, { isFinal: true, 0: { transcript: '署名します' }, length: 1 }, { isFinal: false, 0: { transcript: '秘密鍵で署名します 公開鍵' }, length: 1 }])).toEqual({ final: '秘密鍵で署名します', interim: '公開鍵' });
  });
  it('provides actionable messages for microphone denial and network failure', () => {
    expect(speechErrorMessage('not-allowed')).toContain('文字で入力');
    expect(speechErrorMessage('network')).toContain('文章は残って');
  });
});
