import { expect, test, type Page } from '@playwright/test';
import { termById } from '../src/features/glossary/terms';
import { mockSpeechRecognition, speakExplanation } from './helpers/glossary-speech';

test.beforeEach(async ({ page }) => { await mockSpeechRecognition(page); });

const term = termById.get('digital-signature')!;
const text = '署名者の秘密鍵で署名を作り、公開鍵で検証し、改ざんを検知する仕組みです。';
const textbox = (page: Page) => page.getByRole('textbox', { name: 'ディジタル署名についての説明' });
const check = (page: Page) => page.getByRole('button', { name: 'AIでチェック' });
function evaluation(input = text) { return { version: 1, engine: 'openai', model: 'gpt-6-luna', status: 'covered', grade: 'A', covered: 3, total: 3, criteria: term.criteria.map(c => ({ id: c.id, title: c.title, level: c.level ?? 'B', status: c.level === 'S' ? 'missing' : 'covered', evidence: c.level === 'S' ? '' : input, hint: c.level === 'S' ? 'タイムスタンプによる長期署名の点が足りません。' : '鍵の関係を正しく説明できています。' })), summary: '署名と検証の役割を説明できています。', followUp: { name: '公開鍵基盤', reason: '公開鍵が本人のものだと確かめる仕組みが説明にないためです。' } }; }
async function entries(page: Page, name = 'orenotameno-glossary') {
  return page.evaluate(async dbName => {
    const db = await new Promise<IDBDatabase>((resolve, reject) => { const request = indexedDB.open(dbName); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    const records = await new Promise<Record<string, unknown>[]>((resolve, reject) => { const request = db.transaction('attempts').objectStore('attempts').getAll(); request.onsuccess = () => resolve(request.result); request.onerror = () => reject(request.error); });
    db.close(); return records;
  }, name);
}

test('practices certificate purposes separately and shows only one B point when sufficient', async ({ page }) => {
  for (const [name, id] of [['サーバ証明書', 'certificates'], ['クライアント証明書', 'client-certificate'], ['コードサイニング証明書', 'code-signing-certificate'], ['EV SSL証明書', 'ev-ssl-certificate']]) {
    await page.goto('/glossary');
    await page.getByRole('textbox', { name: '用語を検索' }).fill(name);
    await expect(page.locator('.term-card')).toHaveCount(1);
    await page.getByRole('link', { name: '説明する', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/glossary/${id}$`));
  }
  const serverCertificate = termById.get('certificates')!;
  const explanation = 'TLS通信で接続先のサーバーを認証するための証明書です。';
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: {
    ...evaluation(explanation), grade: 'B', covered: 1, total: 1,
    criteria: serverCertificate.criteria.map(c => ({ ...c, level: 'B', status: 'covered', evidence: explanation })),
  } }));
  await page.goto('/glossary/certificates');
  await speakExplanation(page, explanation);
  await check(page).click();
  await expect(page.getByLabel('評価 B', { exact: true })).toBeVisible();
  await expect(page.locator('.rubric-level-heading')).toHaveCount(1);
  await expect(page.locator('.rubric-level-heading')).toContainText('基本');
  await expect(page.locator('.rubric-item')).toHaveCount(1);
});

test('opens crashing and fast tracking as separate practices with reciprocal related links', async ({ page }) => {
  for (const [name, id] of [['クラッシング', 'schedule-compression'], ['ファストトラッキング', 'fast-tracking']]) {
    await page.goto('/glossary');
    await page.getByRole('textbox', { name: '用語を検索' }).fill(name);
    await expect(page.locator('.term-card')).toHaveCount(1);
    await page.getByRole('link', { name: '説明する', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/glossary/${id}$`));
    await expect(page.getByRole('heading', { name, level: 1, exact: true })).toBeVisible();
    await expect(page.getByRole('textbox', { name: `${name}についての説明` })).toBeVisible();
  }
  await page.getByRole('link', { name: 'クラッシング', exact: true }).click();
  await expect(page).toHaveURL(/\/glossary\/schedule-compression$/);
  await page.getByRole('link', { name: 'ファストトラッキング', exact: true }).click();
  await expect(page).toHaveURL(/\/glossary\/fast-tracking$/);
});

test('practices authenticity separately and checks the CIA overview with only one basic point', async ({ page }) => {
  await page.goto('/glossary');
  await page.getByRole('textbox', { name: '用語を検索' }).fill('真正性');
  await expect(page.locator('.term-card')).toHaveCount(1);
  await page.getByRole('link', { name: '説明する', exact: true }).click();
  await expect(page).toHaveURL(/\/glossary\/authenticity$/);
  await expect(page.getByRole('heading', { name: '真正性', level: 1, exact: true })).toBeVisible();
  const overview = termById.get('security-properties')!;
  const explanation = '情報セキュリティの基本の3要素は、機密性・完全性・可用性です。';
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: {
    ...evaluation(explanation), grade: 'B', covered: 1, total: 1,
    summary: '基本の3要素を挙げられています。',
    criteria: overview.criteria.map(c => ({ ...c, level: 'B', status: 'covered', evidence: explanation })),
  } }));
  await page.goto('/glossary/security-properties');
  await speakExplanation(page, explanation);
  await check(page).click();
  await expect(page.getByLabel('評価 B', { exact: true })).toBeVisible();
  await expect(page.locator('.rubric-item')).toHaveCount(1);
  await expect(page.locator('.rubric-results')).not.toContainText('真正性');
});

