import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, Navigate, Route, Routes, useParams, useSearchParams } from 'react-router';
import { ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpFromLine, BookOpen, Check, CheckCheck, ChevronDown, ChevronRight, CircleHelp, Clock3, History, LoaderCircle, Mic, RotateCcw, Search, Square, Trash2, TriangleAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDate, dayKey } from '@/lib/date';
import { GlossaryProvider, useGlossary } from './useGlossary';
import { normalizeTermWord as normalize, termForWord, terms, termById, termCategories } from './terms';
import { EXPLANATION_MAX_LENGTH, explanationInputSchema, extraTerm, extraTermName, extraTermNameSchema, levelInfo, levels, type Evaluation, type Grade, type GlossaryAttempt, type GlossaryDraft, type Level, type Term } from './model';
import { serializeGlossary } from './db';
import { useLearning } from '@/lib/store';
import { useSpeech } from './useSpeech';

const statusLabels: Record<Evaluation['status'], string> = { covered: '要点を確認', partial: '説明を補おう', review: '要点に誤りあり', unconfirmed: '要点を確認できず' };
const gradeLabels: Record<Grade, string> = { S: '発展の論点まで説明', A: '応用の論点まで説明', B: '基本の論点を押さえた', C: '説明に不足や誤りがある' };
export default function GlossaryApp() {
  return <GlossaryProvider><GlossaryShell /></GlossaryProvider>;
}
function GlossaryShell() {
  const { ready, error, clearError } = useGlossary();
  return <div className="glossary-app">
    <div className="glossary-section-nav"><Link to="/glossary"><Mic size={16} />用語トレーニング</Link><Link to="/glossary/history"><History size={15} />説明の履歴</Link></div>
    {error && <div className="error-banner" role="alert"><span>{error}</span>{ready && <button onClick={clearError} aria-label="用語学習の通知を閉じる"><X size={16} /></button>}</div>}
    {!ready ? <div className="empty-state"><LoaderCircle className={error ? '' : 'animate-spin'} /><h2>{error ? '用語の記録を開けませんでした' : '用語の学習記録を開いています'}</h2>{error && <Button onClick={() => window.location.reload()}>再読み込み</Button>}</div> : <Routes>
      <Route index element={<GlossaryLibrary />} />
      <Route path="history" element={<GlossaryHistory />} />
      <Route path="extra" element={<ExtraTermRoute />} />
      <Route path="review" element={<ReviewWordsRoute />} />
      <Route path=":termId" element={<TermRoute />} />
      <Route path="*" element={<div className="empty-state"><h2>ページが見つかりません</h2><Link className="text-link" to="/glossary">用語一覧へ戻る</Link></div>} />
    </Routes>}
  </div>;
}
function Intro({ title, children }: { title: string; children?: ReactNode }) {
  return <div className="page-intro"><h1>{title}</h1>{children}</div>;
}
function termPath(termId: string, attemptId?: string, fromTermId?: string) {
  const name = extraTermName(termId);
  const params = new URLSearchParams();
  if (name) params.set('name', name);
  if (fromTermId) params.set('from', fromTermId);
  if (attemptId) params.set('attempt', attemptId);
  const query = params.toString();
  return `/glossary/${name ? 'extra' : termId}${query ? `?${query}` : ''}`;
}
function latestByTerm(attempts: GlossaryAttempt[]) { return new Map(attempts.map(attempt => [attempt.termId, attempt])); }
function ResultBadge({ attempt }: { attempt?: GlossaryAttempt }) {
  if (!attempt) return <span className="pill">未練習</span>;
  const { grade, status } = attempt.evaluation;
  if (grade) return <span className={cn('pill', grade === 'C' ? 'pill-amber' : 'pill-green')}>{grade} · {gradeLabels[grade]}</span>;
  return <span className={cn('pill', status === 'covered' ? 'pill-green' : 'pill-amber')}>{statusLabels[status]}</span>;
}
function GlossaryLibrary() {
  const { snapshot } = useGlossary();
  const [params, setParams] = useSearchParams(); const [search, setSearch] = useState('');
  const category = params.get('category') ?? 'all'; const filter = params.get('filter') ?? 'all';
  const latest = latestByTerm(snapshot.attempts);
  const list = terms.filter(term => (category === 'all' || term.category === category) && (filter !== 'new' || !latest.has(term.id)) && (filter !== 'review' || (latest.has(term.id) && latest.get(term.id)!.evaluation.status !== 'covered')) && `${term.name} ${term.aliases?.join(' ') ?? ''} ${term.reading} ${term.category}`.toLowerCase().includes(search.toLowerCase().trim()));
  const practiced = terms.filter(t => latest.has(t.id)).length;
  const needsReview = terms.filter(t => latest.has(t.id) && latest.get(t.id)!.evaluation.status !== 'covered').length;
  const candidates = list.filter(t => !latest.has(t.id) || latest.get(t.id)!.evaluation.status !== 'covered');
  const pool = candidates.length ? candidates : list;
  const [randomIndex] = useState(() => Math.random());
  const random = pool[Math.min(Math.floor(randomIndex * pool.length), pool.length - 1)];
  function update(key: string, value: string) { const next = new URLSearchParams(params); next.set(key, value); setParams(next, { replace: true }); }
  const reviewWords = useLearning().snapshot.reviewWords;
  return <>
    <Intro title="用語学習">{filter === 'words' ? reviewWords.length > 0 && <Button asChild><Link to="/glossary/review">単語を復習<ArrowRight size={17} /></Link></Button> : random && <Button asChild><Link to={`/glossary/${random.id}`}>おまかせで練習<ArrowRight size={17} /></Link></Button>}</Intro>
    <div className="glossary-metrics"><div><strong>{terms.length}<small>語</small></strong><span>収録用語</span></div><div><strong>{practiced}<small>語</small></strong><span>説明した用語</span></div><div><strong>{needsReview}<small>語</small></strong><span>もう一度説明したい</span></div></div>
    <div className="glossary-toolbar"><label className="search-input"><Search size={17} /><input aria-label="用語を検索" placeholder="用語・英語名で検索" value={search} onChange={e => setSearch(e.target.value)} /></label><label className="glossary-category"><span className="sr-only">用語のカテゴリ</span><select value={category} onChange={e => update('category', e.target.value)}><option value="all">すべてのカテゴリ</option>{termCategories.map(value => <option key={value}>{value}</option>)}</select></label></div>
    <div className="library-filter-row"><div className="filter-pills">{[['all', 'すべて'], ['new', 'まだ説明していない'], ['review', 'もう一度'], ...(reviewWords.length || filter === 'words' ? [['words', `復習する単語 ${reviewWords.length}`]] : [])].map(([value, label]) => <button key={value} onClick={() => update('filter', value)} className={filter === value ? 'active' : ''} aria-pressed={filter === value}>{label}</button>)}</div>{filter !== 'words' && <span>{list.length}語</span>}</div>
    {filter === 'words' ? <ReviewWordCards words={reviewWords} search={search} latest={latest} /> : list.length ? <div className="glossary-grid">{list.map(term => <article className="term-card" key={term.id}><div className="term-card-top"><span>{term.category}</span><ResultBadge attempt={latest.get(term.id)} /></div><h2><Link to={`/glossary/${term.id}`}>{term.name}</Link></h2><p className="term-reading">{term.reading}</p>{snapshot.drafts.some(d => d.termId === term.id && d.text.trim()) && <span className="term-draft-label">入力途中の説明があります</span>}<div className="term-card-actions"><Button asChild variant="outline"><Link to={`/glossary/${term.id}?reference=1`}>用語を見る<BookOpen size={15} /></Link></Button><Button asChild><Link to={`/glossary/${term.id}`}>説明する<ArrowRight size={15} /></Link></Button></div></article>)}</div> : <div className="empty-state"><Search size={25} /><h2>条件に合う用語がありません</h2><p>検索語や絞り込み条件を変えてみてください。</p></div>}

  </>;
}

