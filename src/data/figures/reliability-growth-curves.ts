import { figureSvg, text, verticalText } from './svg';

// 令和6年度春期 午前Ⅰ 問17の選択肢のグラフ。縦軸は累積誤り検出数，横軸はテスト項目消化数。
function graph(id: string, line: string): string {
  const body = ['<path d="M60 10V170H250"/>', verticalText(40, 45, '累積誤り検出数'), text(155, 190, 'テスト項目消化数', 'middle'), `<path d="${line}"/>`].join('');
  return figureSvg(id, 260, 200, null, body, 14);
}

export const reliabilityGrowthFigures = {
  a: graph('growth-a', 'M65 165C150 160 220 120 245 15'),
  b: graph('growth-b', 'M65 162L245 30'),
  c: graph('growth-c', 'M65 165C100 162 115 145 125 110C140 55 180 22 245 18'),
  d: graph('growth-d', 'M65 165C70 90 140 40 245 25'),
};
