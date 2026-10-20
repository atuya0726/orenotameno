import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router';
import App from './App';
import { questions } from '@/data/questions';
import { createQuickAnswer, emptySnapshot, type Snapshot } from '@/lib/model';
import { scheduleAnswer } from '@/lib/scheduler';

let snapshot: Snapshot;
vi.mock('@/lib/store', () => ({
  useLearning: () => ({ snapshot, ready: true, error: '', clearError: vi.fn(), updateDraft: vi.fn(), answer: vi.fn(), setReviewFlag: vi.fn(), setReviewWord: vi.fn(), toggleBookmark: vi.fn() }),
  useNow: () => Date.parse('2026-10-19T03:00:00.000Z'),
}));
beforeEach(() => { snapshot = emptySnapshot(); });
function render(path: string) { return renderToStaticMarkup(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>); }

describe('answering and recorded results', () => {
  it.each([
    { total: 5, correct: 3, unknown: 1, percent: '60', target: '60%以上を達成', reached: true },
    { total: 5, correct: 4, unknown: 0, percent: '80', target: '60%以上を達成', reached: true },
    { total: 5, correct: 2, unknown: 2, percent: '40', target: '60%まであと1問正解', reached: false },
    { total: 42, correct: 25, unknown: 3, percent: '59.5', target: '60%まであと1問正解', reached: false },
    { total: 5, correct: 0, unknown: 5, percent: '0', target: '60%まであと3問正解', reached: false },
  ])('summarizes completion at $correct / $total with $unknown unknown answers', ({ total, correct, unknown, percent, target, reached }) => {
    const queue = questions.filter(question => question.course === 'A1').slice(0, total);
    snapshot.attempts = queue.map((question, index) => {
      const confidence = index >= total - unknown ? 'unknown' : 'high';
      const selected = index < correct ? question.correct : question.options.find(option => option.id !== question.correct)!.id;
      return scheduleAnswer(createQuickAnswer({ questionId: question.id, selected, uncertainOptions: [] }, confidence, question), question).attempt;
    });
    snapshot.studySessions = [{
      id: 'completed', path: '/study/A1', questionIds: queue.map(question => question.id),
      index: total, attemptIds: snapshot.attempts.map(attempt => attempt.id), updatedAt: '2026-10-19T03:00:00.000Z',
    }];
    const html = render('/study/A1?session=completed');
    expect(html).toContain(`<strong>${percent}<small>%</small></strong>`);
    expect(html).toContain(target);
    expect(html.includes('completion-score-reached')).toBe(reached);
    expect(html).toContain(`<strong>${unknown}<small>問</small></strong><span>わからなかった問題</span>`);
    expect(html).not.toContain('自信あり');
  });
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
    expect(html).not.toContain('>復習リストに追加</');
    expect(html).not.toContain('復習したい単語を選択');
    expect(html).not.toContain('type="radio"');
    expect(html).not.toContain('これも迷った');
    expect(html).not.toContain('pill-green');
    expect(html).not.toContain('question-number');
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
    expect(html).not.toContain('あなたの解答：');
    expect(html).not.toContain('正解：');
    expect(html).toContain('result-unknown');
    expect(html).not.toContain('復習はあと');
    expect(html).not.toContain('>迷った</');
    expect(html).not.toContain('>復習リストに追加</');
    expect(html).not.toContain('未評価');
    expect(html).not.toContain('your-assessment');
    expect(html).not.toContain('回答時の自信');
    expect(html).not.toContain('undefined');
  });
  it('hides the review request after an incorrect answer', () => {
    const question = questions[0];
    const wrong = question.options.find(option => option.id !== question.correct)!.id;
    const input = createQuickAnswer({ questionId: question.id, selected: wrong, uncertainOptions: [] }, 'high', question);
    const { attempt } = scheduleAnswer(input, question, undefined, new Date('2026-10-19T03:00:00.000Z'));
    snapshot.attempts = [attempt];
    const html = render(`/record/${attempt.id}`);
    expect(html).toContain('もう一度解く');
    expect(html).not.toContain('>復習リストに追加</');
  });
  it('shows an earlier doubt flag as a pressed review request below the explanations', () => {
    const question = questions[0];
    const input = createQuickAnswer({ questionId: question.id, selected: question.correct, uncertainOptions: [] }, 'high', question);
    const { attempt } = scheduleAnswer(input, question, undefined, new Date('2026-10-19T03:00:00.000Z'));
    snapshot.attempts = [{ ...attempt, reviewDoubt: true }];
    const html = render(`/record/${attempt.id}`);
    const button = (html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) ?? []).find(button => button.includes('>復習リストに追加</'))!;
    expect(button).toContain('aria-pressed="true"');
    expect(html.indexOf('review-actions')).toBeGreaterThan(html.indexOf('option-reviews'));
    expect(html).not.toContain('復習はあと');
  });
  it('shows saved word picks before the review action and places the official answer beneath option explanations', () => {
    const question = questions[1];
    const input = createQuickAnswer({ questionId: question.id, selected: question.correct, uncertainOptions: [] }, 'high', question);
    const { attempt } = scheduleAnswer(input, question, undefined, new Date('2026-10-19T03:00:00.000Z'));
    snapshot.attempts = [{ ...attempt, reviewTerms: ['ROC曲線'] }];
    snapshot.reviewWords = ['ROC曲線'];
    const html = render(`/record/${attempt.id}`);
    const buttons = html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) ?? [];
    expect(buttons.find(button => button.includes('aria-label="ROC曲線を復習する"'))).toContain('aria-pressed="true"');
    expect(buttons.find(button => button.includes('aria-label="偽陽性率を復習する"'))).toContain('aria-pressed="false"');
    expect(html.indexOf('official-answer-source')).toBeGreaterThan(html.indexOf('option-reviews'));
    expect(html.indexOf('official-answer-source')).toBeLessThan(html.indexOf('review-term-picker'));
    expect(html.indexOf('review-term-picker')).toBeLessThan(html.indexOf('result-actions'));
    expect(html.indexOf('>復習リストに追加</')).toBeLessThan(html.indexOf('もう一度解く'));
    expect(html).not.toContain('ポアソン分布');
    expect(html).toContain('復習したい単語を選択');
    expect(html).not.toContain('語選択中');
    expect(html).not.toContain('意味がよくわからなかった');
  });
  it('selects a word registered from another question and counts it once in the review notebook', () => {
    const question = questions[14];
    const { attempt } = scheduleAnswer(createQuickAnswer({ questionId: question.id, selected: question.correct, uncertainOptions: [] }, 'high', question), question);
    snapshot.attempts = [attempt];
    snapshot.reviewWords = ['デジタル署名'];
    const html = render(`/record/${attempt.id}`);
    const button = (html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g) ?? []).find(button => button.includes('aria-label="デジタル署名を復習する"'))!;
    expect(button).toContain('aria-pressed="true"');
    const notebook = render('/reviews');
    expect(notebook).toContain('復習する単語');
    expect(notebook).toContain('<strong>1<small>語</small></strong>');
    expect(notebook).toContain('href="/glossary/review"');
  });
});
