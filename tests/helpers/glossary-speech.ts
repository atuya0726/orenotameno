import { expect, type Page } from '@playwright/test';
import type { Recognition } from '../../src/features/glossary/useSpeech';

export async function mockSpeechRecognition(page: Page) {
  await page.addInitScript(() => {
    class MockSpeech {
      lang = ''; continuous = false; interimResults = false;
      onstart?: () => void; onend?: () => void;
      onresult?: (event: unknown) => void; onerror?: (event: { error: string }) => void;
      constructor() { (window as unknown as { testSpeech: MockSpeech }).testSpeech = this; }
      start() { this.onstart?.(); }
      stop() { this.onend?.(); }
      abort() { (window as unknown as { speechAborted: boolean }).speechAborted = true; }
    }
    Object.defineProperty(window, 'SpeechRecognition', { value: MockSpeech, configurable: true });
  });
}

export async function speakExplanation(page: Page, text: string) {
  const transcript = page.locator('#term-explanation');
  await expect(transcript).toBeVisible();
  if (await transcript.inputValue()) await page.getByRole('button', { name: '全文削除' }).click();
  await page.getByRole('button', { name: '押しながら話す' }).hover();
  await page.mouse.down();
  await page.evaluate(value => {
    const { testSpeech } = window as unknown as { testSpeech: Recognition };
    testSpeech.onresult?.({ results: [{ isFinal: true, 0: { transcript: value }, length: 1 }] });
  }, text);
  await page.mouse.up();
  await expect(transcript).toHaveValue(text);
}
