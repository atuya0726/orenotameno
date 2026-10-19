import { expect, test, type Page } from '@playwright/test';

async function mockWhisper(page: Page) {
  await page.addInitScript(() => {
    const w = window as unknown as { speechTest: { requests: { type: string; model: string; audio?: Float32Array; device?: string }[]; stopped: number; terminated: number; fail: boolean; loadFailure: 'none' | 'gpu' | 'all'; delayPermission: boolean; grant?: () => void } };
    w.speechTest = { requests: [], stopped: 0, terminated: 0, fail: false, loadFailure: 'none', delayPermission: false };
    const stream = { getTracks: () => [{ stop: () => w.speechTest.stopped++ }] };
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: () => w.speechTest.delayPermission ? new Promise(resolve => { w.speechTest.grant = () => resolve(stream); }) : Promise.resolve(stream) });
    // A real decodable 0.5-second WAV exercises downmix/resampling, without a physical microphone.
    const bytes = new ArrayBuffer(44 + 16000); const view = new DataView(bytes);
    const str = (offset: number, text: string) => [...text].forEach((char, i) => view.setUint8(offset + i, char.charCodeAt(0)));
    str(0, 'RIFF'); view.setUint32(4, 16036, true); str(8, 'WAVE'); str(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, 16000, true); view.setUint32(28, 32000, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); str(36, 'data'); view.setUint32(40, 16000, true);
    class MockRecorder {
      state = 'inactive'; mimeType = 'audio/wav'; ondataavailable?: (e: { data: Blob }) => void; onstop?: () => void;
      start() { this.state = 'recording'; }
      stop() { this.state = 'inactive'; setTimeout(() => { this.ondataavailable?.({ data: new Blob([bytes], { type: 'audio/wav' }) }); this.onstop?.(); }, 5); }
    }
    Object.defineProperty(window, 'MediaRecorder', { value: MockRecorder });
    const NativeWorker = window.Worker;
    class MockWorker {
      onmessage?: (e: { data: unknown }) => void;
      poisoned = false;
      postMessage(request: { id: number; type: string; model: string; device?: string; audio?: Float32Array }) {
        w.speechTest.requests.push(request);
        if (request.type === 'load') {
          if (this.poisoned || w.speechTest.loadFailure === 'all' || (w.speechTest.loadFailure === 'gpu' && request.device !== 'wasm')) {
            this.poisoned = true;
            setTimeout(() => this.onmessage?.({ data: { id: request.id, type: 'error', message: 'Whisperの準備中に失敗しました。', details: `${request.model} / ${request.device}\nModel fetch failed: HTTP 403`, retryWithWasm: request.device !== 'wasm' } }), 5);
            return;
          }
          this.onmessage?.({ data: { id: request.id, type: 'progress', file: 'encoder.onnx', loaded: 20_000_000, total: 40_000_000 } });
          setTimeout(() => this.onmessage?.({ data: { id: request.id, type: 'ready', device: 'wasm', loadMs: 12 } }), 30);
        } else setTimeout(() => this.onmessage?.({ data: w.speechTest.fail ? { id: request.id, type: 'error', message: '文字起こしに失敗しました。録音を残しているので、もう一度お試しください。' } : { id: request.id, type: 'result', text: request.model === 'tiny' ? '秘密鍵で署名を作ります。' : '秘密鍵で署名を作り、公開鍵で検証します。', inferenceMs: 15 } }), 30);
      }
      terminate() { w.speechTest.terminated++; }
    }
    window.Worker = new Proxy(NativeWorker, { construct(target, args) { return String(args[0]).includes('whisper.worker') ? new MockWorker() : Reflect.construct(target, args); } });
  });
}
const textbox = (page: Page) => page.getByRole('textbox', { name: 'ディジタル署名についての説明' });
const selector = (page: Page) => page.getByRole('combobox', { name: '音声認識' });
async function prepare(page: Page, model: string) {
  await selector(page).selectOption(model);
  await page.getByRole('button', { name: `Whisper ${model}を準備する`, exact: true }).click();
  await expect(page.getByText(/準備完了 · WASM/)).toBeVisible();
}
async function record(page: Page) {
  await page.getByRole('button', { name: '押しながら話す' }).hover(); await page.mouse.down();
  await expect(page.getByRole('button', { name: '離すと停止' })).toBeVisible();
  await page.mouse.up();
}

