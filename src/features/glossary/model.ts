import { z } from 'zod';

// Basics determine passing; deeper points are optional achievements.
export const levels = ['basic', 'deep'] as const;
export type Level = typeof levels[number];
export const levelInfo: Record<Level, { name: string; description: string }> = {
  basic: { name: '基本', description: '試験で押さえる意味・仕組み。ここまでで合格' },
  deep: { name: '深掘り', description: '使いどころ・注意点・tips。できた分だけプラス' },
};
const legacyLevels = ['B', 'A', 'S'] as const;
// Historical attempts/backups retain their original levels and grades.
export function criterionLevel(level?: Level | typeof legacyLevels[number]): Level {
  return level === 'deep' || level === 'A' || level === 'S' ? 'deep' : 'basic';
}
export type Criterion = { id: string; title: string; hint: string; level?: Level };
export type Term = {
  // Aliases are other spellings of the same concept; related concepts get their own terms.
  // reading is the English name, with abbreviations expanded (see docs/glossary-authoring.md).
  id: string; name: string; aliases?: string[]; reading: string; category: string; definition: string;
  criteria: Criterion[]; commonMistakes: string[]; related: string[];
};
const criterionStatusSchema = z.enum(['covered', 'missing', 'review']);
export const probabilitySchema = z.number().finite().min(0).max(1);
export const criterionDecisionSchema = z.object({
  choice: criterionStatusSchema,
  // Retain probability metadata from historical evaluations; new grades use only choice.
  confidence: probabilitySchema.optional(),
  probabilities: z.object({ covered: probabilitySchema, missing: probabilitySchema, review: probabilitySchema }).optional(),
});
export const criterionResultSchema = z.object({
  id: z.string(), title: z.string(), status: criterionStatusSchema, evidence: z.string(), hint: z.string(), level: z.enum([...levels, ...legacyLevels]).optional(),
  decision: criterionDecisionSchema.optional(),
});
export type CriterionResult = z.infer<typeof criterionResultSchema>;
export function isUncertainCriterion(criterion: CriterionResult) {
  return criterion.status === 'missing' && criterion.decision?.choice === 'covered' && criterion.decision.probabilities !== undefined;
}
export const grades = ['pass', 'pass-plus', 'retry', 'S', 'A', 'B', 'C'] as const;
export type Grade = typeof grades[number];
export type Outcome = 'pass' | 'pass-plus' | 'retry';
export function gradeOf(criteria: CriterionResult[]): Outcome {
  const basics = criteria.filter(c => criterionLevel(c.level) === 'basic');
  if (!basics.length || basics.some(c => c.status !== 'covered')) return 'retry';
  const deeper = criteria.filter(c => criterionLevel(c.level) === 'deep');
  return deeper.some(c => c.status === 'covered') && !deeper.some(c => c.status === 'review') ? 'pass-plus' : 'pass';
}
export function outcomeOf(evaluation: Evaluation): Outcome {
  if (evaluation.grade === 'S' || evaluation.grade === 'A') return 'pass-plus';
  if (evaluation.grade === 'B') return 'pass';
  if (evaluation.grade === 'C') return 'retry';
  return evaluation.grade ?? (evaluation.status === 'covered' ? 'pass' : 'retry');
}
// Retain earlier AI suggestions when reading historical attempts/backups.
export const followUpSchema = z.object({ name: z.string().min(1).max(40), reason: z.string(), termId: z.string().optional() });
export const evaluationSchema = z.object({
  version: z.literal(1), status: z.enum(['covered', 'partial', 'review', 'unconfirmed']),
  covered: z.number().int().nonnegative(), total: z.number().int().positive(),
  criteria: z.array(criterionResultSchema), summary: z.string(),
  engine: z.literal('openai'), api: z.literal('decisions').optional(), model: z.string().min(1),
  coveredProbabilityThreshold: probabilitySchema.optional(), // Historical cutoffs only.
  followUp: followUpSchema.optional(), definition: z.string().optional(), grade: z.enum(grades).optional(),
  // Older evaluations stored these before wording feedback was dropped.
  concerns: z.array(z.object({ message: z.string(), evidence: z.string() })).optional(), improvedExplanation: z.string().optional(),
});
export type Evaluation = z.infer<typeof evaluationSchema>;
export const EXPLANATION_MAX_LENGTH = 1000;
const savedExplanationSchema = z.string().trim().min(10).max(5000);
export const explanationInputSchema = z.string().trim().min(10, '10文字以上で、用語の意味を説明してください。').max(EXPLANATION_MAX_LENGTH, '説明は1,000文字以内にしてください。');
// Keep older drafts and attempts readable after lowering the input limit.
export const glossaryDraftSchema = z.object({
  termId: z.string(), text: z.string().max(5000), referenceViewed: z.boolean(), usedVoice: z.boolean(), updatedAt: z.string().datetime(),
});
export type GlossaryDraft = z.infer<typeof glossaryDraftSchema>;
export const glossaryAttemptSchema = z.object({
  id: z.string(), termId: z.string(), termName: z.string(), text: savedExplanationSchema,
  answeredAt: z.string().datetime(), usedVoice: z.boolean(), referenceViewed: z.boolean(),
  evaluation: evaluationSchema, reference: z.string(),
});
export type GlossaryAttempt = z.infer<typeof glossaryAttemptSchema>;
export type GlossarySnapshot = { attempts: GlossaryAttempt[]; drafts: GlossaryDraft[] };
export const glossaryBackupSchema = z.object({ version: z.literal(1), kind: z.literal('glossary'), exportedAt: z.string().datetime(), attempts: z.array(glossaryAttemptSchema).max(50_000), drafts: z.array(glossaryDraftSchema).max(500) });
