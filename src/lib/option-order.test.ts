import { describe, expect, it } from 'vitest';
import { questionById } from '@/data/questions';
import { emptySnapshot, optionIds, optionOrderSchema, quickAnswerSchema } from './model';
import { orderedOptions, shuffleOptionOrder } from './option-order';
import { scheduleAnswer } from './scheduler';
import { exportBackup, parseBackup } from './db';
import { restoreStudySession, studySessionSchema } from './study-session';

describe('option order', () => {
  it('can generate every permutation without changing the original IDs', () => {
    const permutations = new Set<string>();
    for (let a = 0; a < 4; a++) for (let b = 0; b < 3; b++) for (let c = 0; c < 2; c++) {
      const values = [a / 4, b / 3, c / 2];
      const order = shuffleOptionOrder(() => values.shift()!);
      expect([...order].sort()).toEqual(optionIds);
      permutations.add(order.join(''));
    }
    expect(permutations.size).toBe(24);
    expect(optionIds).toEqual(['a', 'b', 'c', 'd']);
  });

  it('keeps content, diagrams and explanations attached to their IDs while relabeling positions', () => {
    for (const id of ['sc-2025-autumn-a1-2', 'sc-2024-spring-a2-24', 'sc-2025-spring-a2-18']) {
      const question = questionById.get(id)!;
      const options = orderedOptions(question, ['c', 'a', 'd', 'b']);
      expect(options.map(option => option.label)).toEqual(['ア', 'イ', 'ウ', 'エ']);
      expect(options.map(({ label, ...option }) => option)).toEqual([2, 0, 3, 1].map(index => question.options[index]));
      expect(orderedOptions(question).map(option => option.id)).toEqual(optionIds);
    }
  });

  it('grades original IDs and preserves the displayed order in history and backups', () => {
    const question = questionById.get('sc-2025-autumn-a1-2')!;
    const optionOrder = ['b', 'd', 'a', 'c'];
    const input = quickAnswerSchema.parse({ inputMode: 'quick', questionId: question.id, selected: 'b', confidence: 'high', uncertainOptions: [], optionOrder });
    const { attempt, card } = scheduleAnswer(input, question);
    expect(attempt).toMatchObject({ correct: true, selected: 'b', optionOrder });
    const backup = parseBackup(exportBackup({ ...emptySnapshot(), attempts: [attempt], cards: [card] }));
    expect(backup.attempts[0].optionOrder).toEqual(optionOrder);
  });

  it('restores stored permutations and keeps legacy sessions in their original order', () => {
    const questionId = 'sc-2025-autumn-a1-2';
    const session = { id: 'test', path: '/study/A1', questionIds: [questionId], index: 0, attemptIds: [], updatedAt: '2026-10-22T12:00:00.000Z' };
    expect(restoreStudySession(session, [])).toEqual(session);
    const shuffled = { ...session, optionOrders: { [questionId]: ['c', 'a', 'd', 'b'] } };
    expect(restoreStudySession(shuffled, [])).toEqual(shuffled);
    for (const order of [['a', 'b', 'c'], ['a', 'a', 'c', 'd'], ['a', 'b', 'c', 'x']]) {
      expect(optionOrderSchema.safeParse(order).success).toBe(false);
      expect(studySessionSchema.safeParse({ ...session, optionOrders: { [questionId]: order } }).success).toBe(false);
    }
    expect(studySessionSchema.safeParse({ ...session, optionOrders: {} }).success).toBe(false);
  });
});
