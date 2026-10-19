import { z } from 'zod';
import { getQuestionTerms } from '@/data/question-terms';

export const courseSchema = z.enum(['A1', 'A2']);
export type Course = z.infer<typeof courseSchema>;
export const optionIdSchema = z.enum(['a', 'b', 'c', 'd']);
export type OptionId = z.infer<typeof optionIdSchema>;
export const optionIds: OptionId[] = ['a', 'b', 'c', 'd'];
export const optionLabels: Record<OptionId, string> = { a: 'ア', b: 'イ', c: 'ウ', d: 'エ' };
export const markSchema = z.enum(['candidate', 'exclude', 'unsure']);
export type Mark = z.infer<typeof markSchema>;
export const optionMarkSchema = z.enum(['unknown', 'candidate', 'exclude', 'unsure']);
export type OptionMark = z.infer<typeof optionMarkSchema>;
const optionMarksSchema = z.object({ a: optionMarkSchema.optional(), b: optionMarkSchema.optional(), c: optionMarkSchema.optional(), d: optionMarkSchema.optional() });
export const optionMarkSymbols: Record<OptionMark, string> = { unknown: '?', candidate: '○', exclude: '×', unsure: '△' };
export const optionMarkLabels: Record<OptionMark, string> = { unknown: 'はてな', candidate: 'まる', exclude: 'ばつ', unsure: '三角' };
export const confidenceSchema = z.enum(['low', 'medium', 'high']);
export type Confidence = z.infer<typeof confidenceSchema>;
export const confidenceLabels: Record<Confidence, string> = { low: '低', medium: '中', high: '高' };
export const assessmentSchema = z.object({ mark: markSchema, confidence: confidenceSchema });
export type Assessment = z.infer<typeof assessmentSchema>;
// Retained only for reading earlier learning records and backups.
export const assessmentsSchema = z.object({ a: assessmentSchema, b: assessmentSchema, c: assessmentSchema, d: assessmentSchema });
export const legacyAnswerSchema = z.object({ questionId: z.string(), selected: optionIdSchema, assessments: assessmentsSchema });
export const responseConfidenceSchema = z.enum(['low', 'high', 'unknown']);
export type ResponseConfidence = z.infer<typeof responseConfidenceSchema>;
export type ReviewFlag = 'reviewDoubt' | 'reviewRequested';
export const responseConfidenceLabels: Record<ResponseConfidence, string> = { low: '迷いあり', high: '自信あり', unknown: 'わからない' };
const uncertainOptionsSchema = z.array(optionIdSchema).max(4).refine(ids => new Set(ids).size === ids.length, '迷った選択肢が重複しています。');
const quickAnswerBase = z.object({
  inputMode: z.literal('quick'), questionId: z.string(), selected: optionIdSchema.nullable(),
  confidence: responseConfidenceSchema, uncertainOptions: uncertainOptionsSchema, optionMarks: optionMarksSchema.optional(),
});
function validQuickAnswer(answer: { selected: OptionId | null; uncertainOptions: OptionId[]; confidence: ResponseConfidence }) {
  return answer.confidence === 'unknown' ? answer.selected === null : answer.selected !== null && !answer.uncertainOptions.includes(answer.selected);
}
export const quickAnswerSchema = quickAnswerBase.refine(validQuickAnswer, '自信あり・迷いありでは答えを1つ選び、わからないでは未解答として記録してください。');
export type QuickAnswerInput = z.infer<typeof quickAnswerSchema>;
export const answerSchema = z.union([quickAnswerSchema, legacyAnswerSchema]);
export type AnswerInput = z.infer<typeof answerSchema>;
export type Draft = { questionId: string; selected?: OptionId; uncertainOptions: OptionId[]; optionMarks?: z.infer<typeof optionMarksSchema> };
export type Question = {
  id: string; examId: string; course: Course; number: number; topic: string; title: string;
  kind: 'knowledge' | 'calculation';
  prompt: string; options: { id: OptionId; text: string; explanation: string }[];
  correct: OptionId; explanation: string;
  details?: { title?: string; items: string[] };
  code?: { title: string; text: string };
  table?: { caption: string; headers: string[]; rows: string[][] };
  // Inline SVG markup drawn with currentColor. Static data from this repository only.
  figure?: { caption: string; svg: string };
  source: { kind: 'original'; label: string } | {
    kind: 'ipa'; label: string; year: number; season: 'autumn' | 'spring'; section: string;
    questionNumber: number; questionUrl: string; answerUrl: string; listingUrl: string; adaptationNote: string;
  };
};
export const reviewTermsSchema = z.array(z.string().min(1).max(100)).max(40)
  .refine(terms => new Set(terms).size === terms.length, '復習する単語が重複しています。');
