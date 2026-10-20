import { test, expect } from '@playwright/test';

for (const failMathLoad of [false, true]) {
  test(`keeps spring A2 question 24 and progress when formula loading ${failMathLoad ? 'fails' : 'succeeds'}`, async ({ page }) => {
    test.setTimeout(60_000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    let blockedRequests = 0;
    if (failMathLoad) await page.route('**/math-formula*', route => {
      blockedRequests++;
      return route.abort('failed');
    });

    await page.goto('/study/A2?by=mock&set=sc-2025-spring-a2');
    for (let number = 1; number < 24; number++) {
      await expect(page.locator('.study-session-counter')).toHaveText(`${number} / 25`);
      await page.getByRole('button', { name: 'わからない', exact: true }).click();
      await page.getByRole('button', { name: '次の問題へ', exact: true }).click();
    }
    await expect(page.locator('.study-session-counter')).toHaveText('24 / 25');
    const url = page.url();
    const prompt = await page.locator('.question-prompt').innerText();
    await page.getByRole('button', { name: 'ウで回答', exact: true }).click();
    const result = page.getByRole('region', { name: '解答結果と解説' });
    const formulas = result.locator(failMathLoad ? '.math-fallback' : '.katex');
    await expect(formulas).toHaveCount(7);
    await expect(result.locator('.answer-outcome strong')).toHaveText('正解');
    await expect(result).toContainText('小数第2位を四捨五入すると98.3％です。');
    if (failMathLoad) {
      expect(blockedRequests).toBeGreaterThan(0);
      await expect(result.locator('.math-fallback').nth(2)).toContainText('420-7');
    }

    await page.reload();
    await expect(page).toHaveURL(url);
    await expect(page.locator('.study-session-counter')).toHaveText('24 / 25');
    await expect(page.locator('.question-prompt')).toHaveText(prompt);
    await expect(formulas).toHaveCount(7);
    await expect(result.locator('.answer-outcome strong')).toHaveText('正解');
    await expect(page.getByRole('button', { name: 'ウで回答', exact: true })).toBeDisabled();
    await page.getByRole('button', { name: '次の問題へ', exact: true }).click();
    await expect(page.locator('.study-session-counter')).toHaveText('25 / 25');
    await page.reload();
    await expect(page.locator('.study-session-counter')).toHaveText('25 / 25');
    expect(errors).toEqual([]);
  });
}
