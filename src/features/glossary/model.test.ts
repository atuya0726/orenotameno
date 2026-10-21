import { describe, expect, it } from 'vitest';
import { criterionLevel, gradeOf, meetsReviewTarget, outcomeOf, evaluationSchema, type CriterionResult, type Level, type Term } from './model';

function point(level?: CriterionResult['level'], status: CriterionResult['status'] = 'covered'): CriterionResult {
  return { id: `${level ?? 'basic'}-${status}`, title: '要点', level, status, evidence: '', hint: '' };
}
const evaluation = (criteria: CriterionResult[]) => evaluationSchema.parse({ version: 1, status: 'covered', covered: 1, total: 1, criteria, summary: '', engine: 'openai', model: 'test', grade: gradeOf(criteria) });
const term = (deeper = true): Term => ({ id: 'test', name: '用語', reading: '', category: '', definition: '', example: '', related: [], commonMistakes: [], criteria: [{ id: 'core', title: '基本', hint: '' }, ...(deeper ? [{ id: 'detail', title: '深掘り', hint: '', level: 'deep' as Level }] : [])] });

describe('基本と深掘りの判定', () => {
  it('passes when all basic points are covered, including a basic-only term', () => {
    expect(gradeOf([point()])).toBe('pass');
    expect(gradeOf([point('basic'), point()])).toBe('pass');
    expect(gradeOf([point('basic'), point('deep', 'missing')])).toBe('pass');
  });

  it('celebrates a correct deeper point without requiring every optional point', () => {
    expect(gradeOf([point('basic'), point('deep')])).toBe('pass-plus');
    expect(gradeOf([point('basic'), point('deep'), point('deep', 'missing')])).toBe('pass-plus');
    expect(gradeOf([point('basic'), point('deep'), point('deep')])).toBe('pass-plus');
  });

  it('keeps the basic pass when a deeper point is incorrect, showing corrections separately', () => {
    expect(gradeOf([point('basic'), point('deep', 'review')])).toBe('pass');
    expect(gradeOf([point('basic'), point('deep'), point('deep', 'review')])).toBe('pass');
  });

  it('requires basics even when deeper points are covered', () => {
    expect(gradeOf([])).toBe('retry');
    expect(gradeOf([point('deep')])).toBe('retry');
    expect(gradeOf([point('basic', 'missing'), point('deep')])).toBe('retry');
    expect(gradeOf([point('basic', 'review'), point('deep')])).toBe('retry');
  });

  it('reads historical levels without changing the saved evaluation', () => {
    expect(['B', 'A', 'S'].map(level => criterionLevel(level as CriterionResult['level']))).toEqual(['basic', 'deep', 'deep']);
    for (const [grade, outcome] of [['B', 'pass'], ['A', 'pass-plus'], ['S', 'pass-plus'], ['C', 'retry']] as const) {
      const historical = { ...evaluation([point('B'), point('S')]), grade };
      expect(outcomeOf(historical)).toBe(outcome);
      expect(historical.grade).toBe(grade);
    }
  });

  it('uses the selected review goal and falls back to basic for terms without deeper points', () => {
    const basic = evaluation([point('basic'), point('deep', 'missing')]);
    const deep = evaluation([point('basic'), point('deep')]);
    const retry = evaluation([point('basic', 'missing')]);
    expect(meetsReviewTarget(term(), basic, 'basic')).toBe(true);
    expect(meetsReviewTarget(term(), basic, 'deep')).toBe(false);
    expect(meetsReviewTarget(term(), deep, 'deep')).toBe(true);
    expect(meetsReviewTarget(term(false), basic, 'deep')).toBe(true);
    expect(meetsReviewTarget(term(false), retry, 'deep')).toBe(false);
  });
});
