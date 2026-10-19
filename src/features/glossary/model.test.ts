import { describe, expect, it } from 'vitest';
import { gradeOf, type CriterionResult, type Level } from './model';

function point(level?: Level, status: CriterionResult['status'] = 'covered'): CriterionResult {
  return { id: `${level ?? 'B'}-${status}`, title: '要点', level, status, evidence: '', hint: '' };
}

describe('用語ごとに必要な段階だけで評価する', () => {
  it('awards B for one or more B points without inventing A/S levels', () => {
    expect(gradeOf([point()])).toBe('B');
    expect(gradeOf([point('B'), point()])).toBe('B');
    expect(gradeOf([point('B', 'missing')])).toBe('C');
  });

  it('awards only the highest existing level whose preceding points are all covered', () => {
    expect(gradeOf([point('B'), point('A')])).toBe('A');
    expect(gradeOf([point('B'), point('S')])).toBe('S');
    expect(gradeOf([point('B'), point('S', 'missing')])).toBe('B');
    expect(gradeOf([point('B'), point('A', 'missing'), point('S')])).toBe('B');
    expect(gradeOf([point('B'), point('A'), point('S', 'missing')])).toBe('A');
    expect(gradeOf([point('B'), point('A'), point('S')])).toBe('S');
  });

  it('requires a B point and treats a factual error at any level as C', () => {
    expect(gradeOf([])).toBe('C');
    expect(gradeOf([point('A')])).toBe('C');
    expect(gradeOf([point('B'), point('A', 'review')])).toBe('C');
    expect(gradeOf([point('B', 'missing'), point('S')])).toBe('C');
  });
});