test('searches terms and persists drafts without exposing the reference first', async ({ page }) => {
  await page.goto('/glossary');
  await page.getByRole('textbox', { name: '用語を検索' }).fill('Digital signature');
  await expect(page.locator('.term-card')).toHaveCount(1);
  await page.getByRole('link', { name: '説明する', exact: true }).click();
  await expect(page.locator('.term-reference')).toHaveCount(0);
  await expect(check(page)).toBeDisabled();
  await speakExplanation(page, text);
  await expect(check(page)).toBeEnabled();
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('orenotameno:glossary-draft:digital-signature') ?? '{}').text)).toBe(text);
  await page.reload(); await expect(textbox(page)).toHaveValue(text);
  await page.getByRole('button', { name: '全文削除' }).click();
  await expect(textbox(page)).toHaveValue('');
  await expect(textbox(page)).toBeDisabled();
  await expect(page.getByRole('button', { name: '押しながら話す' })).toBeFocused();
  await expect(check(page)).toBeDisabled();
  await expect(page.getByRole('button', { name: '全文削除' })).toBeDisabled();
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem('orenotameno:glossary-draft:digital-signature') ?? '{}').text)).toBe('');
  await page.reload(); await expect(textbox(page)).toHaveValue('');
});

test('evaluates once, stores feedback separately from quizzes, and reviews a historical explanation', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/glossary/evaluate', async route => {
    calls++; expect(route.request().postDataJSON()).toEqual({ termId: term.id, text });
    await route.fulfill({ json: evaluation() });
  });
  await page.goto('/glossary/digital-signature'); await speakExplanation(page, text); await check(page).click();
  await expect(page.locator('.glossary-follow-up')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: '判定', exact: true })).toBeVisible();
  await expect(page.getByLabel('評価 A', { exact: true })).toBeVisible();
  await expect(page.locator('.glossary-result-heading')).toHaveText('判定A');
  const resultRegion = page.getByRole('region', { name: '説明のチェック結果' });
  const resultBox = await resultRegion.boundingBox();
  const formBox = await page.locator('.explanation-form').boundingBox();
  expect(formBox!.y + formBox!.height).toBeLessThan(resultBox!.y);
  await expect(page.locator('.term-reference')).toHaveCount(0);
  const exampleToggle = page.getByRole('button', { name: '説明例を見る', exact: true });
  await expect(exampleToggle).toHaveAttribute('aria-expanded', 'false');
  await exampleToggle.click();
  await expect(page.locator('#term-reference-panel .term-reference')).toBeVisible();
  await expect(resultRegion).toBeVisible();
  await page.getByRole('button', { name: '説明例を閉じる', exact: true }).click();
  await expect(page.locator('.term-reference')).toHaveCount(0);
  await expect(page.locator('.glossary-result-heading')).toHaveText('判定A');
  await expect(page.getByText(evaluation().summary, { exact: true })).toHaveCount(0);
  await expect(page.locator('.rubric-level-heading').filter({ hasText: /^B/ })).toContainText('用語の意味・目的・基本の仕組み');
  await expect(page.locator('.rubric-level-heading').filter({ hasText: '応用' })).toContainText('用途・理由・制約・影響');
  await expect(page.locator('.rubric-level-heading').filter({ hasText: '発展' })).toHaveCount(0);
  await expect(page.locator('.rubric-missing')).toHaveCount(0);
  await expect(page.getByText('OpenAI · gpt-6-luna')).toHaveCount(0);
  expect(calls).toBe(1); expect(await entries(page, 'orenotameno-sc')).toEqual([]);
  expect(await entries(page)).toHaveLength(1);
  await page.getByRole('link', { name: '説明の履歴', exact: true }).click();
  await page.reload(); await page.getByRole('link', { name: '見直す', exact: true }).click();
  await expect(page.locator('.saved-explanation')).toContainText(text);
  await expect(page.getByRole('button', { name: '説明例を見る', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.term-reference')).toHaveCount(0);
  await expect(page.locator('.glossary-result-heading')).toHaveText('判定A');
  await expect(page.getByRole('link', { name: '次の用語へ' })).toBeVisible();
});

test('shows the specific conditions at S after the basic and applied explanations', async ({ page }) => {
  const normal = termById.get('normal-distribution')!;
  const explanation = '平均を中心に左右対称な釣鐘型の分布で、標準偏差が大きいほど横に広がります。';
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: {
    ...evaluation(explanation), grade: 'A', covered: 1, total: 1,
    criteria: normal.criteria.map(c => ({ ...c, level: c.level ?? 'B', status: c.level === 'S' ? 'missing' : 'covered', evidence: c.level === 'S' ? '' : explanation, hint: c.level === 'S' ? '具体的な範囲や位置はまだ説明していません。' : '説明できています。' })),
  } }));
  await page.goto('/glossary/normal-distribution');
  await speakExplanation(page, explanation);
  await check(page).click();
  await expect(page.getByLabel('評価 A', { exact: true })).toBeVisible();
  await expect(page.locator('.rubric-level-heading').filter({ hasText: /^S/ })).toContainText('試験範囲内の細かな条件・仕様・例外');
  await expect(page.locator('.rubric-missing')).toHaveCount(2);
  await expect(page.locator('.rubric-state').filter({ hasText: 'この説明では未確認' })).toHaveCount(0);
});

