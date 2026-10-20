import { describe, expect, it } from 'vitest';
import { questions } from './questions';
import { sc2025SpringA2 } from './sc-2025-spring-a2';
import { optionLabels } from '@/lib/model';
import { getQuestionTerms } from './question-terms';
import { termForWord } from '@/features/glossary/terms';

describe('令和7年度春期 午前Ⅱの収録データ', () => {
  it('includes all 25 questions as A2 without duplicate ids', () => {
    expect(sc2025SpringA2).toHaveLength(25);
    expect(sc2025SpringA2.every(q => q.course === 'A2' && q.source.kind === 'ipa')).toBe(true);
    expect(sc2025SpringA2.map(q => q.number)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
    expect(new Set(questions.map(q => q.id)).size).toBe(questions.length);
  });

  it('matches the independently transcribed official answer sheet', () => {
    // IPA「2025r07h_sc_am2_ans.pdf」の問1〜25を独立に転記。
    const expected = ['ウ', 'ア', 'ウ', 'エ', 'ア', 'イ', 'エ', 'ウ', 'ウ', 'エ', 'ウ', 'ウ', 'ウ', 'ア', 'ア', 'イ', 'イ', 'ア', 'エ', 'イ', 'ウ', 'エ', 'イ', 'ウ', 'エ'];
    expect(sc2025SpringA2.map(q => optionLabels[q.correct])).toEqual(expected);
    for (const q of sc2025SpringA2) {
      expect(q.options.map(o => o.id)).toEqual(['a', 'b', 'c', 'd']);
      expect(q.options.every(o => o.text.length > 0 && o.explanation.length > 0 && !o.explanation.includes('TODO'))).toBe(true);
      expect(q.explanation).not.toContain('TODO');
      if (q.source.kind === 'ipa') {
        expect(q.source.questionNumber).toBe(q.number);
        expect(q.source.label).toBe(`出典：令和7年度 春期 情報処理安全確保支援士試験 午前Ⅱ 問${q.number}`);
        expect(q.source.answerUrl).toContain('2025r07h_sc_am2_ans.pdf');
      }
    }
  });

  it('preserves the SQL table and the service availability conditions', () => {
    expect(sc2025SpringA2.filter(q => q.table).map(q => q.number)).toEqual([21]);
    expect(sc2025SpringA2.filter(q => q.figure).map(q => q.number)).toEqual([]);
    expect(sc2025SpringA2.filter(q => q.kind === 'calculation').map(q => q.number)).toEqual([24]);
    const sql = sc2025SpringA2.find(q => q.number === 21)!;
    expect(sql.table?.headers[0]).toBe('従業員コード（主キー）');
    expect(sql.table?.rows).toEqual([
      ['S001', 'NULL', 'A'], ['S002', 'S001', 'B'], ['S003', 'S001', 'C'], ['S004', 'S003', 'D'],
      ['S005', 'NULL', 'E'], ['S006', 'S005', 'F'], ['S007', 'S006', 'G'],
    ]);
    expect(sql.code?.text).toContain('X.従業員コード = Y.上司');
    expect(sql.options.map(o => o.text)).toEqual([
      '従業員コード：S001，S003，S005，S006', '従業員コード：S001，S005',
      '従業員コード：S002，S004，S007', '従業員コード：S003，S006',
    ]);
    expect(sc2025SpringA2.find(q => q.number === 24)?.details?.items).toEqual([
      'システム障害によるサービス提供時間内の停止時間：7時間',
      'システム障害への対処に要したサービス提供時間外の修復時間：3時間',
      'サービス提供時間外のシステムメンテナンス時間：8時間',
    ]);
  });

  it('opens distinct glossary concepts for the newly separated review words', () => {
    for (const [word, other] of [
      ['デジタル証明書', '公開鍵基盤'], ['認証局', '公開鍵基盤'], ['C&Cサーバ', 'ボットネット'],
      ['ARPキャッシュ', 'MACアドレス'], ['OP25B', 'サブミッションポート'], ['SMTP-AUTH', 'サブミッションポート'],
      ['HTTP', 'HTTPステータスコード'], ['レトロスペクティブ', 'スクラム'], ['スプリントレビュー', 'レトロスペクティブ'],
      ['サービス提供時間', 'サービス可用性'], ['信頼性（ITの統制目標）', '信頼性'],
    ]) {
      expect(termForWord(word), word).toBeDefined();
      expect(termForWord(other), other).toBeDefined();
      expect(termForWord(word)?.id, word).not.toBe(termForWord(other)?.id);
    }
    for (const q of sc2025SpringA2) expect(getQuestionTerms(q).length).toBeGreaterThanOrEqual(4);
  });
});
