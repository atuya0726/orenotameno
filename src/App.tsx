import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router';
import { ArrowLeft, ArrowRight, BarChart3, BookOpen, Bookmark, Check, CheckCheck, ChevronRight, CircleHelp, LayoutDashboard, LoaderCircle, Plus, RotateCcw, Search, X } from 'lucide-react';
import { SITE_NAME, SiteBrand } from '@/components/site-brand';
import { Button } from '@/components/ui/button';
import { MathText } from '@/components/math-text';
import { AnswerChoices } from '@/components/answer-choices';
import { courses, questions, questionById } from '@/data/questions';
import { getQuestionTerms } from '@/data/question-terms';
import { eraLabel } from '@/data/ipa';
import { useLearning, useNow } from '@/lib/store';
import { responseConfidenceLabels, attemptConfidenceLabel, createQuickAnswer, cycleOptionMark, isQuickAnswer, selectAnswer, type Attempt, type Course, type Draft, type OptionId, type Question, type QuickAnswerInput, type ResponseConfidence } from '@/lib/model';
import { activeReviews, reviewPriorityLabel } from '@/lib/scheduler';
import { dayKey, formatDate } from '@/lib/date';
import { cn } from '@/lib/utils';
import { Mic } from 'lucide-react';
import { CalculatorToggle } from '@/components/calculator';
import GlossaryApp from '@/features/glossary/GlossaryApp';
import { groupReviewWords } from '@/features/glossary/review-words';
import { PracticeSetup } from '@/components/practice-setup';
import { StudyCompletion } from '@/components/study-completion';
import { buildPracticeQueue, parsePracticeSearch } from '@/lib/practice';
import { studyPath, studySessionUrl, type StudySession } from '@/lib/study-session';
import { randomId } from '@/lib/id';
import { orderedOptions, shuffleOptionOrder } from '@/lib/option-order';

const menu = [
  { to: '/', label: '学習ホーム', icon: LayoutDashboard, end: true },
  { to: '/questions', label: '問題を探す', icon: BookOpen },
  { to: '/reviews', label: '復習ノート', icon: RotateCcw },
  { to: '/records', label: '学習記録', icon: BarChart3 },
  { to: '/glossary', label: '用語学習', icon: Mic },
];

export default function App() {
  const { ready, error, clearError } = useLearning();
  const location = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [location.pathname]);
  return <div className="app-shell">
    <a className="skip-link" href="#main">本文へ移動</a>
    <SiteHeader />
    <div className="main-shell">
      <main id="main" className="main-content">
        {error && <div className="error-banner" role="alert"><span>{error}</span>{ready && <button aria-label="通知を閉じる" onClick={clearError}><X size={16} /></button>}</div>}
        {!ready ? <div className="empty-state"><LoaderCircle className="animate-spin" size={28} /><h1>{error ? '学習記録を開けませんでした' : '学習ノートを開いています'}</h1><p>{error ? '保存を利用できる状態にしてから、ページを再読み込みしてください。' : 'このブラウザに保存した記録を確認しています。'}</p>{error && <Button onClick={() => window.location.reload()}>再読み込み</Button>}</div> :
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/questions" element={<QuestionLibrary />} />
            <Route path="/reviews" element={<ReviewNotebook />} />
            <Route path="/records" element={<Records />} />
            <Route path="/glossary/*" element={<GlossaryApp />} />
            <Route path="/study/:course" element={<Study key={`${location.pathname}:${location.state?.studyKey ?? location.key}`} />} />
            <Route path="/record/:attemptId" element={<SavedResult />} />
            <Route path="*" element={<Empty icon={<BookOpen />} title="ページが見つかりません" description="学習ホームから続けましょう。"><Button asChild><Link to="/">学習ホームへ</Link></Button></Empty>} />
          </Routes>}
      </main>
      <footer className="page-footer"><Link to="/" className="footer-brand">{SITE_NAME}</Link></footer>
    </div>
  </div>;
}

