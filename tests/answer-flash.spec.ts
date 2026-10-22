import { test, expect } from '@playwright/test';

for (const answer of [
  { button: 'option-b', label: '正解' },
  { button: 'option-a', label: '不正解' },
  { button: 'わからない', label: '解説を確認' },
]) {
  test(`briefly shows ${answer.label} and leaves the explanation below the answer`, async ({ page }) => {
    await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
    await (answer.button === 'わからない' ? page.getByRole('button', { name: answer.button, exact: true }) : page.getByTestId(answer.button)).click();
    const flash = page.getByRole('status', { name: `判定：${answer.label}`, exact: true });
    await expect(flash).toBeVisible();
    await expect(flash).toHaveText(answer.label);
    await expect(flash).toHaveCount(0, { timeout: 2_000 });
    await expect(page.getByRole('form', { name: '問題の回答' })).toBeVisible();
    await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
    await expect(page).toHaveURL(/question=sc-2025-autumn-a1-2/);
  });
}

test('keeps the brief result readable when reduced motion is enabled', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await page.getByTestId('option-b').click();
  const flash = page.getByRole('status', { name: '判定：正解', exact: true });
  await expect(flash).toBeVisible();
  await expect(flash.locator('.answer-flash-content')).toHaveCSS('opacity', '1');
  await expect(flash.locator('.answer-flash-content')).toHaveCSS('transform', 'none');
  await expect(flash).toHaveCount(0, { timeout: 2_000 });
  await expect(page.getByRole('heading', { name: '解説', exact: true })).toBeVisible();
});
