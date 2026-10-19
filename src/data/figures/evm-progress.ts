import { arrow, figureSvg, text, verticalText } from './svg';

// 令和6年度春期 午前Ⅰ 問18の図。期間の半分の時点（現時点）でのPV，AC，EVの累積値。
const id = 'evm-progress';
const body = [
  '<path d="M60 12V180H440"/>', verticalText(40, 28, '累積値'),
  '<path d="M60 180L400 30" stroke-width="2"/>', '<path d="M60 180L230 125" stroke-width="2"/>', '<path d="M60 180L230 150" stroke-width="2"/>',
  '<path d="M230 15V180M400 25V180" stroke-dasharray="5 4"/>',
  text(305, 60, 'PV'), arrow(id, 'M268 124H238'), text(276, 130, 'AC'), text(200, 174, 'EV'),
  text(60, 200, '開始日', 'middle'), text(230, 200, '現時点', 'middle'), text(400, 200, '完了予定日', 'middle'),
].join('');

export const evmProgressFigure = figureSvg(id, 460, 210,
  '累積値のグラフ。PVは開始日から完了予定日まで直線的に増加する。期間の半分の現時点では，累積値は大きい順にPV，AC，EVである。', body);
