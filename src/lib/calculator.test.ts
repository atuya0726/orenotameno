import { describe, expect, it } from 'vitest';
import { CalcError, evaluate, formatResult } from './calculator';

describe('計算機の式の評価', () => {
  it('follows operator precedence, parentheses and exam-style symbols', () => {
    expect(evaluate('1+2*3')).toBe(7);
    expect(evaluate('(1+2)×3')).toBe(9);
    expect(evaluate('10÷4−1')).toBe(1.5);
    expect(evaluate('（１＋２）×３')).toBe(9);
    expect(evaluate('1,000*3')).toBe(3000);
  });
  it('handles powers, unary minus and percent', () => {
    expect(evaluate('2^10')).toBe(1024);
    expect(evaluate('2^3^2')).toBe(512);
    expect(evaluate('-2^2')).toBe(-4);
    expect(evaluate('2^-1')).toBe(0.5);
    expect(evaluate('200*15%')).toBe(30);
    expect(evaluate('1-(1-0.9)^2')).toBeCloseTo(0.99);
  });
  it('reports malformed input instead of guessing', () => {
    expect(() => evaluate('')).toThrow(CalcError);
    expect(() => evaluate('1+')).toThrow('途中で終わっています');
    expect(() => evaluate('(1+2')).toThrow('閉じかっこ');
    expect(() => evaluate('1+2)')).toThrow('開きかっこ');
    expect(() => evaluate('5/0')).toThrow('0で割る');
    expect(() => evaluate('alert(1)')).toThrow('使えません');
  });
  it('formats away floating-point noise', () => {
    expect(formatResult(evaluate('0.1+0.2'))).toBe('0.3');
    expect(formatResult(1 / 3)).toBe('0.333333333333');
    expect(formatResult(-0)).toBe('0');
    expect(formatResult(2 ** 60)).toBe('1.1529215046e+18');
  });
});
