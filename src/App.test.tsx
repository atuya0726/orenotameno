import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import App from './App';
import { questions } from '@/data/questions';
import { createQuickAnswer, emptySnapshot, type Snapshot } from '@/lib/model';
import { scheduleAnswer } from '@/lib/scheduler';

let snapshot: Snapshot;
vi.mock('@/lib/store', () => ({
  useLearning: () => ({ snapshot, ready: true, error: '', clearError: vi.fn(), updateDraft: vi.fn(), answer: vi.fn(), setReviewFlag: vi.fn(), setReviewTerms: vi.fn(), toggleBookmark: vi.fn() }),
  useNow: () => Date.parse('2026-10-19T03:00:00.000Z'),
}));
beforeEach(() => { snapshot = emptySnapshot(); });
function render(path: string) { return renderToStaticMarkup(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>); }

describe('answering and recorded results', () => {
  it('offers four immediate answer buttons without asking for confidence', () => {
    const html = render('/study/A1?question=sc-2025-autumn-a1-1');
    const buttons = html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) ?? [];
    const answers = buttons.filter(button => /aria-label="[アイウエ]で回答"/.test(button));
    expect(answers).toHaveLength(4);
    expect(answers.every(button => !button.includes('disabled'))).toBe(true);
    const unknown = buttons.find(button => button.includes('>わからない</'))!;
    expect(unknown).toBeDefined();
    expect(unknown).not.toContain('disabled');
    const marks = buttons.filter(button => /aria-label="[アイウエ]の印：はてな"/.test(button));
    expect(marks).toHaveLength(4);
    expect(marks.every(button => button.includes('data-mark="unknown"') && !button.includes('disabled'))).toBe(true);
    expect(html.indexOf('question-source')).toBeGreaterThan(html.indexOf('choice-text-d'));
    expect(html.indexOf('>わからない</')).toBeGreaterThan(html.indexOf('choice-text-d'));
    expect(html).not.toContain('自信あり');
    expect(html).not.toContain('迷いあり');
    expect(html).not.toContain('>迷った</');
    expect(html).not.toContain('>復習したい</');
    expect(html).not.toContain('復習したい単語リスト');
    expect(html).not.toContain('type="radio"');
    expect(html).not.toContain('これも迷った');
  });
  it('keeps an earlier draft answer available for immediate submission without the old optional controls', () => {
    snapshot.drafts = [{ questionId: 'sc-2025-autumn-a1-2', selected: 'b', uncertainOptions: ['a'] }];
    const html = render('/study/A1?question=sc-2025-autumn-a1-2');
    expect(html).toContain('aria-label="イで回答"');
    expect(html).toContain('choice-selected');
    expect(html).not.toContain('これも迷った');
    expect(html).not.toContain('choice-uncertain');
  });
  it('restores each option mark without selecting or submitting an answer', () => {
    snapshot.drafts = [{ questionId: questions[0].id, uncertainOptions: [], optionMarks: { a: 'exclude', c: 'unsure' } }];
    const html = render(`/study/A1?question=${questions[0].id}`);
    expect(html).toContain('aria-label="アの印：ばつ"');
    expect(html).toContain('aria-label="イの印：はてな"');
    expect(html).toContain('aria-label="ウの印：三角"');
    expect(html).not.toContain('choice-selected');
    expect(html).not.toContain('解答結果と解説');
  });
  it('renders an unanswered saved result without inventing an answer or assessments', () => {
    const question = questions[0];
    const input = createQuickAnswer({ questionId: question.id, uncertainOptions: [] }, 'unknown', question);
    const { attempt, card } = scheduleAnswer(input, question, undefined, new Date('2026-10-19T03:00:00.000Z'));
    snapshot.attempts = [attempt]; snapshot.cards = [card];
    const html = render(`/record/${attempt.id}`);
    expect(html).toContain('あなたの解答：未解答');
    expect(html).toContain('result-unknown');
    expect(html).not.toContain('復習はあと');
    expect(html).not.toContain('>迷った</');
    expect(html).toContain('>復習したい</');
    expect(html).not.toContain('未評価');
    expect(html).not.toContain('your-assessment');
    expect(html).not.toContain('回答時の自信');
    expect(html).not.toContain('undefined');
  });
  it('shows an earlier doubt flag as a pressed review request below the explanations', () => {
    const question = questions[0];
    const input = createQuickAnswer({ questionId: question.id, selected: question.correct, uncertainOptions: [] }, 'high', question);
    const { attempt } = scheduleAnswer(input, question, undefined, new Date('2026-10-19T03:00:00.000Z'));
    snapshot.attempts = [{ ...attempt, reviewDoubt: true }];
    const html = render(`/record/${attempt.id}`);
    const button = (html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) ?? []).find(button => button.includes('>復習したい</'))!;
    expect(button).toContain('aria-pressed="true"');
    expect(html.indexOf('review-actions')).toBeGreaterThan(html.indexOf('option-reviews'));
    expect(html).not.toContain('復習はあと');
  });
  it('shows question vocabulary and restores the saved picks beneath the review button', () => {
    const question = questions[1];
    const input = createQuickAnswer({ questionId: question.id, selected: question.correct, uncertainOptions: [] }, 'high', question);
    const { attempt } = scheduleAnswer(input, question, undefined, new Date('2026-10-19T03:00:00.000Z'));
    snapshot.attempts = [{ ...attempt, reviewTerms: ['ROC曲線'] }];
    const html = render(`/record/${attempt.id}`);
    const buttons = html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) ?? [];
    expect(buttons.find(button => button.includes('aria-label="ROC曲線を復習する"'))).toContain('aria-pressed="true"');
    expect(buttons.find(button => button.includes('aria-label="偽陽性率を復習する"'))).toContain('aria-pressed="false"');
    expect(html.indexOf('review-term-picker')).toBeGreaterThan(html.indexOf('>復習したい</'));
    expect(html).not.toContain('ポアソン分布');
  });
});
