import { test, expect, type Page } from '@playwright/test';

async function answerFirst(page: Page, selected = 'イ', requested = false) {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-1');
  await page.getByRole('button', { name: `${selected}で回答`, exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  if (requested) {
    const toggle = page.getByRole('button', { name: '復習リストに追加', exact: true });
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  }
}
async function counts(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const r = indexedDB.open('orenotameno-sc'); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
    const tx = db.transaction(['attempts', 'cards', 'drafts'], 'readonly');
    const results = await Promise.all(['attempts', 'cards', 'drafts'].map(name => new Promise<number>((resolve, reject) => { const r = tx.objectStore(name).count(); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); })));
    db.close(); return results;
  });
}
async function storedAttempts(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const r = indexedDB.open('orenotameno-sc'); r.onsuccess = () => resolve(r.result); });
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
  await expect(page.getByRole('button', { name: '復習リストに追加', exact: true })).toBeVisible();
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
    await expect(page.locator('.answer-outcome strong')).toHaveText('未解答');
    await expect(page.getByRole('button', { name: '復習リストに追加', exact: true })).toHaveCount(0);
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
  await expect(page.getByRole('button', { name: '復習リストに追加', exact: true })).toBeVisible();
  expect(await counts(page)).toEqual([1, 1, 0]);
  expect((await storedAttempts(page))[0]).toMatchObject({ selected: 'b', confidence: 'high', uncertainOptions: [] });
});

test('asks about review requests only after answering', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await expect(page.getByText('自信あり', { exact: false })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '迷いあり', exact: true })).toHaveCount(0);
  const toggle = page.getByRole('button', { name: '復習リストに追加', exact: true });
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
  const toggle = page.getByRole('button', { name: '復習リストに追加', exact: true });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect((await storedAttempts(page)).find(a => a.questionId === 'sc-2025-autumn-a1-2')).toMatchObject({ selected: 'b', confidence: 'high', reviewRequested: true, uncertainOptions: [] });
  await page.getByRole('button', { name: '次の問題へ' }).click();
  await expect(toggle).toHaveCount(0);
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByRole('button', { name: '復習リストに追加', exact: true })).toHaveAttribute('aria-pressed', 'false');
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
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
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
  await expect(page.getByRole('button', { name: '復習リストに追加', exact: true })).toBeVisible();
  expect(await storedAttempts(page)).toHaveLength(1);
  expect((await storedAttempts(page))[0]).toMatchObject({ selected: 'b', confidence: 'high' });
  expect(errors).toEqual([]);
});

test('answers with the keyboard without submitting when moving focus', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  const answer = page.getByRole('button', { name: 'イで回答', exact: true });
  await answer.focus();
  expect(await storedAttempts(page)).toHaveLength(0);
  await answer.press('Enter');
  await expect(page.getByRole('button', { name: '復習リストに追加', exact: true })).toBeVisible();
  expect(await storedAttempts(page)).toHaveLength(1);
});

test('queues a requested calculation review and finishes a session', async ({ page }) => {
  await answerFirst(page, 'イ', true);
  await expect(page.getByRole('button', { name: '復習リストに追加', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '今回の学習を終える' }).click();
  await expect(page.getByRole('heading', { name: '学習完了' })).toBeVisible();
  await page.getByRole('link', { name: '復習ノートを見る', exact: true }).click();
  await expect(page.getByRole('region', { name: '復習する問題', exact: true })).toContainText('1問');
  await page.getByRole('link', { name: '科目A1を復習', exact: true }).click();
  await expect(page.locator('.question-card h2')).toContainText('M/M/1');
});

test('requires three reviews for a confident mistake and exposes them immediately', async ({ page }) => {
  await answerFirst(page, 'ア');
  await expect(page.getByRole('button', { name: '復習リストに追加', exact: true })).toHaveCount(0);
  await page.goto('/reviews');
  await page.getByRole('link', { name: '科目A1を復習' }).click();
  await expect(page.getByRole('heading', { name: /伝票処理システム/ })).toBeVisible();
  await expect(page.getByRole('button', { name: 'イで回答', exact: true })).toBeEnabled();
  await expect(page.getByRole('button', { name: '迷いあり', exact: true })).toHaveCount(0);
});

test('removes settings and daily goals while preserving saved learning records', async ({ page }) => {
  await answerFirst(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '学習ホーム', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '今日の学習', exact: true })).toHaveCount(0);
  await expect(page.getByRole('progressbar', { name: '今日の学習目標' })).toHaveCount(0);
  await expect(page.locator('a[href="/settings"]')).toHaveCount(0);
  await expect(page.locator('.overview-main > strong')).toHaveText('1 / 500 問');
  await page.goto('/settings');
  await expect(page.getByRole('heading', { name: 'ページが見つかりません', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: '学習の設定', exact: true })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: '学習記録の保存', exact: true })).toHaveCount(0);
  expect(await counts(page)).toEqual([1, 1, 0]);
  await page.goto('/records');
  await page.getByRole('link', { name: /M\/M\/1/ }).click();
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
  await expect(page.getByRole('button', { name: /科目A1 共通知識/ })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByRole('button', { name: /科目A2 セキュリティ専門知識/ })).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('.practice-count')).toHaveText('出題数 300問');
  await page.screenshot({ path: 'test-results/desktop-home.png', fullPage: true });
});

