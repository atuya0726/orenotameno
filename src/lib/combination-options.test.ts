import { describe, expect, it } from 'vitest';
import { questionById } from '@/data/questions';
import { getCombinationOptions } from './combination-options';
import type { Question } from './model';

function combination(id: string) { return getCombinationOptions(questionById.get(id)!.options); }

describe('combination choices', () => {
  it('extracts the common fields of two- and three-column questions', () => {
    expect(combination('sc-2025-spring-a2-18')).toMatchObject({
      headers: ['コリジョンの伝搬', 'ブロードキャストフレームの中継'],
      rows: [{ id: 'a', values: ['伝搬しない', '中継しない'] }, { id: 'b', values: ['伝搬しない', '中継する'] },
        { id: 'c', values: ['伝搬する', '中継しない'] }, { id: 'd', values: ['伝搬する', '中継する'] }],
    });
    expect(combination('sc-2024-spring-a2-16')).toMatchObject({
      headers: ['PGP', 'S/MIME', 'SMTP over TLS'],
      rows: [{ id: 'a', values: ['メールアドレスごと', 'メールアドレスごと', 'メールサーバごと'] }, {}, {}, {}],
    });
  });

  it('keeps lists, punctuation and full-width-separated fields intact', () => {
    expect(combination('sc-2023-autumn-a1-9')!.rows[3].values).toEqual(['T1，T2，T5', 'T3，T6']);
    expect(combination('sc-2023-autumn-a1-6')!.rows[0].values).toEqual(['実行時間2，周期4', '実行時間3，周期8']);
    expect(combination('sc-2023-autumn-a1-14')!.rows[0].values).toEqual(['インシデント対応の中で，CSIRT間の情報連携，調整を行う。', '他のCSIRT']);
    expect(combination('sc-2023-spring-a2-17')!.headers).toEqual(['実装における対策', '実装以外の対策']);
  });

  it('leaves ordinary text, one-field lists, formulas and diagrams in their existing format', () => {
    for (const id of ['sc-2025-autumn-a1-1', 'sc-2025-spring-a2-21', 'sc-2022-spring-a2-4', 'sc-2023-autumn-a1-7']) {
      expect(combination(id), id).toBeNull();
    }
  });

  it('falls back to ordinary choices when fields are missing, empty, repeated or reordered', () => {
    const options = (texts: string[]): Question['options'] => texts.map((text, i) => ({ id: i ? 'b' : 'a', text, explanation: '' }));
    for (const texts of [[], ['A：1，B：2', 'A：1'], ['A：1，B：2', 'B：2，A：1'],
      ['A：1，B：2', 'A：1，B：'], ['A：1，A：2', 'A：3，A：4'], ['説明 A：1，B：2', 'A：1，B：2']]) {
      expect(getCombinationOptions(options(texts)), texts.join(' / ')).toBeNull();
    }
  });
});
