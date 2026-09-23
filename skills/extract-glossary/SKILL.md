---
name: extract-glossary
description: 指定されたリポジトリ、複数リポジトリ、または GitHub organization から、ドメイン固有の専門用語、業界用語、社内・プロダクト用語、リポジトリ実装マップ、技術構成、オンボーディング向け Mermaid 構成図を抽出し、OKF（Open Knowledge Format）のナレッジバンドルとして生成するときに使う。ユーザーが「用語集を作る」「ドメイン辞書を作る」「オンボーディング資料にする」「repo/org を見て専門用語をまとめる」「AI が再確認しなくてよい知識ベースを作る」と依頼したら起動する。既存の用語集を OKF に移したいときにも使う。
license: MIT
---

# extract-glossary

指定されたコードベースから、人間のオンボーディング資料兼 AI の再確認防止用ナレッジを作るためのスキル。
成果物は「用語」「リポジトリ」「技術構成（図を含む）」の三種類の概念からなる **OKF バンドル**にする。

## 目的

- 新規参加者が、業界用語・組織内用語・実装固有名を短時間で読めるようにする。
- AI エージェントが同じ用語や構成を毎回聞き返さず、既存資料を参照して作業できるようにする。
- コードベースの説明を、推測ではなく README/docs/schema/IaC/code 上の根拠に結びつける。

## なぜ OKF で書くか

