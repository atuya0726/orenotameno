import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { commitGlossaryAttempt, loadGlossary, restoreGlossary, writeGlossaryDraft } from './db';
import { evaluateExplanation } from './evaluate';
import { explanationInputSchema, type GlossaryAttempt, type GlossaryDraft, type GlossarySnapshot, type Term } from './model';

type PendingSave = { attempt: GlossaryAttempt; draft: GlossaryDraft; promise?: Promise<void> };
function sameDraft(a: GlossaryDraft, b: GlossaryDraft) { return a.termId === b.termId && a.updatedAt === b.updatedAt && a.text === b.text; }

function useGlossaryStore() {
  const [snapshot, setSnapshot] = useState<GlossarySnapshot>({ attempts: [], drafts: [] });
  const [ready, setReady] = useState(false); const [error, setError] = useState('');
  const [saveStates, setSaveStates] = useState<Record<string, 'saving' | 'failed'>>({});
  const writes = useRef(Promise.resolve()); const pending = useRef(false);
  const pendingSaves = useRef(new Map<string, PendingSave>());
  const refresh = useCallback(async () => {
    const state = await loadGlossary();
    setSnapshot(current => {
      const attempts = new Map([...current.attempts, ...state.attempts].map(attempt => [attempt.id, attempt]));
      for (const { attempt } of pendingSaves.current.values()) attempts.set(attempt.id, attempt);
      return { ...state, attempts: [...attempts.values()].sort((a, b) => a.answeredAt.localeCompare(b.answeredAt)) };
    });
  }, []);
  useEffect(() => { void refresh().then(() => setReady(true)).catch(e => setError(message(e))); }, [refresh]);
  const updateDraft = useCallback((draft: GlossaryDraft) => {
    setSnapshot(s => ({ ...s, drafts: [...s.drafts.filter(d => d.termId !== draft.termId), draft] }));
    writes.current = writes.current.catch(() => {}).then(() => writeGlossaryDraft(draft));
    void writes.current.catch(e => setError(message(e)));
  }, []);
  function retrySave(id: string): Promise<void> {
    const entry = pendingSaves.current.get(id);
    if (!entry) return Promise.resolve();
    if (entry.promise) return entry.promise;
    setSaveStates(s => ({ ...s, [id]: 'saving' }));
    entry.promise = (async () => {
      try {
        await writes.current.catch(() => {});
        await commitGlossaryAttempt(entry.attempt, entry.draft);
        // The attempt is already visible. Update only this draft; don't reread the entire history.
        setSnapshot(s => ({ ...s, drafts: s.drafts.filter(d => !sameDraft(d, entry.draft)) }));
        pendingSaves.current.delete(id);
        setSaveStates(s => { const next = { ...s }; delete next[id]; return next; });
      } catch (e) {
        setSaveStates(s => ({ ...s, [id]: 'failed' }));
        throw e;
      } finally { entry.promise = undefined; }
    })();
    return entry.promise;
  }
  async function submit(term: Term, draft: GlossaryDraft) {
    if (pending.current) throw new Error('AIで説明をチェックしています。');
    if (draft.termId !== term.id) throw new Error('用語と説明が一致しません。');
    const text = explanationInputSchema.parse(draft.text);
    pending.current = true;
    try {
      const evaluation = await evaluateExplanation(term, text, draft.usedVoice);
      const attempt: GlossaryAttempt = { id: crypto.randomUUID(), termId: term.id, termName: term.name, text, answeredAt: new Date().toISOString(), usedVoice: draft.usedVoice, referenceViewed: draft.referenceViewed, evaluation, reference: evaluation.definition || term.definition };
      pendingSaves.current.set(attempt.id, { attempt, draft });
      setSnapshot(s => ({ ...s, attempts: [...s.attempts, attempt] }));
      setError('');
      const persisted = retrySave(attempt.id);
      // Saving may fail after navigating away; retain the result and offer a storage-only retry.
      void persisted.catch(() => {});
      return { attempt, persisted };
    } catch (e) { setError(message(e)); throw e; } finally { pending.current = false; }
  }
  async function restore(text: string) { await writes.current.catch(() => {}); await restoreGlossary(text); await refresh(); }
  return { snapshot, ready, error, saveStates, retrySave, clearError: () => setError(''), updateDraft, submit, restore };
}
const Context = createContext<ReturnType<typeof useGlossaryStore> | undefined>(undefined);
export function GlossaryProvider({ children }: { children: ReactNode }) { return <Context.Provider value={useGlossaryStore()}>{children}</Context.Provider>; }
export function useGlossary() { const store = useContext(Context); if (!store) throw new Error('GlossaryProvider is required'); return store; }
function message(error: unknown) { return error instanceof Error ? error.message : '用語の学習記録を保存できませんでした。'; }
