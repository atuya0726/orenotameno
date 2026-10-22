import { arrow, figureSvg, text, verticalText } from './svg';

// 令和3年度春期 午前Ⅰ 問5。直列2台の経路を2本、並列に置く。
const aid = 'availability-four';
export const fourDeviceAvailabilityFigure = figureSvg(aid, 380, 150, '稼働率xの装置を2台直列にした経路が2本あり、それらを並列に接続する。', [
  '<path d="M15 75H50V40H90M50 75V110H90M150 40H210M150 110H210M270 40H315V110H270M315 75H360"/>',
  ...[40, 110].flatMap(y => [90, 210].map(x => `<rect x="${x}" y="${y - 20}" width="60" height="40"/>${text(x + 30, y + 5, 'x', 'middle')}`)),
].join(''));
const availabilityFunctions = [
  (x: number) => Math.sqrt(x), (x: number) => x * x,
  (x: number) => x + 0.5 * Math.sin(2 * Math.PI * x) / Math.PI,
  (x: number) => 1 - (1 - x * x) ** 2,
];
export const availabilityTrendFigures = availabilityFunctions.map((fn, i) => {
  const id = `availability-trend-${i}`;
  const points = Array.from({ length: 81 }, (_, n) => { const x = n / 80; return `${n ? 'L' : 'M'}${35 + 160 * x} ${190 - 160 * fn(x)}`; }).join('');
  return figureSvg(id, 230, 220, null, [
    arrow(id, 'M35 190V15'), arrow(id, 'M35 190H215'),
    '<path d="M35 190L195 30" stroke-dasharray="5 4"/>', `<path d="${points}" stroke-width="2"/>`,
    text(23, 207, '0'), text(21, 35, '1'), text(192, 207, '1'), text(218, 195, 'x'), text(30, 13, 'y'),
  ].join(''));
});

// 令和3年度秋期 午前Ⅰ 問17。破線は予定、実線は実績。
const chartLabels = ['残作業量', '発生不具合数', '累積バグ数', '要員数'];
const solid = ['M40 35L94 58L143 65L200 180', 'M40 35C45 150 55 160 120 157S180 135 200 45', 'M40 180C65 172 70 85 110 60S170 50 200 50', 'M40 163H70V120H120V70H185V160H207'];
const dashed = ['M40 35L200 180', 'M40 55C45 175 55 180 120 174S180 155 200 60', 'M40 180C65 165 72 70 115 43S175 30 200 30', 'M40 163H80V135H105V80H170V172H207'];
export const burndownChartFigures = chartLabels.map((label, i) => {
  const id = `burndown-choice-${i}`;
  return figureSvg(id, 250, 215, null, [arrow(id, 'M40 183V15'), arrow(id, 'M40 183H220'), verticalText(19, 28, label), text(218, 202, '時間', 'end'), `<path d="${dashed[i]}" stroke-dasharray="5 4"/><path d="${solid[i]}" stroke-width="2"/>`].join(''), 13);
});
