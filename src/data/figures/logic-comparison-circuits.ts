import { dot, figureSvg, gate, text } from './svg';

// 令和4年度秋期 午前Ⅰ 問7。下段の二入力はそれぞれNOTを通す。
function equalityCircuit(kind: 'and' | 'or' | 'nand' | 'nor', option: string): string {
  const id = `equality-${option}`;
  const top = gate(kind, 160, 20), bottom = gate(kind, 160, 90), last = gate(kind, 250, 55);
  return figureSvg(id, 330, 140, null, [
    text(5, 32, 'X'), text(5, 46, 'Y'), text(315, 75, 'Z'),
    `<path d="M25 28H${top.inX}M25 42H${top.inX}M55 28V98H94M75 42V112H94"/>`, dot(55, 28), dot(75, 42),
    '<path d="M94 91L108 98L94 105ZM94 105L108 112L94 119Z"/><circle cx="111" cy="98" r="3"/><circle cx="111" cy="112" r="3"/>',
    `<path d="M114 98H${bottom.inX}M114 112H${bottom.inX}M${top.out[0]} ${top.out[1]}H230V63H${last.inX}M${bottom.out[0]} ${bottom.out[1]}H230V77H${last.inX}M${last.out[0]} ${last.out[1]}H310"/>`,
    top.svg, bottom.svg, last.svg,
  ].join(''));
}
export const equalityCircuits = ['and', 'or', 'nand', 'nor'].map((kind, i) => equalityCircuit(kind as 'and' | 'or' | 'nand' | 'nor', String(i)));

// 令和3年度秋期 午前Ⅰ 問7。出力Xは桁上がり、出力Yは和の下位ビット。
export const halfAdderCircuits = ([['and', 'xor'], ['or', 'xor'], ['or', 'and'], ['and', 'or']] as const).map(([upper, lower], i) => {
  const top = gate(upper, 130, 20), bottom = gate(lower, 130, 85);
  return figureSvg(`half-adder-${i}`, 240, 135, null, [
    text(5, 32, 'A'), text(5, 46, 'B'), text(210, 40, 'X'), text(210, 105, 'Y'),
    `<path d="M25 28H${top.inX}M25 42H${top.inX}M55 28V93H${bottom.inX}M75 42V107H${bottom.inX}M${top.out[0]} ${top.out[1]}H200M${bottom.out[0]} ${bottom.out[1]}H200"/>`,
    dot(55, 28), dot(75, 42), top.svg, bottom.svg,
  ].join(''));
});

// 令和3年度春期 午前Ⅰ 問1の補足図。塗りは演算結果が1になる領域。
export const booleanVennFigures = ['xnor', 'nor', 'and', 'or'].map((kind, i) => {
  const id = `boolean-venn-${i}`;
  const shape = '<circle cx="68" cy="58" r="34"/><circle cx="108" cy="58" r="34"/>';
  const circlePath = (x: number) => `M${x - 34} 58a34 34 0 1 0 68 0a34 34 0 1 0 -68 0`;
  const outsidePath = (x: number) => `M15 15H161V101H15Z${circlePath(x)}`;
  const outside = `<g clip-path="url(#${id}-outside-left)"><g clip-path="url(#${id}-outside-right)"><rect x="15" y="15" width="146" height="86" fill="currentColor" opacity=".2" stroke="none"/></g></g>`;
  const intersection = `<g clip-path="url(#${id}-left)"><circle cx="108" cy="58" r="34" fill="currentColor" opacity=".2" stroke="none"/></g>`;
  const fill = kind === 'xnor' ? outside + intersection : kind === 'nor' ? outside : kind === 'and' ? intersection : `<path d="M34 58a34 34 0 1 0 68 0a34 34 0 1 0 -68 0M74 58a34 34 0 1 0 68 0a34 34 0 1 0 -68 0" fill="currentColor" opacity=".2" stroke="none"/>`;
  return figureSvg(id, 176, 116, null, `<defs><clipPath id="${id}-left"><circle cx="68" cy="58" r="34"/></clipPath><clipPath id="${id}-outside-left"><path d="${outsidePath(68)}" clip-rule="evenodd"/></clipPath><clipPath id="${id}-outside-right"><path d="${outsidePath(108)}" clip-rule="evenodd"/></clipPath></defs>${fill}<rect x="15" y="15" width="146" height="86"/>${shape}`);
});