export const reviewWordsSchema = z.array(z.string().min(1).max(100)).max(10_000)
  .refine(terms => new Set(terms).size === terms.length, '復習する単語が重複しています。');
const attemptFields = {
  id: z.string(), answeredAt: z.string().datetime(), correct: z.boolean(),
  reason: z.string(), reviewMode: z.literal('count').optional(),
  reviewDoubt: z.boolean().optional(),
  reviewRequested: z.boolean().optional(),
  reviewTerms: reviewTermsSchema.optional(),
  requiredReviews: z.number().int().nonnegative().optional(), remainingReviews: z.number().int().nonnegative().optional(),
  // Earlier backups used dates. They are converted when the history is loaded.
  nextReviewAt: z.string().datetime().optional(), intervalMinutes: z.number().positive().optional(),
};
function validReviewMetadata(value: { reviewMode?: 'count'; requiredReviews?: number; remainingReviews?: number; nextReviewAt?: string; intervalMinutes?: number }) {
  return value.reviewMode === 'count'
    ? value.requiredReviews !== undefined && value.remainingReviews !== undefined && value.remainingReviews <= value.requiredReviews
    : value.nextReviewAt !== undefined && value.intervalMinutes !== undefined;
}
export const attemptSchema = z.union([
  quickAnswerBase.extend(attemptFields).refine(validQuickAnswer, '回答の自信と選んだ答えが一致していません。').refine(validReviewMetadata, '復習回数が正しくありません。'),
  legacyAnswerSchema.extend({ ...attemptFields, confidence: confidenceSchema }).refine(validReviewMetadata, '復習回数が正しくありません。'),
]);
export type Attempt = z.infer<typeof attemptSchema>;
export const reviewCardSchema = z.object({
  questionId: z.string(), requiredReviews: z.number().int().nonnegative(), remainingReviews: z.number().int().nonnegative(),
  lastAttemptId: z.string(), updatedAt: z.string().datetime(), reason: z.string(),
}).refine(card => card.remainingReviews <= card.requiredReviews, '残り回数が必要回数を超えています。');
export const legacyReviewCardSchema = z.object({
  questionId: z.string(), dueAt: z.string().datetime(), intervalMinutes: z.number().positive(),
  streak: z.number().int().nonnegative(), lapses: z.number().int().nonnegative(), lastAttemptId: z.string(), reason: z.string(),
});
export type ReviewCard = z.infer<typeof reviewCardSchema>;
export const settingsSchema = z.object({ dailyGoal: z.number().int().min(1).max(100), defaultCourse: courseSchema });
export type Settings = z.infer<typeof settingsSchema>;
export const defaultSettings: Settings = { dailyGoal: 5, defaultCourse: 'A1' };
export type Snapshot = { attempts: Attempt[]; cards: ReviewCard[]; bookmarks: string[]; drafts: Draft[]; reviewWords: string[]; settings: Settings };
export const emptySnapshot = (): Snapshot => ({ attempts: [], cards: [], bookmarks: [], drafts: [], reviewWords: [], settings: defaultSettings });
export function collectReviewWords(attempts: Pick<Attempt, 'reviewTerms'>[]): string[] {
  return [...new Set(attempts.flatMap(attempt => attempt.reviewTerms ?? []))];
}

