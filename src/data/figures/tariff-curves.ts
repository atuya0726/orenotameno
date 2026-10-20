import { figureSvg, text, verticalText } from './svg';

function curve(id: string, path: string): string {
  return figureSvg(id, 260, 210, null, [
    '<path d="M45 15V175H245"/>',
    `<path d="${path}" stroke-width="2"/>`,
    text(35, 189, '0', 'middle'), text(145, 203, '利用量', 'middle'),
    verticalText(23, 70, '利用料金'),
  ].join(''), 14);
}

// 令和6年度春期 午前Ⅱ 問24。横軸は利用量、縦軸は利用料金。
export const tariffCurves = {
  a: curve('tariff-a', 'M45 30L80 95L140 125L230 140'),
  b: curve('tariff-b', 'M45 175L145 45H235'),
  c: curve('tariff-c', 'M45 175L85 105L140 60L235 35'),
  d: curve('tariff-d', 'M45 175L110 155L175 115L235 20'),
};
