import { describe, expect, it } from 'vitest';
import { questions } from './questions';
import { getQuestionTerms } from './question-terms';

describe('question vocabulary candidates', () => {
  it('covers every question with unique terms that actually occur in its content', () => {
    for (const question of questions) {
      const candidates = getQuestionTerms(question);
      expect(candidates.length, question.id).toBeGreaterThan(0);
      expect(new Set(candidates).size).toBe(candidates.length);
      const content = [question.title, question.prompt, question.explanation, question.details?.title,
        ...(question.details?.items ?? []), question.table?.caption, ...(question.table?.headers ?? []),
        ...(question.table?.rows.flat() ?? []), ...question.options.flatMap(option => [option.text, option.explanation])].join('\n');
      for (const term of candidates) expect(content, `${question.id}: ${term}`).toContain(term);
    }
  });
  it('keeps vocabulary specific to each question and avoids unrelated glossary terms', () => {
    expect(getQuestionTerms(questions[1])).toEqual(['機械学習', '2クラス分類', 'ROC曲線', '偽陽性率']);
    expect(getQuestionTerms(questions[0])).toContain('ポアソン分布');
    expect(getQuestionTerms(questions[1])).not.toContain('ポアソン分布');
    expect(getQuestionTerms({ id: 'not-included' })).toEqual([]);
  });
});
