import { questionById } from '@/data/questions';
import { getQuestionTerms } from '@/data/question-terms';
import { answerSchema, attemptSchema, answerConfidence, isConfidentCorrectAnswer, validateAnswerForQuestion, type AnswerInput, type Question, type ReviewCard, type Attempt } from './model';

// The latest answer sets the review weight: unknown/wrong = 3, uncertain = 2,
// confident and correct = 0. Stored count fields remain compatible with backups.
function reviewRequirement(answer: AnswerInput & { reviewDoubt?: boolean; reviewRequested?: boolean; reviewTerms?: string[] }, question: Question) {
  const correct = answer.selected === question.correct;
  const confidence = answerConfidence(answer);
  if (!correct || confidence === 'unknown') {
    return { requiredReviews: 3, remainingReviews: 3, reason: confidence === 'unknown' ? 'わからなかった問題を復習します。' : '間違えた問題を優先して復習します。' };
  }
  if (!isConfidentCorrectAnswer(answer, question) || answer.reviewDoubt || answer.reviewRequested || answer.reviewTerms?.length) {
    const reason = answer.reviewDoubt ? '迷った問題として復習します。'
      : answer.reviewRequested ? '復習したい問題として復習します。'
      : answer.reviewTerms?.length ? '意味を確認したい単語があるため、復習します。' : '迷いが残っているため、復習します。';
    return { requiredReviews: 2, remainingReviews: 2, reason };
  }
  return { requiredReviews: 0, remainingReviews: 0, reason: '自信ありで正解したため、復習対象に入れません。' };
}

export function scheduleAnswer(input: AnswerInput, question: Question, _previous?: ReviewCard, now = new Date(), reviewWords: readonly string[] = []): { attempt: Attempt; card: ReviewCard } {
  const answer = answerSchema.parse(input);
  validateAnswerForQuestion(answer, question);
  const reviewTerms = getQuestionTerms(question).filter(term => reviewWords.includes(term));
  const review = reviewRequirement({ ...answer, reviewTerms }, question);
  const id = crypto.randomUUID();
  const attempt = attemptSchema.parse({
    ...structuredClone(answer), ...(reviewTerms.length > 0 && { reviewTerms }), id, answeredAt: now.toISOString(), correct: answer.selected === question.correct,
    confidence: answerConfidence(answer), reviewMode: 'count', ...review,
  });
  const card: ReviewCard = { questionId: question.id, lastAttemptId: id, updatedAt: attempt.answeredAt, ...review };
  return { attempt, card };
}

// Replay answers rather than trusting stored schedules. This migrates date-based
// records and ensures stale backup cards cannot restore already completed work.
export function rebuildReviewHistory(history: Attempt[], reviewWords?: readonly string[]): { attempts: Attempt[]; cards: ReviewCard[] } {
  const cards = new Map<string, ReviewCard>();
  const attempts = [...history].sort((a, b) => a.answeredAt.localeCompare(b.answeredAt)).map(attempt => {
    const question = questionById.get(attempt.questionId);
    if (!question) throw new Error('収録されていない問題の記録があります。');
    validateAnswerForQuestion(attempt, question);
    const reviewTerms = reviewWords && getQuestionTerms(question).filter(term => reviewWords.includes(term));
    const current = reviewTerms && (reviewTerms.length > 0 || attempt.reviewTerms !== undefined) ? { ...attempt, reviewTerms } : attempt;
    const review = reviewRequirement(current, question);
    const { nextReviewAt, intervalMinutes, ...saved } = current;
    const converted = attemptSchema.parse({ ...saved, reviewMode: 'count', ...review });
    cards.set(question.id, { questionId: question.id, lastAttemptId: attempt.id, updatedAt: attempt.answeredAt, ...review });
    return converted;
  });
  return { attempts, cards: [...cards.values()] };
}

export function activeReviews(cards: ReviewCard[]): ReviewCard[] {
  return cards.filter(card => card.remainingReviews > 0).sort((a, b) => b.remainingReviews - a.remainingReviews || a.updatedAt.localeCompare(b.updatedAt));
}
export function reviewPriorityLabel(weight: number): string {
  return weight >= 3 ? '優先して復習' : weight > 0 ? '要復習' : '復習なし';
}
