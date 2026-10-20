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
const storagePrefix = 'orenotameno:study:';

export function saveStudySession(session: StudySession): void {
  const value = studySessionSchema.parse(session);
  sessionStorage.setItem(storagePrefix + value.id, JSON.stringify(value));
}

export function loadStudySessions(attempts: Attempt[]): StudySession[] {
  const sessions: StudySession[] = [];
  try {
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key?.startsWith(storagePrefix)) continue;
      try {
        const session = restoreStudySession(JSON.parse(sessionStorage.getItem(key) ?? 'null'), attempts);
        if (session) sessions.push(session);
      } catch { /* Ignore a damaged entry without losing the other sessions. */ }
    }
  } catch { /* Saving will report unavailable storage when starting an exercise. */ }
  return sessions.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

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
  // Progress is written before the answer transaction. If a reload interrupts it,
  // drop only that uncommitted answer and keep the queue and current position.
  if (session.attemptIds.length === session.index + 1 && !byId.has(session.attemptIds[session.index])) {
    session.attemptIds.pop();
  }
  return session.questionIds.every(id => questionById.has(id))
    && session.attemptIds.every((id, index) => byId.get(id)?.questionId === session.questionIds[index]) ? session : null;
}

export function studySessionUrl(session: StudySession): string {
  const url = new URL(session.path, 'https://study.local');
  url.searchParams.set('session', session.id);
  return url.pathname + url.search;
}
