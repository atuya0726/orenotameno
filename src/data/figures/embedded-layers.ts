import { figureSvg, text } from './svg';

// 令和7年度秋期 午前Ⅱ 問22の階層構造。上が上位層。
const id = 'embedded-layers';
const layers = ['アプリケーション層', 'ミドルウェア層', 'デバイスドライバ層', 'ハードウェア'];
const body = layers.map((name, i) => `<rect x="10" y="${10 + i * 36}" width="200" height="36"/>` + text(110, 33 + i * 36, name, 'middle')).join('');

export const embeddedLayersFigure = figureSvg(id, 220, 164, '組込みシステムの階層構造。上から順に，アプリケーション層，ミドルウェア層，デバイスドライバ層，ハードウェア。', body);
