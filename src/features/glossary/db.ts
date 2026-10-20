import { glossaryAttemptSchema, glossaryBackupSchema, glossaryDraftSchema, type GlossaryAttempt, type GlossaryDraft, type GlossarySnapshot } from './model';
import { createSessionStore } from '@/lib/session-storage';

const glossaryDrafts = createSessionStore<GlossaryDraft>('orenotameno:glossary-draft:', value => glossaryDraftSchema.parse(value));

export const GLOSSARY_DB_NAME = 'orenotameno-glossary';
let connection: Promise<IDBDatabase> | undefined;
function open(): Promise<IDBDatabase> {
  if (!connection) connection = new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(new Error('用語の学習記録を保存できません。IndexedDBを利用できるブラウザで開いてください。')); return; }
    const request = indexedDB.open(GLOSSARY_DB_NAME, 1);
    request.onupgradeneeded = () => { request.result.createObjectStore('attempts', { keyPath: 'id' }); request.result.createObjectStore('drafts', { keyPath: 'termId' }); };
    request.onsuccess = () => {
      const db = request.result;
      db.onversionchange = () => { db.close(); connection = undefined; };
      const tx = db.transaction('drafts', 'readwrite');
      tx.objectStore('drafts').clear();
      void done(tx).then(() => resolve(db)).catch(error => { db.close(); connection = undefined; reject(error); });
    };
    request.onerror = () => { connection = undefined; reject(request.error); };
    request.onblocked = () => { connection = undefined; reject(new Error('用語学習を開いた別のタブを閉じ、再読み込みしてください。')); };
  });
  return connection;
}
function read<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
}
function done(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = tx.onerror = () => reject(tx.error ?? new Error('用語の学習記録を保存できませんでした。')); });
}
export async function loadGlossary(): Promise<GlossarySnapshot> {
  const db = await open(); const tx = db.transaction('attempts', 'readonly'); const finished = done(tx);
  const attempts = await read<GlossaryAttempt[]>(tx.objectStore('attempts').getAll());
  await finished;
  return { attempts: attempts.sort((a, b) => a.answeredAt.localeCompare(b.answeredAt)), drafts: glossaryDrafts.load() };
}
export async function writeGlossaryDraft(input: GlossaryDraft): Promise<void> {
  glossaryDrafts.save(input.termId, input);
}
export async function commitGlossaryAttempt(input: GlossaryAttempt, submittedDraft: GlossaryDraft): Promise<void> {
  const attempt = glossaryAttemptSchema.parse(input); const db = await open(); const tx = db.transaction('attempts', 'readwrite'); const finished = done(tx);
  tx.objectStore('attempts').put(attempt);
  await finished;
  try {
    const current = glossaryDrafts.load().find(draft => draft.termId === attempt.termId);
    // A learner may navigate away and start another explanation while the LLM is responding.
    if (current?.updatedAt === submittedDraft.updatedAt && current.text === submittedDraft.text) glossaryDrafts.remove(attempt.termId);
  } catch { /* The evaluation is already saved. */ }
}
export function serializeGlossary(snapshot: GlossarySnapshot): string {
  return JSON.stringify({ version: 1, kind: 'glossary', exportedAt: new Date().toISOString(), attempts: snapshot.attempts, drafts: [] }, null, 2);
}
export function parseGlossaryBackup(text: string) { return glossaryBackupSchema.parse(JSON.parse(text)); }
export async function restoreGlossary(text: string): Promise<void> {
  const backup = parseGlossaryBackup(text);
  const db = await open(); const tx = db.transaction('attempts', 'readwrite'); const finished = done(tx);
  for (const attempt of backup.attempts) tx.objectStore('attempts').put(attempt);
  await finished;
  // Drafts in older backups are restored only to this tab; existing drafts win.
  const existing = new Set(glossaryDrafts.load().map(draft => draft.termId));
  for (const draft of backup.drafts) {
    if (!existing.has(draft.termId)) { glossaryDrafts.save(draft.termId, draft); existing.add(draft.termId); }
  }
}
