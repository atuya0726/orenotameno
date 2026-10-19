import { Button } from '@/components/ui/button';
import { speechLabels, type SpeechEngine } from './whisper';
import type { useSpeechComparison } from './useSpeechComparison';

type Speech = ReturnType<typeof useSpeechComparison>;
const seconds = (ms: number) => `${(ms / 1000).toFixed(1)}秒`;
export function SpeechEngineSelector({ speech, disabled }: { speech: Speech; disabled: boolean }) {
  const model = speech.engine === 'web-speech' ? null : speech.engine;
  const ready = model && speech.whisper.ready?.model === model;
  const { loaded, total } = speech.whisper.progress;
  return <div className="speech-engine-panel">
    <label className="speech-engine-select">音声認識<select value={speech.engine} disabled={disabled || speech.active} onChange={event => speech.select(event.target.value as SpeechEngine)}>
      <option value="web-speech">Web Speech（ブラウザ標準）</option><option value="tiny">Whisper tiny（軽量）</option><option value="base">Whisper base（精度優先）</option>
    </select></label>
    {model && <>
      <p className="speech-engine-help">初回にモデル本体を約{model === 'tiny' ? '41' : '77'}MBダウンロードします。音声はこの端末内で処理し、モデルはブラウザにキャッシュします。</p>
      {!ready && <Button type="button" variant="outline" size="sm" disabled={disabled || speech.active || !speech.supported} onClick={() => void speech.whisper.prepare(model)}>{speech.phase === 'loading' ? '準備中…' : `${speechLabels[model]}を準備する`}</Button>}
      {speech.phase === 'loading' && <div className="speech-load" role="status"><span>{loaded ? `${(loaded / 1_000_000).toFixed(1)}MB取得済み` : 'ライブラリを読み込み中…'} · 取得後にモデルを初期化します</span><progress aria-label="Whisperのダウンロード" value={total ? loaded : undefined} max={total || undefined} /></div>}
      {ready && <p className="speech-engine-help" role="status">準備完了 · {speech.whisper.ready!.device === 'webgpu' ? 'WebGPU' : 'WASM（CPU）'} · 準備 {seconds(speech.whisper.ready!.loadMs)}</p>}
      {speech.whisper.hasRecording && <Button type="button" variant="ghost" size="sm" disabled={disabled || speech.active || !ready} onClick={() => void speech.whisper.retry(model)}>直前の録音を{speechLabels[model]}で比較</Button>}
    </>}
    {!speech.supported && model && <p className="speech-engine-help">このブラウザでは録音できません。HTTPSで開くか、別のブラウザを利用してください。</p>}
  </div>;
}
export function SpeechComparisonResults({ speech, disabled, onUse }: { speech: Speech; disabled: boolean; onUse: (text: string) => void }) {
  if (!speech.results.length) return null;
  return <details className="speech-comparison" open><summary>音声認識の比較（直近{speech.results.length}件）</summary>
    <p className="speech-engine-help">停止から確定までの待ち時間を表示します。Web Speechは発話中も認識します。Whisper同士は「直前の録音」で同じ音声を比較できます。比較結果と録音はこの画面を離れると消えます。</p>
    {speech.results.map((result, index) => <article key={index}>
      <div className="speech-comparison-meta"><strong>{speechLabels[result.engine]}</strong><span>発話 {seconds(result.durationMs)} · 確定待ち {seconds(result.waitMs)}{result.inferenceMs !== undefined && ` · 推論 ${seconds(result.inferenceMs)}`}</span></div>
      <p>{result.text}</p><Button type="button" variant="ghost" size="sm" disabled={disabled || speech.active} onClick={() => onUse(result.text)}>この結果を説明欄に入れる</Button>
    </article>)}
  </details>;
}