test('shows compact decision results and allows another spoken attempt', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/glossary/evaluate', route => {
    calls++;
    return route.fulfill({ json: {
      ...evaluation(), api: 'decisions', summary: '', followUp: undefined,
      grade: calls === 1 ? 'C' : 'A', status: calls === 1 ? 'review' : 'covered', covered: calls === 1 ? 1 : 3,
      criteria: term.criteria.map((c, index) => ({ ...c, level: c.level ?? 'B', status: calls === 1 && index === 0 ? 'review' : calls === 1 && index === 1 ? 'missing' : 'covered', evidence: '', hint: '' })),
    } });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/glossary/digital-signature');
  await speakExplanation(page, text); await check(page).click();
  await expect(page.getByLabel('評価 C', { exact: true })).toBeVisible();
  const gradeBox = await page.getByLabel('評価 C', { exact: true }).boundingBox();
  const headerBox = await page.locator('.site-header').boundingBox();
  expect(gradeBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height);
  expect(gradeBox!.y + gradeBox!.height).toBeLessThan(844);
  await expect(page.locator('.rubric-compact .rubric-item')).toHaveCount(term.criteria.length);
  await expect(page.getByRole('img', { name: '内容に誤り', exact: true })).toHaveCount(1);
  await expect(page.getByRole('img', { name: '未説明', exact: true })).toHaveCount(1);
  await expect(page.locator('.rubric-state, .rubric-item p, .rubric-item blockquote, .glossary-follow-up')).toHaveCount(0);
  await expect(page.locator('.rubric-missing')).toContainText(term.criteria[1].title);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: '/private/tmp/orenotameno-decisions-mobile.png', fullPage: true });
  await speakExplanation(page, '本文のハッシュ値に署名し、認証局の証明書で公開鍵が本人のものか確かめます。');
  await expect(check(page)).toBeEnabled(); await check(page).click();
  await expect(page.getByLabel('評価 A', { exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: '説明できた', exact: true })).toHaveCount(term.criteria.length);
  expect(calls).toBe(2);
  await expect.poll(async () => (await entries(page)).length).toBe(2);
  await page.getByRole('link', { name: '説明の履歴', exact: true }).click();
  await page.reload();
  await page.getByRole('link', { name: '見直す', exact: true }).first().click();
  await expect(page.locator('.rubric-compact')).toBeVisible();
});