test('loads models on demand and compares tiny/base using the same recording without overwriting the draft', async ({ page }) => {
  await mockWhisper(page); await page.goto('/glossary/digital-signature');
  await expect(selector(page)).toHaveValue('web-speech');
  await selector(page).selectOption('tiny');
  expect(await page.evaluate(() => (window as any).speechTest.requests)).toEqual([]);
  await expect(page.getByRole('button', { name: '押しながら話す' })).toBeDisabled();
  await prepare(page, 'tiny'); await textbox(page).fill('元の説明。'); await record(page);
  await expect(textbox(page)).toHaveValue('元の説明。\n秘密鍵で署名を作ります。');
  await expect(page.locator('.speech-comparison article')).toHaveCount(1);
  await expect(page.locator('.speech-comparison')).toContainText('推論');
  await prepare(page, 'base');
  await page.getByRole('button', { name: '直前の録音をWhisper baseで比較' }).click();
  await expect(page.locator('.speech-comparison article')).toHaveCount(2);
  await expect(textbox(page)).toHaveValue('元の説明。\n秘密鍵で署名を作ります。');
  const recordings = await page.evaluate(() => (window as any).speechTest.requests.filter((r: any) => r.type === 'transcribe').map((r: any) => Array.from(r.audio)));
  expect(recordings[0]).toEqual(recordings[1]); expect(recordings[0]).toHaveLength(8000);
  expect(await page.evaluate(() => (window as any).speechTest.stopped)).toBeGreaterThan(0);
  await page.locator('.speech-comparison article').first().getByRole('button', { name: 'この結果を説明欄に入れる' }).click();
  await expect(textbox(page)).toHaveValue('秘密鍵で署名を作り、公開鍵で検証します。');
  await page.reload(); await expect(selector(page)).toHaveValue('base');
  await expect(page.locator('.speech-comparison')).toHaveCount(0);
  expect(await page.evaluate(() => (window as any).speechTest.requests)).toEqual([]);
});

test('retains the draft and recording after inference failure and can retry', async ({ page }) => {
  await mockWhisper(page); await page.goto('/glossary/digital-signature'); await prepare(page, 'tiny');
  await textbox(page).fill('消さない説明文。'); await page.evaluate(() => { (window as any).speechTest.fail = true; });
  await record(page); await expect(page.getByRole('alert')).toContainText('文字起こしに失敗');
  await expect(textbox(page)).toHaveValue('消さない説明文。'); await expect(textbox(page)).toBeEditable();
  await page.evaluate(() => { (window as any).speechTest.fail = false; });
  await page.getByRole('button', { name: '直前の録音をWhisper tinyで比較' }).click();
  await expect(page.locator('.speech-comparison article')).toHaveCount(1);
  await expect(textbox(page)).toHaveValue('消さない説明文。');
});

test('releases late microphone permission and cleans up on navigation', async ({ page }) => {
  await mockWhisper(page); await page.goto('/glossary/digital-signature'); await prepare(page, 'tiny');
  await page.evaluate(() => { (window as any).speechTest.delayPermission = true; });
  await page.getByRole('button', { name: '押しながら話す' }).hover(); await page.mouse.down();
  await expect(page.getByRole('button', { name: 'マイクの準備中…' })).toBeVisible(); await page.mouse.up();
  await page.evaluate(() => { (window as any).speechTest.grant(); });
  await expect.poll(() => page.evaluate(() => (window as any).speechTest.stopped)).toBeGreaterThan(0);
  await expect(textbox(page)).toBeEditable();
  await page.evaluate(() => { (window as any).speechTest.delayPermission = false; });
  await page.getByRole('button', { name: '押しながら話す' }).hover(); await page.mouse.down();
  await expect(page.getByRole('button', { name: '離すと停止' })).toBeVisible();
  await page.evaluate(() => document.querySelector<HTMLAnchorElement>('a.back-link')!.click());
  await expect(page).toHaveURL(/\/glossary$/);
  await expect.poll(() => page.evaluate(() => (window as any).speechTest.terminated)).toBe(1);
  expect(await page.evaluate(() => (window as any).speechTest.requests.filter((r: any) => r.type === 'transcribe'))).toHaveLength(0);
});

test('recreates a poisoned GPU worker before retrying preparation on CPU', async ({ page }) => {
  await mockWhisper(page); await page.goto('/glossary/digital-signature');
  await page.evaluate(() => { (window as any).speechTest.loadFailure = 'gpu'; });
  await prepare(page, 'tiny');
  expect(await page.evaluate(() => (window as any).speechTest.requests.map((request: any) => request.device))).toEqual(['auto', 'wasm']);
  expect(await page.evaluate(() => (window as any).speechTest.terminated)).toBe(1);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByRole('button', { name: '押しながら話す' })).toBeEnabled();
});

test('shows the actual load failure and supports a fresh CPU retry while keeping the draft', async ({ page }) => {
  await mockWhisper(page); await page.goto('/glossary/digital-signature');
  await textbox(page).fill('入力した説明は残す。');
  await page.evaluate(() => { (window as any).speechTest.loadFailure = 'all'; });
  await selector(page).selectOption('tiny');
  await page.getByRole('button', { name: 'Whisper tinyを準備する', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('準備中に失敗');
  await page.getByText('エラーの詳細', { exact: true }).click();
  await expect(page.locator('.speech-error-details')).toContainText('HTTP 403');
  await expect(textbox(page)).toHaveValue('入力した説明は残す。');
  await page.evaluate(() => { (window as any).speechTest.loadFailure = 'none'; });
  await page.getByRole('button', { name: 'CPUで準備し直す' }).click();
  await expect(page.getByText(/準備完了 · WASM/)).toBeVisible();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expect(page.getByText('エラーの詳細', { exact: true })).toHaveCount(0);
  await expect(textbox(page)).toHaveValue('入力した説明は残す。');
});
