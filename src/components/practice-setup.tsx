import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router';
import { ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { courses, questions } from '@/data/questions';
import { fieldGroups, fieldIdOf, fieldsOf } from '@/data/fields';
import { useLearning } from '@/lib/store';
import { calculationFilters, matchingQuestions, normalizePracticeConfig, practiceLimits, practiceModes, practiceOrders, practiceSearch, practiceSets, practiceTargets, type PracticeConfig, type PracticeSet } from '@/lib/practice';
import type { Course } from '@/lib/model';
import { cn } from '@/lib/utils';

// The last setup is a per-browser convenience; the app works the same when storage is unavailable.
const storageKey = 'orenotameno:practice-setup';
type Saved = { course?: unknown; setups?: Partial<Record<Course, unknown>> };
function loadSaved(): Saved | null {
  try { return JSON.parse(localStorage.getItem(storageKey) ?? 'null') as Saved | null; } catch { return null; }
}

const modeLabels: Record<PracticeConfig['mode'], string> = { sets: '試験回を指定', fields: '分野を指定', mock: '模擬試験' };
const targetLabels: Record<PracticeConfig['target'], string> = { all: 'すべて', new: '未学習', review: '要復習', bookmarks: 'あとで見る' };
const calculationLabels: Record<PracticeConfig['calculation'], string> = { include: '含める', exclude: '出題しない', only: '計算問題のみ' };
const orderLabels: Record<PracticeConfig['order'], string> = { random: 'ランダム', number: '試験回・番号順' };
const courseSubtitles: Record<Course, string> = { A1: '共通知識', A2: 'セキュリティ専門知識' };

const toggled = (list: string[], id: string, on: boolean) => on ? [...new Set([...list, id])] : list.filter(item => item !== id);

export function PracticeSetup() {
  const { snapshot } = useLearning();
  const [saved] = useState(loadSaved);
  const [course, setCourse] = useState<Course>(() => saved?.course === 'A1' || saved?.course === 'A2' ? saved.course : snapshot.settings.defaultCourse);
  const [setups, setSetups] = useState<Record<Course, PracticeConfig>>(() => ({ A1: normalizePracticeConfig('A1', saved?.setups?.A1), A2: normalizePracticeConfig('A2', saved?.setups?.A2) }));
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify({ course, setups })); } catch { /* storage is optional */ }
  }, [course, setups]);
  const config = setups[course];
  const update = (patch: Partial<PracticeConfig>) => setSetups(current => ({ ...current, [course]: { ...current[course], ...patch } }));
  const sets = practiceSets(course);
  const studied = new Set(snapshot.cards.map(card => card.questionId));
  const matched = matchingQuestions(course, config, snapshot);
  const count = config.mode !== 'mock' && config.limit > 0 ? Math.min(config.limit, matched.length) : matched.length;
  const fieldCounts = new Map<string, number>();
  for (const q of questions) if (q.course === course) fieldCounts.set(fieldIdOf(q) ?? '', (fieldCounts.get(fieldIdOf(q) ?? '') ?? 0) + 1);

  const setChecklist = <SetChecklist sets={sets} selected={config.sets} onChange={selected => update({ sets: selected })} />;
  return <section className="practice-setup" aria-labelledby="practice-heading">
    <div className="section-heading subject-heading"><h2 id="practice-heading">問題を選ぶ</h2><Link className="text-link" to="/questions">すべての問題<ArrowRight size={15} /></Link></div>
    <div className="practice-card">
      <div className="practice-courses" role="group" aria-label="科目">{(['A1', 'A2'] as const).map(c => {
        const list = questions.filter(q => q.course === c);
        const done = list.filter(q => studied.has(q.id)).length;
        return <button key={c} type="button" className={cn('practice-course', course === c && 'active')} aria-pressed={course === c} onClick={() => setCourse(c)}>
          <span className="subject-symbol">{c === 'A1' ? <GraduationCap size={22} strokeWidth={1.6} /> : <ShieldCheck size={22} strokeWidth={1.6} />}</span>
          <span className="practice-course-name"><strong>{courses[c].name}</strong><small>{courseSubtitles[c]}</small></span>
          <span className="practice-course-progress"><span>学習済み {done} / {list.length}問</span><span className="progress-track"><i style={{ width: `${list.length ? done / list.length * 100 : 0}%` }} /></span></span>
        </button>;
      })}</div>

      <div className="practice-modes" role="group" aria-label="出題方法">{practiceModes.map(mode => <button key={mode} type="button" className={cn(config.mode === mode && 'active')} aria-pressed={config.mode === mode} onClick={() => update({ mode })}>{modeLabels[mode]}</button>)}</div>

      <div className="practice-panel">
        {config.mode === 'sets' && setChecklist}
        {config.mode === 'fields' && <>
          <BulkButtons label="分野" onAll={() => update({ fields: fieldsOf(course).map(field => field.id) })} onNone={() => update({ fields: [] })} />
          {fieldGroups[course].map(group => <FieldGroupChecklist key={group.name} name={group.name} fields={group.fields.map(field => ({ id: field.id, label: field.name, count: fieldCounts.get(field.id) ?? 0 }))} selected={config.fields} onChange={fields => update({ fields })} />)}
          <label className="practice-check practice-narrow"><input type="checkbox" checked={config.narrowBySets} onChange={e => update({ narrowBySets: e.target.checked })} /><span>試験回でも絞り込む</span></label>
          {config.narrowBySets && setChecklist}
        </>}
        {config.mode === 'mock' && <fieldset className="practice-fieldset">
          <legend>試験回</legend>
          <div className="practice-grid practice-grid-sets">{sets.map(set => <label key={set.id} className="practice-check"><input type="radio" name={`mock-${course}`} checked={config.mockSet === set.id} onChange={() => update({ mockSet: set.id })} /><span>{set.label}</span><small>{set.count}問</small></label>)}</div>
          <p className="practice-note">選んだ回の全問を、本番と同じ番号順に出題します。</p>
        </fieldset>}
      </div>

      {config.mode !== 'mock' && <div className="practice-settings">
        <Choice legend="出題対象" name={`target-${course}`} options={practiceTargets} labels={targetLabels} value={config.target} onChange={target => update({ target })} />
        <Choice legend="計算問題" name={`calc-${course}`} options={calculationFilters} labels={calculationLabels} value={config.calculation} onChange={calculation => update({ calculation })} />
        <Choice legend="出題順" name={`order-${course}`} options={practiceOrders} labels={orderLabels} value={config.order} onChange={order => update({ order })} />
        <label className="practice-limit"><span>出題数</span><select value={config.limit} onChange={e => update({ limit: Number(e.target.value) })}>{practiceLimits.map(limit => <option key={limit} value={limit}>{limit ? `${limit}問まで` : 'すべて'}</option>)}</select></label>
      </div>}

      <div className="practice-footer">
        <p className="practice-count" aria-live="polite">{count > 0 ? <>出題数 <strong>{count}</strong>問</> : '条件に合う問題がありません'}</p>
        {count > 0 ? <Button asChild><Link to={`/study/${course}?${practiceSearch(course, config)}`}>出題開始<ArrowRight size={17} /></Link></Button> : <Button disabled>出題開始</Button>}
      </div>
    </div>
  </section>;
}

