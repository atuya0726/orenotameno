import { test, expect, type Page } from '@playwright/test';

async function answerFirst(page: Page, selected = 'イ', requested = false) {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-1');
  await page.getByRole('button', { name: `${selected}で回答`, exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  if (requested) {
    const toggle = page.getByRole('button', { name: '復習したい', exact: true });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  }
}
async function counts(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const r = indexedDB.open('orenotameno-sc', 1); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
    const tx = db.transaction(['attempts', 'cards', 'drafts'], 'readonly');
    const results = await Promise.all(['attempts', 'cards', 'drafts'].map(name => new Promise<number>((resolve, reject) => { const r = tx.objectStore(name).count(); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); })));
    db.close(); return results;
  });
}
async function storedAttempts(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('orenotameno-sc', 1); r.onsuccess = () => resolve(r.result); });
    const attempts = await new Promise<Record<string, unknown>[]>(resolve => { const r = db.transaction('attempts').objectStore('attempts').getAll(); r.onsuccess = () => resolve(r.result); });
    db.close(); return attempts;
  });
}

test('answers a calculation in one tap and keeps untouched options unassessed', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('/study/A1?question=sc-2025-autumn-a1-1');
  await expect(page.getByRole('button', { name: '自信あり', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: /これも迷った/ })).toHaveCount(0);
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(page.getByTestId('option-b')).toBeDisabled();
  await expect(page.locator('.choice-selected')).toContainText('イ');
  await expect(page.locator('.answer-outcome').getByText('正解', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: '復習したい', exact: true })).toBeVisible();
  await expect(page.getByText('未評価', { exact: true })).toHaveCount(0);
  const [attempt] = await storedAttempts(page);
  expect(attempt).toMatchObject({ inputMode: 'quick', selected: 'b', confidence: 'high', uncertainOptions: [] });
  expect(attempt).not.toHaveProperty('assessments');
  expect(await counts(page)).toEqual([1, 1, 0]);
  await page.goto('/records'); await page.reload();
  await page.getByRole('link', { name: /M\/M\/1の待ち行列モデル/ }).click();
  await expect(page.locator('.answer-outcome').getByText('正解', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '選択肢の解説' })).toBeVisible();
  await expect(page.getByText('未評価', { exact: true })).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('can choose unknown without selecting an answer in both calculation and knowledge questions', async ({ page }) => {
  for (const number of [1, 2]) {
    await page.goto(`/study/A1?question=sc-2025-autumn-a1-${number}`);
    await expect(page.getByRole('button', { name: '迷いあり', exact: true })).toHaveCount(0);
    const unknown = page.getByRole('button', { name: 'わからない', exact: true });
    await expect(unknown).toBeEnabled();
    await unknown.click();
    await expect(page.getByText('あなたの解答：未解答')).toBeVisible();
    await expect(page.getByRole('button', { name: '復習したい', exact: true })).toBeVisible();
    await expect(page.getByText('未評価', { exact: true })).toHaveCount(0);
    await expect(page.locator('.answer-outcome')).toHaveClass(/result-unknown/);
  }
  const attempts = await storedAttempts(page);
  expect(attempts).toHaveLength(2);
  expect(attempts.every(a => a.selected === null && a.confidence === 'unknown' && a.correct === false)).toBe(true);
  await page.goto('/records');
  await expect(page.locator('.history-unknown')).toHaveCount(2);
});

test('keeps bookmarks across reloads and answers knowledge questions in one tap', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await page.getByRole('button', { name: 'あとで見るに追加', exact: true }).click();
  await expect(page.getByRole('button', { name: 'あとで見るから外す', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'あとで見るから外す', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(page.getByRole('button', { name: '復習したい', exact: true })).toBeVisible();
  expect(await counts(page)).toEqual([1, 1, 0]);
  expect((await storedAttempts(page))[0]).toMatchObject({ selected: 'b', confidence: 'high', uncertainOptions: [] });
});

test('asks about review requests only after answering', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await expect(page.getByText('自信あり', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '迷いあり', exact: true })).toHaveCount(0);
  const toggle = page.getByRole('button', { name: '復習したい', exact: true });
  await expect(toggle).toHaveCount(0);
  expect(await counts(page)).toEqual([0, 0, 0]);
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await toggle.click(); await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click(); await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  expect((await storedAttempts(page))[0]).toMatchObject({ confidence: 'high', reviewRequested: false });
});

