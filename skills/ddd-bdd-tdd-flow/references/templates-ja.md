# テンプレート — ADR と README.md

ADR を書くとき（どのフェーズでも）、またはフェーズの境界でルートの `README.md` を
更新するときに読む。**進め方そのものは `SKILL-ja.md` にある。ここにあるのは形だけ。**

---

## アーキテクチャ決定記録（ADR）

いずれかのフェーズで重要なアーキテクチャ・設計上の決定が行われたときは、ADR として記録する。

**ADR を作成するタイミング:**
- 技術やフレームワークを選択したとき（例: 「SQLite より PostgreSQL を使う」）
- 設計パターンやアーキテクチャスタイルを採用したとき（例: 「Order 集約に CQRS を使う」）
- 既知のトレードオフを受け入れたとき
- 将来の読者のために却下した代替案を残す価値があるとき

**ファイル:** `doc/ADR/NNNN-<kebab-case-title>.md`（ゼロパディング 4 桁、例: `doc/ADR/0001-use-event-sourcing.md`）

**フォーマット（Nygard）:**

```markdown
# ADR-NNNN: <title>

## Status

Proposed | Accepted | Deprecated | Superseded by [ADR-NNNN](NNNN-<title>.md)

## Context

<この決定に至った状況・力・制約を記述する。>

## Decision

<能動態で決定を述べる: "We will…">

## Consequences

<この決定の正と負の帰結を列挙する。>
```

ADR はフェーズの終わりにまとめて作成するのではなく、決定が行われたその場で即座に作成する。ユーザーが後で決定を変更した場合は、古い ADR の `Status` を `Superseded by ADR-NNNN` に更新し、新しい ADR を作成する。

---

---

### README.md ライフサイクル

`README.md` はリポジトリルートに置く。フェーズ 1 で作成し、以降のフェーズごとに新しいセクションを追記する。以下のプログレッシブテンプレートを使用する — 各フェーズが完了するまで、そのフェーズのセクションはコメントのまま残す:

````markdown
# <フィーチャー名>

> <フェーズ 1 で得た一行説明>

## Status

Phase N complete — <フェーズ名>

## Overview

<課題説明と受け入れ基準 — フェーズ 1 で記入>

## Domain Model

<!-- フェーズ 2 で追記 -->
[システムコンテキスト](doc/system-context.md) / [用語集](doc/glossary.md) — 1 行で

## Features / Behavior

<!-- フェーズ 3 で追記 -->
| フィーチャーファイル | 説明 |
|---|---|
| [name.feature](doc/context/<bc>/features/name.feature) | ... |

## Testing

<!-- フェーズ 4 で追記 -->
- **プロパティテスト（インテグレーション）:** `test/integration/` — <PBT ライブラリ> を使用
- **プロパティテスト（E2E）:** `test/e2e/` — フルスタック、モックなし

## Usage

<!-- フェーズ 5 で追記 -->
<アプリ/フィーチャーの実行方法>

## Development

<!-- フェーズ 5 で追記 -->
<ビルドとテスト実行の方法>
````

各セクションを記入したらプレースホルダーコメントを削除する。フェーズ 5 完了時点で README にコメントプレースホルダーが残っていてはならない。

---
