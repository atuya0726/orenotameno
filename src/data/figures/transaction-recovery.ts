import { arrow, dot, figureSvg, text, verticalText } from './svg';

// 令和5年度秋期 午前Ⅰ 問9の図。トランザクションの実行期間とチェックポイント、障害発生の時点。
const id = 'transaction-recovery';
const rows: [string, [number, number][], number | null][] = [
  ['T1', [[70, 140]], 140], ['T2', [[110, 160], [190, 270]], 270], ['T3', [[215, 420]], null],
  ['T4', [[70, 160], [190, 420]], null], ['T5', [[200, 350]], 350], ['T6', [[270, 420]], null],
];
const body = [
  arrow(id, 'M60 20H480'), text(480, 12, '時間', 'end'),
  ...rows.flatMap(([name, segments, commit], i) => {
    const y = 50 + i * 25;
    return [text(30, y + 5, name), ...segments.map(([x1, x2]) => `<path d="M${x1} ${y}H${x2}"/>`), commit ? dot(commit, y) : ''];
  }),
  '<rect x="160" y="35" width="30" height="155"/>', verticalText(175, 58, 'チェックポイント'),
  '<path d="M420 20V195" stroke-width="2"/>', verticalText(440, 80, '障害発生'),
  '<path d="M40 222H110M40 247H110"/>', dot(110, 247),
  text(120, 227, 'はコミットされていないトランザクションを示す。'), text(120, 252, 'はコミットされたトランザクションを示す。'),
].join('');

export const transactionRecoveryFigure = figureSvg(id, 500, 262,
  'トランザクションT1〜T6の実行期間。T1はチェックポイント前にコミット。T2はチェックポイント前に開始し，チェックポイント後にコミット。T3はチェックポイント後に開始し，障害発生時に未コミット。T4はチェックポイント前に開始し，障害発生時に未コミット。T5はチェックポイント後に開始してコミット。T6はチェックポイント後に開始し，障害発生時に未コミット。', body);
