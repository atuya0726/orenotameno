import { describe, expect, it } from 'vitest';
import { questions } from '@/data/questions';
import { collectReviewWords, createQuickAnswer, emptySnapshot } from './model';
import { parseBackup, exportBackup } from './db';
import { rebuildReviewHistory, scheduleAnswer } from './scheduler';

function answerQuestion(number: number, reviewWords: string[] = []) {
  const question = questions.find(question => question.number === number)!;
  const input = createQuickAnswer({ questionId: question.id, selected: question.correct, uncertainOptions: [] }, 'high', question);
  return scheduleAnswer(input, question, undefined, new Date('2026-10-19T03:00:00.000Z'), reviewWords);
}

describe('shared review words', () => {
  it('inherits a registered word across questions and clears its review weight globally when removed', () => {
    const first = answerQuestion(13, ['デジタル署名']);
    const second = answerQuestion(15, ['デジタル署名']);
    const unrelated = answerQuestion(2, ['デジタル署名']);
    expect(first.attempt.reviewTerms).toEqual(['デジタル署名']);
    expect(second.attempt.reviewTerms).toEqual(['デジタル署名']);
    expect([first, second, unrelated].map(result => result.card.remainingReviews)).toEqual([2, 2, 0]);
    const cleared = rebuildReviewHistory([first.attempt, second.attempt], []);
    expect(cleared.cards.map(card => card.remainingReviews)).toEqual([0, 0]);
    expect(cleared.attempts.every(attempt => attempt.reviewTerms?.length === 0)).toBe(true);
    expect(cleared.attempts.map(attempt => attempt.id)).toEqual([first.attempt.id, second.attempt.id]);
    const requested = rebuildReviewHistory([{ ...first.attempt, reviewRequested: true }], []);
    expect(requested.cards[0].remainingReviews).toBe(2);
    const wrong = rebuildReviewHistory([{ ...first.attempt, selected: 'a', correct: false }], []);
    expect(wrong.cards[0].remainingReviews).toBe(3);
  });

  it('migrates earlier per-answer selections into one deduplicated list', () => {
    const first = answerQuestion(13, ['デジタル署名']).attempt;
    const second = answerQuestion(15, ['デジタル署名', 'DNS']).attempt;
    expect(collectReviewWords([first, second])).toEqual(['デジタル署名', 'DNS']);
    const legacy = JSON.parse(exportBackup({ ...emptySnapshot(), attempts: [first, second] }));
    legacy.version = 3;
    delete legacy.reviewWords;
    const restored = parseBackup(JSON.stringify(legacy));
    expect(restored.reviewWords).toEqual(['デジタル署名', 'DNS']);
    expect(restored.attempts.map(attempt => attempt.id)).toEqual([first.id, second.id]);
    expect(restored.cards.map(card => card.remainingReviews)).toEqual([2, 2]);
  });

  it('backs up the shared list independently of attempts and does not revive explicitly removed words', () => {
    const wordsOnly = parseBackup(exportBackup({ ...emptySnapshot(), reviewWords: ['ROC曲線'] }));
    expect(wordsOnly.reviewWords).toEqual(['ROC曲線']);
    expect(wordsOnly.attempts).toEqual([]);
    const { attempt } = answerQuestion(2, ['ROC曲線']);
    const cleared = parseBackup(exportBackup({ ...emptySnapshot(), attempts: [attempt], reviewWords: [] }));
    expect(cleared.reviewWords).toEqual([]);
    expect(cleared.attempts[0].reviewTerms).toEqual([]);
    expect(cleared.cards[0].remainingReviews).toBe(0);
  });

  it('rejects malformed shared lists before import', () => {
    const backup = JSON.parse(exportBackup(emptySnapshot()));
    for (const reviewWords of [['ROC曲線', 'ROC曲線'], ['関係のない単語'], ['']]) {
      expect(() => parseBackup(JSON.stringify({ ...backup, reviewWords }))).toThrow();
    }
    delete backup.reviewWords;
    expect(() => parseBackup(JSON.stringify(backup))).toThrow('単語の復習リスト');
  });
});
