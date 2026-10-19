import { env, pipeline, type AutomaticSpeechRecognitionPipeline } from '@huggingface/transformers';
import cpuWasmUrl from 'onnxruntime-web/ort-wasm-simd-threaded.wasm?url';
import cpuFactoryUrl from 'onnxruntime-web/ort-wasm-simd-threaded.mjs?url';
import type { WhisperRequest, WhisperResponse, WhisperModel } from './whisper';

env.allowLocalModels = false;
env.useBrowserCache = true;
// Download through this site's Worker to avoid cross-origin Hub fetch failures.
// This endpoint streams only allowlisted public tiny/base model files.
env.remoteHost = self.location.origin;
env.remotePathTemplate = '/api/speech-models/{model}/resolve/{revision}/';
// Single-threaded WASM also works without cross-origin isolation headers.
env.backends.onnx.wasm!.numThreads = 1;
let transcriber: AutomaticSpeechRecognitionPipeline | undefined;
let loadedModel: WhisperModel | undefined;
let device: 'webgpu' | 'wasm' = 'wasm';
const send = (message: WhisperResponse) => self.postMessage(message);
let stage = '';
let retryWithWasm = false;
function status(request: WhisperRequest, value: string) { stage = value; send({ id: request.id, type: 'status', stage }); }

async function load(request: WhisperRequest) {
  if (transcriber && loadedModel === request.model) return;
  await transcriber?.dispose(); transcriber = undefined; loadedModel = undefined;
  const options = {
    dtype: 'q8' as const,
    progress_callback: (event: { status: string; file?: string; loaded?: number; total?: number }) => {
      if (event.status === 'initiate' || event.status === 'download') status(request, 'モデルを取得中');
      if (event.status === 'progress') send({ id: request.id, type: 'progress', file: event.file ?? '', loaded: event.loaded ?? 0, total: event.total ?? 0 });
      if (event.status === 'done') status(request, 'モデルを初期化中');
    },
  };
  // Keep identical 8-bit weights on both backends so model size and precision stay comparable.
  // The API may exist even when no adapter is available. Probe first: a failed
  // ONNX GPU initialization can otherwise poison the backend's cached promise.
  status(request, '実行環境を確認中');
  const forceCpu = request.type === 'load' && request.device === 'wasm';
  const mobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
  const gpu = (navigator as Navigator & { gpu?: { requestAdapter: () => Promise<unknown | null> } }).gpu;
  let adapter: unknown = null;
  if (!forceCpu && !mobile) { try { adapter = await gpu?.requestAdapter(); } catch { /* Probe failures use CPU without initializing GPU. */ } }
  if (adapter) {
    device = 'webgpu'; retryWithWasm = true;
    transcriber = await pipeline<'automatic-speech-recognition'>('automatic-speech-recognition', `onnx-community/whisper-${request.model}`, { ...options, device });
    retryWithWasm = false;
  }
  if (!transcriber) {
    device = 'wasm';
    // CPU uses the smaller CPU runtime from this site's assets. It neither loads
    // the GPU runtime nor depends on a cross-origin dynamic import from a CDN.
    env.backends.onnx.wasm!.wasmPaths = { wasm: cpuWasmUrl, mjs: cpuFactoryUrl };
    transcriber = await pipeline<'automatic-speech-recognition'>('automatic-speech-recognition', `onnx-community/whisper-${request.model}`, { ...options, device });
  }
  loadedModel = request.model;
}

let busy = false;
self.addEventListener('message', async (event: MessageEvent<WhisperRequest>) => {
  const request = event.data;
  if (busy) { send({ id: request.id, type: 'error', message: '前の文字起こしが終わってから、もう一度お試しください。' }); return; }
  busy = true;
  retryWithWasm = false;
  try {
    const started = performance.now(); await load(request);
    if (request.type === 'load') send({ id: request.id, type: 'ready', device, loadMs: performance.now() - started });
    else {
      status(request, '音声を認識中');
      const startedInference = performance.now();
      const output = await transcriber!(request.audio, { language: 'japanese', task: 'transcribe', chunk_length_s: 30, stride_length_s: 5 });
      const result = Array.isArray(output) ? output[0] : output;
      send({ id: request.id, type: 'result', text: result.text.trim(), inferenceMs: performance.now() - startedInference });
    }
  } catch (error) {
    console.error('Whisper processing failed', error);
    const reason = (error instanceof Error ? `${error.name}: ${error.message}` : String(error)).replace(/https?:\/\/[^\s)]+/g, value => value.split('?')[0]).slice(0, 1200);
    send({ id: request.id, type: 'error', retryWithWasm, details: `${request.model} / ${device} / ${stage}\n${reason}`, message: request.type === 'load' ? `Whisperの準備中に「${stage}」で失敗しました。CPUで準備し直すか、エラーの詳細を確認してください。` : '文字起こしに失敗しました。録音を残しているので、もう一度お試しください。' });
  } finally { busy = false; }
});
