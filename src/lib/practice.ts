import { z } from 'zod';
import { questions as allQuestions } from '@/data/questions';
import { eraLabel } from '@/data/ipa';
import { fieldIdOf, fieldsOf } from '@/data/fields';
import { activeReviews } from './scheduler';
import type { Course, Question, Snapshot } from './model';

// Practice setup modelled on 過去問道場: pick exam sessions or fields (optionally narrowed by session),
// or take one session in order like a mock exam. The setup travels to the study page as URL parameters.
export const practiceModes = ['sets', 'fields', 'mock'] as const;
export const practiceTargets = ['all', 'new', 'review', 'bookmarks'] as const;
export const calculationFilters = ['include', 'exclude', 'only'] as const;
export const practiceOrders = ['random', 'number'] as const;
export const practiceLimits = [0, 10, 20, 30, 50] as const;

export const practiceConfigSchema = z.object({
  mode: z.enum(practiceModes), sets: z.array(z.string()), fields: z.array(z.string()), narrowBySets: z.boolean(), mockSet: z.string(),
  target: z.enum(practiceTargets), calculation: z.enum(calculationFilters), order: z.enum(practiceOrders), limit: z.number().int().min(0).max(1000),
});
export type PracticeConfig = z.infer<typeof practiceConfigSchema>;

export type PracticeSet = { id: string; label: string; count: number };
const setIdOf = (question: Pick<Question, 'id'>) => question.id.replace(/-\d+$/, '');

// Exam sessions of a course, newest first.
export function practiceSets(course: Course, list: readonly Question[] = allQuestions): PracticeSet[] {
  const sets = new Map<string, PracticeSet & { order: number }>();
  for (const q of list) {
    if (q.course !== course) continue;
    const id = setIdOf(q);
    const found = sets.get(id);
    if (found) { found.count++; continue; }
    const order = q.source.kind === 'ipa' ? q.source.year * 2 + (q.source.season === 'autumn' ? 1 : 0) : 0;
    sets.set(id, { id, label: q.source.kind === 'ipa' ? eraLabel(q.source) : id, count: 1, order });
  }
  return [...sets.values()].sort((a, b) => b.order - a.order).map(({ id, label, count }) => ({ id, label, count }));
}

export function defaultPracticeConfig(course: Course, list: readonly Question[] = allQuestions): PracticeConfig {
  const sets = practiceSets(course, list).map(set => set.id);
  return { mode: 'sets', sets, fields: fieldsOf(course).map(field => field.id), narrowBySets: false, mockSet: sets[0] ?? '', target: 'all', calculation: 'include', order: 'random', limit: 0 };
}

// Keeps only sessions and fields that still exist, e.g. after a saved setup outlives a data change.
export function normalizePracticeConfig(course: Course, value: unknown, list: readonly Question[] = allQuestions): PracticeConfig {
  const fallback = defaultPracticeConfig(course, list);
  const parsed = practiceConfigSchema.safeParse(value);
  if (!parsed.success) return fallback;
  const setIds = new Set(fallback.sets);
  const fieldIds = new Set(fallback.fields);
  const config = parsed.data;
  return { ...config, sets: config.sets.filter(id => setIds.has(id)), fields: config.fields.filter(id => fieldIds.has(id)), mockSet: setIds.has(config.mockSet) ? config.mockSet : fallback.mockSet };
}

const usesSets = (config: PracticeConfig) => config.mode === 'sets' || (config.mode === 'fields' && config.narrowBySets);

export function matchingQuestions(course: Course, config: PracticeConfig, snapshot: Pick<Snapshot, 'cards' | 'bookmarks'>, list: readonly Question[] = allQuestions): Question[] {
  const inCourse = list.filter(q => q.course === course);
  if (config.mode === 'mock') return inCourse.filter(q => setIdOf(q) === config.mockSet).sort((a, b) => a.number - b.number);
  const sets = new Set(config.sets);
  const fields = new Set(config.fields);
  const studied = new Set(snapshot.cards.map(card => card.questionId));
  const due = new Set(activeReviews(snapshot.cards).map(card => card.questionId));
  const bookmarks = new Set(snapshot.bookmarks);
  const setOrder = practiceSets(course, list).map(set => set.id);
  return inCourse.filter(q => (!usesSets(config) || sets.has(setIdOf(q)))
    && (config.mode !== 'fields' || fields.has(fieldIdOf(q) ?? ''))
    && (config.calculation === 'include' || (config.calculation === 'only') === (q.kind === 'calculation'))
    && (config.target === 'all' || (config.target === 'new' && !studied.has(q.id)) || (config.target === 'review' && due.has(q.id)) || (config.target === 'bookmarks' && bookmarks.has(q.id))))
    .sort((a, b) => setOrder.indexOf(setIdOf(a)) - setOrder.indexOf(setIdOf(b)) || a.number - b.number);
}

// The questions for one session: matching questions in random or exam order, cut to the chosen count.
export function buildPracticeQueue(course: Course, config: PracticeConfig, snapshot: Pick<Snapshot, 'cards' | 'bookmarks'>, random = Math.random, list: readonly Question[] = allQuestions): Question[] {
  const matched = matchingQuestions(course, config, snapshot, list);
  if (config.mode !== 'mock' && config.order === 'random') {
    for (let i = matched.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [matched[i], matched[j]] = [matched[j], matched[i]];
    }
  }
  return config.limit > 0 && config.mode !== 'mock' ? matched.slice(0, config.limit) : matched;
}

// URL form: /study/A1?by=sets&sets=…&target=new… Lists that cover everything are omitted to keep links short.
export function practiceSearch(course: Course, config: PracticeConfig, list: readonly Question[] = allQuestions): string {
  const fallback = defaultPracticeConfig(course, list);
  const params = new URLSearchParams({ by: config.mode });
  if (config.mode === 'mock') { params.set('set', config.mockSet); return params.toString(); }
  if (usesSets(config) && config.sets.length !== fallback.sets.length) params.set('sets', config.sets.join(','));
  if (config.mode === 'fields') {
    if (config.fields.length !== fallback.fields.length) params.set('fields', config.fields.join(','));
    if (config.narrowBySets) params.set('narrow', '1');
  }
  if (config.target !== 'all') params.set('target', config.target);
  if (config.calculation !== 'include') params.set('calc', config.calculation);
  if (config.order !== 'random') params.set('order', config.order);
  if (config.limit > 0) params.set('limit', String(config.limit));
  return params.toString();
}

export function parsePracticeSearch(course: Course, params: URLSearchParams, list: readonly Question[] = allQuestions): PracticeConfig | null {
  const mode = params.get('by');
  if (!practiceModes.includes(mode as PracticeConfig['mode'])) return null;
  const fallback = defaultPracticeConfig(course, list);
  const listParam = (key: string, all: string[]) => params.has(key) ? params.get(key)!.split(',').filter(Boolean) : all;
  const pick = <T extends string>(value: string | null, options: readonly T[], otherwise: T) => options.includes(value as T) ? value as T : otherwise;
  return normalizePracticeConfig(course, {
    mode, sets: listParam('sets', fallback.sets), fields: listParam('fields', fallback.fields), narrowBySets: params.get('narrow') === '1',
    mockSet: params.get('set') ?? fallback.mockSet, target: pick(params.get('target'), practiceTargets, 'all'),
    calculation: pick(params.get('calc'), calculationFilters, 'include'), order: pick(params.get('order'), practiceOrders, 'random'),
    limit: Math.max(0, Number.parseInt(params.get('limit') ?? '0', 10) || 0),
  }, list);
}
