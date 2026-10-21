import { describe, expect, it } from 'vitest';
import { groupReviewWords, reviewWordKey } from './review-words';

describe('review word concepts', () => {
  it('keeps each earned value measure separate from EVM', () => {
    const words = ['EVM', 'PV', 'EV', 'AC', 'SPI', 'TCPI', 'BAC', 'CPI（コスト効率指数）'];
    const groups = groupReviewWords(words);
    expect(groups.map(group => group.word)).toEqual(words);
    expect(new Set(groups.map(group => group.term?.id)).size).toBe(words.length);
  });

  it('groups true aliases while retaining all saved spellings for removal', () => {
    const groups = groupReviewWords(['ディジタル署名', 'デジタル署名', 'DNS']);
    expect(groups).toHaveLength(2);
    expect(groups[0].term?.id).toBe('digital-signature');
    expect(groups[0].words).toEqual(['ディジタル署名', 'デジタル署名']);
    expect(reviewWordKey('ディジタル署名')).toBe(reviewWordKey('デジタル署名'));
    expect(groups[1].term?.id).toBe('dns');
  });

  it('keeps older uncollected words available for removal', () => {
    const groups = groupReviewWords(['以前の未収録用語', 'DNS']);
    expect(groups[0]).toEqual({ word: '以前の未収録用語', words: ['以前の未収録用語'], term: undefined });
    expect(groups[1].term?.id).toBe('dns');
  });
});
