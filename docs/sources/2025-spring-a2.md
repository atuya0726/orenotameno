# 令和7年度春期・午前Ⅱの収録情報

- 対象：情報処理安全確保支援士試験 午前Ⅱ、全25問。アプリ上では科目A2相当として扱う。
- 公開一覧の確認日：2026年10月20日。
- 公開元：独立行政法人情報処理推進機構（IPA）。
- 問題・正答の正本：[IPA公式掲載ページ](https://www.ipa.go.jp/shiken/mondai-kaiotu/2025r07.html)。
- [公式問題PDF](https://www.ipa.go.jp/shiken/mondai-kaiotu/nl10bi0000009lh8-att/2025r07h_sc_am2_qs.pdf)
- [公式解答例PDF](https://www.ipa.go.jp/shiken/mondai-kaiotu/nl10bi0000009lh8-att/2025r07h_sc_am2_ans.pdf)

正答は公式解答例PDFのテキストから `scripts/past-exam/fetch.sh` で抽出し、テストには公式解答例から独立して転記した。公式問題PDFは画像のため、本文の入力には公式問題の公開転載である[ぱすてく](https://pasuteku.com/sets/2025r07h-sc-am2)の問題文・選択肢のみを使った。公式問題PDFの問1・2を抜き取り照合し、問3の方式名、問18・20・21の表、問24の条件もページ画像で確認した。第三者サイトの解説は取り込んでいない。

## 表示上の変更

- 英数字と日本語の間の空白、句読点、数式の表記を画面用に整形。
- 問18・20の選択肢の組合せ表を、各選択肢の内容が独立して読める文章に整形。
- 問21の「従業員」表をHTML化。主キーの下線は列名への「主キー」の注記に変更し、SQL文は等幅で表示。結果表の選択肢は、従業員コードの一覧に整形。
- 問24の停止時間・修復時間・メンテナンス時間を箇条書きにし、同問を計算問題として扱う。
- 各問の要点と選択肢ごとの解説は当サイト用に作成。問3では、通常のSHA-512とは初期値が異なる点も補足。
- 各問に復習単語4語を設定し、新規用語68語と既存の用語・別名に対応。認証局と公開鍵基盤、HTTPとHTTPステータスコードなど、別概念になっていた別名の一部を独立用語に分離。既存の用語IDと学習記録は維持。
- 問25の信頼性は、情報セキュリティの性質としての信頼性と区別し、「信頼性（ITの統制目標）」として学習できるようにした。

問題IDは `sc-2025-spring-a2-1` 〜 `sc-2025-spring-a2-25`。

## 正答

| 問 | 正答 | 問 | 正答 | 問 | 正答 |
| --- | --- | --- | --- | --- | --- |
| 1 | ウ | 10 | エ | 19 | エ |
| 2 | ア | 11 | ウ | 20 | イ |
| 3 | ウ | 12 | ウ | 21 | ウ |
| 4 | エ | 13 | ウ | 22 | エ |
| 5 | ア | 14 | ア | 23 | イ |
| 6 | イ | 15 | ア | 24 | ウ |
| 7 | エ | 16 | イ | 25 | エ |
| 8 | ウ | 17 | イ |  |  |
| 9 | ウ | 18 | ア |  |  |

## 解説・用語の確認資料

問題文・正答は上記のIPA資料に従い、解説中の仕様や用語は次の一次資料も参照した。

- SAML：[OASIS SAML 2.0 Technical Overview](https://docs.oasis-open.org/security/saml/Post2.0/sstc-saml-tech-overview-2.0.html)
- SHA-512/256：[NIST FIPS 180-4](https://csrc.nist.gov/pubs/fips/180-4/upd1/final)
- DNSの偽応答対策：[RFC 5452](https://www.rfc-editor.org/rfc/rfc5452.html)
- Mirai：[IPA 情報セキュリティ白書2018](https://www.ipa.go.jp/archive/publish/wp-security/qv6pgp0000000v1y-att/000070313.pdf)
- CPS・CP：[RFC 3647](https://www.rfc-editor.org/rfc/rfc3647.html)
- ISMAP：[制度概要](https://www.ismap.go.jp/csm?id=kb_article_view&sysparm_article=KB0010301)
- CSF 2.0：[NIST CSWP 29](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf)
- 証拠の揮発性と取得順序：[RFC 3227](https://www.rfc-editor.org/rfc/rfc3227.html)
- OAuth 2.0：[RFC 6749](https://www.rfc-editor.org/rfc/rfc6749.html)
- SonarQube：[公式ドキュメント](https://docs.sonarsource.com/sonarqube-community-build/quality-standards-administration/managing-rules/rules)
- スクラム：[スクラムガイド2020](https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-Japanese.pdf)
- ITの統制目標：[金融庁 令和5年4月7日改訂の基準・実施基準](https://www.fsa.go.jp/news/r4/sonota/20230407/1.pdf)（実施基準52ページ）
