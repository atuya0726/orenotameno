import { arrow, figureSvg, text } from './svg';

const id = 'sc2022a-branch';
export const branchCoverageFlow = figureSvg(id, 380, 320,
  '処理1の後に「A > 6 または B = 0」を判定する。真なら処理2を実行し、偽なら処理2を通らず、どちらも下で合流する。', [
    '<path d="M150 5V25"/>',
    '<rect x="95" y="25" width="110" height="45"/>', text(150, 53, '処理1', 'middle'),
    arrow(id, 'M150 70V105'), '<path d="M150 105L255 150L150 195L45 150Z"/>',
    text(150, 155, 'A > 6 or B = 0', 'middle'),
    arrow(id, 'M150 195V225'), text(158, 213, 'Yes'),
    '<rect x="95" y="225" width="110" height="45"/>', text(150, 253, '処理2', 'middle'),
    '<path d="M150 270V310"/>',
    arrow(id, 'M255 150H315V290H150'), text(270, 139, 'No'),
  ].join(''), 15);
