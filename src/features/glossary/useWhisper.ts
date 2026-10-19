import { useEffect, useRef, useState } from 'react';
import type { SpeechMeasurement, WhisperModel, WhisperCommand, WhisperResponse } from './whisper';
import { WhisperError } from './whisper';

type Phase = 'idle' | 'loading' | 'starting' | 'listening' | 'stopping';
type Recording = { held: boolean; base: string; stream?: MediaStream; recorder?: MediaRecorder; chunks: Blob[]; timer?: ReturnType<typeof setTimeout>; stoppedAt?: number };
type RecordingAudio = { samples: Float32Array; durationMs: number };
type Completed = SpeechMeasurement & { model: WhisperModel; inferenceMs: number };

// Decode the browser's recording format, downmix and resample to Whisper's 16 kHz input.
async function decode(blob: Blob): Promise<RecordingAudio> {
  const context = new AudioContext();
  try {
    const buffer = await context.decodeAudioData(await blob.arrayBuffer());
    const offline = new OfflineAudioContext(1, Math.max(1, Math.ceil(buffer.duration * 16000)), 16000);
    const source = offline.createBufferSource(); source.buffer = buffer; source.connect(offline.destination); source.start();
    return { samples: (await offline.startRendering()).getChannelData(0), durationMs: buffer.duration * 1000 };
  } finally { await context.close(); }
}

