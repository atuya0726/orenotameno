import { normalizeTermWord, termForWord } from './terms';

// Keep the saved spellings for removal, but practice each glossary concept once.
export function reviewWordKey(word: string): string {
  return termForWord(word)?.id ?? `word:${normalizeTermWord(word)}`;
}

export function groupReviewWords(words: readonly string[]) {
  const groups = new Map<string, { word: string; words: string[]; term: ReturnType<typeof termForWord> }>();
  for (const word of words) {
    const key = reviewWordKey(word);
    const group = groups.get(key);
    if (group) { if (!group.words.includes(word)) group.words.push(word); }
    else groups.set(key, { word, words: [word], term: termForWord(word) });
  }
  return [...groups.values()];
}
