import { test, expect, type Page } from '@playwright/test';

const panel = (page: Page) => page.getByRole('region', { name: '計算機' });
const key = (page: Page, name: string) => panel(page).getByRole('button', { name, exact: true });
async function press(page: Page, keys: string[]) { for (const name of keys) await key(page, name).click(); }

test('opens a calculator only on calculation questions', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await expect(page.getByRole('button', { name: '計算機を開く' })).toHaveCount(0);
  await page.goto('/study/A1?question=sc-2025-autumn-a1-1');
  await page.getByRole('button', { name: '計算機を開く' }).click();
  await expect(panel(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(panel(page)).toHaveCount(0);
});

test('keeps every calculation, continues from the last answer and survives closing and reloading', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-1');
  await page.getByRole('button', { name: '計算機を開く' }).click();
  await press(page, ['(', '1', '+', '2', ')', '×', '3']);
  await expect(panel(page).locator('output')).toHaveText('= 9');
  await key(page, '計算する').click();
  // an operator first continues from the previous answer
  await press(page, ['÷', '4']); await key(page, '計算する').click();
  // typing works too, with Enter to evaluate
  await panel(page).getByRole('textbox', { name: '計算式' }).fill('0.1+0.2'); await page.keyboard.press('Enter');
  const history = panel(page).getByRole('list', { name: '計算の履歴' }).getByRole('listitem');
  await expect(history).toHaveText(['(1+2)×3= 9', '9÷4= 2.25', '0.1+0.2= 0.3']);
  // a past answer can be reused, and errors keep the input instead of recording it
  await history.nth(1).getByRole('button').click(); await press(page, ['÷', '0']); await key(page, '計算する').click();
  await expect(panel(page).locator('.calculator-error')).toHaveText('0で割ることはできません');
  await expect(history).toHaveCount(3);
  await panel(page).getByRole('button', { name: '計算機を閉じる' }).click();
  await expect(panel(page)).toHaveCount(0);
  await page.reload();
  await page.getByRole('button', { name: '計算機を開く' }).click();
  await expect(history).toHaveCount(3);
  await expect(panel(page).getByRole('textbox', { name: '計算式' })).toHaveValue('2.25÷0');
  await panel(page).getByRole('button', { name: '計算の履歴をすべて消す' }).click();
  await expect(history).toHaveText(['計算した式と答えがここに残ります。タップすると答えを入力に使えます。']);
});

test('fits the calculator at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/study/A1?question=sc-2025-autumn-a1-1');
  await page.getByRole('button', { name: '計算機を開く' }).click();
  const box = await panel(page).boundingBox();
  expect(box && box.x >= 0 && box.x + box.width <= 390 && box.y >= 0).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
