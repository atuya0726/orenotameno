import { describe, expect, it } from 'vitest';
import { questions } from '@/data/questions';
import { answerSchema, attemptSchema, createQuickAnswer, emptySnapshot, hasAnswerUncertainty, isAnswerComplete, isQuickAnswer, legacyAnswerSchema, overallConfidence, restoreDraft, selectAnswer, toggleUncertainOption, type Draft, type QuickAnswerInput, type ResponseConfidence } from './model';
import { activeReviews, rebuildReviewHistory, scheduleAnswer } from './scheduler';
import { exportBackup, parseBackup } from './db';

const calculation = questions.find(q => q.number === 1)!;
const knowledge = questions.find(q => q.number === 2)!;
const now = new Date('2026-10-19T03:00:00.000Z');
function answer(confidence: ResponseConfidence = 'high', question = knowledge): QuickAnswerInput {
  return { inputMode: 'quick', questionId: question.id, selected: question.correct, confidence, uncertainOptions: [] };
}
function legacyAnswer() {
  return legacyAnswerSchema.parse({ questionId: knowledge.id, selected: knowledge.correct, assessments: {
    a: { mark: 'exclude', confidence: 'high' }, b: { mark: 'candidate', confidence: 'high' },
    c: { mark: 'exclude', confidence: 'high' }, d: { mark: 'exclude', confidence: 'high' },
  } });
}