function SiteHeader() {
  const { snapshot } = useLearning();
  const dueCount = activeReviews(snapshot.cards).length;
  return <header className="site-header"><div className="header-inner">
    <Link to="/" className="brand" aria-label={`${SITE_NAME} 学習ホーム`}><SiteBrand /></Link>
    <nav className="main-nav" aria-label="メインメニュー">{menu.map(item => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cn('nav-item', isActive && 'active')}><item.icon size={19} strokeWidth={1.7} /><span>{item.label}</span>{item.to === '/reviews' && dueCount > 0 && <span className="nav-count">{dueCount}</span>}</NavLink>)}</nav>
  </div></header>;
}

function PageIntro({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return <div className="page-intro"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{children}</div>;
}

function Home() {
  const { snapshot } = useLearning();
  const now = useNow();
  const attempted = new Set(snapshot.attempts.map(a => a.questionId));
  const uncertain = activeReviews(snapshot.cards).length;
  const correct = snapshot.attempts.filter(a => a.correct).length;
  const percent = snapshot.attempts.length ? Math.round(correct / snapshot.attempts.length * 100) : null;
  const date = new Intl.DateTimeFormat('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' }).format(new Date(now));
  const interrupted = snapshot.studySessions.find(session => session.index < session.questionIds.length);
  return <>
    <PageIntro title="学習ホーム">
      <time className="today-date" dateTime={dayKey(new Date(now))}>{date}</time>
    </PageIntro>
    {interrupted && <section className="quiet-empty" aria-label="途中の学習"><RotateCcw size={28} strokeWidth={1.4} /><div><strong>途中の学習があります</strong><p>{courses[questionById.get(interrupted.questionIds[0])!.course].name} · {interrupted.attemptIds.length} / {interrupted.questionIds.length}問 回答済み</p><Button asChild><Link to={studySessionUrl(interrupted)}>続きから再開<ArrowRight size={16} /></Link></Button></div></section>}
    <PracticeSetup />
    <div className="dashboard-grid">
      <section className="overview-card"><div className="section-kicker"><h2>これまでの学習</h2><Link to="/records" aria-label="学習記録を見る"><ArrowRight size={18} /></Link></div><div className="overview-main"><span>取り組んだ問題</span><strong>{attempted.size}<small> / {questions.length} 問</small></strong><div className="progress-track"><i style={{ width: `${attempted.size / questions.length * 100}%` }} /></div></div><div className="overview-bottom"><div><span className="stat-label">正答率</span><strong>{percent ?? '—'}<small>{percent === null ? '' : '%'}</small></strong></div><div><span className="stat-label">要復習</span><strong>{uncertain}<small>問</small></strong></div><div><span className="stat-label">あとで見る</span><strong>{snapshot.bookmarks.length}<small>問</small></strong></div></div></section>
    </div>

  </>;
}