この成果物は、書いた本人ではなく、別の人、別のエージェント、別のツールが後から読むためのものだ。
[OKF](https://okf.md/spec/) は、そういう交換されるナレッジのための最小限の約束事である。
Markdown ファイル一つが一つの概念になり、YAML frontmatter の `type` だけが必須になる。
この約束に乗ると、次のことが道具なしで成り立つ。

- エージェントは各ディレクトリの `index.md` から必要な概念だけを開ける（段階的開示）。一枚の巨大な `glossary.md` を毎回全部読む必要がない。
- 用語一つに一つのファイル（概念 ID）があるので、別の用語、別のリポジトリ説明、別プロジェクトの文書から一つの用語へ直接リンクできる。
- 根拠（`sources`）、確度、誰が生成したか（`generated`）が frontmatter にあるので、読み手は本文を読む前に信頼度を判断できる。

仕様の詳細、検証、既存 Markdown の変換は `../okf-open-knowledge-format/SKILL.md` にある。
このスキルは、用語集という用途に合わせた型と構成を定める。

## 入力として受け取るもの

以下のどれでもよい。

- ローカル checkout のパス: `../repo`, `~/ghq/github.com/org/repo`
- GitHub URL: `https://github.com/org/repo`
- 複数リポジトリのリスト
- GitHub organization 名と絞り込み条件
- 出力先: 既存 repo の docs、`.claude/skills/<domain>-glossary/`、任意のディレクトリ

入力が曖昧な場合は、まず候補 repo と出力先を確認する。ただしローカルや GitHub から合理的に特定できる場合は探索を始める。

## 成果物の標準構成

バンドルの構成は、出力先がスキルでも docs でも同じにする。

```text
<bundle>/
├── index.md              # バンドルの入口。okf_version と「読む順番」
├── log.md                # 調査の履歴（いつ、どの repo のどのコミットを見たか）
├── terms/
│   ├── index.md          # 分類ごとの用語一覧（生成する）
│   └── <term-slug>.md    # type: Glossary Term（1 用語 1 ファイル）
├── repositories/
│   ├── index.md
│   └── <repo-name>.md    # type: Repository（1 repo 1 ファイル）
└── architecture/
    ├── index.md
    └── <topic>.md        # type: Architecture（1 観点 1 ファイル、図はここに入れる）
```

スキルとして作る場合は、バンドルを `references/` に置き、`SKILL.md` はその外に置く。
OKF では、バンドル内の `index.md` と `log.md` 以外のすべての `.md` に `type` が要る。
`SKILL.md` の frontmatter には `type` がないので、バンドルの中に入れると不適合になるからだ。

```text
<domain>-glossary/
├── SKILL.md              # 「references/index.md から読む」ことと、どの概念をいつ開くかだけを書く
└── references/           # ← バンドルのルート
    ├── index.md
    └── terms/ repositories/ architecture/ ...
```

docs として作る場合は、`docs/knowledge/` のようにバンドル専用のディレクトリを一つ切る。
既存の docs と混ぜると、`type` のない既存ファイルがバンドルを不適合にする。

ファイル名（概念 ID）は ASCII の kebab-case にする。
日本語の用語は、英語表記かローマ字にする（`入稿` → `nyuko.md`、`Placement` → `placement.md`）。
概念 ID はリンク先として他の文書から参照されるので、後から変えない。

## frontmatter の約束

三種類の概念に共通する項目は次のとおり。

| キー | 必須 | 内容 |
| --- | --- | --- |
| `type` | 必須 | `Glossary Term` / `Repository` / `Architecture` のいずれか。バンドル内で表記を揺らさない。 |
| `title` | 推奨 | 表示名。用語なら用語そのもの。 |
| `description` | 推奨 | 一文の要約。`index.md` の各行にそのまま使われるので、一文で意味が通るように書く。 |
| `resource` | 該当時 | その概念が指す実体の URL。repo なら repo の URL、実装固有名ならそのディレクトリやファイルの URL。抽象概念（業界用語など）には付けない。 |
| `sources` | 推奨 | 根拠にした文書の一覧。各項目に `id`、`resource`（GitHub URL）、`title`。本文の主張には `[^id]` の脚注で対応づける。 |
| `generated` | 推奨 | `{ by: claude-code/<model-id>, at: <ISO 8601 UTC> }`。人が書いたなら `by: human:<id>`。 |
| `status` | 該当時 | 確度が `confirmed` でない概念には `draft` を付ける（後述）。 |

`verified` は、人間が実際に内容を確認したときだけ `{ by: human:<id>, at: ... }` で付ける。
エージェントがコードを読んで裏付けたことは `verified` ではなく、`sources` と `confidence: confirmed` で表す。
OKF では `verified` の有無で信頼の段階が決まるので、確認していない `verified` は読み手を誤らせる。

## 調査手順

### 1. スコープを確定する

1. 対象 repo/org と対象 branch/commit を確認する。
2. local checkout がある場合は `git remote -v` と `git rev-parse HEAD` を確認する。
3. GitHub 上の repo を見る場合は default branch と URL を確認する。
4. 成果物には、機械固有のローカルパスではなく GitHub URL を載せる。

ローカルパスを使って調査してもよいが、最終成果物では以下のように変換する。

```text
/Users/me/ghq/github.com/org/repo/docs/foo.md
-> https://github.com/org/repo/blob/<branch-or-sha>/docs/foo.md
```

調査したコミットは `log.md` に残す。
用語集はコードより遅れて古くなるので、どの時点の repo を見て書いたかが、後で読む人の判断材料になる。

### 2. コーパスを作る

優先して読むもの:

- `README.md`, `CLAUDE.md`, `AGENTS.md`, `docs/`, `adr/`, `design/`, `architecture/`
- `openapi.yaml`, GraphQL schema, Protocol Buffers, SQL schema, migration, DB docs
- Terraform, Packer, CDK, SAM, Helm, Kubernetes, GitHub Actions, deploy docs
- package manifests: `package.json`, `go.mod`, `Cargo.toml`, `composer.json`, `pyproject.toml`, etc.
- entrypoints and routing: `main.*`, `routes.*`, controller/resolver/handler files
- 対象 repo にすでに OKF バンドル（`type:` を持つ Markdown の集まり）があれば、それも読む。重複して作らず、既存の概念にリンクするか追記する。

避けるもの:

- `node_modules`, `vendor`, generated code, build artifacts, minified files, lockfile details
- 大量ログや fixture を主情報源にすること
- 名前だけから断定すること

探索にはまず `rg --files` と `rg` を使う。

### 3. 用語を概念にする

用語は必ず分類する。

| 分類 | 例 | 判断基準 |
| --- | --- | --- |
| 業界用語 | RTB, SSP, VAST, OAuth, ETL | 社外でも通じる標準・業界語。 |
| ドメイン用語 | Publisher, Campaign, Order, Placement | 事業領域の概念。社外語でもプロダクト内の意味を持つ。 |
| 組織内用語 | 略称、旧称、チーム固有名 | README/docs/code に出るが外部標準ではない。 |
| 実装固有名 | service 名、directory 名、table prefix | コードベース内の構成要素。 |
| インフラ用語 | ECS, Snowflake, Meilisearch, Packer | 技術基盤として理解が必要な語。 |

1 用語を `terms/<term-slug>.md` の 1 ファイルにする。
分類と確度は OKF の拡張キーとして frontmatter に書く（OKF は producer が独自のキーを足すことを認めている）。

- `category`: 上の表の分類名のどれか一つ。`terms/index.md` はこのキーで節を分ける。
- `confidence`: `confirmed`（根拠の文書に明記されている）/ `inferred`（名前や配置からの推定）/ `needs-check`（根拠が弱い、または矛盾する）。
- `aliases`: 略語の展開形、旧称、表記揺れ。検索で見つけられるようにする。

`confidence` が `inferred` か `needs-check` なら、`status: draft` も付ける。
OKF では `status` がなければ `stable`（読んでよい確定情報）とみなされる。
推定の用語を `stable` のまま出すと、`confidence` を知らない汎用の読み手が推定を事実として扱ってしまうからだ。
`inferred` の用語は、本文でも断定文にしない。

```markdown
---
type: Glossary Term
title: SSP
description: 媒体社の広告枠を複数の買い手へまとめて販売するためのプラットフォーム。
category: 業界用語
confidence: confirmed
aliases: [Supply-Side Platform]
sources:
  - id: bidder-readme
    resource: https://github.com/org/bidder/blob/3f9c2e1/README.md
    title: org/bidder README
generated: { by: claude-code/claude-opus-5-5, at: 2026-09-23T10:00:00Z }
---

# 意味

媒体社側の在庫を、複数の DSP からの入札にかけて販売する仕組み。
このプロダクトでは、SSP から届く入札リクエストを bidder が受ける。[^bidder-readme]

# 実装・参照

- [bidder](../repositories/bidder.md) — `internal/ssp/` に SSP ごとのアダプタがある。

# 注意点

- [DSP](dsp.md) と取り違えやすい。SSP は売り手側、DSP は買い手側。

[^bidder-readme]: org/bidder README
```

本文の見出しは `# 意味`、`# 実装・参照`、`# 注意点` を基本にする。
混同しやすい語は、その語の概念ファイルへリンクする。
リンク先がまだなくても書いてよい（OKF はリンク切れを「まだ書かれていない知識」として許す）。

### 4. リポジトリを概念にする

repo ごとに `repositories/<repo-name>.md` を作る。
`type: Repository`、`resource` に repo の URL、拡張キー `commit` に調査したコミット SHA を書く。
本文には以下をまとめる。

- `# 責務` — 何を実装しているか
- `# 主要コンポーネント` — 主要 component / directory
- `# 技術スタック`
- `# 最初に読むファイル` — 入口になる README/docs/source files
- `# 依存` — 他 repo との通信・データ依存。相手の repo の概念へリンクする
- `# 境界` — DB/schema/API/protocol の境界

複数 repo の関係は、まず粗い repo-level の対応表を `architecture/repository-overview.md` に作り、次に重要 repo だけ component-level に分解する。

### 5. 技術構成・インフラ構成を概念にする

観点ごとに `architecture/<topic>.md`（`type: Architecture`）を一つ作る。
最低限、以下の観点を分ける。

- runtime request flow
- config / master data flow
- batch / ETL / report flow
- auth / identity / user data flow
- DB / search / cache / object storage
- cloud resources and IaC ownership
- deploy / rollback / observability
- local development prerequisites

クラウド構成は「どのサービスを使っているか」と「どの repo が管理しているか」を分ける。
本文の中で出てくる用語と repo は、`terms/` と `repositories/` の概念へリンクする。

## Mermaid 図の作り方

図は、その図が説明する観点の概念ファイルの `# 図` 節に置く。
独立した図のファイルは作らない。
図と説明文が別ファイルにあると、片方だけ更新されて食い違う。

巨大な一枚図にしない。1 図 1 トピックにする。

推奨する小図と置き場所:

| 図 | 目的 | 置く概念 |
| --- | --- | --- |
| repository overview | repo 間の大まかな責務と依存だけを見る。 | `architecture/repository-overview.md` |
| config/data path | 管理画面や DB の設定が runtime に届く流れを見る。 | `architecture/config-data-flow.md` |
| request sequence | 実リクエストの runtime 通信を見る。sequenceDiagram を優先する。 | `architecture/runtime-request-flow.md` |
| integration entries | 外部 partner、webhook、protocol endpoint など入口別に見る。 | `architecture/integration-entries.md` |
| infra ownership | Terraform/CDK/SAM などが何を管理するかを見る。 | `architecture/infra-ownership.md` |
| data pipeline | log/report/warehouse/search/indexing の流れを見る。 | `architecture/data-pipeline.md` |

図の制約:

- 1 図あたり 10 ノード前後、15 edge 前後を目安にする。
- Mermaid の `subgraph` を深くしすぎない。重なりや長い交差線が出たら分割する。
- edge label は短くする。説明は本文に逃がす。
- protocol/schema の詳細図は、ユーザーが明示的に求めた場合だけ作る。
- 生成物、schema、runtime 通信を同じ図に混ぜない。
- レンダリング結果が読みにくいなら、図を増やして分割する。一つの概念に図が増えすぎたら、概念ごと分ける。

## index.md と log.md

各ディレクトリの `index.md` は手で書かず、frontmatter の `title` と `description` から生成する。
手で書いた一覧は、概念を足したときに更新漏れが起きる。

```bash
S=<このスキルのディレクトリ>/scripts/okf-index.sh
bash "$S" <bundle>/terms category          # 分類ごとの節に分ける
bash "$S" <bundle>/repositories "" リポジトリ
bash "$S" <bundle>/architecture "" 技術構成
```

バンドルのルートの `index.md` だけは手で書く。
OKF で frontmatter を持てる `index.md` はここだけで、`okf_version` を宣言する。
本文には、オンボーディングで読む順番と、調査の入口を書く。

```markdown
---
okf_version: "0.2"
---

# 最初に読む

* [リポジトリ全体図](architecture/repository-overview.md) - どの repo が何を担うか
* [用語](terms/) - 業界用語・ドメイン用語・組織内用語・実装固有名・インフラ用語
* [リポジトリ](repositories/) - repo ごとの責務と、最初に読むファイル

# 技術構成

* [技術構成](architecture/) - リクエスト経路、データの流れ、インフラの管理者
```

`log.md` には、日付（`## YYYY-MM-DD`、新しい順）ごとに、何を調査して何を足したかを書く。

```markdown
# Update Log

## 2026-09-23
* **Creation**: org/bidder@3f9c2e1 と org/console@a1b2c3d を調査し、用語 42 件と repo 2 件を追加。
```

## リンクの書き方

概念同士のリンクは相対パス（`../repositories/bidder.md`、`dsp.md`）で書く。
OKF は `/terms/dsp.md` のようなバンドル基準の絶対パスを推奨しているが、バンドルがリポジトリのサブディレクトリにあると、GitHub は先頭の `/` をリポジトリのルートとして解決し、人間の読み手にとってリンクが切れる。
相対パスは OKF でも正式に認められている。

## 出典・URL ルール

- 成果物にはローカル絶対パスや `../repo` を載せない。
- 参照元は GitHub URL、公式 docs URL、またはユーザーが指定した永続 URL にする。`sources[].resource` と `resource` も同じ。
- GitHub URL はできるだけコミット SHA で固定する。ブランチ名の URL は、後で内容が変わっても気づけない。
- local checkout で調査した場合も、remote URL と branch/commit から GitHub URL に変換する。
- private repo で URL が読めない可能性がある場合でも、読者が権限を持てば辿れる URL を載せる。
- 不確かな場合は `confidence: needs-check` とし、根拠の弱さを本文にも明示する。

## 品質チェック

提出前に以下を確認する。

```bash
# OKF 適合（type の有無、index.md / log.md の構造など）
bash <このスキルのディレクトリ>/../okf-open-knowledge-format/scripts/validate.sh <bundle>
# 上のスキルがない場合の最低限の確認: type のない概念を列挙する
find <bundle> -name '*.md' ! -name index.md ! -name log.md \
  -exec sh -c 'sed -n "1,/^---$/{/^type: ./q0};\$q1" "$1" >/dev/null || echo "type なし: $1"' _ {} \;

# ローカルパス漏れ
rg -n -F '../repo' <bundle>
rg -n '/Users/|/home/' <bundle>

# Markdown の基本チェック
git diff --check

# Mermaid block 数と fence 対応
rg -n '(^```mermaid|^```$|^flowchart|^sequenceDiagram)' <bundle>/architecture

# mmdc があればレンダリング確認
command -v mmdc && for f in <bundle>/architecture/*.md; do mmdc -i "$f" -o "/tmp/$(basename "$f" .md).svg"; done
```

`validate.sh` の `W1`（`title` / `description` がない）は、このスキルでは直す。`index.md` の各行が空になるからだ。
`mmdc` がない場合は、その旨を最終報告に書く。

## 既存の用語集を移す

`glossary.md` のような一枚の用語集がすでにある場合は、表の一行を一つの `terms/<slug>.md` に分け、分類と確度を frontmatter に移す。
元の一枚ファイルは、移行したことを書いた短い案内にするか、ユーザーの了承を得て削除する。
二つを並べて残すと、どちらが最新かわからなくなる。

## 回答時の注意

- 「現時点の repo 上では」と「推定」を分ける。frontmatter の `confidence` と本文の書き方を一致させる。
- 業界用語と組織内用語を混ぜない。
- 成果物の用途が onboarding なら、ルートの `index.md` に読む順番と調査入口を必ず入れる。
- AI 用 skill にする場合、`SKILL.md` は薄く保ち、「`references/index.md` から読み、必要な概念だけを開く」ことを書く。詳細はバンドルに置く。
- 最終報告には、概念の数（用語・repo・技術構成）、`confidence` ごとの件数、`validate.sh` の結果を含める。
- ユーザーが commit/push/PR を求めた場合だけ git publish flow に進む。
