import { arrow, figureSvg, text } from './svg';

const box = (x: number, y: number, name: string, days?: string) => `<rect x="${x}" y="${y}" width="82" height="48"/>${text(x + 41, y + (days ? 19 : 29), name, 'middle')}${days ? text(x + 41, y + 39, days, 'middle') : ''}`;
const pid = 'lead-lag-schedule';
export const leadLagScheduleFigure = figureSvg(pid, 440, 320, 'Aは6日。Aの終了2日前にBを開始する。Bは7日。Bの開始3日後にCを開始する。Cは5日。', [
  box(180, 15, 'A', '6日'), box(180, 125, 'B', '7日'), box(180, 240, 'C', '5日'),
  arrow(pid, 'M262 40H290V100H155V149H180'), text(16, 92, '終了→開始'), text(16, 113, 'リード2日'),
  arrow(pid, 'M180 149H145V263H180'), text(16, 209, '開始→開始'), text(16, 230, 'ラグ3日'),
].join(''), 14);

const did = 'precedence-2021';
export const precedenceNetworkFigure = figureSvg(did, 670, 235, '開始からA→C→E→G→終了、B→D→F→H→終了の経路があり、さらにAの完了がFの開始条件となる。すべて終了開始関係。', [
  box(5, 90, '開始'), box(120, 25, 'A'), box(245, 25, 'C'), box(370, 25, 'E'), box(495, 25, 'G'),
  box(120, 155, 'B'), box(245, 155, 'D'), box(370, 155, 'F'), box(495, 155, 'H'), box(585, 90, '終了'),
  arrow(did, 'M87 110L120 49'), arrow(did, 'M87 120L120 179'),
  ...[49, 179].flatMap(y => [202, 327, 452].map(x => arrow(did, `M${x} ${y}H${x + 43}`))),
  arrow(did, 'M577 49L585 110'), arrow(did, 'M577 179L585 120'), arrow(did, 'M202 49L370 179'),
].join(''), 14);

export const arrowNetworkChoices = [[], [[140, 40, 265, 130]], [[140, 40, 140, 130], [140, 40, 390, 130]], [[140, 40, 390, 130]]].map((dummies, i) => {
  const id = `arrow-network-${i}`;
  const nodes = [[35, 85], [140, 40], [265, 40], [390, 40], [140, 130], [265, 130], [390, 130], [495, 85]];
  const edge = (from: number, to: number, name: string) => {
    const a = nodes[from], b = nodes[to], length = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const ux = (b[0] - a[0]) / length, uy = (b[1] - a[1]) / length;
    return arrow(id, `M${a[0] + ux * 13} ${a[1] + uy * 13}L${b[0] - ux * 14} ${b[1] - uy * 14}`) + text((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 8, name, 'middle');
  };
  return figureSvg(id, 530, 170, null, [
    ...nodes.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="13"/>`),
    ...([[0, 1, 'A'], [1, 2, 'C'], [2, 3, 'E'], [3, 7, 'G'], [0, 4, 'B'], [4, 5, 'D'], [5, 6, 'F'], [6, 7, 'H']] as const).map(([a, b, name]) => edge(a, b, name)),
    ...dummies.map(([x1, y1, x2, y2]) => {
      const length = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / length, uy = (y2 - y1) / length;
      return `<path d="M${x1 + ux * 13} ${y1 + uy * 13}L${x2 - ux * 14} ${y2 - uy * 14}" stroke-dasharray="4 4" marker-end="url(#${id}-arrow)"/>`;
    }),
  ].join(''));
});

const kid = 'kpi-improvement';
const labels = ['物流コスト削減活動の開始', 'a', 'b', 'c', '改善活動の実施', '成果の計測と目標値との差の分析'];
export const kpiImprovementFigure = figureSvg(kid, 650, 410, '開始→a（物流コスト10％削減）→b（在庫と誤出荷の削減）→c（在庫日数7日以内、誤出荷率3％以内）→改善活動の実施→成果の計測と目標値との差の分析を行い、aへ戻る。', [
  ...labels.map((label, i) => `<rect x="35" y="${15 + i * 65}" width="300" height="38"${i === 3 ? ' stroke-width="2.5"' : ''}/>${text(185, 39 + i * 65, label, 'middle')}`),
  ...labels.slice(0, -1).map((_, i) => arrow(kid, `M185 ${53 + i * 65}V${80 + i * 65}`)),
  text(355, 105, '・物流コスト10％削減'), text(355, 164, '・在庫の削減'), text(355, 186, '・誤出荷の削減'),
  text(355, 229, '・在庫日数7日以内'), text(355, 251, '・誤出荷率3％以内'),
  arrow(kid, 'M185 378V397H15V99H35'),
].join(''), 14);

const tid = 'transaction-2022';
export const transactionRecovery2022Figure = figureSvg(tid, 650, 270, 'T1はチェックポイント前に開始してコミット。T2はチェックポイント前に開始し障害時未コミット。T3はチェックポイント後に開始し障害時未コミット。T4はチェックポイント前に開始し障害前にコミット。T5はチェックポイント後に開始し障害前にコミット。', [
  arrow(tid, 'M25 35H630'), text(620, 23, '時間', 'end'),
  '<path d="M155 40V250M540 40V250" stroke-dasharray="5 4"/>', text(155, 18, 'チェックポイント', 'middle'), text(540, 18, 'システム障害', 'middle'),
  ...([[30, 120, 'T1', true], [105, 600, 'T2', false], [245, 620, 'T3', false], [80, 370, 'T4', true], [185, 450, 'T5', true]] as const).map(([start, end, name, committed], i) => {
    const y = 76 + i * 36;
    return arrow(tid, `M${start} ${y}H${committed ? end : 540}`, true) + (!committed ? `<path d="M540 ${y}H${end}" stroke-dasharray="2 4" marker-end="url(#${tid}-arrow)"/>` : '') + text((start + end) / 2, y - 8, name, 'middle') + text(start, y - 8, '開始') + (committed ? text(end, y - 8, 'コミット', 'end') : '');
  }),
].join(''), 13);
