import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { loadSnapshot, commitAnswer, saveDraft, saveBookmark, saveSettings, saveReviewFlag, saveReviewWord, importBackup } from './db';
import { saveStudySession, type StudySession } from './study-session';
import { emptySnapshot, type Snapshot, type Draft, type Question, type Attempt, type ReviewFlag, type Settings, type QuickAnswerInput } from './model';
import { scheduleAnswer } from './scheduler';
import { answerSchema } from './model';

type Store = { snapshot: Snapshot; ready: boolean; error: string; clearError: () => void; updateDraft: (draft: Draft) => void; answer: (question: Question, input: QuickAnswerInput, session?: StudySession) => Promise<Attempt>; updateStudySession: (session: StudySession) => Promise<void>; setReviewFlag: (attemptId: string, flag: ReviewFlag, active: boolean) => Promise<void>; setReviewWord: (term: string, active: boolean) => Promise<void>; toggleBookmark: (id: string) => Promise<void>; updateSettings: (settings: Settings) => Promise<void>; restore: (text: string) => Promise<void> };
const Context = createContext<Store | undefined>(undefined);
export function LearningProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<Snapshot>(emptySnapshot);
  const snapshotRef = useRef(snapshot);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const draftWrites = useRef(Promise.resolve());
  const answerLock = useRef(false);
  const change = useCallback((fn: (s: Snapshot) => Snapshot) => {
    setSnapshot(s => { const next = fn(s); snapshotRef.current = next; return next; });
  }, []);
  const refresh = useCallback(async () => { const next = await loadSnapshot(); snapshotRef.current = next; setSnapshot(next); }, []);
  const updateStudySession = useCallback(async (session: StudySession) => {
    try { saveStudySession(session); await refresh(); }
    catch (e) { setError(message(e)); throw e; }
  }, [refresh]);
  useEffect(() => { void refresh().then(() => setReady(true)).catch(e => setError(message(e))); }, [refresh]);
  function updateDraft(draft: Draft) {
    change(s => ({ ...s, drafts: [...s.drafts.filter(d => d.questionId !== draft.questionId), structuredClone(draft)] }));
    draftWrites.current = draftWrites.current.catch(() => {}).then(() => saveDraft(draft));
    void draftWrites.current.catch(e => setError(message(e)));
  }
  async function answer(question: Question, response: QuickAnswerInput, session?: StudySession) {
    if (answerLock.current) throw new Error('回答を保存しています。');
    answerLock.current = true;
    try {
      const input = answerSchema.parse(response);
      // A transient draft-save failure must not permanently block a full answer.
      // The complete answer is persisted atomically below before showing a result.
      await draftWrites.current.catch(() => {});
      const fresh = await loadSnapshot();
      const { attempt, card } = scheduleAnswer(input, question, fresh.cards.find(c => c.questionId === question.id), undefined, fresh.reviewWords);
      // Save the answer's identity first so a reload after the database commit
      // can restore its result without submitting a duplicate answer.
      if (session) saveStudySession({ ...session, attemptIds: [...session.attemptIds, attempt.id], updatedAt: attempt.answeredAt });
      try { await commitAnswer(attempt, card); }
      catch (e) {
        if (session) { try { saveStudySession(session); } catch { /* Loading also recovers an uncommitted answer. */ } }
        throw e;
      }
      await refresh();
      return attempt;
    } catch (e) { setError(message(e)); throw e; }
    finally { answerLock.current = false; }
  }
  async function setReviewFlag(attemptId: string, flag: ReviewFlag, active: boolean) {
    await draftWrites.current.catch(() => {});
    await saveReviewFlag(attemptId, flag, active);
    await refresh();
  }
  async function setReviewWord(term: string, active: boolean) {
    await draftWrites.current.catch(() => {});
    await saveReviewWord(term, active);
    await refresh();
  }
  async function toggleBookmark(id: string) {
    try { await draftWrites.current; await saveBookmark(id, !snapshotRef.current.bookmarks.includes(id)); await refresh(); }
    catch (e) { setError(message(e)); }
  }
  async function updateSettings(settings: Settings) { await draftWrites.current; await saveSettings(settings); await refresh(); }
  async function restore(text: string) { await draftWrites.current; await importBackup(text); await refresh(); }
  return <Context.Provider value={{ snapshot, ready, error, clearError: () => setError(''), updateDraft, answer, updateStudySession, setReviewFlag, setReviewWord, toggleBookmark, updateSettings, restore }}>{children}</Context.Provider>;
}
function message(e: unknown): string { return e instanceof Error ? e.message : '学習記録の保存に失敗しました。'; }
export function useLearning() { const store = useContext(Context); if (!store) throw new Error('LearningProvider is required'); return store; }
export function useNow() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 30_000); const update = () => setNow(Date.now()); window.addEventListener('focus', update); return () => { clearInterval(id); window.removeEventListener('focus', update); }; }, []);
  return now;
}