test('records a review request and resets the button for the next question', async ({ page }) => {
  await page.goto('/study/A1');
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await page.getByRole('button', { name: '次の問題へ' }).click();
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  const toggle = page.getByRole('button', { name: '復習したい', exact: true });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect((await storedAttempts(page)).find(a => a.questionId === 'sc-2025-autumn-a1-2')).toMatchObject({ selected: 'b', confidence: 'high', reviewRequested: true, uncertainOptions: [] });
  await page.getByRole('button', { name: '次の問題へ' }).click();
  await expect(toggle).toHaveCount(0);
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', { name: '復習したい', exact: true })).toHaveAttribute('aria-pressed', 'false');
});

test('submits only once when choices are clicked rapidly', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-1');
  await page.getByRole('button', { name: 'イで回答', exact: true }).waitFor();
  await page.evaluate(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>('.answer-selector');
    buttons[1].click(); buttons[0].click(); buttons[1].click();
  });
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  expect(await counts(page)).toEqual([1, 1, 0]);
  expect((await storedAttempts(page))[0]).toMatchObject({ selected: 'b', confidence: 'high' });
});

test('allows retrying the same choice after a storage failure', async ({ page }) => {
  await page.addInitScript(() => {
    const put = IDBObjectStore.prototype.put;
    let fail = true;
    IDBObjectStore.prototype.put = function(value: unknown, key?: IDBValidKey) {
      const request = key === undefined ? put.call(this, value) : put.call(this, value, key);
      if (this.name === 'attempts' && fail) { fail = false; this.transaction.abort(); }
      return request;
    };
  });
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  const answer = page.getByRole('button', { name: 'イで回答', exact: true });
  await answer.click();
  await expect(page.getByRole('alert').filter({ hasText: '回答を保存できませんでした' })).toBeVisible();
  await expect(answer).toBeEnabled();
  expect(await storedAttempts(page)).toHaveLength(0);
  await answer.click();
  await expect(page.getByRole('button', { name: '復習したい', exact: true })).toBeVisible();
  expect(await storedAttempts(page)).toHaveLength(1);
  expect((await storedAttempts(page))[0]).toMatchObject({ selected: 'b', confidence: 'high' });
});

test('answers with the keyboard without submitting when moving focus', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  const answer = page.getByRole('button', { name: 'イで回答', exact: true });
  await answer.focus();
  expect(await storedAttempts(page)).toHaveLength(0);
  await answer.press('Enter');
  await expect(page.getByRole('button', { name: '復習したい', exact: true })).toBeVisible();
  expect(await storedAttempts(page)).toHaveLength(1);
});