test('shows a low-probability covered choice as pending and preserves its probabilities in history', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const result = {
    ...evaluation(), api: 'decisions', coveredProbabilityThreshold: 0.9, grade: 'C', status: 'partial', covered: 2, summary: '', followUp: undefined,
    criteria: term.criteria.map((c, index) => ({
      id: c.id, title: c.title, level: c.level ?? 'B', status: index === 0 ? 'missing' : 'covered', evidence: '', hint: '',
      decision: { choice: 'covered', confidence: 0.99, probabilities: { covered: index === 0 ? 0.8999 : 0.95, missing: index === 0 ? 0.0751 : 0.025, review: 0.025 } },
    })),
  };
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: result }));
  await page.goto('/glossary/digital-signature'); await speakExplanation(page, text); await check(page).click();
  await expect(page.getByLabel('評価 C', { exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: '判定保留', exact: true })).toHaveCount(1);
  await expect(page.getByRole('img', { name: '内容に誤り', exact: true })).toHaveCount(0);
  await expect(page.getByRole('img', { name: '説明できた', exact: true })).toHaveCount(term.criteria.length - 1);
  await expect(page.locator('.rubric-missing')).toContainText('判定保留 · 89.9% / 90%');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect.poll(async () => (await entries(page)).length).toBe(1);
  const stored = (await entries(page))[0].evaluation as typeof result;
  expect(stored.coveredProbabilityThreshold).toBe(0.9);
  expect(stored.criteria[0].decision).toEqual(result.criteria[0].decision);
  await page.getByRole('link', { name: '説明の履歴', exact: true }).click();
  await page.reload(); await page.getByRole('link', { name: '見直す', exact: true }).click();
  await expect(page.getByRole('img', { name: '判定保留', exact: true })).toHaveCount(1);
  await expect(page.locator('.rubric-missing')).toContainText('89.9% / 90%');
});

test('does not display historical follow-up suggestions or allow uncollected term practice', async ({ page }) => {
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: evaluation() }));
  await page.goto('/glossary/digital-signature'); await speakExplanation(page, text); await check(page).click();
  await expect(page.getByLabel('評価 A', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'この用語を説明する' })).toHaveCount(0);
  await expect(page.locator('.glossary-follow-up')).toHaveCount(0);
  await page.goto('/glossary/extra?name=未収録の用語');
  await expect(page.getByRole('heading', { name: '用語が見つかりません' })).toBeVisible();
  await expect(check(page)).toHaveCount(0);
});

