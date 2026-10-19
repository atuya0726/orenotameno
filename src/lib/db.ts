import { z } from 'zod';
import { questionById } from '@/data/questions';
import { attemptSchema, reviewTermsSchema, reviewCardSchema, legacyReviewCardSchema, settingsSchema, defaultSettings, answerConfidence, validateAnswerForQuestion, restoreDraft, type Snapshot, type Draft, type Attempt, type ReviewCard, type ReviewFlag, type Settings } from './model';
import { rebuildReviewHistory } from './scheduler';

export const DB_NAME = 'orenotameno-sc';
let connection: Promise<IDBDatabase> | undefined;
export function openDatabase(): Promise<IDBDatabase> {
  if (!connection) connection = new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(new Error('このブラウザでは学習記録を保存できません。IndexedDBを利用できるブラウザで開いてください。')); return; }
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      db.createObjectStore('attempts', { keyPath: 'id' });
      db.createObjectStore('cards', { keyPath: 'questionId' });
      db.createObjectStore('bookmarks', { keyPath: 'questionId' });
      db.createObjectStore('drafts', { keyPath: 'questionId' });
      db.createObjectStore('settings', { keyPath: 'name' });
    };
    request.onsuccess = () => {
      request.result.onversionchange = () => { request.result.close(); connection = undefined; };
      resolve(request.result);
    };
    request.onerror = () => { connection = undefined; reject(request.error); };
    request.onblocked = () => { connection = undefined; reject(new Error('別のタブを閉じてから再読み込みしてください。')); };
  });
  return connection;
}
function result<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => { request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
}
function completed(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error ?? new Error('保存に失敗しました。'));
    transaction.onabort = () => reject(transaction.error ?? new Error('保存が中断されました。'));
  });
}
export async function loadSnapshot(): Promise<Snapshot> {
  const db = await openDatabase();
  const tx = db.transaction(['attempts', 'bookmarks', 'drafts', 'settings'], 'readonly');
  const done = completed(tx);
  const [attempts, bookmarks, drafts, settings] = await Promise.all([
    result<Attempt[]>(tx.objectStore('attempts').getAll()),
    result<{ questionId: string }[]>(tx.objectStore('bookmarks').getAll()), result<Draft[]>(tx.objectStore('drafts').getAll()),
    result<{ name: string; value: Settings } | undefined>(tx.objectStore('settings').get('preferences')),
  ]);
  await done;
  // Removed demo questions must not leave dangling references in the learning UI.
  // Keep their stored rows intact; only currently available questions are displayed.
  return {
    ...rebuildReviewHistory(attempts.filter(a => questionById.has(a.questionId))),
    bookmarks: bookmarks.map(b => b.questionId).filter(id => questionById.has(id)),
    drafts: drafts.filter(d => questionById.has(d.questionId)).map(d => restoreDraft(d, questionById.get(d.questionId)!)),
    settings: settings?.value ?? defaultSettings,
  };
}
export async function saveDraft(draft: Draft): Promise<void> {
  const db = await openDatabase(); const tx = db.transaction('drafts', 'readwrite');
  const done = completed(tx); tx.objectStore('drafts').put(structuredClone(draft)); await done;
}
export async function commitAnswer(attempt: Attempt, card: ReviewCard): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(['attempts', 'cards', 'drafts'], 'readwrite');
  const done = completed(tx);
  tx.objectStore('attempts').put(attempt); tx.objectStore('cards').put(card); tx.objectStore('drafts').delete(attempt.questionId);
  await done;
}
export async function saveReviewFlag(attemptId: string, flag: ReviewFlag, active: boolean): Promise<void> {
  // The review request replaces the earlier doubt button, including when cleared.
  const patch = flag === 'reviewRequested' ? { reviewRequested: active, reviewDoubt: false } : { reviewDoubt: active };
  await updateAttemptReview(attemptId, patch);
}
export async function saveReviewTerms(attemptId: string, terms: string[]): Promise<void> {
  await updateAttemptReview(attemptId, { reviewTerms: reviewTermsSchema.parse(terms) });
}
async function updateAttemptReview(attemptId: string, patch: Partial<Pick<Attempt, 'reviewDoubt' | 'reviewRequested' | 'reviewTerms'>>): Promise<void> {
  const db = await openDatabase();
  const tx = db.transaction(['attempts', 'cards'], 'readwrite');
  const done = completed(tx);
  try {
    const history = await result<Attempt[]>(tx.objectStore('attempts').getAll());
    const target = history.find(attempt => attempt.id === attemptId);
    if (!target) throw new Error('回答の記録が見つかりません。');
    // Replay this question's history so removing a flag also restores later reviews.
    const { attempts, cards } = rebuildReviewHistory(history.filter(attempt => attempt.questionId === target.questionId)
      .map(attempt => attempt.id === attemptId ? attemptSchema.parse({ ...attempt, ...patch }) : attempt));
    for (const attempt of attempts) tx.objectStore('attempts').put(attempt);
    for (const card of cards) tx.objectStore('cards').put(card);
    await done;
  } catch (error) {
    try { tx.abort(); } catch { /* The transaction may already have aborted. */ }
    await done.catch(() => {});
    throw error;
  }
}
export async function saveBookmark(questionId: string, active: boolean): Promise<void> {
  const db = await openDatabase(); const tx = db.transaction('bookmarks', 'readwrite'); const done = completed(tx);
  if (active) tx.objectStore('bookmarks').put({ questionId }); else tx.objectStore('bookmarks').delete(questionId);
  await done;
}
export async function saveSettings(value: Settings): Promise<void> {
  const parsed = settingsSchema.parse(value);
  const db = await openDatabase(); const tx = db.transaction('settings', 'readwrite'); const done = completed(tx);
  tx.objectStore('settings').put({ name: 'preferences', value: parsed }); await done;
}
const backupSchema = z.object({
  version: z.union([z.literal(1), z.literal(2), z.literal(3)]), exportedAt: z.string().datetime(),
  attempts: z.array(attemptSchema).max(100_000), cards: z.array(z.union([reviewCardSchema, legacyReviewCardSchema])).max(10_000),
  bookmarks: z.array(z.string()).max(10_000), settings: settingsSchema,
});
export function exportBackup(snapshot: Snapshot): string {
  return JSON.stringify({ version: 3, exportedAt: new Date().toISOString(), attempts: snapshot.attempts, cards: snapshot.cards, bookmarks: snapshot.bookmarks, settings: snapshot.settings }, null, 2);
}
export function parseBackup(text: string) {
  const backup = backupSchema.parse(JSON.parse(text));
  const ids = [...backup.attempts.map(a => a.questionId), ...backup.cards.map(c => c.questionId), ...backup.bookmarks];
  if (ids.some(id => !questionById.has(id))) throw new Error('この試作に含まれていない問題の記録があります。');
  for (const attempt of backup.attempts) {
    const question = questionById.get(attempt.questionId)!;
    validateAnswerForQuestion(attempt, question);
    if (attempt.correct !== (attempt.selected === question.correct) || attempt.confidence !== answerConfidence(attempt)) throw new Error('回答の内容と集計が一致しません。');
  }
  return { ...backup, ...rebuildReviewHistory(backup.attempts) };
}
export async function importBackup(text: string): Promise<void> {
  const backup = parseBackup(text); // Validate everything before opening a write transaction.
  const existing = await loadSnapshot();
  const merged = [...new Map([...existing.attempts, ...backup.attempts].map(a => [a.id, a])).values()];
  const { attempts, cards } = rebuildReviewHistory(merged);
  const db = await openDatabase(); const tx = db.transaction(['attempts', 'cards', 'bookmarks', 'settings'], 'readwrite'); const done = completed(tx);
  for (const attempt of attempts) tx.objectStore('attempts').put(attempt);
  for (const card of cards) tx.objectStore('cards').put(card);
  for (const questionId of backup.bookmarks) tx.objectStore('bookmarks').put({ questionId });
  tx.objectStore('settings').put({ name: 'preferences', value: backup.settings }); await done;
}