export function isQuickAnswer(answer: AnswerInput): answer is QuickAnswerInput { return 'inputMode' in answer && answer.inputMode === 'quick'; }
export function isAnswerComplete(draft: Draft): boolean { return optionIdSchema.safeParse(draft.selected).success; }
export function overallConfidence(assessments: z.infer<typeof assessmentsSchema>): Confidence {
  const values = Object.values(assessments);
  if (values.some(a => a.mark === 'unsure' || a.confidence === 'low')) return 'low';
  return values.some(a => a.confidence === 'medium') ? 'medium' : 'high';
}
export function answerConfidence(answer: AnswerInput): Confidence | ResponseConfidence { return isQuickAnswer(answer) ? answer.confidence : overallConfidence(answer.assessments); }
export function hasAnswerUncertainty(answer: AnswerInput): boolean {
  return answerConfidence(answer) !== 'high' || (isQuickAnswer(answer) && answer.uncertainOptions.length > 0);
}
export function isConfidentCorrectAnswer(answer: AnswerInput, question: Question): boolean {
  return answer.selected === question.correct && answerConfidence(answer) === 'high';
}
export function validateAnswerForQuestion(answer: AnswerInput & { reviewTerms?: string[] }, question: Question): void {
  if (answer.questionId !== question.id) throw new Error('問題と回答が一致しません。');
  if (answer.reviewTerms?.some(term => !getQuestionTerms(question).includes(term))) throw new Error('この問題に含まれていない単語が選ばれています。');
  if (isQuickAnswer(answer) && question.kind === 'calculation' && answer.uncertainOptions.length) throw new Error('計算問題は選んだ答えの自信だけを記録します。');
}
export function selectAnswer(draft: Draft, selected: OptionId): Draft {
  return { ...draft, selected, uncertainOptions: draft.uncertainOptions.filter(id => id !== selected) };
}
export function cycleOptionMark(draft: Draft, id: OptionId): Draft {
  const current = draft.optionMarks?.[id] ?? 'unknown';
  const next = current === 'candidate' ? 'exclude' : current === 'exclude' ? 'unsure' : 'candidate';
  return { ...draft, optionMarks: { ...draft.optionMarks, [id]: next } };
}
export function toggleUncertainOption(draft: Draft, id: OptionId): Draft {
  if (id === draft.selected) return draft;
  return { ...draft, uncertainOptions: draft.uncertainOptions.includes(id) ? draft.uncertainOptions.filter(value => value !== id) : [...draft.uncertainOptions, id] };
}
export function createQuickAnswer(draft: Draft, confidence: ResponseConfidence, question: Question): QuickAnswerInput {
  return quickAnswerSchema.parse({ ...draft, inputMode: 'quick', selected: confidence === 'unknown' ? null : draft.selected, confidence, uncertainOptions: question.kind === 'calculation' ? [] : draft.uncertainOptions });
}
const storedDraftSchema = z.object({
  questionId: z.string(), selected: optionIdSchema.optional(),
  optionMarks: optionMarksSchema.optional(),
  uncertainOptions: z.array(optionIdSchema).max(4).refine(ids => new Set(ids).size === ids.length).optional(),
  assessments: z.object({ a: assessmentSchema.partial().optional(), b: assessmentSchema.partial().optional(), c: assessmentSchema.partial().optional(), d: assessmentSchema.partial().optional() }).optional(),
});
export function restoreDraft(value: unknown, question: Question): Draft {
  const draft = storedDraftSchema.parse(value);
  const uncertain = draft.uncertainOptions ?? optionIds.filter(id => {
    const assessment = draft.assessments?.[id];
    return assessment?.mark === 'unsure' || assessment?.mark === 'candidate' || (assessment?.confidence !== undefined && assessment.confidence !== 'high');
  });
  return { questionId: draft.questionId, selected: draft.selected, uncertainOptions: question.kind === 'calculation' ? [] : uncertain.filter(id => id !== draft.selected), ...(draft.optionMarks && { optionMarks: draft.optionMarks }) };
}
export function attemptConfidenceLabel(attempt: Attempt): string {
  return isQuickAnswer(attempt) ? responseConfidenceLabels[attempt.confidence] : `確信度 ${confidenceLabels[attempt.confidence]}`;
}
