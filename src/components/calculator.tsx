import { useEffect, useRef, useState } from 'react';
import { Calculator as CalculatorIcon, Delete, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CalcError, evaluate, formatResult } from '@/lib/calculator';

type Entry = { expression: string; result: string };
type Saved = { entries: Entry[]; input: string };
const storageKey = (questionId: string) => `orenotameno-calculator:${questionId}`;
// Per-question scratch work lasts for this tab; every access is guarded.
function load(questionId: string): Saved {
  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey(questionId)) ?? 'null') as Saved | null;
    if (saved && Array.isArray(saved.entries) && typeof saved.input === 'string') return saved;
  } catch { /* unreadable or blocked storage */ }
  return { entries: [], input: '' };
}
function save(questionId: string, value: Saved) {
  try {
    if (!value.entries.length && !value.input) sessionStorage.removeItem(storageKey(questionId));
    else sessionStorage.setItem(storageKey(questionId), JSON.stringify(value));
  } catch { /* storage full or blocked */ }
}
const KEYS: { label: string; insert?: string; action?: 'clear' | 'back' | 'ans' | 'equals'; aria?: string; wide?: boolean; kind?: 'op' | 'fn' | 'eq' }[] = [
  { label: 'C', action: 'clear', aria: '入力を消す', kind: 'fn' }, { label: '(', insert: '(', kind: 'fn' }, { label: ')', insert: ')', kind: 'fn' }, { label: '⌫', action: 'back', aria: '1文字消す', kind: 'fn' },
  { label: '7', insert: '7' }, { label: '8', insert: '8' }, { label: '9', insert: '9' }, { label: '÷', insert: '÷', kind: 'op' },
  { label: '4', insert: '4' }, { label: '5', insert: '5' }, { label: '6', insert: '6' }, { label: '×', insert: '×', kind: 'op' },
  { label: '1', insert: '1' }, { label: '2', insert: '2' }, { label: '3', insert: '3' }, { label: '−', insert: '−', kind: 'op' },
  { label: '0', insert: '0' }, { label: '.', insert: '.' }, { label: '%', insert: '%', kind: 'op' }, { label: '+', insert: '+', kind: 'op' },
  { label: '^', insert: '^', aria: 'べき乗', kind: 'op' }, { label: 'Ans', action: 'ans', aria: '直前の答えを入れる', kind: 'fn' }, { label: '=', action: 'equals', aria: '計算する', wide: true, kind: 'eq' },
];
const CONTINUES = /^[+\-−×÷*/^%]/;

export function CalculatorToggle({ questionId }: { questionId: string }) {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" className={cn('bookmark-button', open && 'bookmarked')} aria-label={open ? '計算機を閉じる' : '計算機を開く'} aria-expanded={open} aria-controls="calculator-panel" onClick={() => setOpen(o => !o)}><CalculatorIcon size={19} /></button>
    {open && <CalculatorPanel questionId={questionId} onClose={() => setOpen(false)} />}
  </>;
}