test('chooses questions by session, field and options like a past-exam dojo, and remembers the setup', async ({ page }) => {
  await page.goto('/');
  const setup = page.getByRole('region', { name: '問題を選ぶ' });
  await setup.getByRole('button', { name: '試験回の選択をすべて解除' }).click();
  await expect(setup.locator('.practice-count')).toHaveText('条件に合う問題がありません');
  await expect(setup.getByRole('button', { name: '出題開始' })).toBeDisabled();
  await setup.getByRole('checkbox', { name: /令和6年度春期/ }).check();
  await expect(setup.locator('.practice-count')).toHaveText('出題数 30問');
  await setup.getByRole('button', { name: '分野を指定' }).click();
  await setup.getByRole('button', { name: '分野の選択をすべて解除' }).click();
  await setup.getByRole('checkbox', { name: /^プロジェクトマネジメント/ }).check();
  await expect(setup.locator('.practice-count')).toHaveText('出題数 25問');
  await setup.getByRole('checkbox', { name: '試験回でも絞り込む' }).check();
  await expect(setup.locator('.practice-count')).toHaveText('出題数 3問');
  await setup.getByText('試験回・番号順', { exact: true }).click();
  await expect(setup.getByRole('radio', { name: '試験回・番号順' })).toBeChecked();
  await setup.getByRole('link', { name: '出題開始' }).click();
  await expect(page).toHaveURL(/by=fields&sets=sc-2024-spring-a1&fields=project&narrow=1&order=number/);
  await expect(page.locator('.study-session-counter')).toContainText('1 / 3');
  await expect(page.getByRole('heading', { name: /EVMで管理しているプロジェクト/ })).toBeVisible();
  await expect(page.getByRole('link', { name: '学習ホーム' }).first()).toBeVisible();
  await page.goto('/');
  await expect(setup.getByRole('button', { name: '分野を指定' })).toHaveAttribute('aria-pressed', 'true');
  await expect(setup.locator('.practice-count')).toHaveText('出題数 3問');
  await setup.getByRole('button', { name: '模擬試験' }).click();
  await setup.getByRole('radio', { name: /令和5年度秋期/ }).check();
  await setup.getByRole('link', { name: '出題開始' }).click();
  await expect(page.locator('.study-session-counter')).toContainText('1 / 30');
  await expect(page.getByRole('heading', { name: /逆ポーランド表記法/ })).toBeVisible();
});

