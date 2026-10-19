import { expect, test, type Page } from '@playwright/test';
import { termById } from '../src/features/glossary/terms';

const term = termById.get('digital-signature')!;
const text = '署名者の秘密鍵で署名を作り、公開鍵で検証し、改ざんを検知する仕組みです。';
const textbox = (page: Page) => page.getByRole('textbox', { name: 'ディジタル署名についての説明' });
const check = (page: Page) => page.getByRole('button', { name: 'AIでチェック' });
function evaluation(input = text) { return { version: 1, engine: 'openai', model: 'gpt-6-luna', status: 'covered', grade: 'A', covered: 3, total: 3, criteria: term.criteria.map(c => ({ id: c.id, title: c.title, level: c.level ?? 'B', status: c.level === 'S' ? 'missing' : 'covered', evidence: c.level === 'S' ? '' : input, hint: c.level === 'S' ? 'タイムスタンプによる長期署名の点が足りません。' : '鍵の関係を正しく説明できています。' })), summary: '署名と検証の役割を説明できています。', followUp: { name: '公開鍵基盤', reason: '公開鍵が本人のものだと確かめる仕組みが説明にないためです。' } }; }
async function entries(page: Page, name = 'orenotameno-glossary') {
  return page.evaluate(async dbName => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const request = indexedDB.open(dbName); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    const records = await new Promise<Record<string, unknown>[]>((resolve, reject) => { const request = db.transaction('attempts').objectStore('attempts').getAll(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    db.close(); return records;
  }, name);
}

test('searches terms and persists drafts without exposing the reference first', async ({ page }) => {
  await page.goto('/glossary');
  await page.getByRole('textbox', { name: '用語を検索' }).fill('Digital signature');
  await expect(page.locator('.term-card')).toHaveCount(1);
  await page.getByRole('link', { name: '説明する', exact: true }).click();
  await expect(page.locator('.term-reference')).toHaveCount(0);
  await expect(check(page)).toBeDisabled();
  await textbox(page).fill(text);
  await expect(check(page)).toBeEnabled();
  // Wait for the IndexedDB write, not only the React input state.
  await expect.poll(() => page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('orenotameno-glossary'); r.onsuccess = () => resolve(r.result); });
    const draft = await new Promise<{ text?: string }>(resolve => { const r = db.transaction('drafts').objectStore('drafts').get('digital-signature'); r.onsuccess = () => resolve(r.result ?? {}); }); db.close(); return draft.text;
  })).toBe(text);
  await page.reload(); await expect(textbox(page)).toHaveValue(text);
});

test('evaluates once, stores feedback separately from quizzes, and reviews a historical explanation', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/glossary/evaluate', async route => {
    calls++; expect(route.request().postDataJSON()).toEqual({ termId: term.id, text });
    await route.fulfill({ json: evaluation() });
  });
  await page.goto('/glossary/digital-signature'); await textbox(page).fill(text); await check(page).click();
  await expect(page.getByRole('heading', { name: '公開鍵基盤' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '応用の論点まで説明' })).toBeVisible();
  await expect(page.locator('.rubric-level-heading').filter({ hasText: '発展' })).toContainText('めったに問われない');
  await expect(page.locator('.rubric-missing')).toContainText('まだ触れていません');
  await expect(page.getByText('OpenAI · gpt-6-luna')).toBeVisible();
  expect(calls).toBe(1); expect(await entries(page, 'orenotameno-sc')).toEqual([]);
  expect(await entries(page)).toHaveLength(1);
  await page.getByRole('link', { name: '説明の履歴', exact: true }).click();
  await page.reload(); await page.getByRole('link', { name: '見直す', exact: true }).click();
  await expect(page.locator('.saved-explanation')).toContainText(text);
  await page.getByRole('button', { name: 'もう一度説明する' }).click();
  await expect(textbox(page)).toHaveValue('');
  await expect(page.getByText('説明例を参照済み')).toBeVisible();
});

test('practices a follow-up term the AI suggested outside the built-in list', async ({ page }) => {
  await page.route('**/api/glossary/evaluate', async route => {
    const body = route.request().postDataJSON();
    if (body.termId === term.id) return route.fulfill({ json: evaluation() });
    expect(body.termId).toBe('extra:公開鍵基盤');
    await route.fulfill({ json: { ...evaluation(body.text), criteria: [{ id: 'ca', title: '認証局が証明書を発行する', status: 'missing', evidence: '', hint: '誰が証明書を発行するかが足りません。' }], covered: 0, total: 1, status: 'unconfirmed', definition: '公開鍵とその持ち主を認証局が証明書で結び付ける仕組みです。', followUp: { name: '認証局', reason: '証明書の発行者だからです。' } } });
  });
  await page.goto('/glossary/digital-signature'); await textbox(page).fill(text); await check(page).click();
  await page.getByRole('link', { name: 'この用語を説明する' }).click();
  await expect(page.getByRole('heading', { name: '公開鍵基盤', level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: '説明例を先に見る' })).toHaveCount(0);
  await page.getByRole('textbox', { name: '公開鍵基盤についての説明' }).fill('公開鍵が本人のものか確かめるための仕組みです。');
  await check(page).click();
  await expect(page.getByText('誰が証明書を発行するかが足りません。')).toBeVisible();
  await expect(page.locator('.term-reference')).toContainText('認証局が証明書で結び付ける');
  await page.getByRole('link', { name: '説明の履歴', exact: true }).click();
  await page.getByRole('link', { name: '公開鍵基盤' }).click();
  await expect(page.locator('.saved-explanation')).toContainText('公開鍵が本人のものか');
});

