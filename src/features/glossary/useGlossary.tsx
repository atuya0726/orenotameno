import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { commitGlossaryAttempt, loadGlossary, restoreGlossary, writeGlossaryDraft } from './db';
import { evaluateExplanation } from './evaluate';
import { explanationInputSchema, type GlossaryAttempt, type GlossaryDraft, type GlossarySnapshot, type Term } from './model';

function useGlossaryStore() {
  const [snapshot, setSnapshot] = useState<GlossarySnapshot>({ attempts: [], drafts: [] });
  const [ready, setReady] = useState(false); const [error, setError] = useState('');
  const writes = useRef(Promise.resolve()); const pending = useRef(false);
  const refresh = useCallback(async () => { const state = await loadGlossary(); setSnapshot(state); }, []);
  useEffect(() => { void refresh().then(() => setReady(true)).catch(e => setError(message(e))); }, [refresh]);
  const updateDraft = useCallback((draft: GlossaryDraft) => {
    setSnapshot(s => ({ ...s, drafts: [...s.drafts.filter(d => d.termId !== draft.termId), draft] }));
    writes.current = writes.current.catch(() => {}).then(() => writeGlossaryDraft(draft));
    void writes.current.catch(e => setError(message(e)));
  }, []);
  async function submit(term: Term, draft: GlossaryDraft): Promise<GlossaryAttempt> {
    if (pending.current) throw new Error('学習記録を保存しています。');
    if (draft.termId !== term.id) throw new Error('用語と説明が一致しません。');
    const text = explanationInputSchema.parse(draft.text);
    pending.current = true;
    try {
      await writes.current.catch(() => {});
      const evaluation = await evaluateExplanation(term, text);
      const attempt: GlossaryAttempt = { id: crypto.randomUUID(), termId: term.id, termName: term.name, text, answeredAt: new Date().toISOString(), usedVoice: draft.usedVoice, referenceViewed: draft.referenceViewed, evaluation, reference: term.definition };
      await commitGlossaryAttempt(attempt, draft); await refresh(); setError(''); return attempt;
    } catch (e) { setError(message(e)); throw e; } finally { pending.current = false; }
  }
  async function restore(text: string) { await writes.current.catch(() => {}); await restoreGlossary(text); await refresh(); }
  return { snapshot, ready, error, clearError: () => setError(''), updateDraft, submit, restore };
}
const Context = createContext<ReturnType<typeof useGlossaryStore> | undefined>(undefined);
export function GlossaryProvider({ children }: { children: ReactNode }) { return <Context.Provider value={useGlossaryStore()}>{children}</Context.Provider>; }
export function useGlossary() { const store = useContext(Context); if (!store) throw new Error('GlossaryProvider is required'); return store; }
function message(error: unknown) { return error instanceof Error ? error.message : '用語の学習記録を保存できませんでした。'; }
