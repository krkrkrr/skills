# 木の残り

**設計文書は `SKILL-ja.md` の「どこに何を置くか」にある。ここには繰り返さない。**
以下は、**モデルではないもの**すべて。

```
doc/
  README.md               索引。1 画面。ここから全部たどれる
  testing-strategy.md     どの層を何で守るか。**全体に効く。コンテキスト別ではない**
  questions/              セッションを跨いで残る未解決。
                          **`unresolved-questions` スキルを見ること**
  ADR/NNNN-<decision>.md  決定とその理由。**覆されたものも残す。指し先を付けて**
  reference/              もらった資料。**書き換えない**
  evidence/               測ったこと。**追記のみ。訂正は新しい行で**
  increments/<日付>-<名前>/   requirements.md ほか。**作業が入ったら凍結**
  environment/            **ドメインではない。** 動かし方と確かめ方（`ENV-`）
    deployment.md   features/*.feature

test/  unit/ integration/ e2e/
src/   <module>.<ext>
```

**`evidence/` と `reference/` を分けるのは意図的である。** 前者は「そう見えた」、
後者は「そう書いてある」。混ぜると**根拠の強さが読めなくなる** —
そして、この 2 つは食い違うことが実際にある。

**`increments/` は凍結されており、それが値打ちである。** どう間違え、どう直したかが
そこにある。`context/` が語るのは「いまどうなっているか」だけで、
**両者を分けているからこそ、`context/` が現在だと信じられる。**

## Markdown はすべて OKF の概念

`doc/` は [OKF](https://okf.md/spec/) のバンドルである。中の `.md` はすべて、先頭に
YAML frontmatter を置き、少なくとも `type`、`title`、一文の `description` を持つ。
`type` は木の中の置き場所で決まる。役割一つに型一つなので、型で絞り込めば
ちょうど一種類の文書が得られる。

| ファイル | `type` |
|---|---|
| `README.md` | `Documentation Index` |
| `system-context.md` | `System Context` |
| `use-cases.md` | `Use Case Catalog` |
| `glossary.md` | `Glossary` |
| `context/<bc>/domain-model.md` | `Domain Model` |
| `context/<bc>/object-model.md` | `Object Model` |
| `context/<bc>/constraints.md` | `Constraints` |
| `testing-strategy.md` | `Testing Strategy` |
| `ADR/NNNN-*.md` | `Architecture Decision Record` — ほかの項目は `adr-writing-ja` に従う |
| `questions/<status>/<subject>/NNNN-*.md` | `Question` — `unresolved-questions` に従う。索引は `questions/index.md` |
| `reference/*.md` | `Reference` |
| `evidence/*.md` | `Evidence` |
| `increments/<日付>-<名前>/requirements.md` | `Requirements` |
| `increments/<日付>-<名前>/test-list.md` | `Test List` |
| `environment/*.md` | `Environment` |

```markdown
---
type: Domain Model
title: 課金 — ドメインモデル
description: 課金コンテキストの言葉、集約、対応する src。
---
```

**`doc/README.md` は名前を変えない。** `doc/` を開いたとき GitHub が表示するのはこれで、
上のすべてのフェーズがこの名前で参照している。OKF が予約しているのは `index.md` と
`log.md` だけなので、`type` を持つ `README.md` は普通の適合した概念である。
横に `doc/index.md` を足さない — 索引が 2 つあれば、1 つの事実に置き場所が 2 つある。

**機械の読み手にとって `evidence/` と `reference/` を分けるのは `type` である。**
人にとってはディレクトリがその役を果たす。`Reference` には、出どころを `sources`
（`resource`、`title`、資料に日付があれば `last_modified`）で書く。`Evidence` には
`generated: { by: <測った人>, at: … }` を書く。frontmatter を先頭に足すことは資料の
書き換えではない — 本文は 1 バイトも変わらない — ので、「書き換えない」「追記のみ」
「凍結」には反しない。Markdown ではない資料（PDF、`.feature`、テストコード）は
そのまま置く。OKF は領域固有の形式を置き換えず、参照する側に回る。

**文書間のリンクは相対パスで書く**（`../system-context.md`）。OKF はバンドル基準の
絶対パス（`/system-context.md`）を勧めるが、GitHub は先頭の `/` を `doc/` ではなく
リポジトリのルートから解決するので、人が読むとリンクが切れる。

**機械的に確かめる。** 文書の検査は、`index.md` と `log.md` 以外の `doc/**/*.md` で、
frontmatter に空でない `type` が無いものを失敗にする。予約ファイルの構造、
`description` の欠落、リンク切れまで見るなら
`bash <okf-open-knowledge-format スキルのディレクトリ>/scripts/validate.sh doc` を実行する。

**既存のリポジトリに導入するとき:** 既存の `doc/` の Markdown すべてに、専用の
コミット 1 つで frontmatter を足す。凍結された増分や追記のみの証拠も含める
（許される理由は上のとおり）。半分だけ変換したバンドルは適合せず、
読み手はどちらの半分を信じればよいか分からない。
