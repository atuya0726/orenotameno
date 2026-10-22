import { test, expect } from '@playwright/test';

for (const width of [320, 390, 1024]) {
  for (const question of [
    { id: 'sc-2025-spring-a2-18', course: 'A2', columns: 2, stacked: false },
    { id: 'sc-2024-spring-a2-16', course: 'A2', columns: 3, stacked: false },
    { id: 'sc-2023-autumn-a1-14', course: 'A1', columns: 2, stacked: true },
    { id: 'sc-2023-autumn-a2-17', course: 'A2', columns: 5, stacked: true },
  ]) test(`compares ${question.id} without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/study/${question.course}?question=${question.id}`);
    const table = page.getByRole('table', { name: '選択肢の組み合わせ' });
    await expect(table).toBeVisible();
    await expect(table.getByRole('columnheader')).toHaveCount(question.columns + 2);
    await expect(table.locator('tbody tr')).toHaveCount(4);
    await expect(table.locator('.choice-mark-toggle')).toHaveText(['?', '?', '?', '?']);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const first = table.locator('tbody tr').first();
    const cells = first.locator('.combination-cell');
    const rects = await cells.evaluateAll(elements => elements.map(element => {
      const rect = element.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width };
    }));
    if (question.stacked && width < 600) {
      expect(rects[1].x).toBeCloseTo(rects[0].x, 0);
      expect(rects[1].y).toBeGreaterThan(rects[0].y);
      await expect(cells.first().locator('.combination-cell-label')).toBeVisible();
    } else {
      expect(rects[1].x).toBeGreaterThan(rects[0].x);
      expect(rects[1].y).toBeCloseTo(rects[0].y, 0);
    }
    const mark = first.locator('.choice-mark-toggle');
    await mark.click();
    await expect(mark).toHaveText('○');
    await expect(page.getByRole('region', { name: '解答結果と解説' })).toHaveCount(0);
    // A tap on any value answers that row; the mark must not intercept it.
    const value = await cells.last().boundingBox();
    await page.mouse.click(value!.x + value!.width / 2, value!.y + value!.height / 2);
    await expect(first).toHaveClass(/choice-selected/);
    await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
    await expect(table.locator('.choice-correct .combination-outcome')).toHaveText('正解');
    for (const button of await table.getByRole('button').all()) await expect(button).toBeDisabled();
  });
}

test('restores table marks and supports keyboard answers with an accessible description', async ({ page }) => {
  await page.goto('/study/A2?question=sc-2025-spring-a2-18');
  const mark = page.getByTestId('mark-b');
  await mark.click();
  await expect(mark).toHaveText('○');
  await expect.poll(() => page.evaluate(() => {
    const draft = JSON.parse(sessionStorage.getItem('orenotameno:question-draft:sc-2025-spring-a2-18') ?? 'null');
    return draft?.optionMarks?.b;
  })).toBe('candidate');
  await page.reload();
  await expect(mark).toHaveText('○');
  const answer = page.getByTestId('option-b');
  const selectedLabel = await answer.locator('.choice-letter').innerText();
  const correctLabel = await page.getByTestId('option-a').locator('.choice-letter').innerText();
  await expect(answer).toHaveAccessibleDescription('コリジョンの伝搬：伝搬しない，ブロードキャストフレームの中継：中継する');
  await answer.focus();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toHaveCount(0);
  await answer.press('Space');
  await expect(page.locator('.answer-outcome strong')).toHaveText('不正解');
  await expect(page.locator('.combination-row.choice-selected .choice-letter')).toHaveText(selectedLabel);
  await expect(page.locator('.combination-row.choice-correct .choice-letter')).toHaveText(correctLabel);
});

test('reveals the correct combination for an unknown answer without selecting a row', async ({ page }) => {
  await page.goto('/study/A2?question=sc-2025-spring-a2-18');
  await page.getByRole('button', { name: 'わからない', exact: true }).click();
  await expect(page.locator('.answer-outcome strong')).toHaveText('未解答');
  await expect(page.locator('.combination-row.choice-selected')).toHaveCount(0);
  await expect(page.locator('.combination-row.choice-correct .combination-outcome')).toHaveText('正解');
});
