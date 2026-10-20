import { z } from 'zod';
import { questionById } from '@/data/questions';
import type { Attempt } from './model';

export const studySessionSchema = z.object({
  id: z.string().min(1), path: z.string().startsWith('/study/'),
  questionIds: z.array(z.string()).min(1).max(1000),
  index: z.number().int().nonnegative(), attemptIds: z.array(z.string()).max(1000),
  updatedAt: z.string().datetime(),
}).refine(session => new Set(session.questionIds).size === session.questionIds.length
  && session.index <= session.questionIds.length
  && (session.attemptIds.length === session.index || (session.index < session.questionIds.length && session.attemptIds.length === session.index + 1))
  && new Set(session.attemptIds).size === session.attemptIds.length);
export type StudySession = z.infer<typeof studySessionSchema>;

export function studyPath(pathname: string, search: URLSearchParams): string {
  const params = new URLSearchParams(search);
  params.delete('session'); params.sort();
  return pathname + (params.size ? `?${params}` : '');
}

// Ignore stale sessions if questions or their saved answers are no longer available.
export function restoreStudySession(value: unknown, attempts: Attempt[]): StudySession | null {
  const parsed = studySessionSchema.safeParse(value);
  if (!parsed.success) return null;
  const session = parsed.data;
  const byId = new Map(attempts.map(attempt => [attempt.id, attempt]));
  return session.questionIds.every(id => questionById.has(id))
    && session.attemptIds.every((id, index) => byId.get(id)?.questionId === session.questionIds[index]) ? session : null;
}

export function studySessionUrl(session: StudySession): string {
  const url = new URL(session.path, 'https://study.local');
  url.searchParams.set('session', session.id);
  return url.pathname + url.search;
}
