import { test, expect, type Page } from '@playwright/test';

async function progress(page: Page) {
  return page.evaluate(async () => {
    const id = new URL(location.href).searchParams.get('session');
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('orenotameno-sc');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    const session = JSON.parse(sessionStorage.getItem(`orenotameno:study:${id}`)!) as { questionIds: string[]; index: number; attemptIds: string[] };
    const count = await new Promise<number>(resolve => {
      const request = db.transaction('attempts').objectStore('attempts').count(); request.onsuccess = () => resolve(request.result);
    });
    db.close(); return { ...session, count };
  });
}

test('resumes a mock exam at the explanation or current question, including option marks', async ({ page, context }) => {
  await page.goto('/study/A2?by=mock&set=sc-2025-autumn-a2');
  await expect(page).toHaveURL(/session=/);
  const firstPrompt = await page.locator('.question-prompt').innerText();
  await page.getByRole('button', { name: 'わからない', exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  await page.reload();
  await expect(page.locator('.question-prompt')).toHaveText(firstPrompt);
  await expect(page.locator('.answer-outcome strong')).toHaveText('未解答');
  await expect(page.getByRole('button', { name: 'アで回答', exact: true })).toBeDisabled();
  expect((await progress(page)).count).toBe(1);

  await page.getByRole('button', { name: '次の問題へ' }).click();
  await expect(page.locator('.study-session-counter')).toHaveText('2 / 25');
  const secondPrompt = await page.locator('.question-prompt').innerText();
  await page.getByRole('button', { name: 'アの印：はてな', exact: true }).click();
  await expect(page.getByRole('button', { name: 'アの印：まる', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.locator('.study-session-counter')).toHaveText('2 / 25');
  await expect(page.locator('.question-prompt')).toHaveText(secondPrompt);
  await expect(page.getByRole('button', { name: 'アの印：まる', exact: true })).toBeVisible();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toHaveCount(0);

  const url = page.url();
  await page.goto('/');
  await page.getByRole('link', { name: '続きから再開', exact: true }).click();
  await expect(page).toHaveURL(url);
  await expect(page.locator('.study-session-counter')).toHaveText('2 / 25');
  await page.close();
  const reopened = await context.newPage();
  await reopened.goto(url);
  await expect(reopened).not.toHaveURL(url);
  await expect(reopened.locator('.study-session-counter')).toHaveText('1 / 25');
  await expect(reopened.locator('.question-prompt')).toHaveText(firstPrompt);
  expect((await progress(reopened)).count).toBe(1);
});

test('preserves a random queue when answered questions leave the new-question filter', async ({ page }) => {
  await page.goto('/study/A1?by=sets&target=new&limit=10');
  await expect(page).toHaveURL(/session=/);
  const original = await progress(page);
  await page.getByRole('button', { name: 'わからない', exact: true }).click();
  await page.getByRole('button', { name: '次の問題へ' }).click();
  await expect(page.locator('.study-session-counter')).toHaveText('2 / 10');
  const prompt = await page.locator('.question-prompt').innerText();
  await page.reload();
  await expect(page.locator('.study-session-counter')).toHaveText('2 / 10');
  await expect(page.locator('.question-prompt')).toHaveText(prompt);
  expect(await progress(page)).toMatchObject({ questionIds: original.questionIds, index: 1, count: 1 });
});

test('keeps completion totals on reload and starts fresh when solving again', async ({ page }) => {
  const path = '/study/A1?question=sc-2025-autumn-a1-2';
  await page.goto(path);
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  await page.reload();
  await expect(page.locator('.choice-selected')).toContainText('イ');
  await page.getByRole('button', { name: '今回の学習を終える' }).click();
  await expect(page.getByRole('heading', { name: '学習完了', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: '学習完了', exact: true })).toBeVisible();
  await expect(page.locator('.completion-stats strong')).toHaveText(['1問', '1問', '1問']);
  await page.getByRole('link', { name: '学習ホームへ', exact: true }).click();
  await expect(page.getByRole('link', { name: '続きから再開', exact: true })).toHaveCount(0);
  await page.goto(path);
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  const saved = await progress(page);
  await page.goto(`/record/${saved.attemptIds[0]}`);
  await page.getByRole('link', { name: 'もう一度解く', exact: true }).click();
  await expect(page.getByRole('button', { name: 'イで回答', exact: true })).toBeEnabled();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toHaveCount(0);
});

test('rolls back answers when saving progress fails, then allows retry and reload', async ({ page }) => {
  await page.addInitScript(() => {
    const setItem = Storage.prototype.setItem;
    let fail = true;
    Storage.prototype.setItem = function(key, value) {
      if (fail && this === sessionStorage && key.startsWith('orenotameno:study:') && JSON.parse(value).attemptIds.length > 0) {
        fail = false; throw new DOMException('Storage full', 'QuotaExceededError');
      }
      setItem.call(this, key, value);
    };
  });
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  const answer = page.getByRole('button', { name: 'イで回答', exact: true });
  await answer.click();
  await expect(page.getByRole('alert').filter({ hasText: '回答を保存できませんでした' })).toBeVisible();
  expect(await progress(page)).toMatchObject({ attemptIds: [], count: 0 });
  await answer.click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  await page.reload();
  await expect(page.locator('.answer-outcome strong')).toHaveText('正解');
  expect((await progress(page)).count).toBe(1);
});

test('retries advancing after a save failure without skipping a question', async ({ page }) => {
  await page.addInitScript(() => {
    const setItem = Storage.prototype.setItem;
    let fail = true;
    Storage.prototype.setItem = function(key, value) {
      if (fail && this === sessionStorage && key.startsWith('orenotameno:study:') && JSON.parse(value).index === 1) {
        fail = false; throw new DOMException('Storage full', 'QuotaExceededError');
      }
      setItem.call(this, key, value);
    };
  });
  await page.goto('/study/A1?by=mock&set=sc-2025-autumn-a1');
  await page.getByRole('button', { name: 'わからない', exact: true }).click();
  const next = page.getByRole('button', { name: '次の問題へ' });
  await next.click();
  await expect(page.getByRole('alert').filter({ hasText: '学習の進行状況を保存できませんでした' })).toBeVisible();
  await expect(page.locator('.study-session-counter')).toHaveText('1 / 30');
  expect(await progress(page)).toMatchObject({ index: 0, count: 1 });
  await next.click();
  await expect(page.locator('.study-session-counter')).toHaveText('2 / 30');
  await page.reload();
  await expect(page.locator('.study-session-counter')).toHaveText('2 / 30');
  expect(await progress(page)).toMatchObject({ index: 1, count: 1 });
});

test('removes old permanent progress while preserving answer history and preferences', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open('orenotameno-sc'); request.onsuccess = () => resolve(request.result); });
    const tx = db.transaction('settings', 'readwrite');
    tx.objectStore('settings').put({ name: 'study:old-session', value: { id: 'old-session' } });
    tx.objectStore('settings').put({ name: 'preferences', value: { dailyGoal: 12, defaultCourse: 'A2' } });
    await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
    db.close();
  });
  await page.reload();
  await expect(page.locator('.answer-outcome strong')).toHaveText('正解');
  const settings = await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open('orenotameno-sc'); request.onsuccess = () => resolve(request.result); });
    const rows = await new Promise<{ name: string; value: unknown }[]>(resolve => { const request = db.transaction('settings').objectStore('settings').getAll(); request.onsuccess = () => resolve(request.result); });
    db.close(); return rows;
  });
  expect(settings).toEqual([{ name: 'preferences', value: { dailyGoal: 12, defaultCourse: 'A2' } }]);
  expect((await progress(page)).count).toBe(1);
});

test('recovers the queue when reload interrupts an answer before its database commit', async ({ page }) => {
  await page.goto('/study/A1?by=sets&limit=10');
  await expect(page).toHaveURL(/session=/);
  const original = await progress(page);
  const prompt = await page.locator('.question-prompt').innerText();
  await page.evaluate(() => {
    const key = `orenotameno:study:${new URL(location.href).searchParams.get('session')}`;
    const session = JSON.parse(sessionStorage.getItem(key)!);
    session.attemptIds.push('uncommitted-answer');
    sessionStorage.setItem(key, JSON.stringify(session));
  });
  await page.reload();
  await expect(page.locator('.question-prompt')).toHaveText(prompt);
  await expect(page.locator('.study-session-counter')).toHaveText('1 / 10');
  await page.getByRole('button', { name: 'わからない', exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  expect(await progress(page)).toMatchObject({ questionIds: original.questionIds, index: 0, count: 1 });
});
