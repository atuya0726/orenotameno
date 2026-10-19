import { figureSvg, text } from './svg';

// 令和5年度春期 午前Ⅰ 問9のクラス図。部門と社員を所属履歴でつなぎ，多重度a，bを空欄にしている。
const id = 'uml-assignment-history';
function classBox(x: number, name: string, attributes: string[]): string {
  return `<rect x="${x}" y="10" width="120" height="100"/><path d="M${x} 38H${x + 120}"/>` + text(x + 60, 29, name, 'middle')
    + [...attributes, '⋮'].map((a, i) => text(a === '⋮' ? x + 20 : x + 8, 58 + i * 20, a, a === '⋮' ? 'middle' : 'start')).join('');
}
const body = [
  classBox(10, '部門', ['部門コード', '部門名']), classBox(230, '所属履歴', ['開始日', '終了日']), classBox(450, '社員', ['社員コード', '氏名']),
  '<path d="M130 62H230M350 62H450"/>', text(140, 55, '1'), text(440, 55, '1', 'end'),
  '<rect x="172" y="40" width="50" height="16" stroke-width="2"/>', text(197, 53, 'a', 'middle'),
  '<rect x="358" y="40" width="50" height="16" stroke-width="2"/>', text(383, 53, 'b', 'middle'),
].join('');

export const umlAssignmentHistoryFigure = figureSvg(id, 580, 120,
  'クラス図。部門（部門コード，部門名，…）と所属履歴（開始日，終了日，…）が関連し，部門側の多重度は1，所属履歴側はa。所属履歴と社員（社員コード，氏名，…）が関連し，所属履歴側の多重度はb，社員側は1。', body);
