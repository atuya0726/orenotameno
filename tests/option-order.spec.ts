import { test, expect, type Page } from '@playwright/test';

// Make the expected permutation deterministic, distinct from the original order.
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => { Math.random = () => 0; });
});

async function choiceIds(page: Page) {
  return page.locator('.choices [data-testid^="option-"]').evaluateAll(elements => elements.map(element => element.getAttribute('data-testid')));
}

for (const query of ['question=sc-2025-autumn-a1-2', 'by=sets&sets=sc-2025-autumn-a1&order=number&limit=10', 'by=fields&order=number']) {
  test(`shuffles choices and retains their order and notes on reload: ${query}`, async ({ page }) => {
    await page.goto(`/study/A1?${query}`);
    await expect(page).toHaveURL(/session=/);
    expect(await choiceIds(page)).toEqual(['option-b', 'option-c', 'option-d', 'option-a']);
    await expect(page.locator('.choices .choice-letter')).toHaveText(['ア', 'イ', 'ウ', 'エ']);
    const first = page.getByRole('button', { name: 'アで回答', exact: true });
    const description = await first.getAttribute('aria-describedby');
    expect(description).toBe('choice-text-b');
    await page.getByRole('button', { name: 'アの印：はてな', exact: true }).click();
    await expect(page.getByTestId('mark-b')).toHaveText('○');
    await page.reload();
    expect(await choiceIds(page)).toEqual(['option-b', 'option-c', 'option-d', 'option-a']);
    await expect(page.getByRole('button', { name: 'アの印：まる', exact: true })).toBeVisible();
    await first.click();
    await expect(page.locator('.answer-outcome strong')).toHaveText('正解');
    await expect(page.locator('.correct-option .choice-letter')).toHaveText('ア');
    await page.reload();
    expect(await choiceIds(page)).toEqual(['option-b', 'option-c', 'option-d', 'option-a']);
    await expect(page.locator('.correct-option .choice-letter')).toHaveText('ア');
    await page.goto('/records');
    await page.locator('.history-item').first().click();
    await page.reload();
    await expect(page.locator('.correct-option .choice-letter')).toHaveText('ア');
  });
}

test('shuffles review choices and each subsequent question', async ({ page }) => {
  await page.goto('/study/A1?by=sets&sets=sc-2025-autumn-a1&order=number&limit=10');
  for (let index = 0; index < 2; index++) {
    expect(await choiceIds(page)).toEqual(['option-b', 'option-c', 'option-d', 'option-a']);
    await page.getByRole('button', { name: 'わからない', exact: true }).click();
    await page.getByRole('button', { name: '次の問題へ', exact: true }).click();
  }
  await page.goto('/study/A1?mode=review');
  expect(await choiceIds(page)).toEqual(['option-b', 'option-c', 'option-d', 'option-a']);
  await page.getByRole('button', { name: 'アで回答', exact: true }).click();
  await expect(page.locator('.answer-outcome strong')).toHaveText('正解');
  await expect(page.getByRole('button', { name: 'また復習する', exact: true })).toBeVisible();
});

for (const question of [
  { id: 'sc-2025-spring-a2-18', selector: '.combination-row', correctLabel: 'エ' },
  { id: 'sc-2024-spring-a2-24', selector: '.choice-card', correctLabel: 'イ' },
]) test(`shuffles combination rows and diagrams with matching explanations: ${question.id}`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`/study/A2?question=${question.id}`);
  expect(await choiceIds(page)).toEqual(['option-b', 'option-c', 'option-d', 'option-a']);
  await expect(page.locator(`${question.selector} .choice-letter`)).toHaveText(['ア', 'イ', 'ウ', 'エ']);
  await page.getByRole('button', { name: `${question.correctLabel}で回答`, exact: true }).click();
  await expect(page.locator('.answer-outcome strong')).toHaveText('正解');
  await expect(page.locator('.correct-option .choice-letter')).toHaveText(question.correctLabel);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('keeps mock exam choices and explanations in the original order', async ({ page }) => {
  await page.goto('/study/A1?by=mock&set=sc-2025-autumn-a1');
  for (let index = 0; index < 2; index++) {
    expect(await choiceIds(page)).toEqual(['option-a', 'option-b', 'option-c', 'option-d']);
    await page.reload();
    expect(await choiceIds(page)).toEqual(['option-a', 'option-b', 'option-c', 'option-d']);
    await page.getByRole('button', { name: 'イで回答', exact: true }).click();
    await expect(page.locator('.answer-outcome strong')).toHaveText('正解');
    await expect(page.locator('.correct-option .choice-letter')).toHaveText('イ');
    await page.getByRole('button', { name: '次の問題へ', exact: true }).click();
  }
});
