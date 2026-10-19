// Shared pieces for figures redrawn from IPA questions. Everything is drawn with currentColor so it follows the theme.

// Wraps a figure body. `id` prefixes every id in the figure, so several figures can share a page.
// Option figures pass no title: the option text is read out instead.
export function figureSvg(id: string, width: number, height: number, title: string | null, body: string, fontSize = 15): string {
  const label = title ? `role="img" aria-labelledby="${id}-title"` : 'aria-hidden="true"';
  // max-width keeps the drawing at its natural size, so small figures are not blown up.
  return `<svg viewBox="0 0 ${width} ${height}" style="max-width:${width}px" xmlns="http://www.w3.org/2000/svg" ${label} font-size="${fontSize}" fill="currentColor">${title ? `<title id="${id}-title">${title}</title>` : ''}<defs><marker id="${id}-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 1L9 5L0 9" fill="none" stroke="currentColor" stroke-width="1.4"/></marker></defs><g fill="none" stroke="currentColor" stroke-width="1.4">${body}</g></svg>`;
}

// Open arrowhead at the end (or both ends with `both`) of a path.
export const arrow = (id: string, d: string, both = false) => `<path d="${d}" marker-end="url(#${id}-arrow)"${both ? ` marker-start="url(#${id}-arrow)"` : ''}/>`;

export function text(x: number, y: number, value: string, anchor: 'start' | 'middle' | 'end' = 'start', extra = ''): string {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="currentColor" stroke="none"${extra}>${value}</text>`;
}

// Vertical Japanese label, one character per line, as on the IPA axes.
export function verticalText(x: number, y: number, value: string, step = 16): string {
  return [...value].map((c, i) => text(x, y + i * step, c, 'middle', c === 'ー' ? ` transform="rotate(90 ${x} ${y + i * step - 5})"` : '')).join('');
}

export const dot = (x: number, y: number) => `<circle cx="${x}" cy="${y}" r="3" fill="currentColor" stroke="none"/>`;

export type GateKind = 'and' | 'nand' | 'or' | 'nor' | 'xor' | 'xnor';
// A two-input gate whose body spans x..x+40 and y..y+30. Inputs enter at y+8 and y+22, the output leaves at `out`.
export function gate(kind: GateKind, x: number, y: number): { svg: string; inX: number; out: [number, number] } {
  const negated = kind === 'nand' || kind === 'nor' || kind === 'xnor';
  const orLike = kind !== 'and' && kind !== 'nand';
  const xorLike = kind === 'xor' || kind === 'xnor';
  const body = orLike
    ? `<path d="M${x} ${y}Q${x + 9} ${y + 15} ${x} ${y + 30}Q${x + 28} ${y + 30} ${x + 40} ${y + 15}Q${x + 28} ${y} ${x} ${y}Z"/>`
    : `<path d="M${x} ${y}H${x + 25}A15 15 0 0 1 ${x + 25} ${y + 30}H${x}Z"/>`;
  const extra = xorLike ? `<path d="M${x - 6} ${y}Q${x + 3} ${y + 15} ${x - 6} ${y + 30}"/>` : '';
  const bubble = negated ? `<circle cx="${x + 43.5}" cy="${y + 15}" r="3.5"/>` : '';
  return { svg: extra + body + bubble, inX: xorLike ? x - 4 : orLike ? x + 4 : x, out: [negated ? x + 47 : x + 40, y + 15] };
}