// Words saved from questions open the matching glossary term, or an AI-checked extra term when none is collected.
function ReviewWordCards({ words, search, latest }: { words: string[]; search: string; latest: Map<string, GlossaryAttempt> }) {
  const { setReviewWord } = useLearning();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState('');
  async function remove(word: string) {
    if (pending) return;
    setPending(word); setError('');
    try { await setReviewWord(word, false); }
    catch { setError('保存できませんでした。もう一度お試しください。'); }
    finally { setPending(null); }
  }
  const shown = words.filter(word => normalize(word).includes(normalize(search)));
  if (!words.length) return <div className="empty-state"><CheckCheck size={25} /><h2>復習する単語はありません</h2><p>問題の解説で「復習したい単語」を選ぶと、ここに並びます。</p></div>;
  return <>
    {error && <p className="inline-error" role="alert">{error}</p>}
    {shown.length ? <div className="glossary-grid">{shown.map(word => {
      const term = termForWord(word); const termId = term?.id ?? extraTerm(word).id;
      return <article className="term-card" key={word}><div className="term-card-top"><span>{term?.category ?? '問題から登録'}</span><ResultBadge attempt={latest.get(termId)} /></div><h2><Link to={termPath(termId)}>{term?.name ?? word}</Link></h2>{term && <p className="term-reading">{term.reading}</p>}<div className="term-card-actions"><Button variant="outline" disabled={pending !== null} aria-busy={pending === word} onClick={() => void remove(word)} aria-label={`${word}を復習する単語から外す`}>{pending === word ? <LoaderCircle className="animate-spin" size={15} /> : <X size={15} />}外す</Button><Button asChild><Link to={termPath(termId)} aria-label={`${word}を説明する`}>説明する<ArrowRight size={15} /></Link></Button></div></article>;
    })}</div> : <div className="empty-state"><Search size={25} /><h2>条件に合う単語がありません</h2></div>}
  </>;
}