test('skips uncollected saved words in review rounds and allows removing older words', async ({ page }) => {
  await page.goto('/glossary');
  await expect(page.getByRole('heading', { name: '用語学習' })).toBeVisible();
  await page.evaluate(async () => {
    const db = await new Promise<IDBDatabase>(resolve => { const request = indexedDB.open('orenotameno-sc'); request.onsuccess = () => resolve(request.result); });
    const tx = db.transaction('reviewWords', 'readwrite');
    for (const term of ['以前の未収録用語', 'デジタル署名']) tx.objectStore('reviewWords').put({ term });
    await new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(tx.error); });
    db.close();
  });
  await page.goto('/glossary?filter=words');
  const older = page.locator('.term-card').filter({ hasText: '以前の未収録用語' });
  await expect(older).toBeVisible();
  await expect(older.getByRole('link')).toHaveCount(0);
  await page.getByRole('link', { name: '単語を復習', exact: true }).click();
  await expect(page.locator('.review-goal')).toContainText('1語を復習します');
  await page.getByRole('link', { name: '復習を始める', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'ディジタル署名', level: 1 })).toBeVisible();
  await expect(page.locator('.review-round-count')).toHaveText('単語の復習 1 / 1');
  await page.goto('/glossary?filter=words');
  await older.getByRole('button', { name: '以前の未収録用語を復習する単語から外す' }).click();
  await expect(older).toHaveCount(0);
});

test('keeps text and allows retry after an AI failure, with no fabricated feedback', async ({ page }) => {
  let calls = 0;
  await page.route('**/api/glossary/evaluate', route => ++calls === 1
    ? route.fulfill({ status: 502, json: { error: 'AIの評価が完了しませんでした。（確認番号: deadbeef）', code: 'AI_INCOMPLETE', reference: 'deadbeef' } })
    : route.fulfill({ json: evaluation() }));
  await page.goto('/glossary/digital-signature'); await speakExplanation(page, text); await check(page).click();
  await expect(page.getByRole('alert').filter({ hasText: '確認番号: deadbeef' }).first()).toBeVisible();
  await expect(textbox(page)).toHaveValue(text); await expect(check(page)).toBeEnabled();
  expect(await entries(page)).toEqual([]);
  await expect(page.getByRole('region', { name: '説明のチェック結果' })).toHaveCount(0);
  expect(calls).toBe(1);
  await check(page).click();
  await expect(page.getByRole('region', { name: '説明のチェック結果' })).toBeVisible();
  expect(calls).toBe(2);
  expect(await entries(page)).toHaveLength(1);
});

test('records whether the explanation example was consulted', async ({ page }) => {
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: evaluation() }));
  await page.goto('/glossary/digital-signature?reference=1');
  await expect(page.locator('.term-reference')).toBeVisible();
  await speakExplanation(page, text); await check(page).click();
  await expect(page.getByRole('region', { name: '説明のチェック結果' })).toBeVisible();
  await expect(page.getByRole('button', { name: '説明例を見る', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.term-reference')).toHaveCount(0);
  expect((await entries(page))[0].referenceViewed).toBe(true);
});

test('opens the example directly below its toggle outside the form and remembers consultation after closing', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: evaluation() }));
  await page.goto('/glossary/digital-signature');
  await speakExplanation(page, text);
  const toggle = page.locator('.term-reference-toggle');
  await expect(toggle).toHaveAccessibleName('説明例を見る');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.explanation-form .term-reference-toggle')).toHaveCount(0);
  await toggle.scrollIntoViewIfNeeded();
  const before = await toggle.boundingBox();
  await toggle.click();
  await expect(toggle).toHaveAccessibleName('説明例を閉じる');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#term-reference-panel .term-reference')).toBeVisible();
  const after = await toggle.boundingBox();
  const panel = await page.locator('#term-reference-panel').boundingBox();
  expect(Math.abs(after!.y - before!.y)).toBeLessThan(2);
  expect(panel!.y).toBeGreaterThanOrEqual(after!.y + after!.height);
  expect(panel!.y).toBeLessThan(844);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await toggle.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#term-reference-panel')).toHaveCount(0);
  await expect(textbox(page)).toHaveValue(text);
  await check(page).click();
  await expect(page.getByRole('region', { name: '説明のチェック結果' })).toBeVisible();
  await expect(page.getByRole('button', { name: '説明例を見る', exact: true })).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.term-reference')).toHaveCount(0);
  expect((await entries(page))[0].referenceViewed).toBe(true);
});

