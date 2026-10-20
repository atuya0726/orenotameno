import { test, expect, type Page } from '@playwright/test';

async function readRecords(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => {
      const request = indexedDB.open('orenotameno-sc');
      request.onsuccess = () => resolve(request.result);
    });
    const tx = db.transaction(['attempts', 'cards', 'reviewWords'], 'readonly');
    const read = (name: string) => new Promise<Record<string, unknown>[]>(resolve => {
      const request = tx.objectStore(name).getAll();
      request.onsuccess = () => resolve(request.result);
    });
    const [attempts, cards, words] = await Promise.all([read('attempts'), read('cards'), read('reviewWords')]);
    db.close();
    return { attempts, cards, reviewWords: words.map(word => word.term), version: db.version };
  });
}

test('toggles a review request after answering and preserves it across reloads', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  const toggle = page.getByRole('button', { name: '復習リストに追加', exact: true });
  await expect(toggle).toHaveCount(0);
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(page.getByRole('button', { name: '迷った', exact: true })).toHaveCount(0);
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(page.getByText(/復習はあと/)).toHaveCount(0);
  const original = (await readRecords(page)).attempts[0];
  await expect(page.locator('.answer-flash')).toHaveCount(0);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.answer-flash')).toHaveCount(0);
  let saved = await readRecords(page);
  expect(saved.attempts).toHaveLength(1);
  expect(saved.attempts[0]).toMatchObject({ id: original.id, correct: true, reviewRequested: true });
  expect(saved.cards[0].remainingReviews).toBe(2);
  await page.goto(`/record/${original.id}`);
  await page.reload();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  saved = await readRecords(page);
  expect(saved.attempts).toHaveLength(1);
  expect(saved.cards[0].remainingReviews).toBe(0);
  await page.goto('/reviews');
  await expect(page.getByRole('heading', { name: '復習する問題はありません' })).toBeVisible();
});

test('prioritizes unknown answers and clears them after a confident correct review', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-1');
  await page.getByRole('button', { name: 'わからない', exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  expect((await readRecords(page)).cards[0].remainingReviews).toBe(3);
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  const toggle = page.getByRole('button', { name: '復習リストに追加', exact: true });
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/reviews');
  const questions = page.getByRole('region', { name: '復習する問題', exact: true });
  await expect(questions).toContainText('2問');
  await expect(questions).toContainText('優先して復習 1問');
  await expect(page.locator('.question-row')).toHaveCount(0);
  await page.getByRole('link', { name: '科目A1を復習', exact: true }).click();
  await expect(page.locator('.question-card h2')).toContainText('伝票処理システム');
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.goto('/reviews');
  await expect(questions).toContainText('1問');
  await page.getByRole('link', { name: '科目A1を復習', exact: true }).click();
  await expect(page.locator('.question-card h2')).toContainText('ROC曲線');
});

test('shows an earlier doubt flag as a review request that can be cleared', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  const original = (await readRecords(page)).attempts[0];
  await page.evaluate(async id => {
    const db = await new Promise<IDBDatabase>(resolve => {
      const request = indexedDB.open('orenotameno-sc');
      request.onsuccess = () => resolve(request.result);
    });
    const tx = db.transaction('attempts', 'readwrite');
    const done = new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
    const store = tx.objectStore('attempts');
    const request = store.get(id as string);
    request.onsuccess = () => store.put({ ...request.result, reviewDoubt: true });
    await done; db.close();
  }, original.id);
  await page.goto(`/record/${original.id}`);
  const toggle = page.getByRole('button', { name: '復習リストに追加', exact: true });
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  const saved = await readRecords(page);
  expect(saved.attempts[0]).toMatchObject({ reviewDoubt: false, reviewRequested: false });
  expect(saved.cards[0].remainingReviews).toBe(0);
});

