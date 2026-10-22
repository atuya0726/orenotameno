import { test, expect } from '@playwright/test';

for (const answer of [
  { selected: 'b', outcome: '正解' },
  { selected: 'a', outcome: '不正解' },
  { selected: null, outcome: '未解答' },
]) {
  test(`reveals ${answer.outcome} below the preserved answer form`, async ({ page }) => {
    await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
    const form = page.getByRole('form', { name: '問題の回答' });
    const formBefore = await form.evaluate(element => ({ top: element.getBoundingClientRect().top + scrollY, height: element.getBoundingClientRect().height }));
    // A property on the DOM node proves that submitting did not replace the form.
    await form.evaluate(element => element.setAttribute('data-preserved-form', 'true'));
    const choice = answer.selected ? form.getByTestId(`option-${answer.selected}`) : form.getByRole('button', { name: 'わからない', exact: true });
    const label = answer.selected ? await choice.locator('.choice-letter').innerText() : null;
    await choice.click();
    const feedback = page.getByRole('region', { name: '解答結果と解説' });
    await expect(feedback).toBeVisible();
    await expect(feedback.locator('.answer-outcome strong')).toHaveText(answer.outcome);
    await expect(feedback.getByRole('heading', { name: '解説', exact: true })).toBeVisible();
    await expect(form).toHaveAttribute('data-preserved-form', 'true');
    if (label) await expect(form.locator('.choice-selected .choice-letter')).toHaveText(label);
    else await expect(form.locator('.choice-selected')).toHaveCount(0);
    for (const button of await form.getByRole('button').all()) await expect(button).toBeDisabled();
    const formAfter = await form.evaluate(element => ({ top: element.getBoundingClientRect().top + scrollY, height: element.getBoundingClientRect().height }));
    expect(formAfter.top).toBeCloseTo(formBefore.top, 0);
    expect(formAfter.height).toBeCloseTo(formBefore.height, 0);
    expect(await feedback.evaluate(element => element.getBoundingClientRect().top + scrollY)).toBeGreaterThanOrEqual(formAfter.top + formAfter.height);
    expect(await feedback.evaluate(element => getComputedStyle(element).animationName)).not.toBe('none');
    await expect(page).toHaveURL(/question=sc-2025-autumn-a1-2/);
    await page.getByRole('button', { name: '今回の学習を終える' }).click();
    await expect(page.getByRole('heading', { name: '学習完了', exact: true })).toBeVisible();
  });
}

test('clears the previous answer and explanation only when moving to the next question', async ({ page }) => {
  await page.goto('/study/A1');
  await page.getByTestId('option-b').click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  await page.getByRole('button', { name: '次の問題へ' }).click();
  await expect(page.locator('.question-card h2')).toContainText('ROC曲線');
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toHaveCount(0);
  await expect(page.locator('.choice-selected')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'わからない', exact: true })).toBeEnabled();
});

test('shows inline feedback on mobile with reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await page.getByTestId('option-b').click();
  const feedback = page.getByRole('region', { name: '解答結果と解説' });
  await expect(feedback).toBeVisible();
  const toggle = feedback.getByRole('button', { name: '復習リストに追加', exact: true });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect(await feedback.evaluate(element => parseFloat(getComputedStyle(element).animationDuration))).toBeLessThan(0.001);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await feedback.locator('.explanation-heading').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'test-results/mobile-inline-feedback.png', fullPage: true });
});

for (const width of [390, 1280]) for (const answer of [
  { button: 'option-b', outcome: 'correct' },
  { button: 'option-a', outcome: 'incorrect' },
  { button: 'わからない', outcome: 'unknown' },
]) for (const reducedMotion of ['no-preference', 'reduce'] as const) test(`scrolls the ${answer.outcome} answer's explanation to the top at ${width}px with ${reducedMotion} motion`, async ({ page }) => {
  await page.setViewportSize({ width, height: 800 });
  await page.emulateMedia({ reducedMotion });
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await (answer.button === 'わからない' ? page.getByRole('button', { name: answer.button, exact: true }) : page.getByTestId(answer.button)).click();
  const heading = page.locator('.explanation-heading');
  const headerBottom = await page.locator('.site-header').evaluate(el => el.getBoundingClientRect().bottom);
  await expect.poll(() => heading.evaluate(el => el.getBoundingClientRect().top), { timeout: 4000 }).toBeLessThan(headerBottom + 40);
  expect(await heading.evaluate(el => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(headerBottom);
});