test('blocks focus while empty and allows direct corrections after speech, including full replacement', async ({ page }) => {
  const corrected = '秘密鍵で署名を作り、公開鍵で検証して、改ざんを検知する仕組みです。';
  await page.route('**/api/glossary/evaluate', route => {
    expect(route.request().postDataJSON()).toEqual({ termId: term.id, text: corrected });
    return route.fulfill({ json: evaluation(corrected) });
  });
  await page.goto('/glossary/digital-signature');
  await expect(textbox(page)).toBeDisabled();
  await textbox(page).focus();
  await expect(textbox(page)).not.toBeFocused();
  await page.getByRole('button', { name: '押しながら話す' }).focus();
  await page.keyboard.press('Tab');
  await expect(textbox(page)).not.toBeFocused();
  await expect(textbox(page)).toHaveValue('');
  await expect(page.getByRole('button', { name: '誤認識を訂正する' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: '文字で続ける' })).toHaveCount(0);
  await expect(page.getByText('話した内容', { exact: true })).toHaveCount(0);
  await speakExplanation(page, '秘密鍵で署名を作り、公開鍵で検証します。');
  await textbox(page).click();
  await expect(textbox(page)).toBeFocused(); await expect(textbox(page)).toBeEditable();
  await textbox(page).fill('');
  await expect(textbox(page)).toBeFocused(); await expect(textbox(page)).toBeEditable();
  await textbox(page).pressSequentially(corrected);
  await page.getByRole('button', { name: '押しながら話す' }).focus();
  await expect(textbox(page)).not.toBeFocused();
  await page.reload();
  await expect(textbox(page)).toHaveValue(corrected); await expect(textbox(page)).toBeEditable();
  await textbox(page).click();
  await page.getByRole('button', { name: '押しながら話す' }).hover(); await page.mouse.down();
  await expect(textbox(page)).not.toBeEditable();
  await page.mouse.up();
  await expect(textbox(page)).toHaveValue(corrected); await expect(textbox(page)).toBeEditable();
  await check(page).click();
  await expect(page.getByRole('region', { name: '説明のチェック結果' })).toBeVisible();
  expect((await entries(page))[0]).toMatchObject({ text: corrected, usedVoice: true });
});

test('locks an emptied transcript after leaving the input and after clearing all text', async ({ page }) => {
  await page.goto('/glossary/digital-signature');
  await speakExplanation(page, text);
  await textbox(page).fill('');
  await expect(textbox(page)).toBeFocused();
  await page.getByRole('button', { name: '押しながら話す' }).focus();
  await expect(textbox(page)).toBeDisabled();
  await textbox(page).focus(); await expect(textbox(page)).not.toBeFocused();
  await speakExplanation(page, text);
  await page.getByRole('button', { name: '全文削除' }).click();
  await expect(textbox(page)).toHaveValue(''); await expect(textbox(page)).toBeDisabled();
  await expect(page.getByRole('button', { name: '押しながら話す' })).toBeFocused();
});

for (const failure of ['no-result', 'network', 'not-allowed'] as const) {
  test(`keeps empty input locked and existing text editable after speech fails with ${failure}`, async ({ page }) => {
    await page.goto('/glossary/digital-signature');
    if (failure === 'network') await speakExplanation(page, text);
    await page.getByRole('button', { name: '押しながら話す' }).hover(); await page.mouse.down();
    if (failure !== 'no-result') await page.evaluate(error => {
      const speech = (window as unknown as { testSpeech: { onerror: (event: { error: string }) => void } }).testSpeech;
      speech.onerror({ error });
    }, failure);
    await page.mouse.up();
    await expect(page.getByRole('alert')).toBeVisible();
    await expect(textbox(page)).toHaveValue(failure === 'network' ? text : '');
    await expect(page.getByRole('button', { name: '文字で続ける' })).toHaveCount(0);
    if (failure === 'network') {
      await textbox(page).click();
      await expect(textbox(page)).toBeFocused(); await expect(textbox(page)).toBeEditable();
      await textbox(page).fill(text); await expect(check(page)).toBeEnabled();
    } else {
      await expect(textbox(page)).toBeDisabled();
      await textbox(page).focus(); await expect(textbox(page)).not.toBeFocused();
    }
  });
}