test('picks multiple question terms and restores them without adding an attempt', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await expect(page.getByRole('heading', { name: '復習したい単語を選択' })).toHaveCount(0);
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  const picker = page.getByRole('region', { name: '復習したい単語を選択' });
  await expect(picker).toBeVisible();
  await expect(picker.getByRole('button')).toHaveCount(4);
  await expect(picker.getByText(/語選択中|意味がよくわからなかった/)).toHaveCount(0);
  const roc = picker.getByRole('button', { name: 'ROC曲線を復習する', exact: true });
  const falsePositive = picker.getByRole('button', { name: '偽陽性率を復習する', exact: true });
  await roc.click();
  await expect(roc).toHaveAttribute('aria-pressed', 'true');
  await falsePositive.click();
  await expect(falsePositive).toHaveAttribute('aria-pressed', 'true');
  const { attempts, cards } = await readRecords(page);
  expect(attempts).toHaveLength(1);
  expect(attempts[0].reviewTerms).toEqual(['ROC曲線', '偽陽性率']);
  expect(cards[0].remainingReviews).toBe(2);
  const questionToggle = page.getByRole('button', { name: '復習リストに追加', exact: true });
  await questionToggle.click();
  await expect(questionToggle).toHaveAttribute('aria-pressed', 'true');
  await questionToggle.click();
  await expect(questionToggle).toHaveAttribute('aria-pressed', 'false');
  expect((await readRecords(page)).cards[0].remainingReviews).toBe(2);
  await page.goto(`/record/${attempts[0].id}`);
  await page.reload();
  await expect(roc).toHaveAttribute('aria-pressed', 'true');
  await expect(falsePositive).toHaveAttribute('aria-pressed', 'true');
  await roc.click();
  await expect(roc).toHaveAttribute('aria-pressed', 'false');
  expect((await readRecords(page)).cards[0].remainingReviews).toBe(2);
  await falsePositive.click();
  await expect(falsePositive).toHaveAttribute('aria-pressed', 'false');
  const cleared = await readRecords(page);
  expect(cleared.attempts).toHaveLength(1);
  expect(cleared.attempts[0].reviewTerms).toEqual([]);
  expect(cleared.cards[0].remainingReviews).toBe(0);
});

