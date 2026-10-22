import { test, expect } from '@playwright/test';
import { mockSpeechRecognition, speakExplanation } from './helpers/glossary-speech';

test.beforeEach(async ({ page }) => { await mockSpeechRecognition(page); });

const questionPath = '/study/A1?question=sc-2025-autumn-a1-1';
const termPath = '/glossary/digital-signature';
const explanation = '署名者の秘密鍵で署名し、公開鍵で検証して改ざんを検知します。';

test('keeps notes, calculator work and explanation drafts through reload only in the current tab', async ({ page, context }) => {
  await page.goto(questionPath);
  await page.getByTestId('mark-a').click();
  await page.getByRole('button', { name: '計算機を開く', exact: true }).click();
  const calculation = page.getByRole('textbox', { name: '計算式', exact: true });
  await calculation.fill('4+5'); await calculation.press('Enter');
  await calculation.fill('9*2');
  await page.goto(termPath);
  await speakExplanation(page, explanation);
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'ディジタル署名についての説明' })).toHaveValue(explanation);
  await page.goto(questionPath);
  await expect(page.getByTestId('mark-a')).toHaveText('○');
  await page.getByRole('button', { name: '計算機を開く', exact: true }).click();
  await expect(calculation).toHaveValue('9*2');
  await expect(page.getByRole('list', { name: '計算の履歴' })).toContainText('4+5= 9');
  await page.reload();
  await expect(page.getByTestId('mark-a')).toHaveText('○');
  await page.getByRole('button', { name: '計算機を開く', exact: true }).click();
  await expect(calculation).toHaveValue('9*2');

  // A separate tab shares the browser's durable records, but none of this work.
  const other = await context.newPage();
  await other.goto(questionPath);
  await expect(other.locator('.choice-mark-toggle')).toHaveText(['?', '?', '?', '?']);
  await other.getByRole('button', { name: '計算機を開く', exact: true }).click();
  await expect(other.getByRole('textbox', { name: '計算式', exact: true })).toHaveValue('');
  await expect(other.getByRole('list', { name: '計算の履歴' })).not.toContainText('4+5');
  await other.goto(termPath);
  await expect(other.getByRole('textbox', { name: 'ディジタル署名についての説明' })).toHaveValue('');
  await page.close();
  await other.reload();
  await expect(other.getByRole('textbox', { name: 'ディジタル署名についての説明' })).toHaveValue('');
});

test('cleans up permanently saved scratch work while preserving answer history and unrelated settings', async ({ page }) => {
  await page.goto('/study/A1?question=sc-2025-autumn-a1-2');
  await page.getByTestId('option-b').click();
  await expect(page.getByRole('region', { name: '解答結果と解説' })).toBeVisible();
  await page.goto(termPath);
  await expect(page.getByRole('textbox', { name: 'ディジタル署名についての説明' })).toBeVisible();
  await page.evaluate(async () => {
    for (const [name, draft] of [
      ['orenotameno-sc', { questionId: 'sc-2025-autumn-a1-1', uncertainOptions: [], optionMarks: { a: 'candidate' } }],
      ['orenotameno-glossary', { termId: 'digital-signature', text: '以前の下書きです。', usedVoice: false, referenceViewed: false, updatedAt: new Date().toISOString() }],
    ] as const) {
      const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open(name); request.onsuccess = () => resolve(request.result); });
      const tx = db.transaction('drafts', 'readwrite'); tx.objectStore('drafts').put(draft);
      await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
      db.close();
    }
    localStorage.setItem('orenotameno-calculator:sc-2025-autumn-a1-1', JSON.stringify({ input: '1+2', entries: [] }));
    localStorage.setItem('orenotameno-calculator:old-question', 'old work');
    localStorage.setItem('unrelated-preference', 'keep');
  });
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'ディジタル署名についての説明' })).toHaveValue('');
  const persisted = await page.evaluate(async () => {
    const counts: number[] = [];
    for (const name of ['orenotameno-sc', 'orenotameno-glossary']) {
      const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open(name); request.onsuccess = () => resolve(request.result); });
      counts.push(await new Promise<number>(resolve => { const request = db.transaction('drafts').objectStore('drafts').count(); request.onsuccess = () => resolve(request.result); }));
      if (name === 'orenotameno-sc') counts.push(await new Promise<number>(resolve => { const request = db.transaction('attempts').objectStore('attempts').count(); request.onsuccess = () => resolve(request.result); }));
      db.close();
    }
    return { counts, calculatorKeys: Object.keys(localStorage).filter(key => key.startsWith('orenotameno-calculator:')), preference: localStorage.getItem('unrelated-preference') };
  });
  expect(persisted).toEqual({ counts: [0, 1, 0], calculatorKeys: [], preference: 'keep' });
  await page.goto(questionPath);
  await expect(page.locator('.choice-mark-toggle')).toHaveText(['?', '?', '?', '?']);
  await page.getByRole('button', { name: '計算機を開く', exact: true }).click();
  await expect(page.getByRole('textbox', { name: '計算式', exact: true })).toHaveValue('');
});
