# 用語集の見直し記録

> 現在の評価は「基本／深掘り」です。以下のB・A・Sは見直し当時の区分で、旧Bを基本、旧A・Sを深掘りへ統合しています。現在の判定は[用語評価の基準](glossary-rubric.md)を参照してください。

「試験で必要な理解の深さ」による[評価基準](glossary-rubric.md)を、収録済みの全661語へ適用した。既存265語を修正し、別概念を同じ用語で評価・案内していた66件を独立した用語に分けた。

| 対象 | 見直し前 | 見直し後 |
|---|---:|---:|
| 用語 | 661 | 727 |
| 評価項目 | 1,576 | 1,323 |
| Bの項目 | 1,021 | 826 |
| Aの項目 | 332 | 483 |
| Sの項目 | 223 | 14 |

件数は変更時点の集計。B・A・Sの比率や個数を目標にはしていない。

## 判断の理由

| 確認した内容 | 適用した判断 | 代表例 |
|---|---|---|
| 意味・基本の仕組み | Bとして残す。同じ論点の重複はまとめる | LRUの置換対象 |
| 用途・理由・制約・影響 | 定義に必須かを確認し、追加の理解ならAへ分類する | バックアップの復元、攻撃への対策、量子計算の暗号への影響 |
| 細かな条件・仕様 | 用語の範囲内で根拠を確認できるものをSとする | TLS 1.3での方式の選び方、IPv4マルチキャストの範囲 |
| 別の用語の定義 | 親の必須項目から外し、その語自身の項目とリンクへ分ける | 公開鍵暗号と共通鍵暗号、SVGとPNG、整列と各手法 |
| 追加の専門知識 | その用語の説明に必要な根拠を確認できない追加項目は保留する | 量子コンピュータでの量子もつれやアニーリングの必須化 |
| 基本1項目で成立するもの | 追加が必要な根拠がなければ範囲を維持する | 昇順、各種の単位、証明書の個別の用途 |

Bの論点は用語の中心的な定義、Aは用途・理由・制約・影響、Sは具体的な条件・仕様として、一項目ずつ範囲を確認した。項目の文章とヒントを評価する範囲とし、それを超える名称・数式・理論の説明は要求しない。十分な説明の例は、用語データの`definition`・`example`と、各項目の意味を満たす言い換えを参照する。

## 範囲を確認した資料

