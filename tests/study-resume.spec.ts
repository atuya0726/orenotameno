import { test, expect, type Page } from '@playwright/test';

async function progress(page: Page) {
  return page.evaluate(async () => {
    const id = new URL(location.href).searchParams.get('session');
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('orenotameno-sc');
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    const tx = db.transaction(['settings', 'attempts'], 'readonly');
    const [session, count] = await Promise.all([
      new Promise<{ value: { questionIds: string[]; index: number; attemptIds: string[] } }>(resolve => {
        const request = tx.objectStore('settings').get(`study:${id}`); request.onsuccess = () => resolve(request.result);
      }),
      new Promise<number>(resolve => { const request = tx.objectStore('attempts').count(); request.onsuccess = () => resolve(request.result); }),
    ]);
    db.close(); return { ...session.value, count };
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
  await expect(reopened.locator('.question-prompt')).toHaveText(secondPrompt);
  await expect(reopened.getByRole('button', { name: 'アの印：まる', exact: true })).toBeVisible();
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
    const put = IDBObjectStore.prototype.put;
    let fail = true;
    IDBObjectStore.prototype.put = function(value, key) {
      const request = key === undefined ? put.call(this, value) : put.call(this, value, key);
      if (fail && this.name === 'settings' && value.name?.startsWith('study:') && value.value.attemptIds.length > 0) {
        fail = false; this.transaction.abort();
      }
      return request;
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
    const put = IDBObjectStore.prototype.put;
    let fail = true;
    IDBObjectStore.prototype.put = function(value, key) {
      const request = key === undefined ? put.call(this, value) : put.call(this, value, key);
      if (fail && this.name === 'settings' && value.name?.startsWith('study:') && value.value.index === 1) {
        fail = false; this.transaction.abort();
      }
      return request;
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
