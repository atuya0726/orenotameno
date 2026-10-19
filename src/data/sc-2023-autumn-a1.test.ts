import { describe, expect, it } from 'vitest';
import { sc2023AutumnA1 as questions } from './sc-2023-autumn-a1';
import { optionLabels } from '@/lib/model';

describe('令和5年度秋期 午前Ⅰの収録データ', () => {
  it('includes exactly the 30 questions in original order', () => {
    expect(questions).toHaveLength(30);
    expect(new Set(questions.map(q => q.id)).size).toBe(30);
    expect(questions.every(q => q.course === 'A1' && q.source.kind === 'ipa')).toBe(true);
    expect(questions.map(q => q.number)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
  });
  it('matches the official answer sheet', () => {
    // IPA「2023r05a_koudo_am1_ans.pdf」の問1〜30を独立に転記。
    const expected = 'アアウウエアアイアイエウウアアエアエアイイウイエエイウイイア'.split('');
    expect(questions.map(q => optionLabels[q.correct])).toEqual(expected);
    for (const q of questions) {
      expect(q.options.map(o => o.id)).toEqual(['a', 'b', 'c', 'd']);
      expect(q.options.every(o => o.text.length > 0 && o.explanation.length > 0)).toBe(true);
      if (q.source.kind === 'ipa') expect(q.source.answerUrl).toContain('2023r05a_koudo_am1_ans.pdf');
    }
  });
  it('keeps the reconstructed tables and calculation flags', () => {
    expect(questions.filter(q => q.table).map(q => q.number)).toEqual([2, 7, 9]);
    expect(questions.filter(q => q.figure).map(q => q.number)).toEqual([9, 19]);
    expect(questions.filter(q => q.options.every(o => o.figure)).map(q => q.number)).toEqual([7]);
    for (const q of questions.filter(q => q.table)) expect(q.table!.rows.every(row => row.length === q.table!.headers.length)).toBe(true);
    expect(questions.find(q => q.number === 7)?.table?.rows.filter(row => row[3] === '1')).toHaveLength(4);
    expect(questions.filter(q => q.kind === 'calculation').map(q => q.number)).toEqual([1, 6, 10, 19, 20]);
  });
});
