// 令和7年度春期 午前Ⅰ 問7の図を再構成したもの。色はcurrentColorでテーマに追従する。
const edge = (x: number) => `M${x} 95V119M${x} 133V160M${x - 7} 122q3.5-4 7 0t7 0M${x - 7} 130q3.5-4 7 0t7 0`;

export const intermittentCurrentFigure = String.raw`<svg viewBox="0 0 560 222" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="intermittent-current-title" font-size="15" fill="currentColor">
  <title id="intermittent-current-title">電流と時間のグラフ。待機中は0.1μA、動作時間（10ミリ秒）は10mAの電流が流れ、動作と待機を交互に繰り返す。</title>
  <defs>
    <marker id="intermittent-current-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M0 1L9 5L0 9" fill="none" stroke="currentColor" stroke-width="1.4"/></marker>
  </defs>
  <g fill="none" stroke="currentColor" stroke-width="1.4">
    <g marker-end="url(#intermittent-current-arrow)"><path d="M70 190V44"/><path d="M70 190H546"/></g>
    <path d="M80 160H180M180 95H240M240 160H295M305 160H360M360 95H420M420 160H520"/>
    <path d="${edge(180)}${edge(240)}${edge(360)}${edge(420)}"/>
    <path d="M295 151q-4 4.5 0 9t0 9M305 151q-4 4.5 0 9t0 9"/>
    <path d="M136 95H180" stroke-dasharray="3 3"/>
    <path d="M180 46V95M240 46V95M360 46V95" stroke-dasharray="3 3" stroke-width="1"/>
    <g marker-start="url(#intermittent-current-arrow)" marker-end="url(#intermittent-current-arrow)"><path d="M100 162V188"/><path d="M160 97V188"/><path d="M182 64H238"/><path d="M242 64H358"/></g>
  </g>
  <text x="56" y="82" text-anchor="end">電流</text>
  <text x="66" y="208" text-anchor="end">0</text>
  <text x="546" y="212" text-anchor="end">時間</text>
  <text x="107" y="183">0.1μA</text>
  <text x="167" y="183">10mA</text>
  <text x="210" y="22" text-anchor="middle">動作時間</text>
  <text x="210" y="40" text-anchor="middle">（10ミリ秒）</text>
  <text x="300" y="30" text-anchor="middle">待機時間</text>
</svg>`;
