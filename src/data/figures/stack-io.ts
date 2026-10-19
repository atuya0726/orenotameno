import { arrow, figureSvg, text, verticalText } from './svg';

// 令和7年度春期 午前Ⅰ 問3の図。データA，B，Cを上から入れ，上から取り出すスタック。
const id = 'stack-io';
const body = [
  '<path d="M120 70V160H180V70"/>', verticalText(150, 95, 'スタック'),
  arrow(id, 'M138 80V40H60'), arrow(id, 'M290 40H162V80'), text(300, 45, 'A，B，C'),
].join('');

export const stackIoFigure = figureSvg(id, 400, 170, 'A，B，Cの順に上から入力し，上から取り出すスタック。', body);
