import { z } from 'zod';

// Levels describe exam-relevant depth: core meaning, applications, then specific details. Missing levels are B.
// The same wording feeds the AI instructions and the feedback screen, so edit it here only.
export const levels = ['B', 'A', 'S'] as const;
export type Level = typeof levels[number];
export const levelInfo: Record<Level, { name: string; description: string }> = {
  B: { name: '基本', description: '用語の意味・目的・基本の仕組み' },
  A: { name: '応用', description: '基本を踏まえた用途・理由・制約・影響' },
  S: { name: '発展', description: '試験範囲内の細かな条件・仕様・例外' },
};
export type Criterion = { id: string; title: string; hint: string; level?: Level };
export type Term = {
  // Aliases are other spellings of the same concept; related concepts get their own terms.
  id: string; name: string; aliases?: string[]; reading: string; category: string; definition: string; example: string;
  criteria: Criterion[]; commonMistakes: string[]; related: string[];
};
export const criterionResultSchema = z.object({
  id: z.string(), title: z.string(), status: z.enum(['covered', 'missing', 'review']), evidence: z.string(), hint: z.string(), level: z.enum(levels).optional(),
});
export type CriterionResult = z.infer<typeof criterionResultSchema>;
export const grades = ['S', 'A', 'B', 'C'] as const;
export type Grade = typeof grades[number];
// Only levels present in the rubric count. A B-only rubric can earn B, even with just one point.
export function gradeOf(criteria: CriterionResult[]): Grade {
  if (criteria.some(c => c.status === 'review')) return 'C';
  const basics = criteria.filter(c => (c.level ?? 'B') === 'B');
  if (!basics.length || basics.some(c => c.status !== 'covered')) return 'C';
  let grade: Grade = 'B';
  for (const level of ['A', 'S'] as const) {
    const items = criteria.filter(c => c.level === level);
    if (items.some(c => c.status !== 'covered')) break;
    if (items.length) grade = level;
  }
  return grade;
}
// A follow-up term the AI suggests; termId is set only when it matches a built-in term.
export const followUpSchema = z.object({ name: z.string().min(1).max(40), reason: z.string(), termId: z.string().optional() });
export const evaluationSchema = z.object({
  version: z.literal(1), status: z.enum(['covered', 'partial', 'review', 'unconfirmed']),
  covered: z.number().int().nonnegative(), total: z.number().int().positive(),
  criteria: z.array(criterionResultSchema), summary: z.string(),
  engine: z.literal('openai'), model: z.string().min(1),
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

// Terms suggested by the AI outside the built-in list. The AI writes their criteria and definition when evaluating.
export const EXTRA_TERM_PREFIX = 'extra:';
export const extraTermNameSchema = z.string().trim().min(1).max(40);
export function extraTerm(name: string, fromTermId?: string): Term {
  return { id: `${EXTRA_TERM_PREFIX}${name}`, name, reading: '', category: '追加の用語', definition: '', example: '', criteria: [], commonMistakes: [], related: fromTermId ? [fromTermId] : [] };
}
export function extraTermName(termId: string) {
  if (!termId.startsWith(EXTRA_TERM_PREFIX)) return undefined;
  const parsed = extraTermNameSchema.safeParse(termId.slice(EXTRA_TERM_PREFIX.length));
  return parsed.success ? parsed.data : undefined;
}