export function useWhisper(onText: (text: string) => void, onComplete: (result: Completed) => void) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [stage, setStage] = useState('');
  const [progress, setProgress] = useState({ loaded: 0, total: 0 });
  const [ready, setReady] = useState<{ model: WhisperModel; device: string; loadMs: number } | null>(null);
  const [hasRecording, setHasRecording] = useState(false);
  const worker = useRef<Worker | null>(null); const sequence = useRef(0);
  const pending = useRef<{ id: number; resolve: (result: WhisperResponse) => void; reject: (error: Error) => void } | null>(null);
  const recording = useRef<Recording | null>(null); const audio = useRef<RecordingAudio | null>(null);
  const alive = useRef(true); const busy = useRef(false);
  const preferCpu = useRef(false);
  const update = useRef(onText); update.current = onText;
  const complete = useRef(onComplete); complete.current = onComplete;

  function release(s: Recording) { clearTimeout(s.timer); s.stream?.getTracks().forEach(track => track.stop()); }
  function terminate(reason: string | Error = '処理を中止しました。') {
    worker.current?.terminate(); worker.current = null;
    pending.current?.reject(reason instanceof Error ? reason : new Error(reason)); pending.current = null;
  }
  function request(message: WhisperCommand): Promise<WhisperResponse> {
    if (!worker.current) {
      const active = new Worker(new URL('./whisper.worker.ts', import.meta.url), { type: 'module' }); worker.current = active;
      const files = new Map<string, { loaded: number; total: number }>();
      active.onmessage = (event: MessageEvent<WhisperResponse>) => {
        if (worker.current !== active) return;
        const result = event.data; const current = pending.current;
        if (!current || result.id !== current.id) return;
        if (result.type === 'status') { setStage(result.stage); }
        else if (result.type === 'progress') {
          files.set(result.file, result); const values = [...files.values()];
          setProgress({ loaded: values.reduce((sum, file) => sum + file.loaded, 0), total: values.reduce((sum, file) => sum + file.total, 0) });
        } else {
          pending.current = null; files.clear();
          if (result.type === 'error') current.reject(new WhisperError(result.message, result.details, result.retryWithWasm)); else current.resolve(result);
        }
      };
      active.onerror = event => {
        if (worker.current !== active) return;
        terminate(new WhisperError('Whisperの実行ファイルを読み込めませんでした。ページを再読み込みして、もう一度お試しください。', `実行ファイルの読み込み\n${event.message || 'ブラウザが実行を停止しました。'}`));
        if (alive.current) setReady(null);
      };
    }
    const id = ++sequence.current;
    return new Promise((resolve, reject) => { pending.current = { id, resolve, reject }; worker.current!.postMessage({ ...message, id }); });
  }
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false; const s = recording.current; recording.current = null;
      if (s) { if (s.recorder?.state === 'recording') s.recorder.stop(); release(s); }
      terminate(); audio.current = null;
    };
  }, []);
  function showError(error: unknown) {
    if (!alive.current) return;
    setError(error instanceof Error ? error.message : 'Whisperを実行できませんでした。');
    setErrorDetails(error instanceof WhisperError ? error.details : '');
  }
  async function prepare(model: WhisperModel, cpu = false) {
    if (busy.current) return;
    if (cpu) preferCpu.current = true;
    busy.current = true; setPhase('loading'); setError(''); setErrorDetails(''); setStage('ライブラリを読み込み中'); setReady(null); setProgress({ loaded: 0, total: 0 });
    // Initialization failures are cached inside ONNX. Each preparation starts a
    // fresh Worker so retrying does not inherit a failed GPU/WASM runtime.
    terminate();
    const started = performance.now();
    try {
      let result: WhisperResponse;
      try { result = await request({ type: 'load', model, device: cpu || preferCpu.current ? 'wasm' : 'auto' }); }
      catch (error) {
        if (!alive.current || !(error instanceof WhisperError) || !error.retryWithWasm || cpu || preferCpu.current) throw error;
        terminate(); preferCpu.current = true; setStage('GPUを利用できないためCPUで準備中');
        result = await request({ type: 'load', model, device: 'wasm' });
      }
      if (alive.current && result.type === 'ready') setReady({ model, device: result.device, loadMs: performance.now() - started });
    } catch (e) { showError(e); terminate(); }
    finally { if (alive.current) { busy.current = false; setPhase('idle'); } }
  }
  async function transcribe(model: WhisperModel, input: RecordingAudio, base?: string, started = performance.now()) {
    const result = await request({ type: 'transcribe', model, audio: input.samples });
    if (!alive.current || result.type !== 'result') return;
    if (!result.text) { setError('音声を認識できませんでした。もう一度話してください。'); return; }
    const measurement = { model, text: result.text, durationMs: input.durationMs, waitMs: performance.now() - started, inferenceMs: result.inferenceMs };
    complete.current(measurement);
    if (base !== undefined) update.current(`${base}${base.trim() ? '\n' : ''}${result.text}`.slice(0, 5000));
  }
  async function finish(s: Recording, model: WhisperModel) {
    if (recording.current !== s) return;
    const started = s.stoppedAt ?? performance.now(); release(s); setPhase('stopping');
    try {
      const input = await decode(new Blob(s.chunks, { type: s.recorder?.mimeType }));
      if (!alive.current || recording.current !== s) return;
      if (input.durationMs < 300) throw new Error('録音が短すぎます。もう少し長く話してください。');
      audio.current = input; setHasRecording(true);
      await transcribe(model, input, s.base, started);
    } catch (e) { showError(e); }
    finally { if (alive.current) { recording.current = null; busy.current = false; setPhase('idle'); } }
  }
  function stop() {
    const s = recording.current; if (!s || !s.held) return;
    s.held = false; s.stoppedAt = performance.now(); clearTimeout(s.timer);
    if (s.recorder?.state === 'recording') { setPhase('stopping'); s.recorder.stop(); release(s); }
    // Permission is still pending: the start continuation releases any newly granted stream.
    else { recording.current = null; busy.current = false; setPhase('idle'); }
  }
  const stopRef = useRef(stop); stopRef.current = stop;
  useEffect(() => {
    const hide = () => { if (document.hidden) stopRef.current(); };
    document.addEventListener('visibilitychange', hide); return () => document.removeEventListener('visibilitychange', hide);
  }, []);
  async function start(model: WhisperModel, base: string) {
    if (busy.current || ready?.model !== model) return;
    const s: Recording = { held: true, base, chunks: [] }; recording.current = s; busy.current = true;
    setPhase('starting'); setError(''); setErrorDetails('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } });
      s.stream = stream;
      if (!alive.current || recording.current !== s || !s.held) { release(s); return; }
      const recorder = new MediaRecorder(stream); s.recorder = recorder;
      recorder.ondataavailable = event => { if (event.data.size) s.chunks.push(event.data); };
      recorder.onstop = () => { void finish(s, model); };
      recorder.onerror = () => {
        if (recording.current !== s) return;
        recording.current = null; release(s); busy.current = false; setPhase('idle'); setError('録音できませんでした。マイクを確認してください。');
      };
      recorder.start(250); setPhase('listening'); s.timer = setTimeout(stopRef.current, 120_000);
    } catch (e) {
      release(s);
      if (!alive.current || recording.current !== s) return;
      recording.current = null; busy.current = false; setPhase('idle');
      setError(e instanceof DOMException && e.name === 'NotAllowedError' ? 'マイクの使用が許可されていません。ブラウザの設定を確認してください。' : '録音を開始できませんでした。マイクやブラウザの対応状況を確認してください。');
    }
  }
  async function retry(model: WhisperModel) {
    if (busy.current || ready?.model !== model || !audio.current) return;
    busy.current = true; setPhase('stopping'); setError(''); setErrorDetails('');
    try { await transcribe(model, audio.current); }
    catch (e) { showError(e); }
    finally { if (alive.current) { busy.current = false; setPhase('idle'); } }
  }
  return { phase, error, errorDetails, stage, progress, ready, hasRecording, start, stop, prepare, retry,
    supported: typeof window !== 'undefined' && window.isSecureContext && Boolean(navigator.mediaDevices?.getUserMedia) && typeof MediaRecorder !== 'undefined' && typeof AudioContext !== 'undefined' && typeof OfflineAudioContext !== 'undefined' };
}