function Study() {
  const { course: courseParam } = useParams();
  const [search, setSearch] = useSearchParams();
  const location = useLocation();
  const { snapshot, answer, updateStudySession } = useLearning();
  const course: Course | undefined = courseParam === 'A1' || courseParam === 'A2' ? courseParam : undefined;
  const reviewing = search.get('mode') === 'review' || (course !== undefined && parsePracticeSearch(course, search)?.target === 'review');
  const [session, setSession] = useState<StudySession>(() => {
    const path = studyPath(location.pathname, search);
    const saved = snapshot.studySessions.find(session => session.id === search.get('session') && session.path === path);
    if (saved) return saved;
    const list = questions.filter(q => q.course === course);
    const practice = course && parsePracticeSearch(course, search);
    const mode = search.get('mode');
    const queue = search.get('question') ? list.filter(q => q.id === search.get('question'))
      : course && practice ? buildPracticeQueue(course, practice, snapshot)
      : mode === 'new' ? list.filter(q => !snapshot.cards.some(c => c.questionId === q.id))
      : mode === 'bookmarks' ? list.filter(q => snapshot.bookmarks.includes(q.id))
      : mode === 'review' ? activeReviews(snapshot.cards).map(card => list.find(q => q.id === card.questionId)).filter((q): q is Question => q !== undefined)
      : list;
    return {
      id: randomId(), path, questionIds: queue.map(q => q.id), index: 0, attemptIds: [], updatedAt: new Date().toISOString(),
      ...(practice && practice.mode === 'mock' ? {} : { optionOrders: Object.fromEntries(queue.map(q => [q.id, shuffleOptionOrder()])) }),
    };
  });
  const queue = session.questionIds.map(id => questionById.get(id)!);
  const index = session.index;
  const sessionResults = session.attemptIds.map(id => snapshot.attempts.find(attempt => attempt.id === id)!);
  const result = sessionResults[index] ?? null;
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const initialSave = useRef<Promise<void> | null>(null);
  const registered = useRef(snapshot.studySessions.some(saved => saved.id === session.id));
  const busy = useRef(false);
  const active = useRef(true);
  async function ensureSession() {
    if (registered.current) return;
    if (!initialSave.current) initialSave.current = updateStudySession(session).then(() => {
      registered.current = true;
      if (!active.current) return;
      // Keep this component mounted when attaching its saved-session URL.
      setSearch(params => { params.set('session', session.id); return params; }, {
        replace: true, state: { ...location.state, studyKey: location.state?.studyKey ?? location.key },
      });
    }).catch(error => { initialSave.current = null; throw error; });
    await initialSave.current;
  }
  useEffect(() => {
    active.current = true;
    if (!session.questionIds.length) return;
    void ensureSession().catch(() => setSubmitError('学習の進行状況を保存できませんでした。もう一度お試しください。'));
    // The initial queue is saved once, before any answer can be submitted.
    return () => { active.current = false; };
  }, []);
  const resultRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!result) return;
    resultRef.current?.focus({ preventScroll: true });
    const timer = window.setTimeout(() => {
      const heading = resultRef.current?.querySelector<HTMLElement>('.explanation-heading'); if (!heading) return;
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
      // Bring the explanation up while the answer feedback is still visible.
      const header = document.querySelector('.site-header')?.getBoundingClientRect().height ?? 0;
      window.scrollTo({ top: heading.getBoundingClientRect().top + window.scrollY - header - 16, behavior });
    }, 300);
    return () => window.clearTimeout(timer);
  }, [result?.id]);
  if (!course) return <Empty icon={<BookOpen />} title="科目が見つかりません" description="A1またはA2から学習をはじめてください。"><Button asChild><Link to="/">学習ホームへ</Link></Button></Empty>;
  if (!questions.some(q => q.course === course)) return <Empty icon={<BookOpen />} title={`${courses[course].name}の実問題は未収録です`} description="収録済みの科目から学習をはじめてください。"><Button asChild><Link to="/study/A1">科目A1を解く<ArrowRight size={16} /></Link></Button></Empty>;
  if (!queue.length) return <Empty icon={<CheckCheck />} title={search.get('mode') === 'review' ? '復習する問題はありません' : '条件に合う問題はありません'} description="すべての問題から選んで、好きなタイミングで学習できます。"><Button asChild><Link to={`/study/${course}`}>すべての問題を解く<ArrowRight size={16} /></Link></Button><Button variant="outline" asChild><Link to="/reviews">復習ノートを見る</Link></Button></Empty>;
  if (index >= queue.length) return <StudyCompletion attempts={sessionResults} />;
  const question = queue[index];
  async function submit(input: QuickAnswerInput) {
    if (busy.current || result) return;
    busy.current = true;
    setSaving(true); setSubmitError('');
    try {
      await ensureSession();
      const attempt = await answer(question, { ...input, ...(session.optionOrders?.[question.id] && { optionOrder: session.optionOrders[question.id] }) }, session);
      setSession(current => ({ ...current, attemptIds: [...current.attemptIds, attempt.id], updatedAt: attempt.answeredAt }));
    }
    catch { setSubmitError('回答を保存できませんでした。入力を確認して、もう一度お試しください。'); }
    finally { busy.current = false; setSaving(false); }
  }
  async function next() {
    if (busy.current) return;
    busy.current = true; setSaving(true); setSubmitError('');
    const progress = { ...session, index: index + 1, updatedAt: new Date().toISOString() };
    try { await updateStudySession(progress); setSession(progress); window.scrollTo({ top: 0, behavior: 'instant' }); }
    catch { setSubmitError('学習の進行状況を保存できませんでした。もう一度お試しください。'); }
    finally { busy.current = false; setSaving(false); }
  }
  return <>
    <div className="study-breadcrumb">{search.has('by') ? <Link to="/"><ArrowLeft size={15} />学習ホーム</Link> : <Link to="/questions"><ArrowLeft size={15} />問題一覧</Link>}<span>/</span><span>{courses[course].name}</span><span className="study-session-counter"><strong>{index + 1}</strong> / {queue.length}</span></div>
    <div className="study-progress"><i style={{ width: `${(index + (result ? 1 : 0)) / queue.length * 100}%` }} /></div>
    <h1 className="sr-only">問題演習</h1>
    <div className="exercise-layout"><div className="exercise-main">
      <QuestionHeader question={question} />
      <AnswerForm key={question.id} question={question} optionOrder={result?.optionOrder ?? session.optionOrders?.[question.id]} saving={saving} result={result} submitError={submitError} onSubmit={submit} />
      {result && <AnswerFlash key={result.id} attempt={result} />}
      {result && <div ref={resultRef} tabIndex={-1} className="result-focus result-reveal" role="region" aria-label="解答結果と解説">
        <ResultDetails question={question} attempt={result} reviewing={reviewing} action={<Button disabled={saving} onClick={() => void next()}>{index + 1 === queue.length ? '今回の学習を終える' : '次の問題へ'}<ArrowRight size={17} /></Button>} />
      </div>}
    </div></div>
  </>;
}

