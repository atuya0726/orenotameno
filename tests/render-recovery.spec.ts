import { test, expect, devices } from '@playwright/test';

test.use({ ...devices['Pixel 7'] });

test('starts, answers and restores question 24 without the secure-context UUID API on Android', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(crypto, 'randomUUID', { value: undefined }); });
  await page.goto('/study/A2?question=sc-2025-spring-a2-24');
  await expect(page).toHaveURL(/session=[0-9a-f-]{36}/);
  const url = page.url();
  await page.getByTestId('option-c').tap();
  await expect(page.locator('.answer-outcome strong')).toHaveText('正解');
  await page.reload();
  await expect(page).toHaveURL(url);
  await expect(page.locator('.answer-outcome strong')).toHaveText('正解');
  await page.getByRole('button', { name: '今回の学習を終える', exact: true }).tap();
  await expect(page.getByRole('heading', { name: '学習完了', exact: true })).toBeVisible();
});

test('keeps the question and explanation visible when the loaded typesetter crashes on Android', async ({ page }) => {
  await page.route('**/src/components/math-formula.tsx*', route => route.fulfill({
    contentType: 'text/javascript',
    body: 'export default function BrokenFormula() { throw new Error("Typesetter render failed"); }',
  }));
  await page.goto('/study/A2?question=sc-2025-spring-a2-24');
  await page.getByTestId('option-c').tap();
  const result = page.getByRole('region', { name: '解答結果と解説' });
  await expect(result.locator('.math-fallback')).toHaveCount(7);
  await expect(result.locator('.answer-outcome strong')).toHaveText('正解');
  await expect(page.getByRole('navigation', { name: 'メインメニュー' })).toBeVisible();
  await page.reload();
  await expect(result.locator('.math-fallback')).toHaveCount(7);
  await expect(result.locator('.answer-outcome strong')).toHaveText('正解');
  await page.getByRole('button', { name: '今回の学習を終える', exact: true }).tap();
  await expect(page.getByRole('heading', { name: '学習完了', exact: true })).toBeVisible();
});

test('shows the error and restores the saved question without reloading after a render crash on Android', async ({ page }) => {
  await page.addInitScript(() => { Object.assign(window, { testAnswerRenderFailure: true }); });
  await page.route('**/src/components/answer-choices.tsx*', async route => {
    const response = await route.fetch();
    const body = (await response.text()).replace(
      /(function AnswerChoices\([^)]*\)\s*\{)/,
      '$1 if (result && window.testAnswerRenderFailure) throw new Error("Answer render failed");',
    );
    await route.fulfill({ response, body });
  });
  await page.goto('/study/A2?question=sc-2025-spring-a2-24');
  await expect(page).toHaveURL(/session=/);
  const url = page.url();
  await page.getByTestId('option-c').tap();
  await expect(page.getByRole('heading', { name: '画面を表示できませんでした' })).toBeVisible();
  await page.getByText('エラーの詳細', { exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Answer render failed');
  await page.evaluate(() => { Object.assign(window, { testAnswerRenderFailure: false }); });
  await page.getByRole('button', { name: '同じ画面に戻る', exact: true }).tap();
  await expect(page).toHaveURL(url);
  await expect(page.locator('.question-prompt')).toContainText('サービス提供時間帯が毎日6時〜20時');
  await expect(page.locator('.answer-outcome strong')).toHaveText('正解');
  await expect(page.getByTestId('option-c')).toBeDisabled();
  expect(await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open('orenotameno-sc'); request.onsuccess = () => resolve(request.result); });
    const count = await new Promise<number>(resolve => { const request = db.transaction('attempts').objectStore('attempts').count(); request.onsuccess = () => resolve(request.result); });
    db.close(); return count;
  })).toBe(1);
});