describe('quick answers and optional uncertainty', () => {
  it('requires only a selected answer in the draft, and an explicit confidence when submitted', () => {
    const draft: Draft = { questionId: knowledge.id, uncertainOptions: [] };
    expect(isAnswerComplete(draft)).toBe(false);
    const selected = selectAnswer(draft, 'b');
    expect(isAnswerComplete(selected)).toBe(true);
    expect(createQuickAnswer(selected, 'high', knowledge)).toEqual(answer());
    expect(answerSchema.safeParse({ ...selected, inputMode: 'quick' }).success).toBe(false);
    expect(answerSchema.safeParse({ ...answer(), confidence: 'medium' }).success).toBe(false);
    expect(answerSchema.safeParse({ ...answer(), selected: null }).success).toBe(false);
    expect(answerSchema.safeParse({ ...answer(), confidence: 'unknown' }).success).toBe(false);
  });
  it('allows an explicit unknown response without selecting or fabricating an answer', () => {
    const draft: Draft = { questionId: knowledge.id, uncertainOptions: ['a', 'b', 'c', 'd'] };
    const input = createQuickAnswer(draft, 'unknown', knowledge);
    expect(input.selected).toBeNull();
    expect(input.uncertainOptions).toEqual(['a', 'b', 'c', 'd']);
    const { attempt, card } = scheduleAnswer(input, knowledge, undefined, now);
    expect(attempt).toMatchObject({ selected: null, confidence: 'unknown', correct: false });
    expect(attempt).not.toHaveProperty('assessments');
    expect(card.remainingReviews).toBe(3);
    expect(card.requiredReviews).toBe(3);
    expect(card.reason).toBe('わからなかった問題を復習します。');
    expect(hasAnswerUncertainty(attempt)).toBe(true);
    const decoded = parseBackup(exportBackup({ ...emptySnapshot(), attempts: [attempt], cards: [card] }));
    expect(decoded.attempts[0]).toEqual(attempt);
  });
  it('can explicitly give up after initially selecting a choice, including in calculations', () => {
    const input = createQuickAnswer({ questionId: calculation.id, selected: 'b', uncertainOptions: [] }, 'unknown', calculation);
    expect(input.selected).toBeNull();
    const { attempt } = scheduleAnswer(input, calculation, undefined, now);
    expect(attempt.correct).toBe(false);
    expect(attempt.confidence).toBe('unknown');
  });
  it('records uncertainty only where explicitly marked, without assessing untouched alternatives', () => {
    const draft = toggleUncertainOption({ questionId: knowledge.id, selected: 'b', uncertainOptions: [] }, 'a');
    const response = createQuickAnswer(draft, 'high', knowledge);
    const { attempt } = scheduleAnswer(response, knowledge, undefined, now);
    expect(isQuickAnswer(attempt)).toBe(true);
    expect(attempt).not.toHaveProperty('assessments');
    expect(attempt).toMatchObject({ selected: 'b', confidence: 'high', uncertainOptions: ['a'] });
    expect(hasAnswerUncertainty(attempt)).toBe(true);
    expect(response.uncertainOptions).not.toContain('c');
  });
  it('removes an uncertainty flag when that choice becomes the selected answer', () => {
    const draft: Draft = { questionId: knowledge.id, selected: 'b', uncertainOptions: ['a', 'c'] };
    const next = selectAnswer(draft, 'a');
    expect(next).toEqual({ questionId: knowledge.id, selected: 'a', uncertainOptions: ['c'] });
    expect(selectAnswer(next, 'b').uncertainOptions).toEqual(['c']);
    expect(toggleUncertainOption(next, 'a')).toEqual(next);
    expect(toggleUncertainOption(next, 'c').uncertainOptions).toEqual([]);
    expect(draft.uncertainOptions).toEqual(['a', 'c']);
  });
  it('rejects duplicate flags, flags on the selected answer, and invalid options', () => {
    for (const uncertainOptions of [['a', 'a'], ['b'], ['e']]) {
      expect(answerSchema.safeParse({ ...answer(), uncertainOptions }).success).toBe(false);
    }
  });
  it('keeps calculation answers limited to the selected answer', () => {
    const draft: Draft = { questionId: calculation.id, selected: 'b', uncertainOptions: ['a'] };
    expect(createQuickAnswer(draft, 'high', calculation).uncertainOptions).toEqual([]);
    expect(restoreDraft(draft, calculation).uncertainOptions).toEqual([]);
    expect(() => scheduleAnswer({ ...answer('high', calculation), uncertainOptions: ['a'] }, calculation)).toThrow('計算問題');
    const { attempt } = scheduleAnswer(answer('high', calculation), calculation, undefined, now);
    expect(attempt.confidence).toBe('high');
    expect(attempt).not.toHaveProperty('assessments');
  });
  it('restores earlier drafts with the selected answer and relevant optional flags', () => {
    const earlier = { ...legacyAnswer(), assessments: {
      ...legacyAnswer().assessments,
      a: { mark: 'unsure', confidence: 'high' }, c: { confidence: 'medium' },
    } };
    expect(restoreDraft(earlier, knowledge)).toEqual({ questionId: knowledge.id, selected: 'b', uncertainOptions: ['a', 'c'] });
    expect(restoreDraft({ ...earlier, questionId: calculation.id }, calculation).uncertainOptions).toEqual([]);
  });
  it('can restore all four optional flags before an answer has been selected', () => {
    const draft: Draft = { questionId: knowledge.id, uncertainOptions: ['a', 'b', 'c', 'd'] };
    expect(restoreDraft(draft, knowledge)).toEqual(draft);
    expect(createQuickAnswer(selectAnswer(draft, 'b'), 'low', knowledge).uncertainOptions).toEqual(['a', 'c', 'd']);
  });
});

