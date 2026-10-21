import { expect, test, type Page } from '@playwright/test';
import { termById } from '../src/features/glossary/terms';
import { mockSpeechRecognition, speakExplanation } from './helpers/glossary-speech';

const term = termById.get('digital-signature')!;
const text = '署名者の秘密鍵で署名を作り、公開鍵で検証して改ざんを検知する仕組みです。';
const evaluation = { version: 1, engine: 'openai', api: 'decisions', model: 'gpt-6-luna', status: 'covered', grade: 'A', covered: 3, total: 3, criteria: term.criteria.map(c => ({ id: c.id, title: c.title, level: c.level ?? 'B', status: 'covered', evidence: '', hint: '' })), summary: '' };
const check = (page: Page) => page.getByRole('button', { name: 'AIでチェック', exact: true });
type StorageControl = { holdSave: boolean; releaseSave?: () => void; historyReads: number };

test.beforeEach(async ({ page }) => { await mockSpeechRecognition(page); });

async function delaySave(page: Page) {
  await page.addInitScript(() => {
    const control = window as unknown as StorageControl;
    control.holdSave = true; control.historyReads = 0;
    const getAll = IDBObjectStore.prototype.getAll;
    IDBObjectStore.prototype.getAll = function(query?: IDBValidKey | IDBKeyRange | null, count?: number) {
      if (this.name === 'attempts' && this.transaction.db.name === 'orenotameno-glossary') control.historyReads++;
      return getAll.call(this, query, count);
    };
    // Hold the storage completion callback, without using a timing-dependent sleep.
    const descriptor = Object.getOwnPropertyDescriptor(IDBTransaction.prototype, 'oncomplete')!;
    Object.defineProperty(IDBTransaction.prototype, 'oncomplete', {
      ...descriptor,
      set(handler: ((this: IDBTransaction, event: Event) => void) | null) {
        const tx = this as IDBTransaction;
        descriptor.set!.call(tx, handler && function(event: Event) {
          if (control.holdSave && tx.db.name === 'orenotameno-glossary' && tx.mode === 'readwrite' && tx.objectStoreNames.contains('attempts')) {
            control.releaseSave = () => { control.holdSave = false; handler.call(tx, event); };
          } else handler.call(tx, event);
        });
      },
    });
  });
}
async function failFirstSave(page: Page) {
  await page.addInitScript(() => {
    const put = IDBObjectStore.prototype.put; let fail = true;
    IDBObjectStore.prototype.put = function(value: unknown, key?: IDBValidKey) {
      const request = key === undefined ? put.call(this, value) : put.call(this, value, key);
      if (fail && this.name === 'attempts' && this.transaction.db.name === 'orenotameno-glossary') {
        fail = false; this.transaction.abort();
      }
      return request;
    };
  });
}
async function storedCount(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open('orenotameno-glossary'); request.onsuccess = () => resolve(request.result); });
    const count = await new Promise<number>(resolve => { const request = db.transaction('attempts').objectStore('attempts').count(); request.onsuccess = () => resolve(request.result); });
    db.close(); return count;
  });
}

test('shows the grade before storage completes and does not reread the full history', async ({ page }) => {
  await delaySave(page);
  let calls = 0;
  await page.route('**/api/glossary/evaluate', route => { calls++; return route.fulfill({ json: evaluation }); });
  await page.goto('/glossary/digital-signature');
  await speakExplanation(page, text);
  const reads = await page.evaluate(() => (window as unknown as StorageControl).historyReads);
  await check(page).click();
  await expect(page.getByLabel('評価 A', { exact: true })).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: '履歴を保存中' })).toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean((window as unknown as StorageControl).releaseSave))).toBe(true);
  expect(await page.evaluate(() => (window as unknown as StorageControl).historyReads)).toBe(reads);
  await page.evaluate(() => (window as unknown as StorageControl).releaseSave!());
  await expect(page.getByRole('status').filter({ hasText: '履歴を保存中' })).toHaveCount(0);
  await expect(page.getByRole('link', { name: '次の用語へ', exact: true })).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as StorageControl).historyReads)).toBe(reads);
  expect(await storedCount(page)).toBe(1);
  expect(calls).toBe(1);
});

