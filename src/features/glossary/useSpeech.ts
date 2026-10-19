import { useEffect, useRef, useState } from 'react';

type SpeechResult = { isFinal: boolean; [index: number]: { transcript: string }; length: number };
type SpeechEvent = { results: ArrayLike<SpeechResult> };
export type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean;
  onstart: (() => void) | null; onend: (() => void) | null;
  onresult: ((event: SpeechEvent) => void) | null; onerror: ((event: { error: string }) => void) | null;
  start: () => void; stop: () => void; abort: () => void;
};
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
export function speechConstructor() { if (typeof window === 'undefined') return undefined; const w = window as SpeechWindow; return w.SpeechRecognition ?? w.webkitSpeechRecognition; }
export function speechErrorMessage(error: string): string {
  const messages: Record<string, string> = {
    'not-allowed': 'マイクの使用が許可されていません。ブラウザの設定を確認するか、文字で入力してください。',
    'service-not-allowed': 'このブラウザでは音声認識サービスを利用できません。文字で入力できます。',
    'audio-capture': '利用できるマイクが見つかりません。接続を確認してください。',
    network: '音声認識サービスに接続できませんでした。入力済みの文章は残っています。',
    'no-speech': '音声を認識できませんでした。もう一度話すか、文字で入力してください。',
    'language-not-supported': '日本語の音声認識を利用できません。文字で入力してください。',
  };
  return messages[error] ?? '音声認識を続けられませんでした。入力済みの文章を確認してください。';
}
export function transcripts(results: ArrayLike<SpeechResult>) {
  let final = ''; let interim = '';
  for (let i = 0; i < results.length; i++) { const text = results[i][0]?.transcript ?? ''; if (results[i].isFinal) final += text; else interim += text; }
  return { final, interim };
}
export function useSpeech(onText: (text: string) => void) {
  const [phase, setPhase] = useState<'idle' | 'starting' | 'listening' | 'stopping'>('idle');
  const [interim, setInterim] = useState(''); const [error, setError] = useState('');
  const recognition = useRef<Recognition | null>(null); const update = useRef(onText); update.current = onText;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function finish(active: Recognition) {
    if (recognition.current !== active) return;
    active.onstart = active.onend = active.onresult = active.onerror = null;
    clearTimeout(timer.current); recognition.current = null; setPhase('idle'); setInterim('');
  }
  function stop() {
    const active = recognition.current; if (!active) return;
    setPhase('stopping');
    try { active.stop(); } catch { finish(active); try { active.abort(); } catch { /* already ended */ } }
  }
  useEffect(() => {
    const hide = () => { if (document.hidden) { try { recognition.current?.stop(); } catch { /* already stopped */ } } };
    document.addEventListener('visibilitychange', hide);
    return () => {
      document.removeEventListener('visibilitychange', hide); clearTimeout(timer.current);
      const active = recognition.current; recognition.current = null;
      if (active) { active.onstart = active.onend = active.onresult = active.onerror = null; try { active.abort(); } catch { /* already ended */ } }
    };
  }, []);
  function start(base: string) {
    if (recognition.current) return;
    const Constructor = speechConstructor();
    if (!Constructor) { setError('このブラウザは音声入力に対応していません。文字で入力できます。'); return; }
    if (!window.isSecureContext) { setError('音声入力はHTTPSまたはlocalhostで開いて利用してください。文字で入力できます。'); return; }
    const active = new Constructor(); recognition.current = active;
    active.lang = 'ja-JP'; active.continuous = true; active.interimResults = true;
    setError(''); setInterim(''); setPhase('starting');
    active.onstart = () => setPhase('listening');
    active.onresult = event => {
      const result = transcripts(event.results);
      setInterim(result.interim);
      if (result.final) update.current(`${base}${base.trim() ? '\n' : ''}${result.final}`.slice(0, 5000));
    };
    active.onerror = event => { if (event.error !== 'aborted') setError(speechErrorMessage(event.error)); finish(active); try { active.abort(); } catch { /* already ended */ } };
    active.onend = () => finish(active);
    try { active.start(); timer.current = setTimeout(stop, 120_000); }
    catch { finish(active); setError('音声入力を開始できませんでした。文字で入力するか、ブラウザのマイク設定を確認してください。'); }
  }
  return { phase, interim, error, supported: Boolean(speechConstructor()), active: phase !== 'idle', start, stop };
}