function AnswerFlash({ attempt }: { attempt: Attempt }) {
  const [visible, setVisible] = useState(true);
  const unanswered = isQuickAnswer(attempt) && attempt.confidence === 'unknown';
  const label = attempt.correct ? '正解' : unanswered ? '解説を確認' : '不正解';
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 800);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return <div className={cn('answer-flash', unanswered ? 'answer-flash-unknown' : !attempt.correct && 'answer-flash-incorrect')} role="status" aria-label={`判定：${label}`}>
    <div className="answer-flash-content">
      <span className="answer-flash-symbol" aria-hidden="true">
        {unanswered ? <CircleHelp size={96} strokeWidth={1.5} /> : <svg viewBox="0 0 120 120" fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round">
          {attempt.correct ? <circle className="answer-flash-mark" cx="60" cy="60" r="43" pathLength="1" /> : <><path className="answer-flash-mark" pathLength="1" d="M30 30 90 90" /><path className="answer-flash-mark" pathLength="1" d="M90 30 30 90" /></>}
        </svg>}
      </span>
      <strong>{label}</strong>
    </div>
  </div>;
}

function QuestionHeader({ question }: { question: Question }) {
  const { snapshot, toggleBookmark } = useLearning();
  const saved = snapshot.bookmarks.includes(question.id);
  return <section className="question-card">
    <div className="question-tools">{question.kind === 'calculation' && <CalculatorToggle key={question.id} questionId={question.id} />}<button className={cn('bookmark-button', saved && 'bookmarked')} aria-label={saved ? 'あとで見るから外す' : 'あとで見るに追加'} aria-pressed={saved} onClick={() => void toggleBookmark(question.id)}><Bookmark size={19} fill={saved ? 'currentColor' : 'none'} /></button></div>
    <h2 className="question-prompt"><MathText text={question.prompt} /></h2>
    {question.details && <div className="question-details">{question.details.title && <h3>〔<MathText text={question.details.title} />〕</h3>}<ul>{question.details.items.map(item => <li key={item}><MathText text={item} /></li>)}</ul></div>}
    {question.code && <div className="question-code"><h3>〔{question.code.title}〕</h3><pre tabIndex={0} aria-label={question.code.title}><code>{question.code.text}</code></pre></div>}
    {question.table && <div className="question-table-scroll" role="region" aria-label={question.table.caption} tabIndex={0}><table className="question-table"><caption><MathText text={question.table.caption} /></caption><thead><tr>{question.table.headers.map(header => <th key={header} scope="col"><MathText text={header} /></th>)}</tr></thead><tbody>{question.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => j === 0 ? <th key={j} scope="row"><MathText text={cell} /></th> : <td key={j}><MathText text={cell} /></td>)}</tr>)}</tbody></table></div>}
    {question.figure && <figure className="question-figure"><figcaption><MathText text={question.figure.caption} /></figcaption><div className="question-figure-body" dangerouslySetInnerHTML={{ __html: question.figure.svg }} /></figure>}
  </section>;
}