test('retains a failed save across navigation and retries storage without another paid check', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await failFirstSave(page);
  let calls = 0;
  await page.route('**/api/glossary/evaluate', route => { calls++; return route.fulfill({ json: evaluation }); });
  await page.goto('/glossary/digital-signature'); await speakExplanation(page, text); await check(page).click();
  await expect(page.getByLabel('評価 A', { exact: true })).toBeVisible();
  await expect(page.getByRole('alert')).toContainText('履歴に保存できませんでした');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await storedCount(page)).toBe(0);
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem('orenotameno:glossary-draft:digital-signature')!).text)).toBe(text);
  await page.getByRole('link', { name: '説明の履歴', exact: true }).click();
  await expect(page.locator('.glossary-history-list article')).toHaveCount(1);
  await page.getByRole('button', { name: '保存を再試行', exact: true }).click();
  await expect(page.getByRole('button', { name: '保存を再試行', exact: true })).toHaveCount(0);
  await expect.poll(() => storedCount(page)).toBe(1);
  expect(calls).toBe(1);
  await page.reload();
  await expect(page.locator('.glossary-history-list article')).toHaveCount(1);
  await expect(page.locator('.history-explanation')).toHaveText(text);
});

test('keeps a newer draft when a previous explanation finishes saving after navigation', async ({ page }) => {
  await delaySave(page);
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: evaluation }));
  await page.goto('/glossary/digital-signature'); await speakExplanation(page, text); await check(page).click();
  await expect(page.getByLabel('評価 A', { exact: true })).toBeVisible();
  await expect.poll(() => page.evaluate(() => Boolean((window as unknown as StorageControl).releaseSave))).toBe(true);
  await page.getByRole('link', { name: '用語一覧へ戻る', exact: true }).click();
  await page.getByRole('textbox', { name: '用語を検索' }).fill('Digital signature');
  await page.getByRole('link', { name: '説明する', exact: true }).click();
  const addition = '本文のハッシュ値に署名し、証明書で公開鍵の持ち主を確かめます。';
  await speakExplanation(page, addition);
  await page.evaluate(() => (window as unknown as StorageControl).releaseSave!());
  await expect.poll(() => storedCount(page)).toBe(1);
  const draft = await page.evaluate(() => JSON.parse(sessionStorage.getItem('orenotameno:glossary-draft:digital-signature')!).text);
  expect(draft).toContain(addition);
  await expect(page.getByRole('textbox', { name: 'ディジタル署名についての説明' })).toHaveValue(draft);
});

test('removes a mastered review word only after its evaluation is saved', async ({ page }) => {
  await failFirstSave(page);
  let calls = 0;
  await page.route('**/api/glossary/evaluate', route => { calls++; return route.fulfill({ json: evaluation }); });
  await page.goto('/study/A1?question=sc-2025-autumn-a1-13');
  await page.getByRole('button', { name: 'ウで回答', exact: true }).click();
  const word = page.getByRole('button', { name: 'デジタル署名を復習する', exact: true });
  await word.click(); await expect(word).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/glossary/review');
  await page.getByRole('radio', { name: /^A ·/ }).check();
  await page.getByRole('link', { name: '復習を始める' }).click();
  await speakExplanation(page, text); await check(page).click();
  await expect(page.getByLabel('評価 A', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '保存を再試行', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: '復習を終える', exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: '保存を再試行', exact: true }).click();
  await expect(page.getByRole('status').filter({ hasText: '復習キューから外しました' })).toBeVisible();
  await expect(page.getByRole('link', { name: '復習を終える', exact: true })).toBeVisible();
  expect(await storedCount(page)).toBe(1); expect(calls).toBe(1);
});
