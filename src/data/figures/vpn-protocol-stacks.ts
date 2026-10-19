import { arrow, figureSvg, text } from './svg';

// 令和7年度春期 午前Ⅰ 問15の図。選択肢A〜Dは，三つのプロトコルを上位から積んだ順序。
const id = 'vpn-protocol-stacks';
const stacks: [string, string[]][] = [['A', ['IPsec', 'L2TP', 'TLS']], ['B', ['IPsec', 'TLS', 'L2TP']], ['C', ['TLS', 'IPsec', 'L2TP']], ['D', ['TLS', 'L2TP', 'IPsec']]];
const body = [
  text(115, 20, 'OSI基本参照モデル', 'middle'), text(115, 46, '上位層（アプリケーション層）', 'middle'),
  arrow(id, 'M115 58V150', true), text(115, 172, '下位層（物理層）', 'middle'),
  ...stacks.map(([name, protocols], i) => {
    const x = 260 + i * 72;
    return text(x + 30, 30, name, 'middle') + protocols.map((p, j) => `<rect x="${x}" y="${50 + j * 30}" width="60" height="30"/>` + text(x + 30, 70 + j * 30, p, 'middle')).join('');
  }),
].join('');

export const vpnProtocolStacksFigure = figureSvg(id, 550, 180,
  '上位層（アプリケーション層）から下位層（物理層）への位置関係。Aは上からIPsec，L2TP，TLS。BはIPsec，TLS，L2TP。CはTLS，IPsec，L2TP。DはTLS，L2TP，IPsec。', body, 14);