test('offers 300 A1 and 200 A2 questions and renders their tables', async ({ page }) => {
  await page.goto('/questions?course=A1');
  await expect(page.locator('.question-row')).toHaveCount(300);
  await expect(page.getByText('2進数と情報量', { exact: true })).toHaveCount(0);
  await page.goto('/study/A1?question=sc-2025-autumn-a1-6');
  await expect(page.getByRole('table', { name: 'キャッシュメモリの状態' })).toBeVisible();
  await expect(page.getByRole('rowheader', { name: 'C2', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'IPA公式の問題PDF ↗', includeHidden: true })).toBeHidden();
  await page.locator('.question-source summary').click();
  await expect(page.getByRole('link', { name: 'IPA公式の問題PDF ↗' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'IPA公式の問題PDF ↗' })).toHaveAttribute('href', /2025r07a_koudo_am1_qs.pdf/);
  await expect(page.getByRole('link', { name: 'IPA公式の解答例 ↗' })).toHaveCount(0);
  await page.goto('/study/A1?question=sc-2025-spring-a1-10');
  await expect(page.getByLabel('SQL文')).toContainText('ON DELETE  a');
  await page.goto('/study/A1?question=sc-2023-autumn-a1-19');
  await expect(page.getByRole('figure', { name: '図1 当初の計画／図2 変更後の計画' }).getByRole('img')).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await page.goto('/questions?course=A2');
  await expect(page.locator('.question-row')).toHaveCount(200);
  await page.goto('/study/A2?question=sc-2025-autumn-a2-24');
  await expect(page.getByRole('table', { name: 'サービス停止状況' })).toBeVisible();
  await page.locator('.question-source summary').click();
  await expect(page.getByRole('link', { name: 'IPA公式の問題PDF ↗' })).toHaveAttribute('href', /2025r07a_sc_am2_qs.pdf/);
  await page.goto('/study/A2?question=sc-2025-spring-a2-21');
  await expect(page.getByRole('table', { name: '従業員', exact: true })).toBeVisible();
  await expect(page.getByLabel('SQL文')).toContainText('WHERE NOT EXISTS');
  await expect(page.getByRole('columnheader', { name: '従業員コード（主キー）' })).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await page.screenshot({ path: '.cache/past-exam/2025r07h_sc_am2/sql-preview.png', fullPage: true });
  await page.goto('/study/A2?question=sc-2025-spring-a2-24');
  await expect(page.getByText('システム障害によるサービス提供時間内の停止時間：7時間', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'ウで回答', exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  await expect(page.locator('.katex').first()).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);
  await page.goto('/study/A2');
  await expect(page.locator('.study-session-counter')).toContainText('200');
});

test('renders the added A2 questions across six sessions with figures and formulas', async ({ page }) => {
  await page.goto('/study/A2?question=sc-2024-autumn-a2-7');
  await expect(page.getByRole('heading', { name: /パスキー/ })).toBeVisible();
  await page.getByRole('button', { name: 'アで回答', exact: true }).click();
  await expect(page.locator('.answer-outcome').getByText('正解', { exact: true })).toBeVisible();

  await page.goto('/study/A2?question=sc-2024-spring-a2-24');
  await expect(page.locator('.choice-figure svg')).toHaveCount(4);
  await page.screenshot({ path: '.cache/past-exam/three-years/tariff-preview.png', fullPage: true });
  await page.getByRole('button', { name: 'ウで回答', exact: true }).click();
  await expect(page.locator('.answer-outcome').getByText('正解', { exact: true })).toBeVisible();

  await page.goto('/study/A2?question=sc-2023-autumn-a2-17');
  await expect(page.getByRole('figure', { name: 'ネットワーク構成の変更' }).getByRole('img')).toBeVisible();
  await expect(page.getByText('フィルタリングルールは，必要な通信だけを許可する設定にする。', { exact: true })).toBeVisible();
  await page.screenshot({ path: '.cache/past-exam/three-years/network-preview.png', fullPage: true });

  await page.goto('/study/A2?question=sc-2023-spring-a2-18');
  await expect(page.locator('.katex').first()).toBeVisible();
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);

  await page.goto('/study/A2?question=sc-2022-autumn-a2-22');
  await expect(page.getByRole('figure', { name: 'テスト対象の流れ図' }).getByRole('img')).toBeVisible();
  await page.screenshot({ path: '.cache/past-exam/three-years/branch-preview.png', fullPage: true });
  await page.goto('/study/A2?question=sc-2022-autumn-a2-21');
  await expect(page.getByRole('table', { name: /表R（列X・Y）と表S/ })).toBeVisible();
  await expect(page.getByLabel('SQL文')).toContainText('LEFT OUTER JOIN');
  await page.goto('/study/A2?question=sc-2022-autumn-a2-24');
  await expect(page.getByRole('table', { name: 'システム化案（単位：百万円）' })).toBeVisible();
  await page.getByRole('button', { name: 'エで回答', exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toContainText('175％');
  await expect(page.locator('.katex-error')).toHaveCount(0);

  await page.goto('/study/A2?question=sc-2022-spring-a2-12');
  await expect(page.getByRole('table', { name: 'クラウドサービスの責務' })).toBeVisible();
  await page.goto('/study/A2?question=sc-2022-spring-a2-4');
  await expect(page.locator('.katex')).toHaveCount(4);
  await page.getByRole('button', { name: 'アで回答', exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  await expect(page.locator('.katex-error')).toHaveCount(0);
});
