import { describe, expect, it } from 'vitest';
import { questions } from './questions';
import { sc2025AutumnA2 } from './sc-2025-autumn-a2';
import { optionLabels } from '@/lib/model';

describe('令和7年度秋期 午前Ⅱの収録データ', () => {
  it('includes all 25 questions as A2 with ids that do not collide with A1', () => {
    expect(sc2025AutumnA2).toHaveLength(25);
    expect(sc2025AutumnA2.every(q => q.course === 'A2' && q.source.kind === 'ipa')).toBe(true);
    expect(sc2025AutumnA2.map(q => q.number)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
    expect(new Set(questions.map(q => q.id)).size).toBe(questions.length);
  });
  it('matches the official answer sheet in original question order', () => {
    // IPA「2025r07a_sc_am2_ans.pdf」の問1〜25を独立に転記。
    const expected = ['ウ', 'イ', 'エ', 'エ', 'ア', 'イ', 'ア', 'ア', 'エ', 'イ', 'ア', 'ア', 'イ', 'エ', 'イ', 'エ', 'ア', 'ア', 'イ', 'ウ', 'エ', 'イ', 'ウ', 'ウ', 'エ'];
    expect(sc2025AutumnA2.map(q => optionLabels[q.correct])).toEqual(expected);
    for (const q of sc2025AutumnA2) {
      expect(q.options.map(o => o.id)).toEqual(['a', 'b', 'c', 'd']);
      expect(q.options.every(o => o.text.length > 0 && o.explanation.length > 0 && !o.explanation.includes('TODO'))).toBe(true);
      if (q.source.kind === 'ipa') {
        expect(q.source.questionNumber).toBe(q.number);
        expect(q.source.label).toBe(`出典：令和7年度 秋期 情報処理安全確保支援士試験 午前Ⅱ 問${q.number}`);
        expect(q.source.answerUrl).toContain('2025r07a_sc_am2_ans.pdf');
      }
    }
  });
  it('redraws the figure as SVG, rebuilds the table as HTML and marks only the availability question as calculation', () => {
    expect(sc2025AutumnA2.filter(q => q.table).map(q => q.number)).toEqual([24]);
    expect(sc2025AutumnA2.filter(q => q.figure).map(q => q.number)).toEqual([22]);
    expect(sc2025AutumnA2.find(q => q.number === 24)?.table?.rows[1]).toEqual(['ハードウェア故障に伴う停止', '6月26日10時から20時までの10時間']);
    expect(sc2025AutumnA2.filter(q => q.kind === 'calculation').map(q => q.number)).toEqual([24]);
  });
});