test('keeps word picks unchanged on a failed save and allows retrying', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.addInitScript(() => {
    const put = IDBObjectStore.prototype.put;
    let fail = true;
    IDBObjectStore.prototype.put = function(value: unknown, key?: IDBValidKey) {
      const request = key === undefined ? put.call(this, value) : put.call(this, value, key);
      if (this.name === 'attempts' && (value as { reviewTerms?: string[] }).reviewTerms?.length && fail) {
        fail = false; this.transaction.abort();
      }
      return request;
    };
  });
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  const term = page.getByRole('button', { name: 'ROC曲線を復習する', exact: true });
  await term.click();
  await expect(page.getByRole('alert')).toContainText('保存できませんでした');
  await expect(term).toHaveAttribute('aria-pressed', 'false');
  expect((await readRecords(page)).cards[0].remainingReviews).toBe(0);
  expect((await readRecords(page)).reviewWords).toEqual([]);
  await term.click();
  await expect(term).toHaveAttribute('aria-pressed', 'true');
  expect((await readRecords(page)).cards[0].remainingReviews).toBe(2);
  expect((await readRecords(page)).reviewWords).toEqual(['ROC曲線']);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('shares a saved word between questions and removes it globally from the review notebook', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/study/A1?question=sc-2025-autumn-a1-13');
  await page.getByRole('button', { name: 'ウで回答', exact: true }).click();
  const word = page.getByRole('button', { name: 'デジタル署名を復習する', exact: true });
  await word.click();
  await expect(word).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/study/A1?question=sc-2025-autumn-a1-15');
  await page.getByRole('button', { name: 'アで回答', exact: true }).click();
  await expect(word).toHaveAttribute('aria-pressed', 'true');
  await page.reload();
  await expect(page.getByRole('button', { name: 'アで回答', exact: true })).toBeDisabled();
  await expect(word).toHaveAttribute('aria-pressed', 'true');
  const saved = await readRecords(page);
  expect(saved.attempts).toHaveLength(2);
  expect(saved.reviewWords).toEqual(['デジタル署名']);
  expect(saved.cards.every(card => card.remainingReviews === 2)).toBe(true);
  await page.goto('/reviews');
  await expect(page.locator('.question-row')).toHaveCount(0);
  const summary = page.getByRole('region', { name: '復習する単語', exact: true });
  await expect(summary).toContainText('1語');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await summary.getByRole('link', { name: '単語を復習' }).click();
  await expect(page.getByRole('heading', { name: '単語復習の目標レベル' })).toBeVisible();
  await page.getByRole('link', { name: '復習を始める' }).click();
  // the question's spelling opens the collected glossary term
  await expect(page).toHaveURL(/\/glossary\/digital-signature\?.*review=/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ディジタル署名');
  await page.goto('/glossary?filter=words');
  const cards = page.locator('.term-card');
  await expect(cards).toHaveCount(1);
  await expect(cards.getByRole('heading')).toHaveText('ディジタル署名');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('button', { name: 'デジタル署名を復習する単語から外す' }).click();
  await expect(page.getByRole('heading', { name: '復習する単語はありません' })).toBeVisible();
  const cleared = await readRecords(page);
  expect(cleared.reviewWords).toEqual([]);
  expect(cleared.cards.every(card => card.remainingReviews === 0)).toBe(true);
  await page.goto(`/record/${saved.attempts[0].id}`);
  await page.reload();
  await expect(word).toHaveAttribute('aria-pressed', 'false');
});

test('upgrades existing per-answer word selections without losing learning records', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  const word = page.getByRole('button', { name: 'ROC曲線を復習する', exact: true });
  await word.click();
  await expect(word).toHaveAttribute('aria-pressed', 'true');
  const [original] = (await readRecords(page)).attempts;
  // Recreate the previous database schema with an existing answer as the upgrade fixture.
  await page.evaluate(async attempt => {
    await new Promise<void>((resolve, reject) => { const request = indexedDB.deleteDatabase('orenotameno-sc'); request.onsuccess = () => resolve(); request.onerror = () => reject(request.error); });
    const db = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('orenotameno-sc', 1);
      request.onupgradeneeded = () => {
        for (const [name, keyPath] of [['attempts', 'id'], ['cards', 'questionId'], ['bookmarks', 'questionId'], ['drafts', 'questionId'], ['settings', 'name']]) request.result.createObjectStore(name, { keyPath });
      };
      request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error);
    });
    const tx = db.transaction('attempts', 'readwrite');
    const done = new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
    tx.objectStore('attempts').put(attempt);
    await done; db.close();
  }, original);
  await page.goto(`/record/${original.id}`);
  await expect(word).toHaveAttribute('aria-pressed', 'true');
  const restored = await readRecords(page);
  expect(restored.version).toBe(2);
  expect(restored.reviewWords).toEqual(['ROC曲線']);
  expect(restored.attempts).toHaveLength(1);
  expect(restored.attempts[0].id).toBe(original.id);
  expect(restored.cards[0].remainingReviews).toBe(2);
  await page.reload();
  expect((await readRecords(page)).reviewWords).toEqual(['ROC曲線']);
});

test('keeps the saved state on failure and allows retrying the request', async ({ page }) => {
  await page.addInitScript(() => {
    const put = IDBObjectStore.prototype.put;
    let fail = true;
    IDBObjectStore.prototype.put = function(value: unknown, key?: IDBValidKey) {
      const request = key === undefined ? put.call(this, value) : put.call(this, value, key);
      if (this.name === 'attempts' && (value as { reviewRequested?: boolean }).reviewRequested && fail) {
        fail = false; this.transaction.abort();
      }
      return request;
    };
  });
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  const toggle = page.getByRole('button', { name: '復習リストに追加', exact: true });
  await toggle.click();
  await expect(page.getByRole('alert')).toContainText('保存できませんでした');
  await expect(toggle).toBeEnabled();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  expect((await readRecords(page)).cards[0].remainingReviews).toBe(0);
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  expect((await readRecords(page)).cards[0].remainingReviews).toBe(2);
});

