import { useEffect, useRef, useState } from 'react';
import { EXPLANATION_MAX_LENGTH } from './model';

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
const squash = (text: string) => text.replace(/\s+/g, '');
// Drop the first `count` non-whitespace characters of text.
function dropLeading(text: string, count: number) {
  let i = 0; while (count > 0 && i < text.length) { if (!/\s/.test(text[i])) count--; i++; }
  return text.slice(i).trim();
}
// Mobile engines re-send earlier text inside later results, so merge on overlap instead of blindly concatenating.
export function mergeTranscript(acc: string, next: string) {
  const a = squash(acc); const n = squash(next);
  if (!n || a.endsWith(n)) return acc;
  if (!a || n.startsWith(a)) return next.trim();
  for (let k = Math.min(a.length, n.length) - 1; k >= 2; k--) if (a.endsWith(n.slice(0, k))) return acc + dropLeading(next, k);
  return acc + next.trim();
}
export function transcripts(results: ArrayLike<SpeechResult>) {
  let final = ''; let interim = '';
  for (let i = 0; i < results.length; i++) { const text = results[i][0]?.transcript ?? ''; if (results[i].isFinal) final = mergeTranscript(final, text); else interim = mergeTranscript(interim, text); }
  const f = squash(final); const it = squash(interim);
  if (f && it.startsWith(f)) interim = dropLeading(interim, f.length);
  else if (f && f.endsWith(it)) interim = '';
  return { final, interim };
}
type Session = { base: string; committed: string; held: boolean; quickEnds: number };
// Each recognition runs non-continuous (continuous mode duplicates text on Android/iOS) and is restarted while the button is held.
export function useSpeech(onText: (text: string) => void) {
  const [phase, setPhase] = useState<'idle' | 'starting' | 'listening' | 'stopping'>('idle');
  const [interim, setInterim] = useState(''); const [error, setError] = useState('');
  const recognition = useRef<Recognition | null>(null); const session = useRef<Session | null>(null);
  const update = useRef(onText); update.current = onText;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  function detach(active: Recognition) { active.onstart = active.onend = active.onresult = active.onerror = null; }
  function finish() {
    const active = recognition.current; if (active) detach(active);
    clearTimeout(timer.current); recognition.current = null; session.current = null; setPhase('idle'); setInterim('');
  }
  function stop() {
    const s = session.current; if (!s || !s.held) return;
    s.held = false; setPhase('stopping');
    const active = recognition.current;
    try { active?.stop(); } catch { finish(); try { active?.abort(); } catch { /* already ended */ } }
  }
  const stopRef = useRef(stop); stopRef.current = stop;
  useEffect(() => {
    const hide = () => { if (document.hidden) stopRef.current(); };
    document.addEventListener('visibilitychange', hide);
    return () => {
      document.removeEventListener('visibilitychange', hide); clearTimeout(timer.current);
      const active = recognition.current; recognition.current = null; session.current = null;
      if (active) { detach(active); try { active.abort(); } catch { /* already ended */ } }
    };
  }, []);
  function listen(s: Session, Constructor: new () => Recognition) {
    const active = new Constructor(); recognition.current = active;
    active.lang = 'ja-JP'; active.continuous = false; active.interimResults = true;
    const startedAt = Date.now(); let heard = '';
    active.onstart = () => setPhase(p => p === 'starting' ? 'listening' : p);
    active.onresult = event => {
      const result = transcripts(event.results);
      if (result.final) heard = result.final;
      const text = `${s.base}${s.base.trim() ? '\n' : ''}${mergeTranscript(s.committed, heard)}`;
      setInterim(result.interim.slice(0, Math.max(0, EXPLANATION_MAX_LENGTH - text.length)));
      if (result.final) update.current(text.slice(0, EXPLANATION_MAX_LENGTH));
      if (text.length >= EXPLANATION_MAX_LENGTH) stop();
    };
    active.onerror = event => {
      // silence while still holding just ends this round; onend restarts it
      if (event.error === 'aborted' || (event.error === 'no-speech' && s.held)) return;
      setError(speechErrorMessage(event.error)); finish(); try { active.abort(); } catch { /* already ended */ }
    };
    active.onend = () => {
      if (recognition.current !== active) return;
      detach(active); if (heard) s.committed = mergeTranscript(s.committed, heard);
      s.quickEnds = !heard && Date.now() - startedAt < 1000 ? s.quickEnds + 1 : 0;
      if (s.held && session.current === s && s.quickEnds < 3) { setInterim(''); listen(s, Constructor); }
      else { if (s.quickEnds >= 3) setError('音声認識がすぐに終了してしまいました。マイクの設定を確認してください。'); finish(); }
    };
    try { active.start(); }
    catch { finish(); setError('音声入力を開始できませんでした。文字で入力するか、ブラウザのマイク設定を確認してください。'); }
  }
  function start(base: string) {
    if (session.current) return;
    if (base.length >= EXPLANATION_MAX_LENGTH) { setError('説明は1,000文字までです。文章を短くしてから音声入力してください。'); return; }
    const Constructor = speechConstructor();
    if (!Constructor) { setError('このブラウザは音声入力に対応していません。文字で入力できます。'); return; }
    if (!window.isSecureContext) { setError('音声入力はHTTPSまたはlocalhostで開いて利用してください。文字で入力できます。'); return; }
    session.current = { base, committed: '', held: true, quickEnds: 0 };
    setError(''); setInterim(''); setPhase('starting');
    timer.current = setTimeout(stop, 120_000);
    listen(session.current, Constructor);
  }
  return { phase, interim, error, supported: Boolean(speechConstructor()), active: phase !== 'idle', start, stop };
}