- [収録した過去問と出典](sources/)：科目A1の2023〜2025年度、科目A2の2022〜2025年度。関連する用語の出現だけでなく、その問題で判断する論点を参照した。
- [IPAの試験要綱・シラバス](https://www.ipa.go.jp/shiken/syllabus/gaiyou.html)：APの基礎理論・構成要素・開発・管理・戦略、SCのセキュリティ知識の範囲と学習目標を参照した。
- [APシラバスVer.7.2](https://www.ipa.go.jp/shiken/syllabus/omgdg50000005kq5-att/syllabus_ap_ver7_2.pdf)と[SCシラバスVer.2.1](https://www.ipa.go.jp/shiken/syllabus/nq6ept00000014ir-att/syllabus_sc_ver2_1.pdf)。

用途・対策などのAは、該当する概念の使い方や性質の理解として判定する。資料の掲載頻度から段階を機械的に振り分けていない。シラバスの用語例への掲載だけを理由に、その分野の全仕様まで要求しない。

## 残したSの論点と根拠

下表の出題は、その用語を学習対象にする根拠として示す。仕様を補足する資料は内容の正確さの確認に使う。特定の細部が出題された回数を主張するものではない。

| 用語・項目 | 細部として扱う理由 | 出題・仕様の根拠 |
|---|---|---|
| SPF / `record` | 送信許可情報の公開先となるレコード種別 | [2022秋SC午前Ⅱ問15](../src/data/sc-2022-autumn-a2.ts)、[RFC 7208 §3](https://www.rfc-editor.org/rfc/rfc7208#section-3) |
| ドメインフロンティング / `sni-host` | 表向きの接続先と実際の転送先を分ける具体的な指定箇所 | [2025秋SC午前Ⅱ問8](../src/data/sc-2025-autumn-a2.ts)の収録解説 |
| IPsec / `esp-ah` | ネットワーク層で保護する基本から進んだ、内部の方式と役割 | [2024春午前Ⅰ問15](../src/data/sc-2024-spring-a1.ts)、[RFC 4301 §3](https://www.rfc-editor.org/rfc/rfc4301#section-3) |
| CVE / `format` | 識別子の用途に加え、表記の構造を確認する | [2024秋午前Ⅰ問14](../src/data/sc-2024-autumn-a1.ts) |
| モジュール結合度 / `order` | 依存の強さという基本から進み、分類を強さの順で整理する | [2023春午前Ⅰ問16](../src/data/sc-2023-spring-a1.ts)、APシラバスのソフトウェア設計 |
| 正規分布 / `ratio`・`inflection` | 具体的な範囲と割合、曲線上の位置関係 | [2023春午前Ⅰ問2](../src/data/sc-2023-spring-a1.ts)、APシラバスの確率・統計 |
| マルチキャスト / `address` | グループ宛て通信から進んだIPv4のアドレス範囲 | [2023秋SC午前Ⅱ問19](../src/data/sc-2023-autumn-a2.ts)、[2022秋SC午前Ⅱ問19](../src/data/sc-2022-autumn-a2.ts) |
| サイバーキルチェーン / `order` | 各段階の具体的な名称と順序 | [2025秋午前Ⅰ問12](../src/data/sc-2025-autumn-a1.ts)、[2022春SC午前Ⅱ問5](../src/data/sc-2022-spring-a2.ts) |
| OSS / `copyleft` | 特定ライセンスでの改変物の配布条件 | APシラバスのOSSと知的財産適用管理、[GNU GPLv3解説](https://www.gnu.org/licenses/quick-guide-gplv3.html) |
| サービスマネジメント / `standard` | 対応する要求事項の規格を特定する | [2023春午前Ⅰ問20](../src/data/sc-2023-spring-a1.ts)、[2023秋SC午前Ⅱ問24](../src/data/sc-2023-autumn-a2.ts) |
| ソフトウェア信頼度成長モデル / `scurve` | 代表的モデルの曲線形状 | [2024春午前Ⅰ問17](../src/data/sc-2024-spring-a1.ts) |
| SHA-512/256 / `initial-value` | 元のSHA-512との初期値の違い | [2025春SC午前Ⅱ問3](../src/data/sc-2025-spring-a2.ts)、[FIPS 180-4 §5.3.6](https://csrc.nist.gov/pubs/fips/180-4/upd1/final) |
| TLS 1.3 / `separate-negotiation` | 鍵交換・署名の選択箇所 | [2023秋SC午前Ⅱ問2](../src/data/sc-2023-autumn-a2.ts)、[RFC 8446 §4](https://www.rfc-editor.org/rfc/rfc8446#section-4) |

## 全用語の確認結果

各行のB/A/Sは見直し後の項目数。既存の用語IDと保存済み履歴を維持し、学習済みの評価を再採点・書き換えしていない。独立させた用語は新しいIDで追加した。

| ID | 用語 | B | A | S | 判断 |
|---|---|---:|---:|---:|---|
| `digital-signature` | ディジタル署名 | 3 | 2 | 0 | 範囲・重複の整理 |
| `hash` | ハッシュ関数 | 3 | 2 | 0 | use: B→A；範囲・重複の整理 |
| `salt` | ソルト | 2 | 2 | 0 | purpose: B→A；範囲・重複の整理 |
| `tls` | TLS | 3 | 3 | 0 | hybrid: B→A；範囲・重複の整理 |
| `sql-injection` | SQLインジェクション | 1 | 3 | 0 | impact: B→A / defense: B→A；範囲・重複の整理 |
| `xss` | XSS | 2 | 4 | 0 | defense: B→A / impact: B→A；範囲・重複の整理 |
| `csrf` | CSRF | 2 | 4 | 0 | defense: B→A / token-reason: B→A；範囲・重複の整理 |
| `mfa` | 多要素認証 | 2 | 2 | 0 | 範囲・重複の整理 |
| `least-privilege` | 最小権限の原則 | 2 | 2 | 0 | impact: B→A；範囲・重複の整理 |
| `dns` | DNS | 1 | 2 | 0 | servers: B→A；範囲・重複の整理 |
| `reverse-proxy` | リバースプロキシ | 2 | 3 | 0 | use: B→A；範囲・重複の整理；別概念へのリンクを分離 |
| `dkim` | DKIM | 3 | 1 | 0 | forwarding: B→A；範囲・重複の整理 |
| `spf` | SPF | 2 | 2 | 1 | limit: B→A / forwarding: B→A / record: A→S；範囲・重複の整理 |
| `base` | BASE特性 | 3 | 1 | 0 | 範囲・重複の整理；別概念へのリンクを分離 |
| `acid` | ACID特性 | 5 | 2 | 0 | 範囲・重複の整理；自身の論点を明確化 |
| `lru` | LRU | 1 | 0 | 0 | 範囲・重複の整理 |
| `zero-trust` | ゼロトラスト | 3 | 2 | 0 | 範囲・重複の整理 |
| `ids-ips` | IDS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ips` | IPS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `pki` | PKI（公開鍵基盤） | 2 | 2 | 0 | 範囲・重複の整理 |
| `cryptrec` | CRYPTREC暗号リスト | 2 | 1 | 0 | transition: S→A；範囲・重複の整理；自身の論点を明確化 |
| `pqc` | 耐量子計算機暗号（PQC） | 2 | 2 | 0 | threat: B→A；範囲・重複の整理 |
| `one-time-pad` | ワンタイムパッド | 2 | 2 | 0 | its: B→A / distribution: S→A；範囲・重複の整理 |
| `xml-signature` | XMLデジタル署名 | 2 | 1 | 0 | types: B→A；範囲・重複の整理；別概念へのリンクを分離 |
| `pass-the-hash` | Pass the Hash攻撃 | 2 | 2 | 0 | mitigation: S→A；範囲・重複の整理 |
| `syn-flood` | SYNフラッド攻撃 | 2 | 2 | 0 | spoof: B→A；範囲・重複の整理 |
| `domain-fronting` | ドメインフロンティング | 2 | 2 | 1 | c2: B→A / countermeasure: S→A / sni-host: A→S |
| `model-inversion` | モデルインバージョン攻撃 | 2 | 1 | 0 | defense: S→A；範囲・重複の整理 |
| `biometrics` | 生体認証 | 1 | 3 | 0 | errors: B→A / irrevocable: B→A / liveness: S→A；範囲・重複の整理 |
| `identity-proofing` | 身元確認（Identity Proofing） | 2 | 0 | 0 | 範囲・重複の整理 |
| `mitre-attack` | MITRE ATT&CK | 2 | 2 | 0 | usage: S→A；範囲・重複の整理 |
| `psirt` | PSIRT | 2 | 2 | 0 | sbom: S→A；範囲・重複の整理 |
| `ueba` | UEBA | 3 | 1 | 0 | 範囲・重複の整理 |
| `cspm` | CSPM | 2 | 1 | 0 | remediation: S→A；範囲・重複の整理 |
| `ieee8021x` | IEEE 802.1X | 1 | 4 | 0 | eap: B→A / roles: B→A / wpa-enterprise: S→A |
| `wal` | ログ先行書込み（WAL） | 1 | 4 | 0 | commit: B→A / durability: B→A；範囲・重複の整理 |
| `ospf` | OSPF | 2 | 1 | 0 | area: S→A；範囲・重複の整理 |
| `risk-approach` | リスク・アプローチ（システム監査） | 1 | 1 | 0 | review: B→A；範囲・重複の整理 |
| `mm1-queue` | M/M/1待ち行列 | 1 | 4 | 0 | utilization: B→A / formula: B→A；範囲・重複の整理 |
| `availability` | 稼働率 | 1 | 2 | 0 | series-parallel: B→A；範囲・重複の整理 |
| `normalization` | 正規化 | 1 | 4 | 0 | 1nf: B→A / 2nf: B→A / 3nf: B→A / denormalize: S→A；範囲・重複の整理 |
| `deadlock` | デッドロック | 1 | 4 | 0 | order: B→A / prevent: B→A / detect: S→A |
| `hamming-code` | ハミング符号 | 2 | 1 | 0 | syndrome: B→A；範囲・重複の整理 |
| `fault-tolerance` | フォールトトレランス | 1 | 1 | 0 | redundancy: B→A；範囲・重複の整理；別概念へのリンクを分離 |
| `overfitting` | 過学習 | 1 | 2 | 0 | remedy: B→A；範囲・重複の整理 |
| `sbom` | SBOM | 1 | 3 | 0 | vuln: B→A / license: B→A / supply-chain: S→A；範囲・重複の整理 |
| `os-command-injection` | OSコマンドインジェクション | 2 | 3 | 0 | avoid-shell: B→A / least-priv: S→A |
| `ipsec` | IPsec | 2 | 2 | 1 | vpn: B→A / esp-ah: A→S；範囲・重複の整理 |
| `cve` | CVE | 2 | 0 | 1 | format: B→S；範囲・重複の整理 |
| `dns-cache-poisoning` | DNSキャッシュポイズニング | 1 | 3 | 0 | redirect: B→A / random: B→A；範囲・重複の整理 |
| `rainbow-table` | レインボーテーブル攻撃 | 2 | 1 | 0 | salt: B→A；範囲・重複の整理 |
| `dmarc` | DMARC | 3 | 2 | 0 | alignment: A→B / report: B→A / staged: S→A |
| `submission-port` | サブミッションポート | 2 | 1 | 0 | op25b: B→A；範囲・重複の整理 |
| `deepfake` | ディープフェイク | 2 | 2 | 0 | abuse: B→A；範囲・重複の整理 |
| `botnet` | ボットネット | 2 | 2 | 0 | use: B→A；範囲・重複の整理 |
| `digital-forensics` | デジタルフォレンジックス | 1 | 2 | 0 | chain-custody: S→A；範囲・重複の整理 |
| `evm` | EVM | 1 | 3 | 0 | cost: B→A / schedule: B→A；範囲・重複の整理 |
| `critical-path` | クリティカルパス | 2 | 2 | 0 | shorten: B→A |
| `rto-rpo` | RTO | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `rpo` | RPO | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `application-control` | 業務処理統制 | 1 | 3 | 0 | examples: B→A / dependency: S→A |
| `soa` | SOA | 2 | 1 | 0 | benefit: B→A；範囲・重複の整理 |
| `ppm` | PPM | 2 | 3 | 0 | allocation: B→A / limits: S→A |
| `break-even-point` | 損益分岐点 | 1 | 4 | 0 | formula: B→A / split: B→A / safety: S→A |
| `five-forces` | ファイブフォース分析 | 2 | 0 | 0 | 範囲・重複の整理 |
| `worker-dispatch` | 労働者派遣 | 1 | 2 | 0 | no-select: B→A / vs-contract: S→A；範囲・重複の整理 |
| `module-coupling` | モジュール結合度 | 1 | 2 | 1 | low-good: B→A / data: B→A / order: A→S；範囲・重複の整理 |
| `edge-computing` | エッジコンピューティング | 1 | 3 | 0 | latency: B→A / traffic: B→A / privacy: S→A；範囲・重複の整理 |
| `poisson-exponential` | ポアソン分布 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `exponential-distribution` | 指数分布 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `roc-curve` | ROC曲線 | 2 | 2 | 0 | upperleft: B→A / diagonal: S→A；範囲・重複の整理 |
| `machine-learning` | 機械学習 | 1 | 2 | 0 | generalize: S→A；範囲・重複の整理；別概念へのリンクを分離 |
| `deep-learning` | 深層学習 | 2 | 1 | 0 | 範囲・重複の整理 |
| `generative-ai` | 生成AI | 1 | 1 | 0 | hallucination: B→A；範囲・重複の整理 |
| `cross-validation` | 交差検証 | 1 | 3 | 0 | generalization: B→A / leakage: S→A |
| `ensemble-learning` | アンサンブル学習 | 1 | 2 | 0 | accuracy: B→A / diversity: S→A；範囲・重複の整理；別概念へのリンクを分離 |
| `search-linear-binary` | 線形探索 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `binary-search` | 2分探索 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `average-comparisons` | 平均比較回数 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ascending-order` | 昇順 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `bisection` | 二分法 | 2 | 1 | 0 | 範囲・重複の整理 |
| `stack` | スタック | 2 | 2 | 0 | overflow: S→A |
| `fifo` | FIFO | 1 | 2 | 0 | queue: B→A；範囲・重複の整理 |
| `lfu` | LFU | 1 | 1 | 0 | 範囲・重複の整理 |
| `reverse-polish` | 逆ポーランド表記法 | 2 | 2 | 0 | 範囲・重複の整理；別概念へのリンクを分離 |
| `hash-table` | ハッシュ表 | 1 | 4 | 0 | fast: B→A / collision: B→A / load: S→A |
| `binary-tree` | 2分木 | 2 | 1 | 0 | traverse: B→A；範囲・重複の整理 |
| `recursion` | 再帰処理 | 2 | 2 | 0 | loop: S→A |
| `quantum-computer` | 量子コンピュータ | 1 | 1 | 0 | 自身の論点を明確化；別概念へのリンクを分離 |
| `quicksort` | クイックソート | 2 | 2 | 0 | unstable: S→A |
| `sorting` | 整列アルゴリズム | 1 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化；別概念へのリンクを分離 |
| `normal-distribution` | 正規分布 | 1 | 1 | 2 | sd: B→A / ratio: A→S |
| `bit-error-rate` | ビット誤り率 | 1 | 2 | 0 | expected: B→A；範囲・重複の整理 |
| `logic-operation` | 論理演算 | 1 | 2 | 0 | xor-twice: S→A；範囲・重複の整理；自身の論点を明確化；別概念へのリンクを分離 |
| `nand` | NAND素子 | 1 | 1 | 0 | universal: B→A；範囲・重複の整理；別概念へのリンクを分離 |
| `combinational-circuit` | 組合せ回路 | 1 | 1 | 0 | 範囲・重複の整理 |
| `parity` | パリティチェック | 1 | 2 | 0 | detect: B→A / even-errors: S→A；範囲・重複の整理 |
| `rendering` | レンダリング | 1 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化；別概念へのリンクを分離 |
| `virtual-reality` | バーチャルリアリティ | 1 | 2 | 0 | tracking: B→A / latency: S→A；範囲・重複の整理 |
| `svg` | SVG | 2 | 2 | 0 | scale: B→A / script: S→A；範囲・重複の整理；別概念へのリンクを分離 |
| `xml` | XML | 2 | 1 | 0 | xxe: S→A；範囲・重複の整理 |
| `dom-sax` | DOM | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sax` | SAX | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `outline-font` | アウトラインフォント | 1 | 1 | 0 | scale: B→A；範囲・重複の整理；別概念へのリンクを分離 |
| `bandwidth` | 帯域幅 | 1 | 3 | 0 | calc: B→A；範囲・重複の整理 |
| `risc-cisc` | RISC | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cisc` | CISC | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `instruction-set` | 命令セット | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `vliw` | VLIW | 2 | 0 | 0 | 範囲・重複の整理 |
| `flynn` | フリンの分類 | 1 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化 |
| `capacity-planning` | キャパシティプランニング | 1 | 4 | 0 | bottleneck: B→A / margin: S→A |
| `throughput` | スループット | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `response-time` | 応答時間 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `turnaround-time` | ターンアラウンドタイム | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cache-memory` | キャッシュメモリ | 1 | 3 | 0 | hit: B→A / effective: B→A；範囲・重複の整理 |
| `embedded-system` | 組込みシステム | 1 | 3 | 0 | realtime: B→A / update: S→A |
| `chattering` | チャタリング | 1 | 1 | 0 | measure: B→A；範囲・重複の整理 |
| `cpi` | CPI | 1 | 3 | 0 | time: B→A / period: B→A；範囲・重複の整理 |
| `mtbf-mttr` | MTBF | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `mttr` | MTTR | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `virtual-memory` | 仮想記憶 | 1 | 4 | 0 | paging: B→A / replace: B→A / thrashing: S→A；範囲・重複の整理 |
| `fragmentation` | 断片化（フラグメンテーション） | 2 | 2 | 0 | compaction: S→A |
| `iot` | IoT | 1 | 3 | 0 | gateway: B→A / mirai: S→A |
| `intermittent` | 間欠動作 | 1 | 2 | 0 | average: B→A；範囲・重複の整理 |
| `poe` | PoE | 1 | 2 | 0 | use: B→A；範囲・重複の整理 |
| `plc` | PLC | 1 | 1 | 0 | 範囲・重複の整理 |
| `ups` | UPS | 1 | 3 | 0 | shutdown: B→A / capacity: S→A |
| `cluster` | クラスタ構成 | 1 | 2 | 0 | 範囲・重複の整理 |
| `compiler` | コンパイラ | 1 | 2 | 0 | order: B→A / optimize: S→A；範囲・重複の整理 |
| `ide` | 統合開発環境（IDE） | 1 | 1 | 0 | flow: B→A；範囲・重複の整理 |
| `actuator` | アクチュエーター | 1 | 2 | 0 | loop: S→A；範囲・重複の整理；別概念へのリンクを分離 |
| `feedback-control` | フィードバック制御 | 2 | 0 | 0 | 範囲・重複の整理 |
| `fail-safe` | フェールセーフ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `fail-soft` | フェールソフト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `foolproof` | フールプルーフ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `fail-secure` | フェールセキュア | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `pipeline` | パイプライン | 1 | 2 | 0 | hazard: B→A；範囲・重複の整理 |
| `out-of-order` | アウトオブオーダー実行 | 1 | 1 | 0 | commit: B→A；範囲・重複の整理 |
| `scaling` | スケールアウト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `scale-up` | スケールアップ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `scale-in` | スケールイン | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `scale-down` | スケールダウン | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `grid-computing` | グリッドコンピューティング | 1 | 2 | 0 | large: B→A / heterogeneous: S→A；範囲・重複の整理 |
| `energy-harvesting` | エネルギーハーベスティング | 1 | 2 | 0 | iot: B→A |
| `wearable` | ウェアラブルデバイス | 1 | 2 | 0 | sense: B→A |
| `provisioning` | プロビジョニング | 1 | 3 | 0 | auto: B→A / deprovision: S→A |
| `iac` | IaC | 1 | 3 | 0 | reproduce: B→A / secret: S→A |
| `alive-monitoring` | 死活監視 | 1 | 3 | 0 | notify: B→A / service: S→A |
| `cloud-deployment` | クラウドの配置モデル | 1 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化 |
| `system-integration` | システムインテグレーション | 1 | 0 | 0 | 範囲・重複の整理 |
| `rtos` | リアルタイムOS | 1 | 2 | 0 | preemptive: B→A；範囲・重複の整理 |
| `ci` | 継続的インテグレーション | 2 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化 |
| `two-phase-commit` | 2相コミット | 2 | 2 | 0 | block: S→A |
| `primary-key` | 主キー | 2 | 0 | 0 | 範囲・重複の整理 |
| `relational-database` | 関係データベース | 2 | 1 | 0 | dbms: B→A；範囲・重複の整理 |
| `view` | ビュー | 1 | 2 | 0 | restrict: B→A；範囲・重複の整理 |
| `relational-algebra` | 関係演算 | 1 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化 |
| `functional-dependency` | 関数従属性 | 1 | 3 | 0 | partial: B→A / transitive: B→A；範囲・重複の整理 |
| `referential-constraint` | 参照制約 | 1 | 2 | 0 | cascade: B→A；範囲・重複の整理 |
| `stored-procedure` | ストアドプロシージャ | 1 | 2 | 0 | traffic: B→A / privilege: S→A；範囲・重複の整理 |
| `db-recovery` | 障害回復 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `rollback` | ロールバック | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `rollforward` | ロールフォワード | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `checkpoint` | チェックポイント | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `commit` | コミット | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `transaction` | トランザクション | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `packet` | パケット | 1 | 2 | 0 | time: B→A；範囲・重複の整理 |
| `lan` | LAN | 1 | 1 | 0 | 範囲・重複の整理 |
| `web-server` | Webサーバ | 1 | 3 | 0 | dmz: B→A / banner: S→A |
| `vpn` | VPN | 1 | 2 | 0 | tunnel: B→A / crypto: B→A；範囲・重複の整理 |
| `osi-model` | OSI基本参照モデル | 2 | 2 | 0 | 範囲・重複の整理 |
| `ethernet` | イーサネット | 1 | 3 | 0 | encap: B→A / collision: S→A |
| `mac-address` | MACアドレス | 1 | 1 | 0 | random: S→A；範囲・重複の整理 |
| `ip-address` | IPアドレス | 2 | 1 | 0 | 範囲・重複の整理 |
| `subnet-mask` | サブネットマスク | 1 | 4 | 0 | and: B→A / cidr: S→A |
| `port-number` | ポート番号 | 1 | 3 | 0 | wellknown: B→A / scan: S→A |
| `mobile-network` | ハンドオーバー | 1 | 0 | 0 | 範囲・重複の整理；別概念へのリンクを分離 |
| `network-commands` | ネットワーク管理コマンド | 1 | 0 | 0 | 範囲・重複の整理；自身の論点を明確化；別概念へのリンクを分離 |
| `csma-cd` | CSMA/CD | 2 | 1 | 0 | switch: S→A；範囲・重複の整理 |
| `csma-ca` | CSMA/CA | 1 | 2 | 0 | ack: B→A；範囲・重複の整理 |
| `ipv6` | IPv6 | 1 | 2 | 0 | notation: B→A / dual: S→A；範囲・重複の整理 |
| `ppp` | PPP | 1 | 1 | 0 | auth: B→A；範囲・重複の整理 |
| `ssh` | SSH | 1 | 3 | 0 | auth: B→A / forward: S→A；範囲・重複の整理 |
| `multicast` | マルチキャスト | 1 | 1 | 1 | 現在の定義・評価範囲を維持 |
| `rip` | RIP | 2 | 3 | 0 | converge: S→A |
| `dhcp` | DHCP | 1 | 3 | 0 | broadcast: B→A / rogue: S→A |
| `dns-records` | DNSのリソースレコード | 1 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化 |
| `http-status` | HTTPステータスコード | 1 | 1 | 0 | classes: B→A；範囲・重複の整理；自身の論点を明確化 |
| `ajax` | Ajax | 2 | 2 | 0 | cors: S→A |
| `css` | CSS | 1 | 2 | 0 | separate: B→A |
| `vlan` | VLAN | 1 | 2 | 0 | static: B→A；範囲・重複の整理 |
| `ip-masquerade` | IPマスカレード | 2 | 1 | 0 | inbound: S→A；範囲・重複の整理 |
| `free-address` | フリーアドレス制 | 1 | 2 | 0 | network: B→A |
| `domain-name` | ドメイン名 | 1 | 2 | 0 | expire: S→A；範囲・重複の整理 |
| `cyber-kill-chain` | サイバーキルチェーン | 1 | 1 | 1 | break: B→A / order: A→S；範囲・重複の整理 |
| `exploit` | エクスプロイト | 2 | 1 | 0 | 範囲・重複の整理 |
| `vulnerability` | 脆弱性 | 1 | 3 | 0 | fix: B→A；範囲・重複の整理 |
| `malware` | マルウェア | 1 | 1 | 0 | route: B→A；範囲・重複の整理 |
| `ransomware` | ランサムウェア | 1 | 2 | 0 | backup: B→A；範囲・重複の整理 |
| `bec` | ビジネスメール詐欺 | 1 | 1 | 0 | verify: B→A；範囲・重複の整理 |
| `deep-web` | ディープウェブ | 1 | 0 | 0 | 範囲・重複の整理 |
| `certificates` | サーバー証明書 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `client-certificate` | クライアント証明書 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `code-signing-certificate` | コードサイニング証明書 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ev-ssl-certificate` | EV SSL証明書 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `security-properties` | 情報セキュリティの3要素 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `confidentiality` | 機密性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `integrity` | 完全性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `information-availability` | 可用性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `authenticity` | 真正性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `reliability` | 信頼性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `accountability` | 責任追跡性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `non-repudiation` | 否認防止 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `entity` | エンティティ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `authorization` | 認可 | 1 | 1 | 0 | 範囲・重複の整理 |
| `smime` | S/MIME | 2 | 1 | 0 | e2e: S→A；範囲・重複の整理 |
| `oss` | OSS | 2 | 1 | 1 | 定義・説明例または関連リンクを整理 |
| `directory-traversal` | ディレクトリトラバーサル | 1 | 2 | 0 | measure: B→A / privilege: S→A；範囲・重複の整理 |
| `buffer-overflow` | バッファオーバーフロー | 1 | 3 | 0 | code: B→A / mitigation: S→A |
| `ids-signature` | シグネチャ | 2 | 2 | 0 | update: S→A |
| `mac` | メッセージ認証符号 | 2 | 1 | 0 | 範囲・重複の整理 |
| `otp` | ワンタイムパスワード | 1 | 2 | 0 | replay: B→A / phishing: S→A；範囲・重複の整理 |
| `risk-based-auth` | リスクベース認証 | 2 | 2 | 0 | ux: S→A |
| `captcha` | CAPTCHA | 1 | 3 | 0 | bot: B→A / solver: S→A |
| `public-key-crypto` | 公開鍵暗号方式 | 2 | 3 | 0 | trust: S→A；別概念へのリンクを分離 |
| `csirt` | CSIRT | 1 | 2 | 0 | types: B→A / soc: S→A；範囲・重複の整理 |
| `soc` | SOC | 1 | 3 | 0 | handover: B→A / mssp: S→A |
| `siem` | SIEM | 2 | 2 | 0 | tuning: S→A |
| `whois` | WHOIS | 1 | 2 | 0 | use: B→A |
| `ddos` | DDoS攻撃 | 2 | 2 | 0 | reflection: S→A |
| `password-attacks` | パスワードリスト攻撃 | 1 | 2 | 0 | measure: B→A / lockout: S→A |
| `social-engineering` | ソーシャルエンジニアリング | 1 | 3 | 0 | examples: B→A / pretext: S→A |
| `open-relay` | 第三者中継 | 1 | 3 | 0 | spam: B→A / blacklist: S→A |
| `crl` | 証明書失効リスト | 1 | 2 | 0 | check: B→A；範囲・重複の整理 |
| `quantum-crypto` | 量子暗号 | 1 | 1 | 0 | distance: S→A；別概念へのリンクを分離 |
| `timing-attack` | タイミング攻撃 | 1 | 1 | 0 | 範囲・重複の整理 |
| `attribute-certificate` | 属性証明書 | 2 | 1 | 0 | 現在の定義・評価範囲を維持 |
| `model-extraction` | モデル抽出攻撃 | 2 | 1 | 0 | measure: S→A；範囲・重複の整理；別概念へのリンクを分離 |
| `reverse-engineering` | リバースエンジニアリング | 1 | 3 | 0 | use: B→A / obfuscate: S→A |
| `cms-asn1` | CMS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `asn1` | ASN.1 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cdn` | CDN | 1 | 2 | 0 | load: B→A；範囲・重複の整理 |
| `sni` | SNI | 1 | 2 | 0 | multi: B→A；範囲・重複の整理 |
| `dns-reflection` | DNSリフレクション攻撃 | 2 | 1 | 0 | 現在の定義・評価範囲を維持 |
| `domain-hijack` | ドメイン名ハイジャック | 1 | 2 | 0 | redirect: B→A；範囲・重複の整理 |
| `provable-security` | 情報理論的安全性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `computational-security` | 計算量的安全性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `dh-key-exchange` | DH鍵共有 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `rsa` | RSA暗号 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ecc` | 楕円曲線暗号 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ic-card` | ICカード | 1 | 2 | 0 | contact: B→A；範囲・重複の整理；別概念へのリンクを分離 |
| `security-orgs` | NIST | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `enisa` | ENISA | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cnapp-family` | CWPP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `casb` | CASB | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `wps` | WPS | 1 | 2 | 0 | pin: B→A |
| `physical-security` | 入退室管理 | 1 | 1 | 0 | tailgate: B→A；範囲・重複の整理 |
| `firewall` | ファイアウォール | 2 | 2 | 0 | 範囲・重複の整理 |
| `uml` | UML | 1 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化 |
| `oop` | オブジェクト指向 | 3 | 2 | 0 | poly: S→B / instance: B→A；範囲・重複の整理 |
| `tuckman` | タックマンモデル | 1 | 2 | 0 | storming: B→A；範囲・重複の整理 |
| `man-month` | 人月 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `effort` | 工数 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `productivity` | 生産性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `handover` | 引継ぎ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `labor-cost` | 人件費 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `effort-distribution` | 作業配分モデル | 1 | 2 | 0 | two: B→A |
| `itsm` | サービスマネジメント | 1 | 1 | 1 | standard: B→S；範囲・重複の整理；自身の論点を明確化 |
| `incident-problem` | インシデント管理 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `incident` | インシデント | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `problem-management` | 問題管理 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `root-cause` | 根本原因 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `slm` | サービスレベル管理 | 2 | 1 | 0 | 範囲・重複の整理 |
| `service-availability` | サービス可用性 | 2 | 2 | 0 | vs-availability: S→A |
| `capacity-continuity` | 容量・能力管理 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `service-continuity` | サービス継続管理 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `audit-standards` | システム監査基準 | 1 | 4 | 0 | independence: B→A / skepticism: B→A / reproducible: S→A；範囲・重複の整理 |
| `audit-procedure` | 監査手続 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `audit-evidence` | 監査証拠 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `preliminary-survey` | 予備調査 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `main-survey` | 本調査 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `audit-techniques` | 監査技法 | 1 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化 |
| `proof-list` | プルーフリスト | 1 | 1 | 0 | match: B→A；範囲・重複の整理 |
| `audit-follow-up` | フォローアップ | 1 | 1 | 0 | who: B→A；範囲・重複の整理 |
| `it-governance` | ITガバナンス | 1 | 1 | 0 | 範囲・重複の整理 |
| `program-management` | プログラムマネジメント | 1 | 2 | 0 | synergy: B→A；範囲・重複の整理 |
| `pmbok` | PMBOK | 1 | 0 | 0 | 範囲・重複の整理 |
| `project-charter` | プロジェクト憲章 | 1 | 2 | 0 | content: B→A |
| `scope-statement` | プロジェクト・スコープ記述書 | 1 | 2 | 0 | exclusion: B→A |
| `wbs` | WBS | 1 | 2 | 0 | package: B→A |
| `schedule-compression` | クラッシング | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `fast-tracking` | ファストトラッキング | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `emv` | 期待金額価値 | 1 | 3 | 0 | choose: B→A / risk: S→A |
| `contingency-plan` | コンティンジェンシープラン | 1 | 1 | 0 | reserve: B→A；範囲・重複の整理 |
| `design-review` | デザインレビュー | 1 | 2 | 0 | rework: B→A；範囲・重複の整理 |
| `scrum` | スクラム | 1 | 4 | 0 | review: B→A / retro: B→A；範囲・重複の整理 |
| `quality-characteristics` | 品質特性 | 1 | 1 | 0 | measure: S→A；範囲・重複の整理；自身の論点を明確化 |
| `reliability-growth` | ソフトウェア信頼度成長モデル | 1 | 2 | 1 | early: S→A / scurve: B→S |
| `low-code` | ローコード開発 | 1 | 3 | 0 | speed: B→A / shadow: S→A |
| `prototyping` | プロトタイピング | 1 | 1 | 0 | clarify: B→A；範囲・重複の整理 |
| `integration-test` | 結合テスト | 1 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化；別概念へのリンクを分離 |
| `backup` | バックアップ方式 | 1 | 2 | 0 | offline: S→A；範囲・重複の整理；自身の論点を明確化；別概念へのリンクを分離 |
| `rlo` | RLO | 1 | 1 | 0 | 現在の定義・評価範囲を維持 |
| `traceability` | トレーサビリティ | 1 | 1 | 0 | benefit: B→A；範囲・重複の整理 |
| `rfi-rfp` | RFI | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `rfp` | RFP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `model-contract` | モデル契約 | 1 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化 |
| `copyright` | 著作権 | 2 | 1 | 0 | scope: B→A；範囲・重複の整理；自身の論点を明確化；別概念へのリンクを分離 |
| `design-act` | 意匠法 | 2 | 1 | 0 | 範囲・重複の整理 |
| `patent` | 特許権 | 2 | 1 | 0 | 定義・説明例または関連リンクを整理 |
| `unfair-competition` | 不正競争防止法 | 1 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化 |
| `trademark` | 商標権 | 2 | 0 | 0 | 範囲・重複の整理 |
| `anonymized-info` | 匿名加工情報 | 1 | 2 | 0 | consent: B→A；範囲・重複の整理 |
| `erp` | ERP | 1 | 4 | 0 | package: B→A / addon: S→A |
| `bpr` | BPR | 1 | 2 | 0 | effect: B→A；範囲・重複の整理 |
| `investment-evaluation` | 投資評価手法 | 1 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化 |
| `balanced-scorecard` | バランススコアカード | 1 | 3 | 0 | kpi: B→A / balance: S→A |
| `ansoff` | アンゾフの成長マトリクス | 1 | 2 | 0 | penetration: B→A；範囲・重複の整理 |
| `mes` | MES | 1 | 2 | 0 | layer: B→A |
| `dx-certification` | DX認定制度 | 1 | 2 | 0 | code: B→A；範囲・重複の整理 |
| `dx-index` | DX推進指標 | 1 | 2 | 0 | two: B→A |
| `environment-analysis` | 環境分析のフレームワーク | 1 | 0 | 0 | 範囲・重複の整理；自身の論点を明確化；別概念へのリンクを分離 |
| `smart-factory` | スマートファクトリー | 1 | 2 | 0 | ot: S→A；範囲・重複の整理 |
| `open-innovation` | オープンイノベーション | 1 | 1 | 0 | 範囲・重複の整理 |
| `co-creation` | コ・クリエーション | 1 | 0 | 0 | 範囲・重複の整理；別概念へのリンクを分離 |
| `darwin-sea` | ダーウィンの海 | 1 | 0 | 0 | 範囲・重複の整理 |
| `chasm` | キャズム | 1 | 1 | 0 | mainstream: B→A；範囲・重複の整理 |
| `mrp` | MRP（資材所要量計画） | 1 | 2 | 0 | net: B→A |
| `corporate-philosophy` | 経営理念 | 1 | 1 | 0 | hierarchy: B→A；範囲・重複の整理 |
| `ems` | EMS | 2 | 0 | 0 | 範囲・重複の整理 |
| `fabless` | ファブレス | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `foundry` | ファウンドリー | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `franchise` | フランチャイズ | 2 | 1 | 0 | 現在の定義・評価範囲を維持 |
| `segmentation` | 市場セグメンテーション | 1 | 2 | 0 | variables: B→A；範囲・重複の整理 |
| `qc-tools` | QC七つ道具 | 1 | 1 | 0 | 範囲・重複の整理；自身の論点を明確化；別概念へのリンクを分離 |
| `backcasting` | バックキャスティング | 1 | 1 | 0 | 範囲・重複の整理；別概念へのリンクを分離 |
| `feasibility-study` | フィージビリティスタディ | 1 | 1 | 0 | decide: B→A；範囲・重複の整理 |
| `delphi` | デルファイ法 | 1 | 1 | 0 | forecast: B→A；範囲・重複の整理；別概念へのリンクを分離 |
| `product-lifecycle` | プロダクトライフサイクル | 1 | 2 | 0 | strategy: B→A |
| `benchmarking` | ベンチマーキング | 1 | 2 | 0 | improve: B→A |
| `aggregation-service` | アグリゲーションサービス | 1 | 2 | 0 | example: B→A |
| `omni-channel` | オムニチャネル | 1 | 1 | 0 | seamless: B→A；範囲・重複の整理 |
| `escrow` | エスクローサービス | 1 | 1 | 0 | trust: B→A |
| `cost-accounting` | 原価計算基準 | 1 | 3 | 0 | three: B→A / exclude: B→A；自身の論点を明確化 |
| `dummy-activity` | ダミー作業 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `duration` | 所要日数 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `drdos` | DRDoS攻撃 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `zero-day-attack` | ゼロデイ攻撃 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `saml` | SAML | 1 | 1 | 0 | verification: B→A |
| `single-sign-on` | シングルサインオン | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `kerberos` | Kerberos | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sha-512-256` | SHA-512/256 | 1 | 0 | 1 | initial-value: A→S |
| `sha-512` | SHA-512 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sha-256` | SHA-256 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `kaminsky-attack` | カミンスキー攻撃 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cryptojacking` | クリプトジャッキング | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `crypto-mining` | マイニング | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `certificate-authority` | 認証局 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `x509` | X.509 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `mirai` | Mirai | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `connect-back` | コネクトバック | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `trojan-horse` | トロイの木馬 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `backdoor` | バックドア | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cps` | CPS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `certificate-policy` | 証明書ポリシー | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `threat` | 脅威 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `risk-identification` | リスク特定 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `risk-evaluation` | リスク評価 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ismap` | ISMAP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cloud-service` | クラウドサービス | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `privacy-mark` | プライバシーマーク | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `isms` | 情報セキュリティマネジメントシステム | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `csf-2` | CSF 2.0 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `csf-govern` | GOVERN | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `risk-management` | リスク管理 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ioc` | IoC | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `side-channel-attack` | サイドチャネル攻撃 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `power-analysis-attack` | 電力解析攻撃 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `tamper-resistance` | 耐タンパー性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `volatility` | 揮発性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `routing-table` | ルーティングテーブル | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `oauth2` | OAuth 2.0 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `authentication` | 認証 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `access-token` | アクセストークン | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `smtp` | SMTP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `router` | ルータ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `collision-domain` | コリジョンドメイン | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `broadcast-domain` | ブロードキャストドメイン | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `spanning-tree` | スパニングツリープロトコル | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `bridge` | ブリッジ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `load-balancing` | 負荷分散 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `http-get` | GETメソッド | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `http-post` | POSTメソッド | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `not-exists` | NOT EXISTS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `correlated-subquery` | 相関副問合せ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sql-null` | NULL | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sonarqube` | SonarQube | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `git` | Git | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `jenkins` | Jenkins | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `snort` | Snort | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `kpt` | KPT | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `downtime` | 停止時間 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `repair-time` | 修復時間 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `compliance` | 準拠性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `digital-certificate` | デジタル証明書 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `command-control-server` | C&Cサーバ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `arp-cache` | ARPキャッシュ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `op25b` | OP25B | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `smtp-auth` | SMTP-AUTH | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `http-protocol` | HTTP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sprint-retrospective` | レトロスペクティブ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sprint-review` | スプリントレビュー | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `service-hours` | サービス提供時間 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `it-control-reliability` | 信頼性（ITの統制目標） | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `symmetric-key` | 共通鍵 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `public-key` | 公開鍵 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `private-key` | 秘密鍵 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `forward-secrecy` | 前方秘匿性 | 1 | 1 | 0 | 現在の定義・評価範囲を維持 |
| `session-key` | セッション鍵 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `blockchain` | ブロックチェーン | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `tls13` | TLS 1.3 | 1 | 1 | 1 | separate-negotiation: A→S；自身の論点を明確化 |
| `aead` | AEAD | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cipher-suite` | 暗号スイート | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `collision-resistance` | 衝突発見困難性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `preimage-resistance` | 原像計算困難性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `birthday-attack` | 誕生日攻撃 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ctr-mode` | CTRモード | 1 | 1 | 0 | counter-unique: B→A |
| `block-cipher` | ブロック暗号 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `padding` | パディング | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cprm` | CPRM | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cppm` | CPPM | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `dtcp` | DTCP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `hdcp` | HDCP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `left-outer-join` | LEFT OUTER JOIN | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `join-condition` | 結合条件 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `full-outer-join` | 完全外部結合 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sql-or` | OR条件 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sql-and` | AND条件 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `data-lineage` | データリネージ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `metadata` | メタデータ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `data-warehouse` | データウェアハウス | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `odbc` | ODBC | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `data-dictionary` | データディクショナリ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `log` | ログ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sql-grant` | GRANT | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sql-grant-option` | WITH GRANT OPTION | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sql-select` | SELECT | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sql-update` | UPDATE | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `referential-integrity` | 参照整合性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sql` | SQL | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `reproduction-right` | 複製権 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `technological-protection` | 技術的保護手段 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `software-license` | 使用許諾契約 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `return-on-investment` | 投資利益率 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `initial-cost` | 初期費用 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `operating-cost` | 運用費 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `incremental-profit` | 利益の増加額 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `business-continuity` | 事業継続 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `supply-chain` | サプライチェーン | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `saas` | SaaS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `paas` | PaaS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `iaas` | IaaS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `internal-audit` | 内部監査 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `management-review` | マネジメントレビュー | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sms` | SMS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ooda` | OODAループ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `continual-improvement` | 継続的改善 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `degressive-charging` | 逓減課金方式 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `progressive-charging` | 逓増課金方式 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `unit-price` | 単価 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `usage-charge` | 利用料金 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `permutation` | 順列 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `combination` | 組合せ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `combination-with-repetition` | 重複組合せ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `icmp` | ICMP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ipv4` | IPv4 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `udp` | UDP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `tcp` | TCP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `txt-record` | TXTレコード | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `pgp` | PGP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `smtp-over-tls` | SMTP over TLS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `privacy-separator` | プライバシーセパレータ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ssid` | SSID | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `mac-filtering` | MACアドレスフィルタリング | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `neighbor-discovery` | 近隣探索 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `private-address` | プライベートアドレス | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `class-d` | クラスD | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `vrrp` | VRRP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `default-gateway` | デフォルトゲートウェイ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `rstp` | RSTP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `rarp` | RARP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `isp` | ISP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `https` | HTTPS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `imaps` | IMAPS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `apop` | APOP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `pop3` | POP3 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sntp` | SNTP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ntp` | NTP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `nntp` | NNTP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `tftp` | TFTP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `igmp` | IGMP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sip` | SIP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ldap` | LDAP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `dmz` | DMZ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `pptp` | PPTP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `network-address` | ネットワークアドレス | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `broadcast-address` | ブロードキャストアドレス | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `host-part` | ホスト部 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `loopback` | ループバック | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `wpa3-enterprise` | WPA3-Enterprise | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `transmission-efficiency` | 伝送効率 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `designated-port` | 代表ポート | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `root-port` | ルートポート | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `root-bridge` | ルートブリッジ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `directed-broadcast` | ディレクテッドブロードキャスト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `limited-broadcast` | リミテッドブロードキャスト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `icmp-redirect` | Redirect | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `icmp-time-exceeded` | Time Exceeded | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ttl` | TTL | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `network-tap` | ネットワークタップ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `wavelength-division-multiplexing` | 波長分割多重 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `layer2-switch` | レイヤー2スイッチ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cache-control` | Cache-Control | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cache-no-store` | no-store | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cache-no-cache` | no-cache | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `shared-cache` | 共有キャッシュ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `unicast` | ユニキャスト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `broadcast` | ブロードキャスト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `aaa` | AAA | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `diameter` | Diameter | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `accounting` | アカウンティング | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `adversarial-examples` | Adversarial Examples | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cvss` | CVSS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `stix` | STIX | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `taxii` | TAXII | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ntp-reflection` | NTPリフレクション攻撃 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `smurf` | Smurf攻撃 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `passkey` | パスキー | 1 | 1 | 0 | local-verification: B→A |
| `fido` | FIDO | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `proxy-authentication-sso` | 代理認証方式 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `soar` | SOAR | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `waf` | WAF | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `false-positive` | フォールスポジティブ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `false-negative` | フォールスネガティブ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `inline-mode` | インラインモード | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `anomaly-detection` | アノマリ型 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `signature-detection` | シグネチャ型 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `clickjacking` | クリックジャッキング | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `x-frame-options` | X-Frame-Options | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `httponly-cookie` | HttpOnly属性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `secure-cookie` | Secure属性 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `hsts` | HSTS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `dtls` | DTLS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `authorization-server` | 認可サーバ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `resource-owner` | リソースオーナー | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `csrf-token` | CSRFトークン | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `http-header-injection` | HTTPヘッダインジェクション | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `session-hijacking` | セッションハイジャック | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `mitb` | MITB攻撃 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `transaction-signing` | トランザクション署名 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `notice` | NOTICE | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `nict` | NICT | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `scap` | SCAP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `dnssec` | DNSSEC | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ismap-liu` | ISMAP-LIU | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sim3` | SIM3 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `samm` | SAMM | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cwe` | CWE | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cpe` | CPE | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `shadow-it` | シャドーIT | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `enhanced-open` | Enhanced Open | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `owe` | OWE | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `dns-caa` | DNS CAA | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `password-spray` | パスワードスプレー攻撃 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `dictionary-attack` | 辞書攻撃 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `brute-force` | 総当たり攻撃 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `keylogger` | キーロガー | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `man-in-the-middle` | 中間者攻撃 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `password` | パスワード | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `osint` | OSINT | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `security-action` | SECURITY ACTION | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ipa` | IPA | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cybersecurity-management-guidelines` | サイバーセキュリティ経営ガイドライン | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cryptrec-project` | CRYPTREC | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ismap-criteria` | ISMAP管理基準 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `csf-1-1` | CSF 1.1 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `authentication-server` | 認証サーバ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `privileged-id` | 特権ID | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `audit-trail` | 監査証跡 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `segregation-of-duties` | 職務の分離 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `access-management` | アクセス管理 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `access-control` | アクセスコントロール | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `access-rights` | アクセス権限 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `user-id` | 利用者ID | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `penetration-test` | ペネトレーションテスト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `shared-responsibility` | 責任共有モデル | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `registration-authority` | RA | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `supplicant` | サプリカント | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `authenticator` | オーセンティケータ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `radius` | RADIUS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `eap` | EAP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ocsp` | OCSP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `placeholder` | プレースホルダ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `wireless-lan` | 無線LAN | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `quantum-key-distribution` | 量子鍵配送 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `parallel-simulation` | 並行シミュレーション | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `general-it-controls` | IT全般統制 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cryptographic-module` | 暗号モジュール | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `fips1403` | FIPS 140-3 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `iso15408` | ISO/IEC 15408 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `iso27002` | ISO/IEC 27002 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `iso27017` | ISO/IEC 27017 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `jisq15001` | JIS Q 15001 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `validation-authority` | VA | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `soap` | SOAP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `xkms` | XKMS | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cmmi` | CMMI | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `branch-coverage` | 判定条件網羅 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `multiple-condition-coverage` | 複数条件網羅 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `white-box-test` | ホワイトボックステスト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `black-box-test` | ブラックボックステスト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `boundary-value` | 境界値 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `tailoring` | テーラリング | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `life-cycle-process` | ライフサイクルプロセス | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `simulation` | シミュレーション | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `chaos-engineering` | カオスエンジニアリング | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `devops` | DevOps | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `test-driven-development` | テスト駆動開発 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `extreme-programming` | XP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `product-backlog` | プロダクトバックログ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `gang-of-four` | GoF | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `design-pattern` | デザインパターン | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `architecture-pattern` | アーキテクチャパターン | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `refactoring` | リファクタリング | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `test-coverage` | カバレージ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `walkthrough` | ウォークスルー | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `formal-methods` | 形式手法 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `inspection` | インスペクション | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `http-referer` | Referer | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `l2tp` | L2TP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `foreign-key` | 外部キー | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `candidate-key` | 候補キー | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `jisq20000` | JIS Q 20000-1 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `top-down-test` | トップダウンテスト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `sandwich-test` | サンドイッチテスト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `detached-signature` | デタッチ署名 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `dns-resolver` | リゾルバ | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `arp` | ARP | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cryptrec-recommended` | 電子政府推奨暗号リスト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cryptrec-candidate` | 推奨候補暗号リスト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cryptrec-monitored` | 運用監視暗号リスト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `cryptographic-compromise` | 危殆化 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `hash-value` | ハッシュ値 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `ntlm` | NTLM認証 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `plaintext-password` | 平文パスワード | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `xor` | 排他的論理和 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `bit` | ビット | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `byte` | バイト | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `audit-risk` | 監査リスク | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `reconnaissance` | 偵察 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `planned-downtime` | 計画停止 | 1 | 0 | 0 | 現在の定義・評価範囲を維持 |
| `forward-proxy` | フォワードプロキシ | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `nosql` | NoSQL | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `eventual-consistency` | 結果整合性 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `enveloped-signature` | エンベロープ署名 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `enveloping-signature` | エンベローピング署名 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `quantum-bit` | 量子ビット | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `superposition` | 重ね合わせ | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `quantum-gate` | 量子ゲート | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `supervised-learning` | 教師あり学習 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `unsupervised-learning` | 教師なし学習 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `reinforcement-learning` | 強化学習 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `inference` | 推論 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `multitask-learning` | マルチタスク学習 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `bubble-sort` | バブルソート | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `insertion-sort` | 挿入ソート | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `heap-sort` | ヒープソート | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `prefix-notation` | 前置記法 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `infix-notation` | 中置記法 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `logical-and` | 論理積 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `logical-or` | 論理和 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `nor` | NOR素子 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `de-morgan` | ド・モルガンの法則 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `ray-tracing` | レイトレーシング | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `radiosity` | ラジオシティ法 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `texture-mapping` | テクスチャマッピング | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `metaball` | メタボール | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `hidden-surface-removal` | 隠面消去 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `bitmap-font` | ビットマップフォント | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `raster-format` | ラスタ形式 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `vector-format` | ベクター形式 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `png` | PNG | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `tiff` | TIFF | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `w3c` | W3C | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `sensor` | センサー | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `fault-avoidance` | フォールトアボイダンス | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `roaming` | ローミング | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `tethering` | テザリング | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `fallback` | フォールバック | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `ping` | ping | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `ipconfig` | ipconfig | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `netstat` | netstat | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `data-poisoning` | データポイズニング | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `capacitive-sensing` | 静電容量方式 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `symmetric-key-crypto` | 共通鍵暗号方式 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `lattice-problem` | 格子問題 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `full-backup` | フルバックアップ | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `differential-backup` | 差分バックアップ | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `incremental-backup` | 増分バックアップ | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `bottom-up-test` | ボトムアップテスト | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `big-bang-test` | ビッグバンテスト | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `test-stub` | スタブ | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `test-driver` | ドライバ | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `swot` | SWOT分析 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `three-c` | 3C分析 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `pest` | PEST分析 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `vrio` | VRIO分析 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `value-chain` | バリューチェーン分析 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `pareto-chart` | パレート図 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `cause-effect-diagram` | 特性要因図 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `matrix-diagram` | マトリックス図 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `relations-diagram` | 連関図 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `brainstorming` | ブレーンストーミング | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `forecasting` | フォアキャスティング | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `mergers-acquisitions` | M&A | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `author-moral-rights` | 著作者人格権 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
| `right-of-integrity` | 同一性保持権 | 1 | 0 | 0 | 別概念から分離。自身の定義をBで確認 |
