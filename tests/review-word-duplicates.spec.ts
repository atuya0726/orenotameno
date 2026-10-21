import { expect, test, type Page } from '@playwright/test';
import { termById } from '../src/features/glossary/terms';
import { mockSpeechRecognition, speakExplanation } from './helpers/glossary-speech';

test.beforeEach(async ({ page }) => { await mockSpeechRecognition(page); });

async function seedWords(page: Page, words: string[]) {
  await page.goto('/glossary');
  await expect(page.getByRole('heading', { name: '用語学習', exact: true })).toBeVisible();
  await page.evaluate(async terms => {
    const db = await new Promise<IDBDatabase>(resolve => {
      const request = indexedDB.open('orenotameno-sc');
      request.onsuccess = () => resolve(request.result);
    });
    const tx = db.transaction('reviewWords', 'readwrite');
    for (const term of terms) tx.objectStore('reviewWords').put({ term });
    await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
    db.close();
  }, words);
}

async function savedWords(page: Page) {
  return page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => {
      const request = indexedDB.open('orenotameno-sc');
      request.onsuccess = () => resolve(request.result);
    });
    const words = await new Promise<{ term: string }[]>(resolve => {
      const request = db.transaction('reviewWords').objectStore('reviewWords').getAll();
      request.onsuccess = () => resolve(request.result);
    });
    db.close();
    return words.map(word => word.term);
  });
}

test('reviews EVM and each saved measure once with distinct headings across a reload', async ({ page }) => {
  const words = ['EVM', 'PV', 'EV', 'AC', 'SPI', 'TCPI', 'BAC'];
  const headings = ['EVM', 'PV（計画価値）', 'EV（出来高）', 'AC（実コスト）', 'SPI（スケジュール効率指数）', 'TCPI（残作業効率指数）', 'BAC（完成時総予算）'];
  await seedWords(page, words);
  await page.goto('/glossary?filter=words');
  await expect(page.locator('.term-card')).toHaveCount(words.length);
  for (const heading of headings) await expect(page.getByRole('heading', { name: heading, exact: true })).toHaveCount(1);
  await page.goto('/glossary/review');
  await expect(page.locator('.review-goal')).toContainText('7語を復習します');
  await page.getByRole('link', { name: '復習を始める', exact: true }).click();
  const seen: string[] = [];
  for (let i = 0; i < words.length; i++) {
    await expect(page.locator('.review-round-count')).toHaveText(`単語の復習 ${i + 1} / 7`);
    const heading = await page.getByRole('heading', { level: 1 }).innerText();
    expect(seen).not.toContain(heading);
    seen.push(heading);
    if (i === 2) {
      await page.reload();
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    }
    await page.getByRole('link', { name: i === words.length - 1 ? '復習を終える' : 'この単語をとばす', exact: true }).click();
  }
  await expect(page.getByRole('heading', { name: '単語の復習が終わりました' })).toBeVisible();
  expect(seen.sort()).toEqual(headings.sort());
  expect((await savedWords(page)).sort()).toEqual(words.sort());
});

test('shows true aliases once and removes all their saved spellings from the list', async ({ page }) => {
  await seedWords(page, ['ディジタル署名', 'デジタル署名', 'DNS']);
  await page.goto('/reviews');
  await expect(page.getByRole('region', { name: '復習する単語', exact: true }).locator('strong').first()).toHaveText('2語');
  await page.goto('/glossary?filter=words');
  await expect(page.locator('.term-card')).toHaveCount(2);
  const signature = page.locator('.term-card').filter({ has: page.getByRole('heading', { name: 'ディジタル署名', exact: true }) });
  await signature.getByRole('button', { name: /復習する単語から外す/ }).click();
  await expect(signature).toHaveCount(0);
  await expect.poll(() => savedWords(page)).toEqual(['DNS']);
});

test('clears all aliases after mastery and does not repeat the concept within the round', async ({ page }) => {
  const term = termById.get('digital-signature')!;
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: {
    version: 1, engine: 'openai', model: 'test', status: 'covered', grade: 'S', covered: term.criteria.length, total: term.criteria.length,
    criteria: term.criteria.map(criterion => ({ ...criterion, level: criterion.level ?? 'B', status: 'covered', evidence: '', hint: '' })), summary: '説明できています。',
  } }));
  await seedWords(page, ['ディジタル署名', 'デジタル署名']);
  await page.goto('/glossary/review');
  await expect(page.locator('.review-goal')).toContainText('1語を復習します');
  await page.getByRole('link', { name: '復習を始める', exact: true }).click();
  await expect(page.locator('.review-round-count')).toHaveText('単語の復習 1 / 1');
  await speakExplanation(page, '秘密鍵で署名を作り、公開鍵で検証して改ざんを検知する仕組みです。');
  await page.getByRole('button', { name: 'AIでチェック' }).click();
  await expect(page.getByRole('status').filter({ hasText: '復習キューから外しました' })).toBeVisible();
  await expect.poll(() => savedWords(page)).toEqual([]);
  await page.getByRole('link', { name: '復習を終える', exact: true }).click();
  await expect(page.getByRole('heading', { name: '単語の復習が終わりました' })).toBeVisible();
});