function QuestionSource({ question }: { question: Question }) {
  return <details className="question-source"><summary>出典</summary><p>{question.source.label}</p>{question.source.kind === 'ipa' && <a href={question.source.questionUrl} target="_blank" rel="noreferrer">IPA公式の問題PDF ↗</a>}</details>;
}

function AnswerForm({ question, optionOrder, saving, result, submitError, onSubmit }: { question: Question; optionOrder?: OptionId[]; saving: boolean; result: Attempt | null; submitError: string; onSubmit: (input: QuickAnswerInput) => Promise<void> }) {
  const { snapshot, updateDraft } = useLearning();
  const submitting = useRef(false);
  // Keep the submitted selection visible after saving removes the persisted draft.
  const [draft, setDraft] = useState<Draft>(() => result ? {
    questionId: question.id, selected: result.selected ?? undefined,
    uncertainOptions: isQuickAnswer(result) ? result.uncertainOptions : [],
    optionMarks: isQuickAnswer(result) ? result.optionMarks : undefined,
  } : snapshot.drafts.find(d => d.questionId === question.id) ?? { questionId: question.id, uncertainOptions: [] });
  const locked = saving || Boolean(result);
  function changeMark(id: OptionId) {
    if (locked || submitting.current) return;
    const next = cycleOptionMark(draft, id);
    setDraft(next);
    updateDraft(next);
  }
  async function submit(confidence: ResponseConfidence, selected?: OptionId) {
    if (locked || submitting.current) return;
    submitting.current = true;
    try {
      const next: Draft = { ...(selected ? selectAnswer(draft, selected) : draft), uncertainOptions: [] };
      setDraft(next);
      if (selected) updateDraft(next);
      await onSubmit(createQuickAnswer(next, confidence, question));
    } finally { submitting.current = false; }
  }
  return <form onSubmit={e => e.preventDefault()} aria-label="問題の回答" className={result ? 'answer-submitted' : undefined} aria-busy={saving}>
    <AnswerChoices question={question} optionOrder={optionOrder} draft={draft} result={result} locked={locked} onAnswer={id => void submit('high', id)} onMark={changeMark} />
    <div className="answer-controls">
      <QuestionSource question={question} />
      <Button type="button" variant="ghost" className="unknown-response" disabled={locked} onClick={() => void submit('unknown')}>わからない</Button>
    </div>
    <span className="sr-only" role="status">{saving ? '保存中' : ''}</span>
    {submitError && <p className="inline-error" role="alert">{submitError}</p>}
  </form>;
}

function ResultDetails({ question, attempt, action, reviewing = false }: { question: Question; attempt: Attempt; action?: ReactNode; reviewing?: boolean }) {
  const quick = isQuickAnswer(attempt);
  const unanswered = quick && attempt.confidence === 'unknown';
  return <div className="result-content">
    <section className="explanation-card">
      <div className="explanation-heading"><h3>解説</h3><span className={cn('answer-outcome', unanswered ? 'result-unknown' : !attempt.correct && 'result-incorrect')}>{attempt.correct ? <Check size={17} /> : unanswered ? <CircleHelp size={17} /> : <X size={17} />}<strong>{attempt.correct ? '正解' : unanswered ? '未解答' : '不正解'}</strong></span></div>
      <p><MathText text={question.explanation} /></p>
    </section>
    <h3 className="option-review-title">選択肢の解説</h3>
    <div className="option-reviews">{orderedOptions(question, attempt.optionOrder).map(option => <div key={option.id} className={cn('option-review', option.id === question.correct && 'correct-option')}>
      <div className="option-review-top"><span className="choice-letter">{option.label}</span><strong>{option.figure && <span className="choice-figure" dangerouslySetInnerHTML={{ __html: option.figure }} />}<MathText text={option.text} /></strong>{option.id === question.correct && <span className="correct-answer-label"><Check size={14} />正解</span>}</div>
      <p><MathText text={option.explanation} /></p>
    </div>)}</div>
    {question.source.kind === 'ipa' && <div className="official-answer-source"><a className="official-answer-link" href={question.source.answerUrl} target="_blank" rel="noreferrer">IPA公式の解答例 ↗</a></div>}
    <ReviewActions question={question} attempt={attempt} action={action} reviewing={reviewing} />
  </div>;
}

