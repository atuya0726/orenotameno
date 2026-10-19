import { figureSvg, text } from './svg';

// 令和5年度秋期 午前Ⅰ 問19の図1・図2（アローダイアグラム）。
const id = 'arrow-diagram-split';
const r = 14;
type Point = [number, number];

function edge(from: Point, to: Point, name: string, days: string, opts: { bold?: boolean; dummy?: boolean; nameAt?: Point; daysAt?: Point } = {}): string {
  const [dx, dy] = [to[0] - from[0], to[1] - from[1]];
  const len = Math.hypot(dx, dy);
  const [ux, uy] = [dx / len, dy / len];
  const d = `M${from[0] + ux * r} ${from[1] + uy * r}L${to[0] - ux * (r + 1)} ${to[1] - uy * (r + 1)}`;
  const style = opts.dummy ? ' stroke-dasharray="2 3"' : opts.bold ? ' stroke-width="2.6"' : '';
  const [mx, my] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2];
  const nameAt = opts.nameAt ?? [mx, my - 6];
  const daysAt = opts.daysAt ?? [mx, my + 16];
  return `<path d="${d}" marker-end="url(#${id}-arrow)"${style}/>` + (name ? text(nameAt[0], nameAt[1], name, 'middle') : '') + (days ? text(daysAt[0], daysAt[1], days, 'middle') : '');
}
const node = ([x, y]: Point) => `<circle cx="${x}" cy="${y}" r="${r}"/>`;

function network(top: number, split: boolean): string {
  const [n1, n2, n3, n4]: Point[] = [[30, top], [120, top], [220, top], [320, top]];
  const bottom = top + (split ? 140 : 110);
  const [n5, n6, n7, n8]: Point[] = [[220, bottom], [320, bottom], [420, bottom], [520, bottom]];
  const nodes = [n1, n2, n3, n4, n5, n6, n7, n8];
  const edges = [
    edge(n1, n2, 'A', '5'), edge(n2, n3, 'B', '8'), edge(n3, n4, 'D', '7'),
    edge(n2, n5, 'C', '7', { nameAt: [182, top + 45], daysAt: [150, top + (split ? 70 : 62)] }),
    edge(n5, n6, 'F', '5'), edge(n6, n7, 'H', '4'), edge(n7, n8, 'I', '2'),
    edge(n4, n8, 'G', '7', { nameAt: [440, top + 30], daysAt: split ? [440, top + 98] : [428, top + 72] }),
  ];
  if (!split) return [...nodes.map(node), ...edges, edge(n3, n6, 'E', '9', { bold: true, nameAt: [290, top + 45], daysAt: [258, top + 65] })].join('');
  const m1: Point = [240, top + 75];
  const m2: Point = [330, top + 62];
  return [...nodes, m1, m2].map(node).join('') + edges.join('') + [
    edge(n3, m1, 'E1', '3', { bold: true, nameAt: [254, top + 42], daysAt: [214, top + 45] }),
    edge(n3, m2, 'E2', '4', { bold: true, nameAt: [310, top + 30], daysAt: [282, top + 55] }),
    edge(m2, m1, '', '', { dummy: true }),
    edge(m1, n6, 'E3', '2', { bold: true, nameAt: [298, top + 96], daysAt: [262, top + 120] }),
  ].join('');
}

const body = [
  network(30, false), text(220, 180, '図1　当初の計画', 'middle'),
  network(230, true), text(220, 410, '図2　変更後の計画', 'middle'),
  text(30, 450, '凡例'), node([90, 470]), node([190, 470]), edge([90, 470], [190, 470], '作業名', '所要日数'),
  `<path d="M250 470H300" stroke-dasharray="2 3" marker-end="url(#${id}-arrow)"/>`, text(306, 475, '：ダミー作業'),
].join('');

export const arrowDiagramSplitFigure = figureSvg(id, 550, 500,
  '図1：A（5日）→B（8日）の後，D（7日）→G（7日），E（9日）→H（4日）→I（2日）の経路がある。AからC（7日）→F（5日）を経てHに合流する。図2：Eを，Bの後に並行するE1（3日）とE2（4日）に分け，E2の後のダミー作業でE1の終点に合流し，E3（2日）を経てHの開始点につなぐ。', body);
