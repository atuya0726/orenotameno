import { describe, expect, it } from 'vitest';
import { questions } from './questions';
import { sc2025AutumnA1 } from './sc-2025-autumn-a1';
import { optionLabels } from '@/lib/model';

describe('令和7年度秋期 午前Ⅰの収録データ', () => {
  it('includes exactly the 30 real questions and no prototype questions', () => {
    expect(questions).toHaveLength(30);
    expect(new Set(questions.map(q => q.id)).size).toBe(30);
    expect(questions.every(q => q.course === 'A1' && q.source.kind === 'ipa')).toBe(true);
    expect(questions.map(q => q.number)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
  });
  it('matches the official answer sheet in original question order', () => {
    // IPA「2025r07a_koudo_am1_ans.pdf」の問1〜30を独立に転記。
    const expected = ['イ', 'イ', 'イ', 'エ', 'イ', 'エ', 'ア', 'イ', 'ア', 'ウ', 'ア', 'イ', 'ウ', 'ア', 'ア', 'イ', 'エ', 'エ', 'ウ', 'ア', 'エ', 'イ', 'ア', 'エ', 'ウ', 'イ', 'イ', 'イ', 'イ', 'ア'];
    expect(sc2025AutumnA1.map(q => optionLabels[q.correct])).toEqual(expected);
    for (const q of questions) {
      expect(q.options.map(o => o.id)).toEqual(['a', 'b', 'c', 'd']);
      expect(q.options.every(o => o.text.length > 0 && o.explanation.length > 0)).toBe(true);
      if (q.source.kind === 'ipa') {
        expect(q.source.questionNumber).toBe(q.number);
        expect(q.source.questionUrl).toContain('www.ipa.go.jp/');
        expect(q.source.answerUrl).toContain('2025r07a_koudo_am1_ans.pdf');
      }
    }
  });
  it('contains the data required for the three table-based questions', () => {
    expect(questions.filter(q => q.table).map(q => q.number)).toEqual([6, 27, 29]);
    for (const q of questions.filter(q => q.table)) {
      expect(q.table!.rows.every(row => row.length === q.table!.headers.length)).toBe(true);
    }
    expect(questions.find(q => q.number === 6)?.table?.rows[2]).toEqual(['C2', '0:04', '0:05', '3']);
    expect(questions.find(q => q.number === 7)?.options[0].text).toBe(String.raw`\(a\cdot\overline{b}\)`);
  });
  it('classifies calculation questions explicitly rather than by the presence of a table', () => {
    expect(questions.filter(q => q.kind === 'calculation').map(q => q.number)).toEqual([1, 3, 10, 19, 29]);
    expect(questions.find(q => q.number === 6)?.kind).toBe('knowledge');
    expect(questions.find(q => q.number === 27)?.kind).toBe('knowledge');
    expect(questions.every(q => q.kind === 'calculation' || q.kind === 'knowledge')).toBe(true);
  });
});
