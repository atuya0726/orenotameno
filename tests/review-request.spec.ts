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
  await expect(page.locator('.question-row')).toHaveCount(2);
  await expect(page.locator('.question-row').first()).toContainText('優先して復習');
  await expect(page.locator('.question-row').last()).toContainText('要復習');
  await page.getByRole('link', { name: '科目A1を復習', exact: true }).click();
  await expect(page.locator('.question-card h2')).toContainText('伝票処理システム');
  await page.getByRole('button', { name: 'イで回答', exact: true }).click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await page.goto('/reviews');
  await expect(page.locator('.question-row')).toHaveCount(1);
  await expect(page.locator('.question-row')).toContainText('ROC曲線と偽陽性率');
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
  await page.getByRole('button', { name: 'アで回答', exact: true }).click();
  await expect(word).toHaveAttribute('aria-pressed', 'true');
  const saved = await readRecords(page);
  expect(saved.reviewWords).toEqual(['デジタル署名']);
  expect(saved.cards.every(card => card.remainingReviews === 2)).toBe(true);
  await page.goto('/reviews');
  const list = page.getByRole('region', { name: '復習する単語', exact: true });
  await expect(list.getByRole('listitem')).toHaveCount(1);
  await expect(list.getByRole('link', { name: 'デジタル署名が出てくる令和7年度秋期 科目A1の問13を解く' })).toBeVisible();
  await expect(list.getByRole('link', { name: 'デジタル署名が出てくる令和7年度秋期 科目A1の問15を解く' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await list.getByRole('button', { name: 'デジタル署名を復習する単語から外す' }).click();
  await expect(list.getByRole('listitem')).toHaveCount(0);
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