function CalculatorPanel({ questionId, onClose }: { questionId: string; onClose: () => void }) {
  const [state, setState] = useState(() => load(questionId));
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null); const historyRef = useRef<HTMLOListElement>(null); const panelRef = useRef<HTMLElement>(null);
  const { entries, input } = state;
  const last = entries.at(-1)?.result;
  useEffect(() => { save(questionId, state); }, [questionId, state]);
  useEffect(() => { inputRef.current?.focus({ preventScroll: true }); }, []);
  // On phones the panel is a bottom sheet; reserve its height so the question can still be scrolled above it.
  useEffect(() => {
    const panel = panelRef.current; if (!panel) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => root.style.setProperty('--calculator-space', `${panel.offsetHeight}px`));
    observer.observe(panel);
    return () => { observer.disconnect(); root.style.removeProperty('--calculator-space'); };
  }, []);
  useEffect(() => { historyRef.current?.scrollTo({ top: historyRef.current.scrollHeight }); }, [entries.length]);
  let preview = '';
  try { if (input.trim() && !/[+\-−×÷*/^(]\s*$/.test(input)) preview = formatResult(evaluate(input)); } catch { /* incomplete while typing */ }

  function setInput(next: string, caret?: number) {
    setError(''); setState(s => ({ ...s, input: next }));
    if (caret !== undefined) requestAnimationFrame(() => { inputRef.current?.setSelectionRange(caret, caret); });
  }
  function insert(text: string) {
    const el = inputRef.current;
    // Starting with an operator continues from the previous answer, like a paper-tape calculator.
    if (!input && last && CONTINUES.test(text)) { setInput(last + text, last.length + text.length); return; }
    const start = el?.selectionStart ?? input.length; const end = el?.selectionEnd ?? input.length;
    setInput(input.slice(0, start) + text + input.slice(end), start + text.length);
  }
  function back() {
    const el = inputRef.current; const start = el?.selectionStart ?? input.length; const end = el?.selectionEnd ?? input.length;
    if (start !== end) setInput(input.slice(0, start) + input.slice(end), start);
    else if (start > 0) setInput(input.slice(0, start - 1) + input.slice(start), start - 1);
  }
  function equals() {
    if (!input.trim()) return;
    try {
      const result = formatResult(evaluate(input));
      setError(''); setState(s => ({ entries: [...s.entries, { expression: s.input.trim(), result }], input: '' }));
    } catch (e) { setError(e instanceof CalcError ? e.message : '計算できませんでした'); }
  }
  function press(key: typeof KEYS[number]) {
    if (key.insert) insert(key.insert);
    else if (key.action === 'clear') setInput('', 0);
    else if (key.action === 'back') back();
    else if (key.action === 'ans' && last) insert(last);
    else if (key.action === 'equals') equals();
    inputRef.current?.focus({ preventScroll: true });
  }
  return <section ref={panelRef} id="calculator-panel" className="calculator-panel" aria-label="計算機" onKeyDown={e => { if (e.key === 'Escape') onClose(); }}>
    <div className="calculator-header"><h2><CalculatorIcon size={16} />計算機</h2><button type="button" className="calculator-icon-button" disabled={!entries.length} onClick={() => { setState(s => ({ ...s, entries: [] })); setError(''); }} aria-label="計算の履歴をすべて消す"><Trash2 size={16} /></button><button type="button" className="calculator-icon-button" onClick={onClose} aria-label="計算機を閉じる"><X size={18} /></button></div>
    <ol ref={historyRef} className="calculator-history" aria-label="計算の履歴">
      {entries.length ? entries.map((entry, i) => <li key={i}><button type="button" onClick={() => insert(entry.result)} aria-label={`${entry.expression} = ${entry.result}。答えを入力に使う`}><span>{entry.expression}</span><strong>= {entry.result}</strong></button></li>)
        : <li className="calculator-empty">計算した式と答えがここに残ります。タップすると答えを入力に使えます。</li>}
    </ol>
    <div className="calculator-input">
      <input ref={inputRef} value={input} inputMode="none" autoComplete="off" spellCheck={false} aria-label="計算式" placeholder={last ? `${last} に続けて演算子を押す` : '式を入力'}
        onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' || e.key === '=') { e.preventDefault(); equals(); } }} />
      <output aria-live="polite">{error ? <span className="calculator-error">{error}</span> : preview && `= ${preview}`}</output>
    </div>
    <div className="calculator-keys">{KEYS.map(key => <button type="button" key={key.label} className={cn(key.kind && `calc-${key.kind}`, key.wide && 'calc-wide')} aria-label={key.aria} disabled={key.action === 'ans' && !last} onClick={() => press(key)}>{key.action === 'back' ? <Delete size={18} /> : key.label}</button>)}</div>
  </section>;
}
