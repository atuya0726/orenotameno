import { arrow, figureSvg, text, verticalText } from './svg';

// 令和5年度春期 午前Ⅰ 問6の選択肢のグラフ。縦軸はデータ1個当たりの探索時間，横軸は表の中のデータの個数。
function graph(id: string, line: string): string {
  const body = [
    arrow(id, 'M40 200V12'), arrow(id, 'M40 200H252'),
    verticalText(20, 22, 'データ1個当たりの探索時間', 14), text(34, 216, '0', 'end'), text(146, 222, '表の中のデータの個数', 'middle'),
    `<path d="${line}"/>`,
  ].join('');
  return figureSvg(id, 260, 230, null, body, 13);
}

export const hashSearchTimeFigures = {
  a: graph('hash-a', 'M55 170C120 162 165 160 195 140S230 90 238 60'),
  b: graph('hash-b', 'M55 165L240 55'),
  c: graph('hash-c', 'M55 185C100 110 150 75 240 72'),
  d: graph('hash-d', 'M55 110H240'),
};
