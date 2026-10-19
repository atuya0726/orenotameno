import { figureSvg, gate, text, type GateKind } from './svg';

// 令和6年度春期 午前Ⅰ 問7のタイムチャートと，選択肢の論理素子。
const id = 'timing-chart';
const edges = [60, 110, 160, 210, 260, 310, 360, 410];
const signals: [string, number, number[]][] = [
  ['A', 20, [0, 0, 1, 0, 1, 0, 1]], ['B', 75, [1, 0, 1, 0, 1, 0, 0]], ['Y', 130, [1, 1, 0, 1, 0, 1, 1]],
];
function wave(top: number, values: number[]): string {
  const y = (v: number) => v ? top : top + 25;
  return `<path d="M${edges[0]} ${y(values[0])}${values.map((v, i) => `${i ? `V${y(v)}` : ''}H${edges[i + 1]}`).join('')}"/>`;
}
const body = [
  ...edges.slice(1, -1).map(x => `<path d="M${x} 10V168" stroke-dasharray="2 4" stroke-width="1"/>`),
  ...signals.map(([name, top, values]) => text(18, top + 17, name) + text(42, top + 5, '1') + text(42, top + 30, '0') + wave(top, values)),
].join('');

export const timingChartFigure = figureSvg(id, 430, 175,
  'タイムチャート。7区間の値は，Aが0，0，1，0，1，0，1，Bが1，0，1，0，1，0，0，Yが1，1，0，1，0，1，1。', body);

function gateOption(optionId: string, kind: GateKind): string {
  const g = gate(kind, 45, 8);
  const body = [text(8, 21, 'A'), text(8, 40, 'B'), `<path d="M22 16H${g.inX}M22 30H${g.inX}"/>`, g.svg, `<path d="M${g.out[0]} 23H110"/>`, text(115, 28, 'Y')].join('');
  return figureSvg(`gate-${optionId}`, 135, 46, null, body);
}

export const timingChartGateFigures = { a: gateOption('a', 'xor'), b: gateOption('b', 'xnor'), c: gateOption('c', 'nand'), d: gateOption('d', 'nor') };