test('keeps text and allows retry after an AI failure, with no fabricated feedback', async ({ page }) => {
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ status: 503, json: { error: 'AI評価の接続設定がまだありません。' } }));
  await page.goto('/glossary/digital-signature'); await textbox(page).fill(text); await check(page).click();
  await expect(page.getByRole('alert').filter({ hasText: '接続設定がまだありません' }).first()).toBeVisible();
  await expect(textbox(page)).toHaveValue(text); await expect(check(page)).toBeEnabled();
  expect(await entries(page)).toEqual([]);
  await expect(page.getByRole('region', { name: '説明のチェック結果' })).toHaveCount(0);
});

test('records whether the explanation example was consulted', async ({ page }) => {
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: evaluation() }));
  await page.goto('/glossary/digital-signature?reference=1');
  await expect(page.locator('.term-reference')).toBeVisible();
  await textbox(page).fill(text); await check(page).click();
  await expect(page.getByText('説明例を参照した練習', { exact: true })).toBeVisible();
  expect((await entries(page))[0].referenceViewed).toBe(true);
});

test('falls back to editable text when speech recognition is unavailable', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'SpeechRecognition', { value: undefined, configurable: true }); Object.defineProperty(window, 'webkitSpeechRecognition', { value: undefined, configurable: true }); });
  await page.goto('/glossary/digital-signature');
  await expect(page.getByRole('button', { name: '押しながら話す' })).toBeDisabled();
  await expect(textbox(page)).toBeEditable(); await textbox(page).fill(text); await expect(check(page)).toBeEnabled();
});

test('handles final/interim voice text, prevents checks while listening, and stops the mic on navigation', async ({ page }) => {
  await page.addInitScript(() => {
    class MockSpeech {
      lang = ''; continuous = false; interimResults = false;
      onstart?: () => void; onend?: () => void;
      onresult?: (e: unknown) => void;
      constructor() { (window as unknown as { testSpeech: MockSpeech }).testSpeech = this; }
      start() { this.onstart?.(); }
      stop() { this.onend?.(); }
      abort() { (window as unknown as { speechAborted: boolean }).speechAborted = true; }
    }
    Object.defineProperty(window, 'SpeechRecognition', { value: MockSpeech, configurable: true });
  });
  await page.goto('/glossary/digital-signature'); await page.getByRole('button', { name: '押しながら話す' }).hover(); await page.mouse.down();
  await expect(textbox(page)).not.toBeEditable(); await expect(check(page)).toBeDisabled();
  await page.evaluate(() => {
    const speech = (window as unknown as { testSpeech: { onresult: (e: unknown) => void } }).testSpeech;
    speech.onresult({ results: [{ isFinal: true, 0: { transcript: '秘密鍵で署名を作ります。' }, length: 1 }, { isFinal: false, 0: { transcript: '公開鍵で' }, length: 1 }] });
  });
  await expect(textbox(page)).toHaveValue('秘密鍵で署名を作ります。');
  await expect(page.locator('.speech-interim')).toContainText('公開鍵で');
  // the engine ends a round on a pause; while held it restarts and keeps the earlier text without repeating it
  await page.evaluate(() => {
    const w = window as unknown as { testSpeech: { onend: () => void; onresult: (e: unknown) => void } };
    w.testSpeech.onend();
    w.testSpeech.onresult({ results: [{ isFinal: true, 0: { transcript: '署名を作ります。公開鍵で検証します。' }, length: 1 }] });
  });
  await expect(textbox(page)).toHaveValue('秘密鍵で署名を作ります。公開鍵で検証します。');
  await page.mouse.up();
  await expect(textbox(page)).toBeEditable(); await expect(check(page)).toBeEnabled();
  await page.getByRole('button', { name: '押しながら話す' }).hover(); await page.mouse.down();
  // navigate without moving focus so blur doesn't stop the mic first
  await page.evaluate(() => document.querySelector<HTMLAnchorElement>('a.back-link')!.click());
  await expect(page).toHaveURL(/\/glossary$/);
  await expect.poll(() => page.evaluate(() => (window as unknown as { speechAborted: boolean }).speechAborted)).toBe(true);
});

test('backs up and merges history without duplicating paid evaluations', async ({ page }) => {
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: evaluation() }));
  await page.goto('/glossary/digital-signature'); await textbox(page).fill(text); await check(page).click();
  await expect(page.getByText('OpenAI · gpt-6-luna')).toBeVisible();
  await page.getByRole('link', { name: '説明の履歴', exact: true }).click();
  const downloading = page.waitForEvent('download'); await page.getByRole('button', { name: '記録を書き出す' }).click();
  const path = await (await downloading).path(); expect(path).toBeTruthy();
  await page.getByLabel('用語学習のバックアップ').setInputFiles(path!);
  await expect(page.getByText('用語の学習記録を取り込みました。')).toBeVisible(); expect(await entries(page)).toHaveLength(1);
});

test('fits the glossary and explanation form at mobile width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/glossary');
  await expect(page.getByRole('heading', { name: '用語学習' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/glossary/digital-signature'); await expect(textbox(page)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
