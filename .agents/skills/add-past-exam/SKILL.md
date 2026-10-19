---
name: add-past-exam
description: Add an IPA past-exam section (e.g. SC 午前Ⅱ / 科目A2, 高度午前Ⅰ / 科目A1) to this app with original explanations, review-word candidates, and matching glossary terms. Use when asked to 「問題を足して」「過去問を追加」「A1/A2を増やして」 or to grow the glossary from newly added questions.
---

# 過去問の追加（IPA）

この手順は Claude Code と Codex の両方で使う。機械的な部分はスクリプトに任せ、モデルは「解説を書く」「図表を確認する」「用語を書く」だけに集中する。

## 0. 何を追加するか

- 引数がなければ、`src/data/questions.ts` で収録済みのセットを確認し、IPAの公開一覧で次に新しい未収録分を選ぶ。
- 科目の対応は `am1` → A1（試験コード `koudo`、共通の午前Ⅰ）、`am2` → A2（例：`sc`）。

## 1. 取得と下書きの作成（自動）

```sh
scripts/past-exam/fetch.sh sc 2025 autumn am2   # <試験> <西暦> <autumn|spring> <am1|am2>
```

`.cache/past-exam/<key>/` に次のファイルを作る（gitには含めない）。

- `qs.pdf` / `ans.pdf`：公式PDF。正答は `ans.pdf` のテキストから抽出する。
- `pages/pNN.png`：問題ページの画像。表紙と白紙のメモ用紙は除く。
- `draft.json`：問題文・選択肢・正答と、目で確認が必要な点（`check`）。
- `skeleton.ts`：`src/data/<id>.ts` の雛形。問題文・選択肢・正答・URLは入力済みで、`TODO` だけが残る。

問題文はぱすてくの公開転載から取り込む（問題文と選択肢だけで、第三者の解説は捨てる）。取得できなければ `check` に `transcription missing` が出る。その場合はページ画像から入力する。

## 2. 確認（必要な箇所だけ見る）

- 出力で `check` が付いた問題のページ画像だけを開く（図・表・数式）。全ページを読まない。
- ほかのページは1枚だけ抜き取り、問題文が公式と一致するかを確認する。
- 問題文に図があれば、必ずSVGで描いて載せる（文章の箇条書きで済ませない）。表やマトリクスのように表で表せる図だけは `table` にする。
  - SVGは `src/data/figures/<内容>.ts` に `String.raw` の文字列として書き（例：`intermittent-current.ts`）、`figure: { caption, svg }` で渡す。tsxスクリプトからも読めるよう `?raw` のインポートは使わない。
  - 線と文字は `currentColor` で描く。`<title>` に図の内容を文章で書き、`id` には図ごとの接頭辞を付けて他の図と重ならないようにする。
  - 描いたら `pages/pNN.png` の原図と並べて見比べる。`marker-start`/`marker-end` は1つのpathの最初と最後にしか付かないので、矢印ごとにpathを分ける。
- 条件の箇条書きは `details` を使う。数式は `String.raw` とKaTeXの `\(...\)` で書く。
- 計算問題の番号を `calculation` に入れる。

## 3. データファイル

1. `skeleton.ts` を `src/data/<exam>-<year>-<season>-<a1|a2>.ts` にコピーし、`examName` と全ての `TODO` を埋める。
   - `examName`：午前Ⅰは `高度試験・情報処理安全確保支援士試験`、SCの午前Ⅱは `情報処理安全確保支援士試験`。
   - 解説は独自に書く（です・ます調）。選択肢ごとに「何の説明か／なぜ違うか」を1〜2文で書く。全体の解説では判断の手掛かりを示す。計算問題では、誤りの選択肢の値がどの誤りから出るかを実際に計算して確かめる。
2. `src/data/questions.ts` の `questions` に追加し、`courses` の `description` を更新する。
   - 分野（`q()`の第2引数）は既存の名前を使う。新しい名前を使ったら `src/data/fields.ts` のどれかの分野に追加する（`fields.test.ts`が漏れを検出する）。
3. `src/data/question-terms.ts` に問題ごとの復習単語の候補（4〜8語）を追加し、`sets` に登録する。各語は問題文・選択肢・解説のどこかに必ず含める（テストで検査する）。
4. テスト：`src/data/sc-2025-autumn-a2.test.ts` をコピーし、件数・正答（`ans.pdf` から独立に転記）・表のある問題・計算問題を合わせる。
5. `docs/sources/<year>-<season>-<a1|a2>.md` を既存の形式で作る。README の収録内容を更新する。

## 4. 用語集を増やす

復習単語の候補は、すべて用語集のいずれかの用語で開けるようにする（`src/data/question-terms.test.ts` が検査する）。用語は名前のほか、かっこ内の表記（`PKI（公開鍵基盤）` なら `PKI` と `公開鍵基盤`）と `aliases` で単語に対応する。対応していない単語は次のコマンドで一覧にする。

```sh
npx tsx scripts/past-exam/missing-terms.ts sc-2025-autumn-a2   # 引数は問題IDの接頭辞（省略で全問）
```

既存の用語は次のコマンドで確認する（`terms.ts` 全体は読まない）。

```sh
grep -E '^    "(id|name|category)"' src/features/glossary/terms.ts | paste - - -
```

単語ごとに次のどちらかで対応させる。

- **既存の用語の別名にする**：表記ゆれ（`ハッシュ値`→ハッシュ関数）や、その用語の説明に含まれる下位の語（`MTBF`→MTBFとMTTR）。説明しても別の概念になる語は別名にしない（`ディープウェブ`をディープフェイクの別名にしない）。

  ```sh
  node scripts/past-exam/add-aliases.mjs /path/to/aliases.json   # {"<用語ID>": ["別名", ...]}
  ```

- **新しい用語を作る**：一緒に説明するのが自然な語は1つの用語にまとめ、残りを `aliases` に入れる（`クラッシングとファストトラッキング`）。JSONの配列で一時ファイルに書き、スクリプトで追加する。IDの重複、名前・別名の重複（大文字小文字や全角半角の違いも同じとみなす）、存在しない `related`、B段階の要点がないことはスクリプトが拒否する。

  ```sh
  node scripts/past-exam/add-terms.mjs /path/to/new-terms.json
  ```

各用語の形式は `Term`（`src/features/glossary/model.ts`）。`criteria` の `level` は出題頻度で決める。省略するとB（基本）、Aは応用、Sは発展。1語につきBを2〜4個、Aを1〜2個、Sを1個にする。`commonMistakes` には、問題の誤りの選択肢になっていた混同を書く。別名にした語も、説明例や要点で扱う。

## 5. 検証

```sh
npx vitest run && npm run check && npm run build
npx playwright test tests/learning.spec.ts -g "questions"
```

- `src/server/glossary-evaluator.test.ts` は、用語集にない語を「未知の用語」の例に使っている。追加した用語と重なったら、例を別の語に変える。
- 件数を前提にしたE2E（`tests/learning.spec.ts` の収録数のテスト）を更新する。
- 図表を含む問題は、開発サーバーで1問だけスクリーンショットを撮り、`.katex-error` がないことを確認する。

## 注意

- 正答は必ず公式の `ans.pdf` に従う。転載サイトの正答とは照合しない。
- 第三者サイトの解説や図は転載しない。
- コミットは、ユーザーに頼まれたときだけ行う。
