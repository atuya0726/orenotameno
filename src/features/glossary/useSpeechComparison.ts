import { useState } from 'react';
import { useSpeech } from './useSpeech';
import { useWhisper } from './useWhisper';
import type { SpeechEngine, SpeechMeasurement } from './whisper';

type Comparison = SpeechMeasurement & { engine: SpeechEngine; inferenceMs?: number };
export function useSpeechComparison(onText: (text: string) => void) {
  const [engine, setEngine] = useState<SpeechEngine>(() => {
    try { const saved = localStorage.getItem('orenotameno-speech-engine'); if (saved === 'tiny' || saved === 'base') return saved; } catch { /* storage unavailable */ }
    return 'web-speech';
  });
  const [results, setResults] = useState<Comparison[]>([]);
  function remember(result: Comparison) { setResults(previous => [result, ...previous].slice(0, 6)); }
  const web = useSpeech(onText, result => remember({ ...result, engine: 'web-speech' }));
  const whisper = useWhisper(onText, result => remember({ ...result, engine: result.model }));
  const phase = engine === 'web-speech' ? web.phase : whisper.phase;
  const active = phase !== 'idle';
  function select(value: SpeechEngine) {
    if (active) return;
    setEngine(value); try { localStorage.setItem('orenotameno-speech-engine', value); } catch { /* storage unavailable */ }
  }
  return {
    engine, select, results, phase, active, whisper,
    supported: engine === 'web-speech' ? web.supported : whisper.supported,
    error: engine === 'web-speech' ? web.error : whisper.error,
    interim: engine === 'web-speech' ? web.interim : '',
    canRecord: engine === 'web-speech' ? web.supported : whisper.supported && whisper.ready?.model === engine,
    start: (base: string) => { if (engine === 'web-speech') web.start(base); else void whisper.start(engine, base); },
    stop: () => { if (engine === 'web-speech') web.stop(); else whisper.stop(); },
  };
}
