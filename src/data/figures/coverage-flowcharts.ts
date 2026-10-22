import { arrow, figureSvg, text } from './svg';

const id = 'coverage-2022';
const rect = (x: number, y: number, value: string) => `<rect x="${x}" y="${y}" width="110" height="34"/>${text(x + 55, y + 22, value, 'middle')}`;
export const branchCoverage2022Figure = figureSvg(id, 440, 475, 'Cを1にする。A>0かつB=0ならCをA×C、そうでなければCを2にする。合流後にA>0かつC=1を判定し、真はそのまま、偽はCをCの2乗にして終了する。', [
  '<rect x="120" y="8" width="110" height="30" rx="15"/>', text(175, 29, '開始', 'middle'), arrow(id, 'M175 38V57'), rect(120, 57, '1 → C'), arrow(id, 'M175 91V110'),
  '<path d="M175 110L265 155L175 200L85 155Z"/>', text(175, 147, 'A > 0', 'middle'), text(175, 168, 'かつ B = 0', 'middle'),
  arrow(id, 'M175 200V220'), text(185, 215, 'Yes'), rect(120, 220, 'A × C → C'),
  arrow(id, 'M265 155H330V220'), text(275, 143, 'No'), rect(275, 220, '2 → C'),
  arrow(id, 'M330 254V275H175'), arrow(id, 'M175 254V292'),
  '<path d="M175 292L265 337L175 382L85 337Z"/>', text(175, 330, 'A > 0', 'middle'), text(175, 351, 'かつ C = 1', 'middle'),
  arrow(id, 'M265 337H330V385'), text(275, 325, 'No'), rect(275, 385, 'C² → C'), arrow(id, 'M330 419V434H175'),
  arrow(id, 'M175 382V443'), text(185, 405, 'Yes'), '<rect x="120" y="443" width="110" height="30" rx="15"/>', text(175, 464, '終了', 'middle'),
].join(''), 14);

// 令和3年度春期 午前Ⅰ 問16。各判定は独立し、枝は段ごとに合流する。
export const statementCoverage2021Figure = (() => {
  const id = 'statement-coverage-2021';
  const rows = [3, 2, 3];
  return figureSvg(id, 340, 440, '独立した三つの判定が順に並ぶ。第1段は三つの処理へ分岐して合流、第2段は二つの処理へ分岐して合流、第3段は三つの処理へ分岐して合流する。', [
    '<path d="M170 5V30"/>',
    ...rows.map((count, i) => {
      const y = 30 + i * 135, xs = count === 3 ? [65, 170, 275] : [65, 275];
      return `<path d="M170 ${y}L210 ${y + 23}L170 ${y + 46}L130 ${y + 23}Z"/>` + xs.map(x => {
        const path = x === 170 ? `M170 ${y + 46}V${y + 68}` : `M${x < 170 ? 130 : 210} ${y + 23}H${x}V${y + 68}`;
        return arrow(id, path) + `<rect x="${x - 32}" y="${y + 68}" width="64" height="32"/>` + arrow(id, `M${x} ${y + 100}V${y + 120}H170`);
      }).join('') + arrow(id, `M170 ${y + 120}V${y + 135}`);
    }),
  ].join(''));
})();
