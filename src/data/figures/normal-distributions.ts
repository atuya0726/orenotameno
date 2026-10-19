import { figureSvg, text } from './svg';

// 令和5年度春期 午前Ⅰ 問2の選択肢のグラフ。横軸の値vを x = 130 + (v - center) × scale に置く。
const base = 105;
function graph(id: string, density: (v: number) => number, scale: number, marks: [number, string][], gap?: [number, number], center = 60): string {
  const x = (v: number) => 130 + (v - center) * scale;
  const y = (v: number) => base - 90 * density(v);
  const from = center - 120 / scale, to = center + 120 / scale;
  const points = Array.from({ length: 121 }, (_, i) => from + (to - from) * i / 120);
  const curve = `<path d="M${points.map(v => `${x(v).toFixed(1)} ${y(v).toFixed(1)}`).join('L')}"/>`;
  const dotted = marks.map(([v]) => `<path d="M${x(v)} ${base}V${y(v)}" stroke-dasharray="2 3" stroke-width="1"/>`).join('');
  const labels = marks.map(([v, label]) => text(x(v), base + 18, label, 'middle')).join('');
  const width = gap ? text((x(gap[0]) + x(gap[1])) / 2, base - 6, '10', 'middle', ' font-size="12"') : '';
  return figureSvg(id, 260, 130, null, `<path d="M5 ${base}H255"/>${curve}${dotted}${labels}${width}`, 13);
}
const bell = (mean: number, sd: number) => (v: number) => Math.exp(-((v - mean) ** 2) / (2 * sd * sd));

export const normalDistributionFigures = {
  a: graph('normal-a', bell(60, 10), 4, [[60, '60'], [70, '70']], [60, 70]),
  b: graph('normal-b', v => Math.exp(-((v - 60) ** 2) / 50) * 0.75 + 0.25 / (1 + ((v - 60) / 6) ** 2), 4, [[55, '55'], [60, '60'], [65, '65']], [55, 65]),
  c: graph('normal-c', v => 0.35 * Math.exp(-((v - 10) ** 2) / 12) + 0.12 * Math.exp(-((v - 30) ** 2) / 300) + Math.exp(-((v - 60) ** 2) / 80), 3, [[10, '10'], [60, '60']], undefined, 42),
  d: graph('normal-d', v => v < 60 ? Math.exp(-((v - 60) ** 2) / (2 * 18 * 18)) : Math.exp(-((v - 60) ** 2) / (2 * 7 * 7)), 4, [[50, '50'], [60, '60']], [50, 60]),
};