test('reviews saved words one after another in random order from the review notebook', async ({ page }) => {
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: { version: 1, engine: 'openai', model: 'test-model', status: 'covered', grade: 'B', covered: 1, total: 1, criteria: [{ id: 'core', title: '基本の仕組み', level: 'B', status: 'covered', evidence: '', hint: '押さえられています。' }], summary: '説明できています。', definition: '用語の説明例です。' } }));
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await page.getByRole('button', { name: 'ROC曲線を復習する', exact: true }).click();
  await page.getByRole('button', { name: '偽陽性率を復習する', exact: true }).click();
  await expect(page.getByRole('button', { name: '偽陽性率を復習する', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/reviews');
  await page.getByRole('link', { name: '単語を復習' }).click();
  await page.getByRole('radio', { name: 'A · 応用', exact: false }).check();
  await page.getByRole('link', { name: '復習を始める' }).click();
  // the first word is picked at random and opens its glossary term directly; both words open the ROC曲線 term
  await expect(page).toHaveURL(/\/glossary\/roc-curve\?.*review=/);
  await expect(page.getByText('単語の復習 1 / 2')).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('ROC曲線');
  const first = new URL(page.url()).searchParams.get('review');
  await page.getByRole('link', { name: 'この単語をとばす' }).click();
  await expect(page.getByText('単語の復習 2 / 2')).toBeVisible();
  const second = new URL(page.url()).searchParams.get('review');
  expect([first, second].sort()).toEqual(['ROC曲線', '偽陽性率'].sort());
  await page.getByRole('textbox', { name: 'ROC曲線についての説明' }).fill('しきい値を変えたときの偽陽性率と真陽性率の関係を表す曲線です。');
  await page.getByRole('button', { name: 'AIでチェック' }).click();
  await expect(page.getByRole('status').filter({ hasText: '目標Aに届かなかった' })).toBeVisible();
  expect((await readRecords(page)).reviewWords.sort()).toEqual(['ROC曲線', '偽陽性率'].sort());
  await page.getByRole('link', { name: '復習を終える' }).click();
  await expect(page.getByRole('heading', { name: '単語の復習が終わりました' })).toBeVisible();
  await page.getByRole('link', { name: 'もう一周する' }).click();
  await expect(page.getByRole('heading', { name: '単語復習の目標レベル' })).toBeVisible();
  await page.getByRole('link', { name: '復習を始める' }).click();
  await expect(page.getByText('単語の復習 1 / 2')).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

function wordEvaluation(grade: string | undefined) {
  return { version: 1, engine: 'openai', model: 'test-model', status: 'covered', grade, covered: 1, total: 1, criteria: [{ id: 'core', title: '基本の仕組み', level: 'B', status: 'covered', evidence: '', hint: '確認しました。' }], summary: '説明を確認しました。', definition: '用語の説明例です。' };
}
async function startWordReview(page: Page, target: string) {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-13');
  await page.getByRole('button', { name: 'ウで回答', exact: true }).click();
  await page.getByRole('button', { name: 'デジタル署名を復習する', exact: true }).click();
  await page.goto('/glossary?filter=words');
  await page.getByRole('link', { name: '単語を復習', exact: true }).click();
  await page.getByRole('radio', { name: new RegExp(`^${target} ·`) }).check();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole('link', { name: '復習を始める' }).click();
  await expect(page.locator('.review-round-bar')).toContainText(`目標 ${target}`);
}

for (const { target, grade, removed } of [
  { target: 'B', grade: 'B', removed: true },
  { target: 'B', grade: 'S', removed: true },
  { target: 'B', grade: 'C', removed: false },
  { target: 'A', grade: 'B', removed: false },
  { target: 'A', grade: 'A', removed: true },
  { target: 'A', grade: 'S', removed: true },
  { target: 'S', grade: 'A', removed: false },
  { target: 'S', grade: 'S', removed: true },
  { target: 'B', grade: undefined, removed: false },
]) {
  test(`keeps or removes a saved word with target ${target} and grade ${grade ?? 'missing'}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: wordEvaluation(grade) }));
    await startWordReview(page, target);
    await page.reload();
    await expect(page.locator('.review-round-bar')).toContainText(`目標 ${target}`);
    await page.getByRole('textbox', { name: 'ディジタル署名についての説明' }).fill('秘密鍵で署名を作り、公開鍵で検証して改ざんを検知する仕組みです。');
    await page.getByRole('button', { name: 'AIでチェック' }).click();
    await expect(page.getByRole('status').filter({ hasText: removed ? '復習キューから外しました' : '復習キューに残します' })).toBeVisible();
    const records = await readRecords(page);
    expect(records.reviewWords).toEqual(removed ? [] : ['デジタル署名']);
    expect(records.cards[0].remainingReviews).toBe(removed ? 0 : 2);
    await page.getByRole('link', { name: '復習を終える' }).click();
    await expect(page.getByRole('heading', { name: '単語の復習が終わりました' })).toBeVisible();
    await expect(page.locator('.session-complete')).toContainText(`復習キューに残っている単語は${removed ? 0 : 1}語`);
    await page.reload();
    expect((await readRecords(page)).reviewWords).toEqual(removed ? [] : ['デジタル署名']);
  });
}

test('retries a failed queue removal without paying for another evaluation', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/glossary/evaluate', route => { calls++; return route.fulfill({ json: wordEvaluation('A') }); });
  await page.addInitScript(() => {
    const remove = IDBObjectStore.prototype.delete; let fail = true;
    IDBObjectStore.prototype.delete = function(key: IDBValidKey | IDBKeyRange) {
      const request = remove.call(this, key);
      if (this.name === 'reviewWords' && fail) { fail = false; this.transaction.abort(); }
      return request;
    };
  });
  await startWordReview(page, 'A');
  await page.getByRole('textbox', { name: 'ディジタル署名についての説明' }).fill('秘密鍵で署名を作り、公開鍵で検証して改ざんを検知する仕組みです。');
  await page.getByRole('button', { name: 'AIでチェック' }).click();
  await expect(page.getByRole('alert')).toContainText('評価は保存されています');
  expect((await readRecords(page)).reviewWords).toEqual(['デジタル署名']);
  await page.getByRole('button', { name: 'キューから外す処理を再試行' }).click();
  await expect(page.getByRole('status').filter({ hasText: '復習キューから外しました' })).toBeVisible();
  expect((await readRecords(page)).reviewWords).toEqual([]);
  expect(calls).toBe(1);
});

test('keeps progress stable as mastered words leave the queue and removes only the reviewed spelling', async ({ page }) => {
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: wordEvaluation('S') }));
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await page.getByRole('button', { name: 'ROC曲線を復習する', exact: true }).click();
  await page.getByRole('button', { name: '偽陽性率を復習する', exact: true }).click();
  await expect(page.getByRole('button', { name: '偽陽性率を復習する', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await page.goto('/glossary/review');
  await page.getByRole('link', { name: '復習を始める' }).click();
  await expect(page.getByText('単語の復習 1 / 2')).toBeVisible();
  const first = new URL(page.url()).searchParams.get('review');
  await page.getByRole('textbox', { name: 'ROC曲線についての説明' }).fill('しきい値を変えたときの偽陽性率と真陽性率の関係を表す曲線です。');
  await page.getByRole('button', { name: 'AIでチェック' }).click();
  await expect(page.getByRole('status').filter({ hasText: '復習キューから外しました' })).toBeVisible();
  expect((await readRecords(page)).reviewWords).toEqual(['ROC曲線', '偽陽性率'].filter(word => word !== first));
  await expect(page.getByText('単語の復習 1 / 2')).toBeVisible();
  await page.getByRole('link', { name: '次の単語へ', exact: true }).click();
  await expect(page.getByText('単語の復習 2 / 2')).toBeVisible();
  await expect(page.locator('.review-round-bar')).toContainText('目標 B');
  await page.getByRole('textbox', { name: 'ROC曲線についての説明' }).fill('しきい値を変えたときの偽陽性率と真陽性率の関係を表す曲線です。');
  await page.getByRole('button', { name: 'AIでチェック' }).click();
  await expect(page.getByRole('status').filter({ hasText: '復習キューから外しました' })).toBeVisible();
  await page.getByRole('link', { name: '復習を終える' }).click();
  await expect(page.getByRole('heading', { name: '単語の復習が終わりました' })).toBeVisible();
  expect((await readRecords(page)).reviewWords).toEqual([]);
});
