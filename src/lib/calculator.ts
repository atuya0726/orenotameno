export class CalcError extends Error {}

type Token = { type: 'num'; value: number } | { type: 'op'; value: string };
const OPERATORS: Record<string, string> = { '+': '+', '-': '-', '−': '-', '*': '*', '×': '*', '/': '/', '÷': '/', '^': '^', '%': '%', '(': '(', ')': ')', '（': '(', '）': ')' };

function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  const text = input.replace(/[！-～]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xfee0)).replace(/,/g, '');
  for (let i = 0; i < text.length;) {
    const c = text[i];
    if (/\s/.test(c)) { i++; continue; }
    const number = /^(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/i.exec(text.slice(i));
    if (number) { tokens.push({ type: 'num', value: Number(number[0]) }); i += number[0].length; continue; }
    if (OPERATORS[c]) { tokens.push({ type: 'op', value: OPERATORS[c] }); i++; continue; }
    throw new CalcError(`「${c}」は使えません`);
  }
  return tokens;
}

// Recursive descent: + - < * / < unary minus < ^ (right-assoc) < postfix % < number or (...)
export function evaluate(input: string): number {
  const tokens = tokenize(input);
  if (!tokens.length) throw new CalcError('式を入力してください');
  let pos = 0;
  const peek = () => tokens[pos];
  const isOp = (value: string) => peek()?.type === 'op' && peek()!.value === value;
  function expression(): number {
    let value = term();
    while (isOp('+') || isOp('-')) { const op = tokens[pos++].value; const right = term(); value = op === '+' ? value + right : value - right; }
    return value;
  }
  function term(): number {
    let value = unary();
    while (isOp('*') || isOp('/')) {
      const op = tokens[pos++].value; const right = unary();
      if (op === '/' && right === 0) throw new CalcError('0で割ることはできません');
      value = op === '*' ? value * right : value / right;
    }
    return value;
  }
  function unary(): number {
    if (isOp('-')) { pos++; return -unary(); }
    if (isOp('+')) { pos++; return unary(); }
    return power();
  }
  function power(): number {
    const base = postfix();
    if (isOp('^')) { pos++; return base ** unary(); }
    return base;
  }
  function postfix(): number {
    let value = primary();
    while (isOp('%')) { pos++; value /= 100; }
    return value;
  }
  function primary(): number {
    const token = tokens[pos++];
    if (!token) throw new CalcError('式が途中で終わっています');
    if (token.type === 'num') return token.value;
    if (token.value === '(') {
      const value = expression();
      if (!isOp(')')) throw new CalcError('閉じかっこが足りません');
      pos++; return value;
    }
    throw new CalcError('式の形が正しくありません');
  }
  const result = expression();
  if (pos < tokens.length) throw new CalcError(isOp(')') ? '開きかっこが足りません' : '式の形が正しくありません');
  if (!Number.isFinite(result)) throw new CalcError('計算結果が大きすぎます');
  return result;
}

// Round off binary floating-point noise (0.1 + 0.2) without hiding meaningful digits.
export function formatResult(value: number): string {
  if (Object.is(value, -0) || value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e15 || abs < 1e-9) return value.toExponential(10).replace(/\.?0+e/, 'e');
  return String(Number(value.toPrecision(12)));
}
