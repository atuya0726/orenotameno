import { arrow, figureSvg, text } from './svg';

const id = 'sc2023a-db-move';
function device(x: number, y: number, lines: string[]): string {
  return `<rect x="${x}" y="${y}" width="88" height="42"/>` + lines.map((label, i) => text(x + 44, y + (lines.length === 1 ? 26 : 17 + i * 17), label, 'middle')).join('');
}
function panel(offset: number, after: boolean): string {
  return `<g transform="translate(${offset} 0)">` + [
    text(185, 20, after ? '変更後' : '変更前', 'middle'),
    '<ellipse cx="185" cy="52" rx="68" ry="17"/>', text(185, 57, 'インターネット', 'middle'),
    '<path d="M185 69V158M124 179H141M229 179H253M80 132V158M297 132V158"/>',
    '<path d="M18 88H135V262H18ZM245 88H365V262H245Z" stroke-dasharray="5 4"/>',
    device(36, 90, ['運用管理', 'PC']), device(36, 158, ['L3SW']),
    device(141, 158, ['FW']), device(253, 158, ['L2SW']), device(253, 90, ['WebAP', 'サーバ']),
    after ? '<path d="M80 200V210"/>' : '<path d="M297 200V210"/>',
    device(after ? 36 : 253, 210, ['DB', 'サーバ']),
    text(80, 284, '内部ネットワーク', 'middle'), text(297, 284, 'DMZ', 'middle'),
    '</g>',
  ].join('');
}

export const dbNetworkMove = figureSvg(id, 840, 340,
  '変更前は、運用管理PCとL3スイッチが内部ネットワークにあり、WebAPサーバとDBサーバがDMZのL2スイッチに接続している。ファイアウォールは内部ネットワーク、DMZ、インターネットの間にある。変更後はDBサーバだけを内部ネットワークのL3スイッチ側へ移動し、WebAPサーバはDMZに残す。', [
    panel(0, false), arrow(id, 'M385 179H425'), panel(445, true),
    text(20, 325, 'L2SW：レイヤー2スイッチ　 L3SW：レイヤー3スイッチ　 FW：ファイアウォール'),
  ].join(''), 13);
