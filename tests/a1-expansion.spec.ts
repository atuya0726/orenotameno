import { expect, test } from '@playwright/test';
import { sc2022AutumnA1 } from '../src/data/sc-2022-autumn-a1';
import { sc2022SpringA1 } from '../src/data/sc-2022-spring-a1';
import { sc2021AutumnA1 } from '../src/data/sc-2021-autumn-a1';
import { sc2021SpringA1 } from '../src/data/sc-2021-spring-a1';
import { optionLabels } from '../src/lib/model';

const sets = [
  { key: '2022-autumn', questions: sc2022AutumnA1, visual: [1, 7, 9, 18, 19, 24] },
  { key: '2022-spring', questions: sc2022SpringA1, visual: [1, 16, 18, 19] },
  { key: '2021-autumn', questions: sc2021AutumnA1, visual: [7, 8, 17, 18, 23, 24, 29] },
  { key: '2021-spring', questions: sc2021SpringA1, visual: [1, 2, 5, 16, 19, 26] },
];
for (const set of sets) test(`renders added A1 figures, tables and formulas from ${set.key} at mobile width`, async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const number of set.visual) {
    const q = set.questions[number - 1];
    await page.goto(`/study/A1?question=${q.id}`);
    await expect(page.getByRole('heading', { name: '問題演習', exact: true })).toBeVisible();
    await expect(page.locator('.question-source')).toContainText(`問${number}`);
    if (q.figure) await expect(page.locator('.question-figure svg')).toHaveCount(1);
    if (q.options.every(o => o.figure)) await expect(page.locator('.choice-figure svg')).toHaveCount(4);
    if (q.table) await expect(page.getByRole('table', { name: q.table.caption, exact: true })).toBeVisible();
    if (q.prompt.includes('\\(') || q.prompt.includes('\\[')) await expect(page.locator('.question-prompt .katex').first()).toBeVisible();
    await expect(page.locator('.katex-error')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if ([1, 7, 16, 18, 23].includes(number)) await page.screenshot({ path: `/private/tmp/a1-${set.key}-${number}.png`, fullPage: true });
    await page.getByRole('button', { name: `${optionLabels[q.correct]}で回答`, exact: true }).click();
    await expect(page.locator('.answer-outcome').getByText('正解', { exact: true })).toBeVisible();
    await expect(page.locator('.katex-error')).toHaveCount(0);
  }
});
