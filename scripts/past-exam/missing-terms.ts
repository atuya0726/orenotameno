// Lists question words that open no glossary term, grouped by question, to plan the next glossary additions.
// Usage: npx tsx scripts/past-exam/missing-terms.ts [question-id-prefix]
import { questions } from '../../src/data/questions';
import { getQuestionTerms } from '../../src/data/question-terms';
import { termForWord } from '../../src/features/glossary/terms';

const prefix = process.argv[2] ?? '';
let count = 0;
for (const question of questions.filter(q => q.id.startsWith(prefix))) {
  const missing = getQuestionTerms(question).filter(word => !termForWord(word));
  if (!missing.length) continue;
  count += missing.length;
  console.log(`${question.id} ${question.title}: ${missing.join(' / ')}`);
}
console.log(`${count} words without a glossary term`);