function TermRoute() {
  const { termId } = useParams(); const term = termById.get(termId ?? ''); const [params] = useSearchParams();
  if (!term) return <div className="empty-state"><h2>用語が見つかりません</h2><Link to="/glossary" className="text-link">用語一覧へ戻る<ArrowRight size={15} /></Link></div>;
  return <TermPractice key={`${term.id}-${params.get('reference')}-${params.get('attempt')}-${params.get('review')}-${params.get('target')}`} term={term} referenceInitially={params.get('reference') === '1'} attemptId={params.get('attempt') ?? undefined} review={reviewSession(params)} />;
}
function ExtraTermRoute() {
  const [params] = useSearchParams(); const name = extraTermNameSchema.safeParse(params.get('name') ?? '');
  if (!name.success) return <div className="empty-state"><h2>用語が見つかりません</h2><Link to="/glossary" className="text-link">用語一覧へ戻る<ArrowRight size={15} /></Link></div>;
  const from = params.get('from') ?? undefined;
  return <TermPractice key={`${name.data}-${params.get('attempt')}-${params.get('review')}-${params.get('target')}`} term={extraTerm(name.data, from && termById.has(from) ? from : undefined)} referenceInitially={false} attemptId={params.get('attempt') ?? undefined} review={reviewSession(params)} />;
}
// A review round walks the saved words in random order; the words already explained ride along in the URL.
type ReviewSession = { word: string; done: string[]; target: Level };
function reviewTarget(params: URLSearchParams) { return levels.find(level => level === params.get('target')); }
function reviewSession(params: URLSearchParams): ReviewSession | undefined {
  const word = params.get('review'); const target = reviewTarget(params);
  return word && target ? { word, done: params.getAll('done'), target } : undefined;
}
function reviewQuery(done: string[], target: Level) { const params = new URLSearchParams(); done.forEach(word => params.append('done', word)); params.set('target', target); return params; }
function reviewWordPath(word: string, done: string[], target: Level) {
  const term = termForWord(word); const params = reviewQuery(done, target);
  if (!term) params.set('name', word);
  params.set('review', word);
  return `/glossary/${term ? term.id : 'extra'}?${params}`;
}
function nextReviewPath(session: ReviewSession) { return `/glossary/review?${reviewQuery([...session.done, session.word], session.target)}`; }
function ReviewGoal({ count }: { count: number }) {
  const [target, setTarget] = useState<Level>('B');
  return <><Intro title="単語復習の目標レベル" /><div className="review-goal"><p>{count}語を復習します。目標以上の評価を取れた単語は、復習キューから自動で外します。</p><fieldset><legend>目標レベルを選んでください</legend>{levels.map(level => <label className={cn('review-goal-option', target === level && 'review-goal-selected')} key={level}><input type="radio" name="review-target" value={level} checked={target === level} onChange={() => setTarget(level)} /><span><strong>{level} · {levelInfo[level].name}</strong><small>{levelInfo[level].description}</small></span></label>)}</fieldset><div className="actions"><Button asChild><Link to={`/glossary/review?${reviewQuery([], target)}`}>復習を始める<ArrowRight size={16} /></Link></Button><Button asChild variant="outline"><Link to="/reviews">復習ノートへ戻る</Link></Button></div></div></>;
}
function ReviewWordsRoute() {
  const words = useLearning().snapshot.reviewWords; const [params] = useSearchParams();
  const target = reviewTarget(params); const done = [...new Set(params.getAll('done'))]; const remaining = words.filter(word => !done.includes(word));
  const [pick] = useState(() => Math.random());
  if (target && done.length && !remaining.length) return <div className="session-complete"><span className="completion-icon"><CheckCheck size={34} /></span><h1>単語の復習が終わりました</h1><p>今回の目標：{target}（{levelInfo[target].name}）。復習キューに残っている単語は{words.length}語です。</p><div className="actions">{words.length > 0 && <Button asChild><Link to="/glossary/review">もう一周する<RotateCcw size={16} /></Link></Button>}<Button variant="outline" asChild><Link to="/reviews">復習ノートへ戻る</Link></Button></div></div>;
  if (!words.length) return <div className="empty-state"><CheckCheck size={25} /><h2>復習する単語はありません</h2><p>問題の解説で「復習したい単語」を選ぶと、ここで続けて説明できます。</p><Link to="/reviews" className="text-link">復習ノートへ戻る<ArrowRight size={15} /></Link></div>;
  if (!target) return <ReviewGoal count={words.length} />;
  return <Navigate replace to={reviewWordPath(remaining[Math.min(Math.floor(pick * remaining.length), remaining.length - 1)], done, target)} />;
}
function TermPractice({ term, referenceInitially, attemptId, review }: { term: Term; referenceInitially: boolean; attemptId?: string; review?: ReviewSession }) {
  const { snapshot, updateDraft, submit } = useGlossary();
  const { snapshot: learning, setReviewWord } = useLearning(); const reviewWords = learning.reviewWords;
  const reviewLast = review && reviewWords.every(word => word === review.word || review.done.includes(word));
  const reviewTotal = review && new Set([...reviewWords, ...review.done, review.word]).size;
  const saved = snapshot.attempts.find(a => a.id === attemptId && a.termId === term.id);
  const [draft, setDraft] = useState<GlossaryDraft>(() => {
    const existing = snapshot.drafts.find(d => d.termId === term.id);
    return existing ? { ...existing, referenceViewed: existing.referenceViewed || referenceInitially } : { termId: term.id, text: '', usedVoice: false, referenceViewed: referenceInitially, updatedAt: new Date().toISOString() };
  });
  const draftRef = useRef(draft); const hasSeenReference = useRef(referenceInitially);
  const [showReference, setShowReference] = useState(referenceInitially);
  const [result, setResult] = useState<GlossaryAttempt | null>(saved ?? null);
  const [saving, setSaving] = useState(false); const [error, setError] = useState('');
  const [transcriptFocused, setTranscriptFocused] = useState(false);
  const [removal, setRemoval] = useState<'idle' | 'removed' | 'failed'>('idle');
  const feedbackRef = useRef<HTMLDivElement>(null); const textareaRef = useRef<HTMLTextAreaElement>(null); const micRef = useRef<HTMLButtonElement>(null);
  function change(patch: Partial<GlossaryDraft>) {
    const next = { ...draftRef.current, ...patch, referenceViewed: hasSeenReference.current || draftRef.current.referenceViewed || Boolean(patch.referenceViewed), updatedAt: new Date().toISOString() };
    draftRef.current = next; setDraft(next); updateDraft(next); setResult(null); setRemoval('idle'); setError('');
  }
  const speech = useSpeech(text => change({ text, usedVoice: true }));
  function startSpeaking() { setTranscriptFocused(false); speech.start(draftRef.current.text); }
  const history = snapshot.attempts.filter(a => a.termId === term.id).slice().reverse();
  const nextTerm = terms[(terms.findIndex(t => t.id === term.id) + 1) % terms.length];
  useEffect(() => { if (result) { hasSeenReference.current = true; feedbackRef.current?.focus(); } }, [result]);
  async function removeReviewedWord() {
    if (!review) return;
    try { await setReviewWord(review.word, false); setRemoval('removed'); }
    catch { setRemoval('failed'); }
  }
  async function check(event: React.FormEvent) {
    event.preventDefault(); if (speech.active || saving || result) return;
    const parsed = explanationInputSchema.safeParse(draft.text);
    if (!parsed.success) { setError(parsed.error.issues[0].message); return; }
    setSaving(true); setError('');
    try {
      const attempt = await submit(term, draftRef.current); setResult(attempt);
      const grade = attempt.evaluation.grade;
      if (review && grade && grade !== 'C' && levels.indexOf(grade) >= levels.indexOf(review.target)) await removeReviewedWord();
    }
    catch (e) { setError(e instanceof Error ? e.message : '評価を取得できませんでした。文章は残っているので、もう一度お試しください。'); }
    finally { setSaving(false); }
  }
  function reveal() { hasSeenReference.current = true; setShowReference(true); change({ referenceViewed: true }); }
  return <>
    {review ? <div className="review-round-bar"><Link to="/reviews" className="back-link"><ArrowLeft size={15} />復習をやめる</Link><span className="review-round-count">単語の復習 {review.done.length + 1} / {reviewTotal}</span><span className="pill">目標 {review.target} · {levelInfo[review.target].name}</span>{!result && !saving && <Link to={nextReviewPath(review)} className="text-link">{reviewLast ? '復習を終える' : 'この単語をとばす'}<ChevronRight size={15} /></Link>}</div> : <Link to="/glossary" className="back-link"><ArrowLeft size={15} />用語一覧へ戻る</Link>}
    <div className="term-practice-heading"><div><span className="pill">{term.category}</span><h1>{term.name}</h1><p>{term.reading}</p></div><span className="term-practice-count"><History size={14} />これまで{history.length}回説明</span></div>
    <div className="term-practice-layout"><div className="term-practice-main">
      {term.definition && !result && <div className="term-reference-disclosure"><Button type="button" variant="ghost" className="term-reference-toggle" aria-expanded={showReference} aria-controls="term-reference-panel" disabled={speech.active || saving} onClick={() => showReference ? setShowReference(false) : reveal()}><BookOpen size={17} /><span>{showReference ? '説明例を閉じる' : '説明例を見る'}</span><ChevronDown size={17} /></Button>{showReference && <div id="term-reference-panel"><Reference term={term} /></div>}</div>}
      {saved && result?.id === saved.id ? <div className="saved-explanation"><span className="eyebrow">{formatDate(saved.answeredAt, true)} の説明</span><p>{saved.text}</p><Button variant="outline" onClick={() => { setResult(null); setShowReference(false); textareaRef.current?.focus(); }}>新しく説明してみる<RotateCcw size={15} /></Button></div> : <form onSubmit={event => void check(event)} className="explanation-form">
        <div className="explanation-form-heading"><h2>仕組みと用途を説明</h2></div>
        <div className="speech-controls"><Button ref={micRef} type="button" className="speech-hold" aria-pressed={speech.active} disabled={saving || !speech.supported || speech.phase === 'stopping'}
          onPointerDown={e => { if (e.button !== 0) return; e.preventDefault(); e.currentTarget.focus(); e.currentTarget.setPointerCapture(e.pointerId); startSpeaking(); }}
          onPointerUp={speech.stop} onPointerCancel={speech.stop} onLostPointerCapture={speech.stop}
          onKeyDown={e => { if (e.key !== ' ' && e.key !== 'Enter') return; e.preventDefault(); if (!e.repeat) startSpeaking(); }}
          onKeyUp={e => { if (e.key === ' ' || e.key === 'Enter') speech.stop(); }} onBlur={speech.stop} onContextMenu={e => e.preventDefault()}>
          {speech.active ? <Square size={44} /> : <Mic size={48} />}<span>{speech.phase === 'starting' ? 'マイクの準備中…' : speech.phase === 'listening' ? '離すと停止' : speech.phase === 'stopping' ? '文字起こしを確定中' : '押しながら話す'}</span></Button><span className={cn('speech-state', speech.active && 'speech-recording')} role="status">{speech.active ? <><span className="status-dot" />{speech.phase === 'listening' ? '聞き取り中' : speech.phase === 'stopping' ? '確定結果を待っています' : 'マイクの準備中'}</> : speech.supported ? '' : '音声入力は非対応です'}</span></div>
        {speech.error && <p className="inline-error" role="alert">{speech.error}</p>}
        <label className="sr-only" htmlFor="term-explanation">{term.name}についての説明</label><textarea id="term-explanation" ref={textareaRef} value={draft.text} maxLength={EXPLANATION_MAX_LENGTH} disabled={(!draft.text && !transcriptFocused) || speech.active || saving} onFocus={() => setTranscriptFocused(true)} onBlur={() => setTranscriptFocused(false)} onChange={e => change({ text: e.target.value })} placeholder="マイクを押しながら話すと、ここに表示されます" aria-describedby="explanation-input-count" />
        <div className="explanation-input-meta"><span id="explanation-input-count">{draft.text.length} / {EXPLANATION_MAX_LENGTH.toLocaleString('ja-JP')}</span><Button type="button" variant="ghost" size="sm" disabled={!draft.text || speech.active || saving} onClick={() => { setTranscriptFocused(false); change({ text: '', usedVoice: false }); micRef.current?.focus(); }}><Trash2 size={15} />全文削除</Button></div>
        {speech.interim && <div className="speech-interim" role="status"><span>聞き取り途中</span><p>{speech.interim}</p></div>}
        <div className="explanation-submit"><Button type="submit" disabled={speech.active || saving || Boolean(result) || draft.text.trim().length < 10}>{saving ? <LoaderCircle size={16} className="animate-spin" /> : <Check size={16} />}{saving ? 'チェック中' : result ? 'チェック済み' : 'AIでチェック'}</Button></div>
        {error && <p className="inline-error" role="alert">{error}</p>}
        <p className="speech-privacy">チェック時に説明文をOpenAIへ送信します。履歴はこのブラウザに保存。音声認識はブラウザのサービスを利用し、音声は当サイトに保存しません。</p>
      </form>}
      {result && <div ref={feedbackRef} tabIndex={-1} className="glossary-feedback-focus"><Feedback attempt={result} />{review && <div className="review-goal-result">{removal === 'failed' ? <><p className="inline-error" role="alert">目標に達しましたが、復習キューから外せませんでした。評価は保存されています。</p><Button type="button" variant="outline" disabled={saving} onClick={async () => { setSaving(true); try { await removeReviewedWord(); } finally { setSaving(false); } }}>キューから外す処理を再試行</Button></> : <p role="status" className={removal === 'removed' ? 'success-message' : 'muted'}>{saving ? '復習キューを更新しています…' : removal === 'removed' ? `目標${review.target}に達したので「${review.word}」を復習キューから外しました。` : `目標${review.target}に届かなかったので「${review.word}」は復習キューに残します。`}</p>}</div>}<Reference term={term} definition={result.reference} /><div className="actions glossary-next-actions">{review ? saving || removal === 'failed' ? <Button disabled>{reviewLast ? '復習を終える' : '次の単語へ'}<ArrowRight size={16} /></Button> : <Button asChild><Link to={nextReviewPath(review)}>{reviewLast ? '復習を終える' : '次の単語へ'}<ArrowRight size={16} /></Link></Button> : <Button asChild><Link to={`/glossary/${nextTerm.id}`}>次の用語へ<ArrowRight size={16} /></Link></Button>}</div></div>}
      {!result && history.length > 0 && <details className="term-history"><summary><History size={16} />過去の説明を見る（{history.length}件）</summary>{history.slice(0, 5).map(attempt => <Link key={attempt.id} to={termPath(term.id, attempt.id)}><time>{formatDate(attempt.answeredAt, true)}</time><ResultBadge attempt={attempt} /><ChevronRight size={15} /></Link>)}</details>}
    </div>{term.related.length > 0 && <aside className="term-coach"><div className="related-terms"><h3>関連用語</h3>{term.related.map(id => { const related = termById.get(id); return related && <Link key={id} to={`/glossary/${id}`}>{related.name}<ChevronRight size={14} /></Link>; })}</div></aside>}</div>
  </>;
}
function Reference({ term, definition = term.definition }: { term: Term; definition?: string }) {
  return <section className="term-reference"><span className="eyebrow">用語の説明例</span><h2>{term.name}</h2><p>{definition}</p>{term.example && <div className="term-example"><strong>例えば</strong><p>{term.example}</p></div>}</section>;
}
function Feedback({ attempt }: { attempt: GlossaryAttempt }) {
  const evaluation = attempt.evaluation; const { grade } = evaluation;
  const passed = grade ? grade !== 'C' : evaluation.status === 'covered';
  return <section className="glossary-feedback" aria-label="説明のチェック結果"><div className={cn('glossary-result-heading', passed && 'glossary-result-covered')}><h2>判定</h2><span className={cn('glossary-result-value', grade && 'glossary-grade')} aria-label={grade ? `評価 ${grade}` : undefined}>{grade ?? statusLabels[evaluation.status]}</span></div>
    <div className="glossary-result-meta"><span>{attempt.usedVoice ? '音声入力を使用' : '文字で入力'}</span><span>{attempt.referenceViewed ? '説明例を参照した練習' : '説明例を見る前の練習'}</span><time>{formatDate(attempt.answeredAt, true)}</time></div>
    {levels.map(level => { const items = evaluation.criteria.filter(c => (c.level ?? 'B') === level); return items.length > 0 && <div className="rubric-level" key={level}>{grade && <h3 className="rubric-level-heading"><span>{level}</span>{levelInfo[level].name}<small>{levelInfo[level].description}</small></h3>}<div className="rubric-results">{items.map(criterion => <div className={cn('rubric-item', `rubric-${criterion.status}`)} key={criterion.id}><span className="rubric-icon">{criterion.status === 'covered' ? <Check size={17} /> : criterion.status === 'review' ? <TriangleAlert size={17} /> : <CircleHelp size={17} />}</span><div><span className="rubric-state">{criterion.status === 'covered' ? '説明に含まれています' : criterion.status === 'review' ? '内容に誤りがあります' : level === 'B' ? 'この説明では未確認' : 'まだ触れていません'}</span><h3>{criterion.title}</h3>{criterion.evidence && <blockquote>{criterion.evidence}</blockquote>}<p>{criterion.hint}</p></div></div>)}</div></div>; })}
    {evaluation.followUp && <FollowUp attempt={attempt} followUp={evaluation.followUp} />}<p className="glossary-check-limit">AI評価は誤る場合があります。説明例も確認してください。</p>
  </section>;
}
function FollowUp({ attempt, followUp }: { attempt: GlossaryAttempt; followUp: NonNullable<Evaluation['followUp']> }) {
  const name = extraTermNameSchema.safeParse(followUp.name);
  // The AI may name a collected term by another spelling without its id, so look the name up too.
  const known = (followUp.termId && termById.get(followUp.termId)) || termForWord(followUp.name);
  const to = known && known.id !== attempt.termId ? termPath(known.id) : name.success ? termPath(`extra:${name.data}`, undefined, extraTermName(attempt.termId) ? undefined : attempt.termId) : undefined;
  return <div className="glossary-follow-up"><span className="eyebrow">次に説明してみよう</span><h3>{followUp.name}</h3><p>{followUp.reason}</p>{to && <Button asChild variant="outline"><Link to={to}>この用語を説明する<ArrowRight size={15} /></Link></Button>}</div>;
}
function GlossaryHistory() {
  const { snapshot, restore } = useGlossary();
  const fileRef = useRef<HTMLInputElement>(null); const [message, setMessage] = useState(''); const [error, setError] = useState(''); const [importing, setImporting] = useState(false);
  function download() { const url = URL.createObjectURL(new Blob([serializeGlossary(snapshot)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = `orenotameno-glossary-${dayKey(new Date())}.json`; a.click(); URL.revokeObjectURL(url); setMessage('用語の学習記録を書き出しました。'); }
  async function upload(file?: File) { if (!file) return; setError(''); setMessage(''); setImporting(true); try { if (file.size > 10_000_000) throw new Error('バックアップは10MB以内のファイルを選んでください。'); await restore(await file.text()); setMessage('用語の学習記録を取り込みました。'); } catch { setError('用語学習のバックアップを読み込めませんでした。ファイルの形式を確認してください。'); } finally { setImporting(false); if (fileRef.current) fileRef.current.value = ''; } }
  return <><Intro title="説明の履歴" /><div className="glossary-history-tools"><span>{snapshot.attempts.length}回の説明</span><Button variant="outline" onClick={download}><ArrowDownToLine size={15} />記録を書き出す</Button><Button variant="outline" disabled={importing} onClick={() => fileRef.current?.click()}><ArrowUpFromLine size={15} />記録を取り込む</Button><input ref={fileRef} className="sr-only" aria-label="用語学習のバックアップ" type="file" accept=".json,application/json" onChange={e => void upload(e.target.files?.[0])} /></div>{message && <p className="success-message" role="status">{message}</p>}{error && <p className="inline-error" role="alert">{error}</p>}
    {snapshot.attempts.length ? <div className="glossary-history-list">{[...snapshot.attempts].reverse().map(attempt => <article key={attempt.id}><div className="glossary-history-top"><span className="glossary-history-icon">{attempt.usedVoice ? <Mic size={19} /> : <BookOpen size={19} />}</span><div><h2>{termById.has(attempt.termId) || extraTermName(attempt.termId) ? <Link to={termPath(attempt.termId, attempt.id)}>{attempt.termName}</Link> : attempt.termName}</h2><time>{formatDate(attempt.answeredAt, true)}</time></div><ResultBadge attempt={attempt} /></div><p className="history-explanation">{attempt.text}</p><div className="glossary-history-bottom"><span>確認できた要点 {attempt.evaluation.covered} / {attempt.evaluation.total}{attempt.referenceViewed ? ' · 説明例を参照' : ''}</span>{(termById.has(attempt.termId) || extraTermName(attempt.termId)) && <Link to={termPath(attempt.termId, attempt.id)}>見直す<ArrowRight size={14} /></Link>}</div></article>)}</div> : <div className="empty-state"><Clock3 size={26} /><h2>説明の履歴はありません</h2><Button asChild><Link to="/glossary">用語を選ぶ<ArrowRight size={15} /></Link></Button></div>}</>;
}