function ReviewActions({ question, attempt, action, reviewing }: { question: Question; attempt: Attempt; action?: ReactNode; reviewing: boolean }) {
  const { snapshot, setReviewFlag, setReviewWord } = useLearning();
  const current = snapshot.attempts.find(saved => saved.id === attempt.id) ?? attempt;
  const marked = Boolean(current.reviewRequested || current.reviewDoubt);
  const candidates = getQuestionTerms(question);
  const selected = snapshot.reviewWords;
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState('');
  const savingRef = useRef(false);
  async function save(key: string, operation: () => Promise<void>) {
    if (savingRef.current) return;
    savingRef.current = true; setPending(key); setError('');
    try { await operation(); }
    catch { setError('保存できませんでした。もう一度お試しください。'); }
    finally { savingRef.current = false; setPending(null); }
  }
  return <div className="review-actions">
    {candidates.length > 0 && <section className="review-term-picker" aria-labelledby={`review-terms-${attempt.id}`}>
      <h3 id={`review-terms-${attempt.id}`}>復習したい単語を選択</h3>
      <ul className="review-term-list" aria-label="この問題の単語">{candidates.map(term => {
        const checked = selected.includes(term);
        return <li key={term}><button type="button" className={cn('review-term', checked && 'review-term-selected')} aria-label={`${term}を復習する`} aria-pressed={checked} aria-busy={pending === term} disabled={pending !== null} onClick={() => void save(term, () => setReviewWord(term, !checked))}>
          <span className="review-term-icon" aria-hidden="true"><Plus className="review-term-plus" size={15} /><Check className="review-term-check" size={15} /></span>{term}
        </button></li>;
      })}</ul>
    </section>}
    <div className="result-actions">
      {attempt.correct && <Button type="button" variant="outline" className={cn('review-flag', marked && 'review-flag-active')} aria-pressed={marked} aria-busy={pending === 'question'} disabled={pending !== null} onClick={() => void save('question', () => setReviewFlag(attempt.id, 'reviewRequested', !marked))}>
        {pending === 'question' ? <LoaderCircle className="animate-spin" size={17} /> : marked ? <Check size={17} /> : reviewing ? <RotateCcw size={17} /> : <Plus size={17} />}{reviewing ? 'また復習する' : '復習リストに追加'}
      </Button>}
      {action}
    </div>
    {error && <p className="inline-error" role="alert">{error}</p>}
  </div>;
}

function SavedResult() {
  const { attemptId } = useParams();
  const { snapshot } = useLearning();
  const attempt = snapshot.attempts.find(a => a.id === attemptId);
  const question = attempt && questionById.get(attempt.questionId);
  if (!attempt || !question) return <Empty icon={<BookOpen />} title="回答の記録が見つかりません" description="記録は回答したブラウザで確認できます。"><Button asChild><Link to="/records">学習記録へ</Link></Button></Empty>;
  return <><Link to="/records" className="back-link"><ArrowLeft size={15} />学習記録へ</Link><PageIntro title="回答の記録" description={formatDate(attempt.answeredAt, true)} /><div className="saved-result"><QuestionHeader question={question} /><ResultDetails question={question} attempt={attempt} action={<Button asChild><Link to={`/study/${question.course}?question=${question.id}`}>もう一度解く<RotateCcw size={16} /></Link></Button>} /><QuestionSource question={question} /></div></>;
}