test('queues a requested calculation review and finishes a session', async ({ page }) => {
  await answerFirst(page, 'イ', true);
  await expect(page.getByRole('button', { name: '復習したい', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '今回の学習を終える' }).click();
  await expect(page.getByRole('heading', { name: '学習完了' })).toBeVisible();
  await page.getByRole('link', { name: '復習ノートを見る', exact: true }).click();
  await expect(page.getByRole('link', { name: /M\/M\/1の待ち行列モデル/ }).first()).toBeVisible();
});

test('requires three reviews for a confident mistake and exposes them immediately', async ({ page }) => {
  await answerFirst(page, 'ア');
  await expect(page.getByRole('button', { name: '復習したい', exact: true })).toBeVisible();
  await page.goto('/reviews');
  await page.getByRole('link', { name: '科目A1を復習' }).click();
  await expect(page.getByRole('heading', { name: /伝票処理システム/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'イで回答', exact: true })).toBeEnabled();
  await expect(page.getByRole('button', { name: '迷いあり', exact: true })).toHaveCount(0);
});

test('exports and merges a backup without duplicating attempts', async ({ page }) => {
  await answerFirst(page);
  await page.goto('/settings');
  const downloading = page.waitForEvent('download');
  await page.getByRole('button', { name: '記録を書き出す' }).click();
  const download = await downloading; const path = await download.path();
  expect(path).toBeTruthy();
  await page.locator('input[type=file]').setInputFiles(path!);
  await expect(page.getByRole('status')).toContainText('既存の記録と統合しました');
  expect(await counts(page)).toEqual([1, 1, 0]);
  await page.locator('input[type=file]').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{bad') });
  await expect(page.getByRole('alert')).toBeVisible();
  expect(await counts(page)).toEqual([1, 1, 0]);
});

test('imports and displays a version 1 backup alongside a new answer', async ({ page }) => {
  await answerFirst(page);
  await page.goto('/settings');
  const answeredAt = '2026-10-19T03:00:00.000Z'; const dueAt = '2026-10-26T03:00:00.000Z';
  const backup = {
    version: 1, exportedAt: answeredAt,
    attempts: [{ id: 'earlier-record', questionId: 'sc-2025-autumn-a1-2', selected: 'b', assessments: {
      a: { mark: 'exclude', confidence: 'high' }, b: { mark: 'candidate', confidence: 'high' },
      c: { mark: 'exclude', confidence: 'high' }, d: { mark: 'exclude', confidence: 'high' },
    }, answeredAt, correct: true, confidence: 'high', nextReviewAt: dueAt, intervalMinutes: 10080, reason: '以前の学習記録です。' }],
    cards: [], bookmarks: [], settings: { dailyGoal: 5, defaultCourse: 'A1' },
  };
  await page.locator('input[type=file]').setInputFiles({ name: 'version-1.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(backup)) });
  await expect(page.getByRole('status')).toContainText('既存の記録と統合しました');
  expect(await counts(page)).toEqual([2, 2, 0]);
  await page.goto('/records');
  await page.getByRole('link', { name: /ROC曲線と偽陽性率/ }).click();
  await expect(page.getByText('以前の判断', { exact: false })).toHaveCount(0);
  await expect(page.locator('.answer-outcome').getByText('正解', { exact: true })).toBeVisible();
});

test('works at mobile width without horizontal overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '学習ホーム' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await expect(page.getByRole('button', { name: 'イで回答', exact: true })).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(page.locator('.answer-outcome').getByText('正解', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: 'test-results/mobile-review.png', fullPage: true });
});

test('shows the dashboard and subject selection with accurate empty stats', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '学習ホーム' })).toBeVisible();
  await expect(page.getByRole('link', { name: /科目A1 共通知識/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /科目A2 セキュリティ専門知識/ })).toBeVisible();
  await page.screenshot({ path: 'test-results/desktop-home.png', fullPage: true });
});

test('offers 30 A1 questions, renders their tables, and marks A2 as unavailable', async ({ page }) => {
  await page.goto('/questions?course=A1');
  await expect(page.locator('.question-row')).toHaveCount(30);
  await expect(page.getByText('2進数と情報量', { exact: true })).toHaveCount(0);
  await page.goto('/study/A1?question=sc-2025-autumn-a1-6');
  await expect(page.getByRole('table', { name: 'キャッシュメモリの状態' })).toBeVisible();
  await expect(page.getByRole('rowheader', { name: 'C2', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'IPA公式の問題PDF ↗', includeHidden: true })).toBeHidden();
  await page.locator('.question-source summary').click();
  await expect(page.getByRole('link', { name: 'IPA公式の問題PDF ↗' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'IPA公式の問題PDF ↗' })).toHaveAttribute('href', /2025r07a_koudo_am1_qs.pdf/);
  await expect(page.getByRole('link', { name: 'IPA公式の解答例 ↗' })).toHaveCount(0);
  await page.goto('/study/A2');
  await expect(page.getByRole('heading', { name: '科目A2の実問題は未収録です' })).toBeVisible();
  await page.getByRole('link', { name: '科目A1を解く' }).click();
  await expect(page.locator('.study-session-counter')).toContainText('30');
});
