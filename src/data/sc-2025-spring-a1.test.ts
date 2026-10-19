import { describe, expect, it } from 'vitest';
import { sc2025SpringA1 as questions } from './sc-2025-spring-a1';
import { optionLabels } from '@/lib/model';

describe('令和7年度春期 午前Ⅰの収録データ', () => {
  it('includes exactly the 30 questions in original order', () => {
    expect(questions).toHaveLength(30);
    expect(new Set(questions.map(q => q.id)).size).toBe(30);
    expect(questions.every(q => q.course === 'A1' && q.source.kind === 'ipa')).toBe(true);
    expect(questions.map(q => q.number)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
  });
  it('matches the official answer sheet', () => {
    // IPA「2025r07h_koudo_am1_ans.pdf」の問1〜30を独立に転記。
    const expected = 'アイウウイウウウイアイウイイウアイイエイウウイエイウイエウイ'.split('');
    expect(questions.map(q => optionLabels[q.correct])).toEqual(expected);
    for (const q of questions) {
      expect(q.options.map(o => o.id)).toEqual(['a', 'b', 'c', 'd']);
      expect(q.options.every(o => o.text.length > 0 && o.explanation.length > 0)).toBe(true);
      if (q.source.kind === 'ipa') expect(q.source.answerUrl).toContain('2025r07h_koudo_am1_ans.pdf');
    }
  });
  it('keeps the reconstructed tables, SQL and calculation flags', () => {
    expect(questions.filter(q => q.table).map(q => q.number)).toEqual([4, 25]);
    for (const q of questions.filter(q => q.table)) expect(q.table!.rows.every(row => row.length === q.table!.headers.length)).toBe(true);
    expect(questions.find(q => q.number === 10)?.code?.text).toContain('ON DELETE  a');
    expect(questions.filter(q => q.kind === 'calculation').map(q => q.number)).toEqual([1, 3, 4, 7, 20, 29]);
  });
});