test('keeps an empty input unfocusable when speech recognition is unavailable', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'SpeechRecognition', { value: undefined, configurable: true }); Object.defineProperty(window, 'webkitSpeechRecognition', { value: undefined, configurable: true }); });
  await page.goto('/glossary/digital-signature');
  await expect(page.getByRole('button', { name: '押しながら話す' })).toBeDisabled();
  await expect(textbox(page)).toBeDisabled();
  await textbox(page).focus(); await expect(textbox(page)).not.toBeFocused();
  await expect(page.getByRole('button', { name: '文字で続ける' })).toHaveCount(0);
});

test('handles final/interim voice text, prevents checks while listening, and stops the mic on navigation', async ({ page }) => {
  await page.addInitScript(() => {
    class MockSpeech {
      lang = ''; continuous = false; interimResults = false;
      onstart?: () => void; onend?: () => void;
      onresult?: (e: unknown) => void;
      constructor() { (window as unknown as { testSpeech: MockSpeech }).testSpeech = this; }
      start() { this.onstart?.(); }
      stop() { this.onend?.(); }
      abort() { (window as unknown as { speechAborted: boolean }).speechAborted = true; }
    }
    Object.defineProperty(window, 'SpeechRecognition', { value: MockSpeech, configurable: true });
  });
  await page.goto('/glossary/digital-signature'); await page.getByRole('button', { name: '押しながら話す' }).hover(); await page.mouse.down();
  await expect(textbox(page)).not.toBeEditable(); await expect(check(page)).toBeDisabled();
  await page.evaluate(() => {
    const speech = (window as unknown as { testSpeech: { onresult: (e: unknown) => void } }).testSpeech;
    speech.onresult({ results: [{ isFinal: true, 0: { transcript: '秘密鍵で署名を作ります。' }, length: 1 }, { isFinal: false, 0: { transcript: '公開鍵で' }, length: 1 }] });
  });
  await expect(textbox(page)).toHaveValue('秘密鍵で署名を作ります。');
  await expect(page.getByRole('button', { name: '全文削除' })).toBeDisabled();
  await expect(page.locator('.speech-interim')).toContainText('公開鍵で');
  // the engine ends a round on a pause; while held it restarts and keeps the earlier text without repeating it
  await page.evaluate(() => {
    const w = window as unknown as { testSpeech: { onend: () => void; onresult: (e: unknown) => void } };
    w.testSpeech.onend();
    w.testSpeech.onresult({ results: [{ isFinal: true, 0: { transcript: '署名を作ります。公開鍵で検証します。' }, length: 1 }] });
  });
  await expect(textbox(page)).toHaveValue('秘密鍵で署名を作ります。公開鍵で検証します。');
  await page.mouse.up();
  await expect(textbox(page)).toBeEditable(); await expect(check(page)).toBeEnabled();
  await page.getByRole('button', { name: '全文削除' }).click();
  await expect(textbox(page)).toHaveValue('');
  await page.getByRole('button', { name: '押しながら話す' }).hover(); await page.mouse.down();
  await page.evaluate(() => {
    const speech = (window as unknown as { testSpeech: { onresult: (e: unknown) => void } }).testSpeech;
    speech.onresult({ results: [{ isFinal: true, 0: { transcript: '新しい説明を始めます。' }, length: 1 }] });
  });
  await expect(textbox(page)).toHaveValue('新しい説明を始めます。');
  // navigate without moving focus so blur doesn't stop the mic first
  await page.evaluate(() => document.querySelector<HTMLAnchorElement>('a.back-link')!.click());
  await expect(page).toHaveURL(/\/glossary$/);
  await expect.poll(() => page.evaluate(() => (window as unknown as { speechAborted: boolean }).speechAborted)).toBe(true);
});

