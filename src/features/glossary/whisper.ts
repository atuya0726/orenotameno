export type WhisperModel = 'tiny' | 'base';
export type SpeechEngine = 'web-speech' | WhisperModel;
export const speechLabels: Record<SpeechEngine, string> = { 'web-speech': 'Web Speech', tiny: 'Whisper tiny', base: 'Whisper base' };
export type SpeechMeasurement = { text: string; durationMs: number; waitMs: number };
export type WhisperCommand = { model: WhisperModel } & ({ type: 'load' } | { type: 'transcribe'; audio: Float32Array });
export type WhisperRequest = { id: number } & WhisperCommand;
export type WhisperResponse = { id: number } & (
  | { type: 'progress'; file: string; loaded: number; total: number }
  | { type: 'ready'; device: 'webgpu' | 'wasm'; loadMs: number }
  | { type: 'result'; text: string; inferenceMs: number }
  | { type: 'error'; message: string }
);
