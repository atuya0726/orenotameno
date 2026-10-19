import { dot, figureSvg, gate, text, type GateKind } from './svg';

// 令和5年度秋期 午前Ⅰ 問7の選択肢の回路図。AとB，BとC，AとCの2入力素子の出力を二段の素子でまとめる。
function circuit(id: string, first: GateKind, middle: GateKind, last: GateKind): string {
  const g1 = gate(first, 90, 12), g2 = gate(first, 90, 68), g3 = gate(first, 90, 124);
  const h = gate(middle, 165, 40), f = gate(last, 240, 62);
  const body = [
    text(10, 24, 'A'), text(10, 39, 'B'), text(10, 95, 'C'),
    `<path d="M22 20H${g1.inX}M50 20V146H${g3.inX}"/>`, dot(50, 20),
    `<path d="M22 34H${g1.inX}M62 34V76H${g2.inX}"/>`, dot(62, 34),
    `<path d="M22 90H${g2.inX}M62 90V132H${g3.inX}"/>`, dot(62, 90),
    g1.svg, g2.svg, g3.svg, h.svg, f.svg,
    `<path d="M${g1.out[0]} 27H150V48H${h.inX}M${g2.out[0]} 83H150V62H${h.inX}"/>`,
    `<path d="M${h.out[0]} 55H225V70H${f.inX}M${g3.out[0]} 139H212V84H${f.inX}"/>`,
    `<path d="M${f.out[0]} 77H305"/>`, text(310, 82, 'Y'),
  ].join('');
  return figureSvg(id, 330, 160, null, body, 13);
}

export const majorityCircuitFigures = {
  a: circuit('majority-a', 'and', 'or', 'or'),
  b: circuit('majority-b', 'xor', 'or', 'or'),
  c: circuit('majority-c', 'or', 'and', 'nand'),
  d: circuit('majority-d', 'xor', 'and', 'nand'),
};