function QuestionLibrary() {
  const { snapshot } = useLearning();
  const [params, setParams] = useSearchParams();
  const course = params.get('course') ?? 'all';
  const filter = params.get('filter') ?? 'all';
  const [search, setSearch] = useState('');
  const list = questions.filter(q => (course === 'all' || q.course === course) && (filter !== 'new' || !snapshot.cards.some(c => c.questionId === q.id)) && (filter !== 'bookmarks' || snapshot.bookmarks.includes(q.id)) && `${q.title} ${q.prompt} ${q.topic}`.includes(search));
  function update(key: string, value: string) { const next = new URLSearchParams(params); next.set(key, value); setParams(next, { replace: true }); }
  return <><PageIntro title="問題一覧" /><div className="library-toolbar"><div className="course-tabs" aria-label="科目で絞り込み">{[['all', 'すべて'], ['A1', '科目A1'], ['A2', '科目A2']].map(([value, label]) => <button key={value} className={course === value ? 'active' : ''} onClick={() => update('course', value)} aria-pressed={course === value}>{label}</button>)}</div><label className="search-input"><Search size={17} /><input aria-label="問題を検索" placeholder="キーワードで探す" value={search} onChange={e => setSearch(e.target.value)} /></label></div><div className="library-filter-row"><div className="filter-pills">{[['all', 'すべての問題'], ['new', 'まだ解いていない'], ['bookmarks', 'あとで見る']].map(([value, label]) => <button key={value} className={filter === value ? 'active' : ''} onClick={() => update('filter', value)} aria-pressed={filter === value}>{label}</button>)}</div><span>{list.length}問</span></div>{list.length ? <div className="question-list">{list.map(q => <QuestionRow key={q.id} question={q} />)}</div> : <Empty icon={<Search />} title="条件に合う問題はありません" description="キーワードや絞り込み条件を変えてみてください。" />}<div className="prototype-note"><span className="pill">収録情報</span>{`A1：${courses.A1.description}／A2：${courses.A2.description}。解説は独自作成。`}</div></>;
}

function QuestionRow({ question, reviewRemaining }: { question: Question; reviewRemaining?: number }) {
  const { snapshot, toggleBookmark } = useLearning();
  const card = snapshot.cards.find(c => c.questionId === question.id);
  const last = snapshot.attempts.find(a => a.id === card?.lastAttemptId);
  const bookmarked = snapshot.bookmarks.includes(question.id);
  const remaining = reviewRemaining ?? card?.remainingReviews ?? 0;
  return <div className="question-row"><span className={cn('row-subject', question.course === 'A2' && 'row-subject-a2')}>{question.course}</span><Link className="question-row-link" to={`/study/${question.course}?question=${question.id}`}><span className="row-topic">{question.source.kind === 'ipa' && <>{eraLabel(question.source)} <span>·</span> </>}{question.topic} <span>·</span> 問{question.number}</span><strong>{question.title}</strong></Link><span className={cn('row-state', remaining > 0 ? 'state-incorrect' : last?.correct && 'state-correct')}>{remaining > 0 ? <><RotateCcw size={13} />{reviewPriorityLabel(remaining)}</> : last ? <>{last.correct ? <Check size={14} /> : <RotateCcw size={13} />}{last.correct ? '正解' : '要復習'}<span className="row-confidence">{attemptConfidenceLabel(last)}</span></> : '未学習'}</span><button className={cn('bookmark-button', bookmarked && 'bookmarked')} aria-label={`${question.title}を${bookmarked ? 'あとで見るから外す' : 'あとで見るに追加'}`} aria-pressed={bookmarked} onClick={() => void toggleBookmark(question.id)}><Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} /></button><Link className="row-go" to={`/study/${question.course}?question=${question.id}`} aria-label={`${question.title}を解く`}><ChevronRight size={19} /></Link></div>;
}

function ReviewNotebook() {
  const { snapshot } = useLearning();
  const pending = activeReviews(snapshot.cards);
  const priorityCount = pending.filter(card => card.remainingReviews >= 3).length;
  const words = groupReviewWords(snapshot.reviewWords).length;
  if (!pending.length && !words) return <><PageIntro title="復習ノート" /><Empty icon={<CheckCheck />} title="復習する問題はありません" description="問題一覧から、次の学習を進めましょう。"><Button asChild><Link to="/questions">問題を選ぶ<ArrowRight size={16} /></Link></Button></Empty></>;
  return <><PageIntro title="復習ノート" />
    <div className="review-summaries">
      <section className="review-summary" aria-label="復習する問題"><span className="review-summary-icon"><RotateCcw size={25} /></span><div><span>復習する問題</span><strong>{pending.length}<small>問</small></strong></div>{pending.length > 0 ? <><p>優先して復習 <strong className="review-total-count">{priorityCount}問</strong></p><div className="review-course-actions">{(['A1', 'A2'] as const).filter(course => pending.some(card => questionById.get(card.questionId)?.course === course)).map(course => <Button key={course} asChild><Link to={`/study/${course}?mode=review`}>{courses[course].name}を復習<ArrowRight size={16} /></Link></Button>)}</div></> : <p className="muted">復習する問題はありません。</p>}</section>
      <section className="review-summary" aria-label="復習する単語"><span className="review-summary-icon"><Mic size={25} /></span><div><span>復習する単語</span><strong>{words}<small>語</small></strong></div>{words > 0 ? <><p className="muted">用語学習で、自分の言葉で説明して確かめます。</p><div className="review-course-actions"><Button asChild><Link to="/glossary/review">単語を復習<ArrowRight size={16} /></Link></Button></div></> : <p className="muted">登録した単語はありません。</p>}</section>
    </div>
  </>;
}

