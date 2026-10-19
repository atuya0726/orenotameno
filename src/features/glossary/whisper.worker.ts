import { env, pipeline, type AutomaticSpeechRecognitionPipeline } from '@huggingface/transformers';
import type { WhisperRequest, WhisperResponse, WhisperModel } from './whisper';

env.allowLocalModels = false;
env.useBrowserCache = true;
// Single-threaded WASM also works without cross-origin isolation headers.
env.backends.onnx.wasm!.numThreads = 1;
let transcriber: AutomaticSpeechRecognitionPipeline | undefined;
let loadedModel: WhisperModel | undefined;
let device: 'webgpu' | 'wasm' = 'wasm';
const send = (message: WhisperResponse) => self.postMessage(message);

async function load(request: WhisperRequest) {
  if (transcriber && loadedModel === request.model) return;
  await transcriber?.dispose(); transcriber = undefined; loadedModel = undefined;
  const options = {
    dtype: 'q8' as const,
    progress_callback: (event: { status: string; file?: string; loaded?: number; total?: number }) => {
      if (event.status === 'progress') send({ id: request.id, type: 'progress', file: event.file ?? '', loaded: event.loaded ?? 0, total: event.total ?? 0 });
    },
  };
  // Keep identical 8-bit weights on both backends so model size and precision stay comparable.
  // The API may exist even when no adapter is available. Probe first: a failed
  // ONNX GPU initialization can otherwise poison the backend's cached promise.
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown | null> } }).gpu;
  const adapter = await gpu?.requestAdapter().catch(() => null);
  if (adapter) {
    try {
      transcriber = await pipeline<'automatic-speech-recognition'>('automatic-speech-recognition', `onnx-community/whisper-${request.model}`, { ...options, device: 'webgpu' });
      device = 'webgpu';
    } catch { /* Unsupported GPU/operators: reuse cached weights with WASM. */ }
  }
  if (!transcriber) {
    transcriber = await pipeline<'automatic-speech-recognition'>('automatic-speech-recognition', `onnx-community/whisper-${request.model}`, { ...options, device: 'wasm' });
    device = 'wasm';
  }
  loadedModel = request.model;
}

let busy = false;
self.addEventListener('message', async (event: MessageEvent<WhisperRequest>) => {
  const request = event.data;
  if (busy) { send({ id: request.id, type: 'error', message: '前の文字起こしが終わってから、もう一度お試しください。' }); return; }
  busy = true;
  try {
    const started = performance.now(); await load(request);
    if (request.type === 'load') send({ id: request.id, type: 'ready', device, loadMs: performance.now() - started });
    else {
      const startedInference = performance.now();
      const output = await transcriber!(request.audio, { language: 'japanese', task: 'transcribe', chunk_length_s: 30, stride_length_s: 5 });
      const result = Array.isArray(output) ? output[0] : output;
      send({ id: request.id, type: 'result', text: result.text.trim(), inferenceMs: performance.now() - startedInference });
    }
  } catch (error) {
    console.error('Whisper processing failed', error);
    send({ id: request.id, type: 'error', message: request.type === 'load' ? 'Whisperを準備できませんでした。通信やブラウザの空きメモリを確認し、もう一度準備してください。' : '文字起こしに失敗しました。録音を残しているので、もう一度お試しください。' });
  } finally { busy = false; }
});
