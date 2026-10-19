import { describe, expect, it } from 'vitest';
import { questions } from './questions';
import { getQuestionTerms } from './question-terms';
import { normalizeTermWord, termForWord, terms } from '@/features/glossary/terms';

describe('question vocabulary candidates', () => {
  it('covers every question with unique terms that actually occur in its content', () => {
    for (const question of questions) {
      const candidates = getQuestionTerms(question);
      expect(candidates.length, question.id).toBeGreaterThan(0);
      expect(new Set(candidates).size).toBe(candidates.length);
      const content = [question.title, question.prompt, question.explanation, question.details?.title,
        ...(question.details?.items ?? []), question.code?.text, question.table?.caption, ...(question.table?.headers ?? []),
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
  it('opens a glossary term for every question word, with no spelling shared by two terms', () => {
    const missing = questions.flatMap(question => getQuestionTerms(question).filter(word => !termForWord(word)).map(word => `${question.id}: ${word}`));
    expect(missing, 'add terms or aliases (npx tsx scripts/past-exam/missing-terms.ts)').toEqual([]);
    const owners = new Map<string, string>();
    for (const term of terms) for (const word of new Set([term.name, ...(term.aliases ?? [])].map(normalizeTermWord))) {
      expect(owners.get(word), `${word} names both ${owners.get(word)} and ${term.id}`).toBeUndefined();
      owners.set(word, term.id);
    }
  });
  it('opens a separate term for each certificate purpose while preserving server spelling variants', () => {
    const certificates = ['サーバ証明書', 'クライアント証明書', 'コードサイニング証明書', 'EV SSL証明書'].map(termForWord);
    expect(certificates.every(Boolean)).toBe(true);
    expect(new Set(certificates.map(term => term?.id)).size).toBe(4);
    expect(termForWord('サーバー証明書')).toBe(certificates[0]);
    expect(termForWord('サーバ証明書')?.id).toBe('certificates');
    for (const term of certificates) {
      expect(term?.criteria).toHaveLength(1);
      expect(term?.criteria[0].level ?? 'B').toBe('B');
    }
  });
});
