import { glossaryAttemptSchema, glossaryBackupSchema, glossaryDraftSchema, type GlossaryAttempt, type GlossaryDraft, type GlossarySnapshot } from './model';

export const GLOSSARY_DB_NAME = 'orenotameno-glossary';
let connection: Promise<IDBDatabase> | undefined;
function open(): Promise<IDBDatabase> {
  if (!connection) connection = new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(new Error('用語の学習記録を保存できません。IndexedDBを利用できるブラウザで開いてください。')); return; }
    const request = indexedDB.open(GLOSSARY_DB_NAME, 1);
    request.onupgradeneeded = () => { request.result.createObjectStore('attempts', { keyPath: 'id' }); request.result.createObjectStore('drafts', { keyPath: 'termId' }); };
    request.onsuccess = () => { request.result.onversionchange = () => { request.result.close(); connection = undefined; }; resolve(request.result); };
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
  const db = await open(); const tx = db.transaction(['attempts', 'drafts'], 'readonly'); const finished = done(tx);
  const [attempts, drafts] = await Promise.all([read<GlossaryAttempt[]>(tx.objectStore('attempts').getAll()), read<GlossaryDraft[]>(tx.objectStore('drafts').getAll())]);
  await finished;
  return { attempts: attempts.sort((a, b) => a.answeredAt.localeCompare(b.answeredAt)), drafts };
}
export async function writeGlossaryDraft(input: GlossaryDraft): Promise<void> {
  const draft = glossaryDraftSchema.parse(input); const db = await open(); const tx = db.transaction('drafts', 'readwrite'); const finished = done(tx);
  tx.objectStore('drafts').put(draft); await finished;
}
export async function commitGlossaryAttempt(input: GlossaryAttempt, submittedDraft: GlossaryDraft): Promise<void> {
  const attempt = glossaryAttemptSchema.parse(input); const db = await open(); const tx = db.transaction(['attempts', 'drafts'], 'readwrite'); const finished = done(tx);
  tx.objectStore('attempts').put(attempt);
  const drafts = tx.objectStore('drafts');
  const request = drafts.get(attempt.termId);
  request.onsuccess = () => {
    const current = request.result as GlossaryDraft | undefined;
    // A learner may navigate away and start another explanation while the LLM is responding.
    if (current?.updatedAt === submittedDraft.updatedAt && current.text === submittedDraft.text) drafts.delete(attempt.termId);
  };
  await finished;
}
export function serializeGlossary(snapshot: GlossarySnapshot): string {
  return JSON.stringify({ version: 1, kind: 'glossary', exportedAt: new Date().toISOString(), ...snapshot }, null, 2);
}
export function parseGlossaryBackup(text: string) { return glossaryBackupSchema.parse(JSON.parse(text)); }
export async function restoreGlossary(text: string): Promise<void> {
  const backup = parseGlossaryBackup(text);
  const db = await open(); const tx = db.transaction(['attempts', 'drafts'], 'readwrite'); const finished = done(tx);
  for (const attempt of backup.attempts) tx.objectStore('attempts').put(attempt);
  // Imported attempts merge by immutable ID; existing drafts take precedence.
  for (const draft of backup.drafts) {
    const request = tx.objectStore('drafts').get(draft.termId);
    request.onsuccess = () => { if (!request.result) tx.objectStore('drafts').put(draft); };
  }
  await finished;
}