function BulkButtons({ label, onAll, onNone }: { label: string; onAll: () => void; onNone: () => void }) {
  return <div className="practice-bulk"><button type="button" onClick={onAll} aria-label={`${label}をすべて選択`}>すべて選択</button><button type="button" onClick={onNone} aria-label={`${label}の選択をすべて解除`}>すべて解除</button></div>;
}

function SetChecklist({ sets, selected, onChange }: { sets: PracticeSet[]; selected: string[]; onChange: (selected: string[]) => void }) {
  return <fieldset className="practice-fieldset">
    <legend>試験回</legend>
    <BulkButtons label="試験回" onAll={() => onChange(sets.map(set => set.id))} onNone={() => onChange([])} />
    <div className="practice-grid practice-grid-sets">{sets.map(set => <label key={set.id} className="practice-check"><input type="checkbox" checked={selected.includes(set.id)} onChange={e => onChange(toggled(selected, set.id, e.target.checked))} /><span>{set.label}</span><small>{set.count}問</small></label>)}</div>
  </fieldset>;
}

function FieldGroupChecklist({ name, fields, selected, onChange }: { name: string; fields: { id: string; label: string; count: number }[]; selected: string[]; onChange: (selected: string[]) => void }) {
  const chosen = fields.filter(field => selected.includes(field.id)).length;
  const groupRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (groupRef.current) groupRef.current.indeterminate = chosen > 0 && chosen < fields.length; }, [chosen, fields.length]);
  const ids = fields.map(field => field.id);
  return <fieldset className="practice-fieldset">
    <legend className="practice-group-legend"><label className="practice-check practice-group"><input ref={groupRef} type="checkbox" checked={chosen === fields.length} onChange={e => onChange(e.target.checked ? [...new Set([...selected, ...ids])] : selected.filter(id => !ids.includes(id)))} /><span>{name}</span><small>{fields.reduce((sum, field) => sum + field.count, 0)}問</small></label></legend>
    <div className="practice-grid">{fields.map(field => <label key={field.id} className="practice-check"><input type="checkbox" checked={selected.includes(field.id)} onChange={e => onChange(toggled(selected, field.id, e.target.checked))} /><span>{field.label}</span><small>{field.count}問</small></label>)}</div>
  </fieldset>;
}

function Choice<T extends string>({ legend, name, options, labels, value, onChange }: { legend: ReactNode; name: string; options: readonly T[]; labels: Record<T, string>; value: T; onChange: (value: T) => void }) {
  return <div className="practice-choice" role="radiogroup" aria-labelledby={`${name}-label`}>
    <span id={`${name}-label`} className="practice-choice-label">{legend}</span>
    <div className="practice-pills">{options.map(option => <label key={option} className={cn('practice-pill', value === option && 'active')}><input className="sr-only" type="radio" name={name} checked={value === option} onChange={() => onChange(option)} />{labels[option]}</label>)}</div>
  </div>;
}
