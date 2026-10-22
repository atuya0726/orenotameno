import { describe, expect, it } from 'vitest';
import { sc2022AutumnA1 } from './sc-2022-autumn-a1';
import { sc2022SpringA1 } from './sc-2022-spring-a1';
import { sc2021AutumnA1 } from './sc-2021-autumn-a1';
import { sc2021SpringA1 } from './sc-2021-spring-a1';
import { questions as allQuestions } from './questions';
import { optionLabels } from '@/lib/model';

// 公式解答PDFを画像で確認し、問題データとは独立に問1〜30を転記。
const sets = [
  { label: '令和4年度秋期', key: '2022r04a', questions: sc2022AutumnA1, answers: 'エイイエウイウアウイ' + 'ウウイイアアウイウイ' + 'エウエイエイエウウウ', tables: [1, 19, 24], figures: [9, 18], choices: [7], calculations: [4, 8, 18, 19, 24] },
  { label: '令和4年度春期', key: '2022r04h', questions: sc2022SpringA1, answers: 'アアエイウイウウアイ' + 'エアエウウイアエウエ' + 'イアイウアウエウイエ', tables: [18, 19], figures: [16], choices: [], calculations: [1, 4, 18, 19] },
  { label: '令和3年度秋期', key: '2021r03a', questions: sc2021AutumnA1, answers: 'エアウエイアアエイア' + 'エイアアアアアイイエ' + 'ウイウイイアエアアア', tables: [2, 8, 24, 29], figures: [18, 23], choices: [7, 17, 18], calculations: [21, 24, 29] },
  { label: '令和3年度春期', key: '2021r03h', questions: sc2021SpringA1, answers: 'アウウイエエエウエウ' + 'エアアウイアアアアエ' + 'アウウアウウイウイイ', tables: [26], figures: [2, 5, 16, 19], choices: [1, 5], calculations: [2, 16, 19, 20] },
];

for (const set of sets) describe(`${set.label} 午前Ⅰ`, () => {
  it('contains all 30 questions in official order with complete explanations', () => {
    expect(set.questions).toHaveLength(30);
    expect(set.questions.map(q => q.number)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    for (const q of set.questions) {
      expect(q.course).toBe('A1');
      expect(q.options.map(o => o.id)).toEqual(['a', 'b', 'c', 'd']);
      expect(q.options.every(o => o.text.trim() && o.explanation.trim())).toBe(true);
      expect(q.explanation).not.toMatch(/TODO|transcription missing/);
      expect(q.source.kind).toBe('ipa');
      if (q.source.kind === 'ipa') {
        expect(q.source.questionNumber).toBe(q.number);
        expect(q.source.questionUrl).toContain(`${set.key}_koudo_am1_qs.pdf`);
        expect(q.source.answerUrl).toContain(`${set.key}_koudo_am1_ans.pdf`);
      }
    }
  });
  it('matches the independent official answer transcription', () => {
    expect(set.questions.map(q => optionLabels[q.correct])).toEqual([...set.answers]);
  });
  it('preserves tables, prompt figures, option figures and explicit calculation types', () => {
    expect(set.questions.filter(q => q.table).map(q => q.number)).toEqual(set.tables);
    expect(set.questions.filter(q => q.figure).map(q => q.number)).toEqual(set.figures);
    expect(set.questions.filter(q => q.options.every(o => o.figure)).map(q => q.number)).toEqual(set.choices);
    expect(set.questions.filter(q => q.kind === 'calculation').map(q => q.number)).toEqual(set.calculations);
    for (const q of set.questions.filter(q => q.table)) expect(q.table!.rows.every(row => row.length === q.table!.headers.length)).toBe(true);
  });
});

it('adds 120 A1 questions with unique ids and preserves 200 A2 questions', () => {
  expect(sets.flatMap(set => set.questions)).toHaveLength(120);
  expect(allQuestions.filter(q => q.course === 'A1')).toHaveLength(300);
  expect(allQuestions.filter(q => q.course === 'A2')).toHaveLength(200);
  expect(new Set(allQuestions.map(q => q.id)).size).toBe(allQuestions.length);
});

it('preserves the numerical data used in project calculations', () => {
  expect(sc2022AutumnA1[18].table?.rows[2]).toEqual(['導入費用の安さ', '4', '8', '5', '7', '6']);
  expect(sc2022AutumnA1[23].table?.rows[1]).toEqual(['B', '220', '120', '80', '40']);
  expect(sc2022SpringA1[17].table?.rows[2]).toEqual(['アーンドバリュー（EV）', '40']);
  expect(sc2021AutumnA1[28].table?.rows[3]).toEqual(['D', '40', '10', '−10']);
});