describe('review weights', () => {
  it('gives all mistakes and unknown answers the heaviest weight', () => {
    expect(scheduleAnswer({ ...answer(), selected: 'a' }, knowledge, undefined, now).card.remainingReviews).toBe(3);
    expect(scheduleAnswer({ ...answer('low'), selected: 'a' }, knowledge, undefined, now).card.remainingReviews).toBe(3);
    expect(scheduleAnswer({ ...answer('unknown'), selected: null }, knowledge, undefined, now).card.remainingReviews).toBe(3);
  });
  it('excludes an initially confident correct answer from active reviews', () => {
    const { attempt, card } = scheduleAnswer(answer(), knowledge, undefined, now);
    expect(attempt.remainingReviews).toBe(0);
    expect(activeReviews([card])).toEqual([]);
    expect(attempt).not.toHaveProperty('nextReviewAt');
    expect(attempt).not.toHaveProperty('intervalMinutes');
  });
  it('requires two reviews for a doubtful correct answer', () => {
    const { attempt, card } = scheduleAnswer(answer('low'), knowledge, undefined, now);
    expect(attempt.correct).toBe(true);
    expect(card.remainingReviews).toBe(2);
    expect(card.requiredReviews).toBe(2);
  });
  it('retains optional markers without scheduling a confident correct answer', () => {
    const { attempt, card } = scheduleAnswer({ ...answer(), uncertainOptions: ['a'] }, knowledge, undefined, now);
    expect(attempt.confidence).toBe('high');
    expect(attempt).toMatchObject({ uncertainOptions: ['a'] });
    expect(card.remainingReviews).toBe(0);
  });
  it('clears a queued mistake immediately after a confident correct answer', () => {
    const mistake = { ...answer('high', calculation), selected: 'a' as const };
    const first = scheduleAnswer(mistake, calculation, undefined, now);
    const second = scheduleAnswer(answer('high', calculation), calculation, first.card, now);
    expect([first, second].map(s => s.card.remainingReviews)).toEqual([3, 0]);
    expect(second.card.requiredReviews).toBe(0);
    expect(activeReviews([second.card])).toEqual([]);
    expect(first.card.remainingReviews).toBe(3);
    expect(first.attempt.confidence).toBe('high');
  });
  it('updates the weight from the latest answer instead of retaining an earlier weight', () => {
    const first = scheduleAnswer({ ...answer(), selected: 'a' }, knowledge, undefined, now);
    const doubtful = scheduleAnswer(answer('low'), knowledge, first.card, now);
    const wrong = scheduleAnswer({ ...answer('low'), selected: 'a' }, knowledge, doubtful.card, now);
    const unknown = scheduleAnswer({ ...answer('unknown'), selected: null }, knowledge, wrong.card, now);
    expect([doubtful, wrong, unknown].map(s => s.card.remainingReviews)).toEqual([2, 3, 3]);
    const progress = scheduleAnswer(answer(), knowledge, first.card, now);
    const reset = scheduleAnswer({ ...answer(), selected: 'a' }, knowledge, progress.card, now);
    expect(reset.card.remainingReviews).toBe(3);
    expect(reset.card.requiredReviews).toBe(3);
  });
  it('makes review questions available immediately, with larger counts first', () => {
    const three = scheduleAnswer({ ...answer(), selected: 'a' }, knowledge, undefined, now).card;
    const two = scheduleAnswer(answer('low', calculation), calculation, undefined, now).card;
    const done = { ...two, questionId: 'completed', remainingReviews: 0 };
    expect(activeReviews([two, done, three]).map(c => c.remainingReviews)).toEqual([3, 2]);
  });
  it('copies optional uncertainty flags before saving', () => {
    const input = { ...answer(), uncertainOptions: ['a'] as QuickAnswerInput['uncertainOptions'] };
    const { attempt } = scheduleAnswer(input, knowledge, undefined, now);
    input.uncertainOptions.push('c');
    expect(attempt).toMatchObject({ uncertainOptions: ['a'] });
  });
  it('rejects answers for another question', () => {
    expect(() => scheduleAnswer({ ...answer(), questionId: 'another' }, knowledge)).toThrow('問題と回答');
  });
  it('converts earlier medium confidence to two reviews', () => {
    const medium = legacyAnswer(); medium.assessments.b.confidence = 'medium';
    expect(overallConfidence(medium.assessments)).toBe('medium');
    expect(scheduleAnswer(medium, knowledge, undefined, now).card.remainingReviews).toBe(2);
  });
  it('rebuilds remaining work from history instead of reviving stale backup schedules', () => {
    const first = scheduleAnswer({ ...answer(), selected: 'a' }, knowledge, undefined, now);
    const second = scheduleAnswer(answer(), knowledge, first.card, new Date(now.getTime() + 1000));
    const third = scheduleAnswer(answer(), knowledge, second.card, new Date(now.getTime() + 2000));
    const result = rebuildReviewHistory([third.attempt, first.attempt, second.attempt]);
    expect(result.cards[0].remainingReviews).toBe(0);
    expect(result.attempts.map(a => a.remainingReviews)).toEqual([3, 0, 0]);
  });
});

