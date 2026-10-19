import { dot, figureSvg, gate, text } from './svg';

// 令和5年度春期 午前Ⅰ 問7の回路図。入力を両方につないだNAND二つの出力を，別のNANDに入力する。
const id = 'nand-or-circuit';
const n1 = gate('nand', 100, 20), n2 = gate('nand', 100, 80), n3 = gate('nand', 190, 50);
const body = [
  text(12, 33, 'X'), text(12, 107, 'Y'),
  `<path d="M28 28H100M80 28V42H100M28 102H100M80 102V88H100"/>`, dot(80, 28), dot(80, 102),
  n1.svg, n2.svg, n3.svg,
  `<path d="M${n1.out[0]} 35H170V58H190M${n2.out[0]} 95H170V72H190M${n3.out[0]} 65H262"/>`, text(268, 70, 'Z'),
].join('');

export const nandOrCircuitFigure = figureSvg(id, 290, 125,
  'Xを二つの入力に接続したNAND素子の出力と，Yを二つの入力に接続したNAND素子の出力を，別のNAND素子に入力し，その出力をZとする回路。', body);