function Records() {
  const { snapshot } = useLearning();
  const [course, setCourse] = useState('all');
  const attempts = snapshot.attempts.filter(a => course === 'all' || questionById.get(a.questionId)?.course === course);
  const correct = attempts.filter(a => a.correct).length;
  const highIncorrect = attempts.filter(a => !a.correct && a.confidence === 'high').length;
  const stats = (['high', 'low', 'unknown', 'medium'] as const).filter(confidence => confidence !== 'medium' || attempts.some(a => a.confidence === 'medium')).map(confidence => { const list = attempts.filter(a => a.confidence === confidence); return { confidence, total: list.length, correct: list.filter(a => a.correct).length }; });
  return <><PageIntro title="学習記録" /><div className="course-tabs record-tabs" aria-label="学習記録の科目">{[['all', '全科目'], ['A1', '科目A1'], ['A2', '科目A2']].map(([value, label]) => <button key={value} className={course === value ? 'active' : ''} onClick={() => setCourse(value)} aria-pressed={course === value}>{label}</button>)}</div><div className="record-stats"><Metric label="解いた回数" value={attempts.length} unit="回" icon={<BookOpen size={18} />} /><Metric label="正答率" value={attempts.length ? Math.round(correct / attempts.length * 100) : '—'} unit={attempts.length ? '%' : ''} icon={<CheckCheck size={18} />} /><Metric label="高い確信で不正解" value={highIncorrect} unit="回" icon={<CircleHelp size={18} />} /></div><section className="confidence-chart"><div><h2>自信別の正答率</h2></div><div className="confidence-bars">{stats.map(s => <div className="confidence-chart-row" key={s.confidence}><span>{s.confidence === 'medium' ? '以前の記録（中）' : responseConfidenceLabels[s.confidence]}</span><div className="confidence-bar"><i style={{ width: `${s.total ? s.correct / s.total * 100 : 0}%` }} /></div><strong>{s.total ? `${Math.round(s.correct / s.total * 100)}%` : '—'}</strong><small>{s.correct} / {s.total} 回</small></div>)}</div></section><div className="section-heading"><div><h2>回答履歴</h2></div><span className="muted">{attempts.length}件</span></div>{attempts.length ? <div className="history-list">{[...attempts].reverse().map(a => { const q = questionById.get(a.questionId)!; return <Link key={a.id} className="history-item" to={`/record/${a.id}`}><span className={cn('history-result', isQuickAnswer(a) && a.confidence === 'unknown' ? 'history-unknown' : !a.correct && 'history-wrong')}>{a.correct ? <Check size={19} /> : isQuickAnswer(a) && a.confidence === 'unknown' ? <CircleHelp size={18} /> : <X size={18} />}</span><span className="history-info"><small>{q.course} <span>·</span> {q.topic}</small><strong>{q.title}</strong></span><span className="history-confidence">{attemptConfidenceLabel(a)}</span><time>{formatDate(a.answeredAt, true)}</time><ChevronRight size={16} /></Link>; })}</div> : <Empty icon={<BarChart3 />} title="回答履歴はありません"><Button asChild><Link to="/questions">問題を選ぶ<ArrowRight size={16} /></Link></Button></Empty>}</>;
}

function Metric({ label, value, unit, icon }: { label: string; value: number | string; unit: string; icon: ReactNode }) { return <div className="metric"><span>{icon}{label}</span><strong>{value}<small>{unit}</small></strong></div>; }

function Empty({ icon, title, description, children }: { icon: ReactNode; title: string; description?: string; children?: ReactNode }) { return <div className="empty-state"><span className="empty-icon">{icon}</span><h2>{title}</h2>{description && <p>{description}</p>}{children && <div className="actions">{children}</div>}</div>; }