describe('doubt marked after answering', () => {
  it('adds a correct answer to reviews and reverses the flag without adding an attempt', () => {
    const { attempt } = scheduleAnswer(answer(), knowledge, undefined, now);
    const marked = rebuildReviewHistory([{ ...attempt, reviewDoubt: true }]);
    expect(marked.cards[0].remainingReviews).toBe(2);
    expect(marked.attempts).toHaveLength(1);
    expect(marked.attempts[0]).toMatchObject({ id: attempt.id, answeredAt: attempt.answeredAt, selected: knowledge.correct, confidence: 'high', correct: true, reviewDoubt: true });
    const cleared = rebuildReviewHistory([{ ...marked.attempts[0], reviewDoubt: false }]);
    expect(activeReviews(cleared.cards)).toHaveLength(0);
    expect(cleared.attempts[0].id).toBe(attempt.id);
  });
  it('replays later answers when an earlier flag changes', () => {
    const first = scheduleAnswer(answer(), knowledge, undefined, now);
    const later = scheduleAnswer(answer(), knowledge, first.card, new Date(now.getTime() + 1000));
    const marked = rebuildReviewHistory([{ ...first.attempt, reviewDoubt: true }, later.attempt]);
    expect(marked.attempts.map(attempt => attempt.remainingReviews)).toEqual([2, 0]);
    expect(marked.cards[0].lastAttemptId).toBe(later.attempt.id);
    const cleared = rebuildReviewHistory(marked.attempts.map(attempt => ({ ...attempt, reviewDoubt: false })));
    expect(cleared.attempts.map(attempt => attempt.remainingReviews)).toEqual([0, 0]);
    expect(cleared.attempts).toHaveLength(2);
  });
  it('preserves flagged answers and their reviews in backups', () => {
    const { attempt } = scheduleAnswer(answer(), knowledge, undefined, now);
    const marked = rebuildReviewHistory([{ ...attempt, reviewDoubt: true }]);
    const restored = parseBackup(exportBackup({ ...emptySnapshot(), ...marked }));
    expect(restored.attempts[0].reviewDoubt).toBe(true);
    expect(restored.cards[0].remainingReviews).toBe(2);
  });
  it('retains reviews required by the original answer when the flag is cleared', () => {
    for (const input of [answer('low'), { ...answer(), selected: 'a' as const }, { ...answer('unknown'), selected: null }]) {
      const { attempt, card } = scheduleAnswer(input, knowledge, undefined, now);
      const cleared = rebuildReviewHistory([{ ...attempt, reviewDoubt: false }]);
      expect(cleared.cards[0].remainingReviews).toBe(card.remainingReviews);
      expect(cleared.cards[0].remainingReviews).toBeGreaterThan(0);
    }
  });
});

