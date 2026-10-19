import { figureSvg, text } from './svg';

// 令和6年度春期 午前Ⅰ 問3の2分木。
const id = 'binary-tree-expression';
const r = 22;
const nodes: Record<string, [number, number]> = {
  '+': [190, 35], A: [100, 115], '÷': [280, 115], '×': [200, 195], '−': [345, 195], B: [150, 275], C: [245, 275], D: [295, 275], E: [395, 275],
};
const edges = [['+', 'A'], ['+', '÷'], ['÷', '×'], ['÷', '−'], ['×', 'B'], ['×', 'C'], ['−', 'D'], ['−', 'E']];
const body = [
  ...edges.map(([p, c]) => {
    const [[x1, y1], [x2, y2]] = [nodes[p], nodes[c]];
    const len = Math.hypot(x2 - x1, y2 - y1); const [ux, uy] = [(x2 - x1) / len, (y2 - y1) / len];
    return `<path d="M${x1 + ux * r} ${y1 + uy * r}L${x2 - ux * r} ${y2 - uy * r}"/>`;
  }),
  ...Object.entries(nodes).map(([label, [x, y]]) => `<circle cx="${x}" cy="${y}" r="${r}"/>` + text(x, y + 5, label, 'middle')),
].join('');

export const binaryTreeExpressionFigure = figureSvg(id, 440, 305,
  '2分木。根は＋で，左の子はA，右の子は÷。÷の左の子は×，右の子は−。×の左の子はB，右の子はC。−の左の子はD，右の子はE。', body);
