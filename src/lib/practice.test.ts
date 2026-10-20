import { describe, expect, it } from 'vitest';
import { questions } from '@/data/questions';
import { buildPracticeQueue, defaultPracticeConfig, matchingQuestions, normalizePracticeConfig, parsePracticeSearch, practiceSearch, practiceSets, type PracticeConfig } from './practice';
import type { ReviewCard } from './model';

const empty = { cards: [] as ReviewCard[], bookmarks: [] as string[] };
const card = (questionId: string, remainingReviews: number): ReviewCard => ({ questionId, requiredReviews: 3, remainingReviews, lastAttemptId: 'x', updatedAt: '2026-10-19T00:00:00.000Z', reason: '' });
const config = (patch: Partial<PracticeConfig>): PracticeConfig => ({ ...defaultPracticeConfig('A1'), ...patch });

describe('practice setup', () => {
  it('lists exam sessions of a course from newest to oldest', () => {
    const sets = practiceSets('A1');
    expect(sets.map(set => set.label)).toEqual(['令和7年度秋期', '令和7年度春期', '令和6年度秋期', '令和6年度春期', '令和5年度秋期', '令和5年度春期']);
    expect(sets.every(set => set.count === 30)).toBe(true);
    expect(practiceSets('A2')).toEqual([
      { id: 'sc-2025-autumn-a2', label: '令和7年度秋期', count: 25 }, { id: 'sc-2025-spring-a2', label: '令和7年度春期', count: 25 },
      { id: 'sc-2024-autumn-a2', label: '令和6年度秋期', count: 25 }, { id: 'sc-2024-spring-a2', label: '令和6年度春期', count: 25 },
      { id: 'sc-2023-autumn-a2', label: '令和5年度秋期', count: 25 }, { id: 'sc-2023-spring-a2', label: '令和5年度春期', count: 25 },
      { id: 'sc-2022-autumn-a2', label: '令和4年度秋期', count: 25 }, { id: 'sc-2022-spring-a2', label: '令和4年度春期', count: 25 },
    ]);
  });
  it('starts with every session and field selected, in random order without a limit', () => {
    expect(matchingQuestions('A1', defaultPracticeConfig('A1'), empty)).toHaveLength(180);
    expect(defaultPracticeConfig('A1')).toMatchObject({ mode: 'sets', order: 'random', limit: 0, target: 'all', calculation: 'include' });
  });
  it('filters by session, field, calculation and learning state', () => {
    expect(matchingQuestions('A1', config({ sets: ['sc-2024-spring-a1'] }), empty).every(q => q.id.startsWith('sc-2024-spring-a1-'))).toBe(true);
    const projects = matchingQuestions('A1', config({ mode: 'fields', fields: ['project'] }), empty);
    expect(projects.length).toBeGreaterThan(0);
    expect(projects.every(q => q.topic === 'プロジェクト管理')).toBe(true);
    const narrowed = matchingQuestions('A1', config({ mode: 'fields', fields: ['project'], narrowBySets: true, sets: ['sc-2023-autumn-a1'] }), empty);
    expect(narrowed.map(q => q.number)).toEqual(projects.filter(q => q.id.startsWith('sc-2023-autumn-a1-')).map(q => q.number));
    // Sessions are ignored in the field tab unless narrowing is on.
    expect(matchingQuestions('A1', config({ mode: 'fields', fields: ['project'], sets: [] }), empty)).toHaveLength(projects.length);
    expect(matchingQuestions('A1', config({ calculation: 'only' }), empty).every(q => q.kind === 'calculation')).toBe(true);
    expect(matchingQuestions('A1', config({ calculation: 'exclude' }), empty).every(q => q.kind === 'knowledge')).toBe(true);
    const snapshot = { cards: [card('sc-2025-autumn-a1-1', 2), card('sc-2025-autumn-a1-2', 0)], bookmarks: ['sc-2024-autumn-a1-5'] };
    expect(matchingQuestions('A1', config({ target: 'review' }), snapshot).map(q => q.id)).toEqual(['sc-2025-autumn-a1-1']);
    expect(matchingQuestions('A1', config({ target: 'bookmarks' }), snapshot).map(q => q.id)).toEqual(['sc-2024-autumn-a1-5']);
    expect(matchingQuestions('A1', config({ target: 'new' }), snapshot)).toHaveLength(178);
  });
  it('shuffles and limits a session, or keeps exam order', () => {
    const ordered = buildPracticeQueue('A1', config({ order: 'number', limit: 3 }), empty);
    expect(ordered.map(q => q.id)).toEqual(['sc-2025-autumn-a1-1', 'sc-2025-autumn-a1-2', 'sc-2025-autumn-a1-3']);
    const shuffled = buildPracticeQueue('A1', config({ limit: 20 }), empty, () => 0.42);
    expect(shuffled).toHaveLength(20);
    expect(new Set(shuffled.map(q => q.id)).size).toBe(20);
    expect(shuffled.map(q => q.id)).not.toEqual(matchingQuestions('A1', config({}), empty).slice(0, 20).map(q => q.id));
  });
  it('runs a mock exam as one whole session in question order', () => {
    const mock = buildPracticeQueue('A1', config({ mode: 'mock', mockSet: 'sc-2023-spring-a1', limit: 10, calculation: 'only', target: 'review' }), empty, () => 0.9);
    expect(mock.map(q => q.number)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
    expect(mock.every(q => q.id.startsWith('sc-2023-spring-a1-'))).toBe(true);
  });
  it('round-trips the setup through the study URL and drops unknown values', () => {
    const setup = config({ mode: 'fields', fields: ['project', 'audit'], narrowBySets: true, sets: ['sc-2025-spring-a1'], target: 'new', calculation: 'exclude', order: 'number', limit: 20 });
    const search = practiceSearch('A1', setup);
    expect(parsePracticeSearch('A1', new URLSearchParams(search))).toEqual(setup);
    expect(practiceSearch('A1', defaultPracticeConfig('A1'))).toBe('by=sets');
    expect(parsePracticeSearch('A1', new URLSearchParams('by=sets'))).toEqual(defaultPracticeConfig('A1'));
    expect(parsePracticeSearch('A1', new URLSearchParams('mode=review'))).toBeNull();
    expect(parsePracticeSearch('A1', new URLSearchParams('by=sets&sets=nope,sc-2024-autumn-a1&target=odd&limit=-4'))).toMatchObject({ sets: ['sc-2024-autumn-a1'], target: 'all', limit: 0 });
    expect(normalizePracticeConfig('A2', { broken: true })).toEqual(defaultPracticeConfig('A2'));
    expect(questions.length).toBeGreaterThan(180);
  });
});