describe('reviews requested after answering', () => {
  it('keeps wrong and unknown answers heaviest regardless of either review flag', () => {
    const inputs: QuickAnswerInput[] = [{ ...answer(), selected: 'a' }, { ...answer('low'), selected: 'a' }, { ...answer('unknown'), selected: null }];
    for (const input of inputs) {
      const { attempt } = scheduleAnswer(input, knowledge, undefined, now);
      for (const reviewDoubt of [false, true]) for (const reviewRequested of [false, true]) {
        const result = rebuildReviewHistory([{ ...attempt, reviewDoubt, reviewRequested }]);
        expect(result.cards[0].remainingReviews).toBe(3);
      }
    }
  });
  it.each([
    { reviewDoubt: false, reviewRequested: false, remaining: 0 },
    { reviewDoubt: true, reviewRequested: false, remaining: 2 },
    { reviewDoubt: false, reviewRequested: true, remaining: 2 },
    { reviewDoubt: true, reviewRequested: true, remaining: 2 },
  ])('combines independent flags without duplicating the queue: %j', ({ reviewDoubt, reviewRequested, remaining }) => {
    const { attempt } = scheduleAnswer(answer(), knowledge, undefined, now);
    const result = rebuildReviewHistory([{ ...attempt, reviewDoubt, reviewRequested }]);
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0].remainingReviews).toBe(remaining);
    expect(result.attempts).toHaveLength(1);
    expect(result.attempts[0]).toMatchObject({ id: attempt.id, reviewDoubt, reviewRequested });
  });
  it('retains the other reason for review when one flag is cleared', () => {
    const { attempt } = scheduleAnswer(answer(), knowledge, undefined, now);
    const both = rebuildReviewHistory([{ ...attempt, reviewDoubt: true, reviewRequested: true }]);
    for (const flag of ['reviewDoubt', 'reviewRequested'] as const) {
      const partial = rebuildReviewHistory([{ ...both.attempts[0], [flag]: false }]);
      expect(partial.cards[0].remainingReviews).toBe(2);
    }
    const cleared = rebuildReviewHistory([{ ...both.attempts[0], reviewDoubt: false, reviewRequested: false }]);
    expect(activeReviews(cleared.cards)).toHaveLength(0);
  });
  it('retains a requested review independently of doubt when importing a backup', () => {
    const { attempt } = scheduleAnswer(answer(), knowledge, undefined, now);
    const marked = rebuildReviewHistory([{ ...attempt, reviewDoubt: false, reviewRequested: true }]);
    const restored = parseBackup(exportBackup({ ...emptySnapshot(), ...marked }));
    expect(restored.attempts[0]).toMatchObject({ reviewDoubt: false, reviewRequested: true });
    expect(restored.cards[0].remainingReviews).toBe(2);
  });
});

describe('vocabulary picked after answering', () => {
  it('queues a correct answer while any selected term remains', () => {
    const { attempt } = scheduleAnswer(answer(), knowledge, undefined, now);
    const both = rebuildReviewHistory([{ ...attempt, reviewTerms: ['ROC曲線', '偽陽性率'] }]);
    expect(both.cards[0].remainingReviews).toBe(2);
    expect(both.attempts).toHaveLength(1);
    expect(both.attempts[0]).toMatchObject({ id: attempt.id, confidence: 'high', reviewTerms: ['ROC曲線', '偽陽性率'] });
    const one = rebuildReviewHistory([{ ...both.attempts[0], reviewTerms: ['偽陽性率'] }]);
    expect(one.cards[0].remainingReviews).toBe(2);
    const none = rebuildReviewHistory([{ ...one.attempts[0], reviewTerms: [] }]);
    expect(activeReviews(none.cards)).toEqual([]);
  });
  it('preserves the question-level review request when all terms are cleared', () => {
    const { attempt } = scheduleAnswer(answer(), knowledge, undefined, now);
    const result = rebuildReviewHistory([{ ...attempt, reviewRequested: true, reviewTerms: [] }]);
    expect(result.cards[0].remainingReviews).toBe(2);
  });
  it('keeps wrong and unknown answers at the heaviest weight when words are picked', () => {
    const inputs: QuickAnswerInput[] = [{ ...answer(), selected: 'a' }, { ...answer('unknown'), selected: null }];
    for (const input of inputs) {
      const { attempt } = scheduleAnswer(input, knowledge, undefined, now);
      const result = rebuildReviewHistory([{ ...attempt, reviewTerms: ['ROC曲線'] }]);
      expect(result.cards[0].remainingReviews).toBe(3);
    }
  });
  it('round-trips selected terms in backups and rejects duplicates or unrelated terms', () => {
    const { attempt } = scheduleAnswer(answer(), knowledge, undefined, now);
    const result = rebuildReviewHistory([{ ...attempt, reviewTerms: ['偽陽性率'] }]);
    const restored = parseBackup(exportBackup({ ...emptySnapshot(), ...result }));
    expect(restored.attempts[0].reviewTerms).toEqual(['偽陽性率']);
    expect(restored.cards[0].remainingReviews).toBe(2);
    expect(() => rebuildReviewHistory([{ ...attempt, reviewTerms: ['ポアソン分布'] }])).toThrow('この問題に含まれていない単語');
    expect(attemptSchema.safeParse({ ...attempt, reviewTerms: ['ROC曲線', 'ROC曲線'] }).success).toBe(false);
  });
});

