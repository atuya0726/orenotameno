import { test, expect } from '@playwright/test';

test('cycles independent option notes, restores drafts, and locks them after answering', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-1');
  const marks = page.locator('.choice-mark-toggle');
  await expect(marks).toHaveText(['?', '?', '?', '?']);
  const first = marks.nth(0);
  for (const symbol of ['○', '×', '△', '○', '×', '△']) {
    await first.click();
    await expect(first).toHaveText(symbol);
    await expect(page.locator('.choice-selected')).toHaveCount(0);
    await expect(page.getByRole('region', { name: '解答結果と解説' })).toHaveCount(0);
  }
  await first.focus();
  await first.press('Space');
  await marks.nth(2).click();
  // Wait for the queued IndexedDB writes before reloading.
  await expect.poll(() => page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open('orenotameno-sc', 1); request.onsuccess = () => resolve(request.result); });
    const draft = await new Promise<{ optionMarks?: Record<string, string> }>(resolve => { const request = db.transaction('drafts').objectStore('drafts').get('sc-2025-autumn-a1-1'); request.onsuccess = () => resolve(request.result); });
    db.close();
    return draft?.optionMarks;
  })).toEqual({ a: 'candidate', c: 'candidate' });
  await page.reload();
  await expect(marks).toHaveText(['○', '?', '○', '?']);
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  for (const mark of await marks.all()) await expect(mark).toBeDisabled();
  await expect(marks).toHaveText(['○', '?', '○', '?']);
});

test('resets option notes when advancing to another question', async ({ page }) => {
  await page.goto('/study/A1');
  await page.locator('.choice-mark-toggle').first().click();
  await page.getByRole('button', { name: 'わからない', exact: true }).click();
  await page.getByRole('button', { name: '次の問題へ' }).click();
  await expect(page.locator('.question-number')).toHaveText('問2');
  await expect(page.locator('.choice-mark-toggle')).toHaveText(['?', '?', '?', '?']);
});

for (const width of [390, 1024]) {
  test(`places the source and unknown action below choices and centers the option labels at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
    await expect(page.locator('.choice-card')).toHaveCount(4);
    const layout = await page.evaluate(() => {
      const rect = (selector: string) => document.querySelector(selector)!.getBoundingClientRect();
      const source = rect('.question-source summary');
      const unknown = rect('.unknown-response');
      const card = rect('.choice-card');
      const label = rect('.answer-selector .choice-letter');
      const range = document.createRange();
      range.selectNodeContents(document.querySelector('.answer-selector .choice-letter')!);
      const letter = range.getBoundingClientRect();
      const divider = getComputedStyle(document.querySelector('.answer-selector .choice-letter')!, '::after');
      return {
        questionGap: rect('.choices').top - rect('.question-card').bottom,
        lastChoiceBottom: rect('.choices').bottom,
        sourceTop: source.top, unknownTop: unknown.top,
        letterCenter: (letter.top + letter.bottom) / 2,
        rowCenter: (card.top + card.bottom) / 2,
        labelCenter: (label.top + label.bottom) / 2,
        divider: divider.backgroundImage,
        fits: document.documentElement.scrollWidth <= innerWidth,
      };
    });
    expect(layout.questionGap).toBeLessThanOrEqual(16);
    expect(layout.sourceTop).toBeGreaterThanOrEqual(layout.lastChoiceBottom);
    expect(layout.unknownTop).toBeCloseTo(layout.sourceTop, 0);
    expect(Math.abs(layout.letterCenter - layout.rowCenter)).toBeLessThan(4);
    expect(layout.labelCenter).toBeCloseTo(layout.rowCenter, 0);
    expect(layout.divider).toContain('linear-gradient');
    expect(layout.fits).toBe(true);
    await page.locator('.question-source summary').click();
    await expect(page.getByRole('link', { name: 'IPA公式の問題PDF ↗' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'わからない', exact: true })).toBeEnabled();
  });
}