test('limits voice input to 1000 characters including existing text and stops recognition', async ({ page }) => {
  await page.addInitScript(() => {
    class MockSpeech {
      onstart?: () => void; onend?: () => void; onresult?: (e: unknown) => void;
      constructor() { (window as unknown as { testSpeech: MockSpeech }).testSpeech = this; }
      start() { this.onstart?.(); }
      stop() { this.onend?.(); }
      abort() {}
    }
    Object.defineProperty(window, 'SpeechRecognition', { value: MockSpeech, configurable: true });
  });
  await page.goto('/glossary/digital-signature');
  await expect(textbox(page)).toHaveAttribute('maxlength', '1000');
  await speakExplanation(page, 'あ'.repeat(990));
  await page.getByRole('button', { name: '押しながら話す' }).hover(); await page.mouse.down();
  await page.evaluate(() => {
    const speech = (window as unknown as { testSpeech: { onresult: (e: unknown) => void } }).testSpeech;
    speech.onresult({ results: [{ isFinal: false, 0: { transcript: 'い'.repeat(20) }, length: 1 }] });
  });
  await expect(page.locator('.speech-interim p')).toHaveText('い'.repeat(9));
  await page.evaluate(() => {
    const speech = (window as unknown as { testSpeech: { onresult: (e: unknown) => void } }).testSpeech;
    speech.onresult({ results: [{ isFinal: true, 0: { transcript: 'い'.repeat(20) }, length: 1 }] });
  });
  await expect(textbox(page)).toHaveValue(`${'あ'.repeat(990)}\n${'い'.repeat(9)}`);
  await expect(textbox(page)).toBeEditable();
  await expect(page.locator('.explanation-input-meta')).toContainText('1000 / 1,000');
  await page.mouse.up();
  await page.getByRole('button', { name: '押しながら話す' }).click();
  await expect(page.getByRole('alert')).toContainText('説明は1,000文字までです');
  await expect(textbox(page)).toHaveValue(`${'あ'.repeat(990)}\n${'い'.repeat(9)}`);
});

test('backs up and merges history without duplicating paid evaluations', async ({ page }) => {
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: evaluation() }));
  await page.goto('/glossary/digital-signature'); await speakExplanation(page, text); await check(page).click();
  await expect(page.getByRole('region', { name: '説明のチェック結果' })).toBeVisible();
  await page.getByRole('link', { name: '説明の履歴', exact: true }).click();
  const downloading = page.waitForEvent('download'); await page.getByRole('button', { name: '記録を書き出す' }).click();
  const path = await (await downloading).path(); expect(path).toBeTruthy();
  await page.getByLabel('用語学習のバックアップ').setInputFiles(path!);
  await expect(page.getByText('用語の学習記録を取り込みました。')).toBeVisible(); expect(await entries(page)).toHaveLength(1);
});

test('fits the glossary, explanation form, and compact C result at mobile width', async ({ page }) => {
  await page.route('**/api/glossary/evaluate', route => route.fulfill({ json: {
    ...evaluation(), grade: 'C', status: 'unconfirmed', covered: 0,
    criteria: evaluation().criteria.map(c => ({ ...c, status: 'missing', evidence: '', hint: '用語の説明例と照らし合わせてみましょう。' })),
  } }));
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/glossary');
  await expect(page.getByRole('heading', { name: '用語学習' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.goto('/glossary/digital-signature'); await expect(textbox(page)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await speakExplanation(page, text); await check(page).click();
  await expect(page.getByLabel('評価 C', { exact: true })).toBeVisible();
  await expect(page.locator('.glossary-result-heading')).toHaveText('判定C');
  await expect(page.locator('.glossary-result-heading')).not.toHaveClass(/glossary-result-covered/);
  await expect(page.locator('.rubric-missing').first()).toContainText('用語の説明例と照らし合わせてみましょう。');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