describe('portable learning records', () => {
  it('round-trips new and earlier answers together without fabricating alternative assessments', () => {
    const state = emptySnapshot();
    const quick = scheduleAnswer({ ...answer(), uncertainOptions: ['a'] }, knowledge, undefined, now);
    const legacy = scheduleAnswer(legacyAnswer(), knowledge, undefined, now);
    state.attempts = [legacy.attempt, quick.attempt]; state.cards = [quick.card]; state.bookmarks = [knowledge.id];
    const encoded = exportBackup(state);
    expect(JSON.parse(encoded).version).toBe(3);
    const decoded = parseBackup(encoded);
    expect(decoded.attempts).toEqual(state.attempts);
    expect(decoded.attempts[1]).not.toHaveProperty('assessments');
  });
  it('converts version 1 and 2 date-based records to counts without keeping scheduled dates', () => {
    const base = { ...legacyAnswer(), id: 'old-answer', answeredAt: now.toISOString(), correct: true, confidence: 'high', nextReviewAt: '2026-10-26T03:00:00.000Z', intervalMinutes: 10080, reason: '以前の予定' };
    const card = { questionId: knowledge.id, dueAt: base.nextReviewAt, intervalMinutes: 10080, streak: 1, lapses: 0, lastAttemptId: base.id, reason: base.reason };
    const old = { ...JSON.parse(exportBackup(emptySnapshot())), version: 1, attempts: [base], cards: [card] };
    const decoded = parseBackup(JSON.stringify(old));
    expect(decoded.cards[0].remainingReviews).toBe(0);
    expect(decoded.attempts[0]).not.toHaveProperty('nextReviewAt');
    old.version = 2;
    const quick = { ...answer('low'), id: 'old-quick', answeredAt: now.toISOString(), correct: true, nextReviewAt: '2026-10-20T03:00:00.000Z', intervalMinutes: 1440, reason: '以前の予定' };
    old.attempts = [quick];
    expect(parseBackup(JSON.stringify(old)).cards[0].remainingReviews).toBe(2);
  });
  it('rejects malformed, inconsistent, and calculation-only incompatible records', () => {
    const { attempt, card } = scheduleAnswer(answer(), knowledge, undefined, now);
    const encoded = exportBackup({ ...emptySnapshot(), attempts: [attempt], cards: [card] });
    expect(() => parseBackup('{broken')).toThrow();
    const wrongResult = JSON.parse(encoded); wrongResult.attempts[0].correct = false;
    expect(() => parseBackup(JSON.stringify(wrongResult))).toThrow();
    const invalidChoice = JSON.parse(encoded); invalidChoice.attempts[0].uncertainOptions = ['b'];
    expect(() => parseBackup(JSON.stringify(invalidChoice))).toThrow();
    const calc = scheduleAnswer(answer('high', calculation), calculation, undefined, now).attempt;
    const impossible = JSON.parse(exportBackup({ ...emptySnapshot(), attempts: [calc] })); impossible.attempts[0].uncertainOptions = ['a'];
    expect(() => parseBackup(JSON.stringify(impossible))).toThrow('計算問題');
    expect(attemptSchema.safeParse({ ...attempt, confidence: 'medium' }).success).toBe(false);
  });
});
