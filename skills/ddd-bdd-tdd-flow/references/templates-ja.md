# テンプレート

次の形を書く直前に読む。**進め方そのものは `SKILL-ja.md` にある。ここにあるのは形だけ。**

- アーキテクチャ決定記録（ADR）
- ルートの README.md と doc/README.md の年表
- フィーチャーファイル（フェーズ 3）
- プロパティ表（フェーズ 4a）
- プロパティベーステスト（フェーズ 4b）
- テストリスト（フェーズ 5a）

---

## アーキテクチャ決定記録（ADR）

いずれかのフェーズで重要なアーキテクチャ・設計上の決定が行われたときは、ADR として記録する。
`adr-writing-ja` スキルがあれば、この節ではなくそちらに従う。

**ADR を作成するタイミング:**
- 技術やフレームワークを選択したとき（例: 「SQLite より PostgreSQL を使う」）
- 設計パターンやアーキテクチャスタイルを採用したとき（例: 「Order 集約に CQRS を使う」）
- 既知のトレードオフを受け入れたとき
- 将来の読者のために却下した代替案を残す価値があるとき

**ファイル:** `doc/ADR/NNNN-<kebab-case-title>.md`（ゼロパディング 4 桁、例: `doc/ADR/0001-use-event-sourcing.md`）

**フォーマット（Nygard）:**

```markdown
---
type: Architecture Decision Record
title: "ADR-NNNN: <title>"
description: <決定を一文で>
status: draft   # Proposed → draft、Accepted → stable、Rejected / Deprecated / Superseded → deprecated
---

# ADR-NNNN: <title>

## Status

Proposed | Accepted | Rejected | Deprecated | Superseded by [ADR-NNNN](NNNN-<title>.md)

## Context

<この決定に至った状況・力・制約を記述する。>

## Decision

<能動態で決定を述べる: "We will…">

## Consequences

<この決定の正と負の帰結を列挙する。>
```

ADR はフェーズの終わりにまとめず、決定したその場で `Proposed` として作成する。
`Accepted` にするのは、ユーザーが明示的に承認したときだけ。
ユーザーが後で決定を変えた場合は、`Supersedes [ADR-MMMM](MMMM-<title>.md)` と書いた新しい ADR を `Proposed` で作成する。
古い ADR の `Status` を `Superseded by ADR-NNNN` にするのは、新しい ADR が承認されたときで、同じコミットで行い、本文には触れない。
frontmatter の `status` は、同じ編集で `Status` 行に合わせる。OKF の読み手は `status` の無いファイルを現役とみなすので、置き換えられた ADR が `stable` のままだと、生きた決定として読まれる。

---

## ルートの README.md と doc/README.md の年表

**フィーチャーごとにルートの `README.md` へ節を足さない。** リポジトリにまだないときに
1 度だけ作り、**100 行以下**に保つ:

```markdown
# <アプリ名>

> <1 行の説明>

## 実行

<アプリの起動方法>

## テスト

<全テストの実行方法>

## ドキュメント

設計・決定・履歴: [doc/README.md](doc/README.md)
```

以降は、アプリやテストの実行方法が変わったときだけ更新する。

**増分は `doc/README.md` の年表に 1 行ずつ記録する。** フェーズ 1 で行を足し、
フェーズの境界ごとに Status を更新する:

`doc/README.md` 自体も OKF の概念なので（`references/layout-ja.md`）、先頭に frontmatter を置く:

```markdown
---
type: Documentation Index
title: <アプリ名> — ドキュメント
description: <アプリ名> の設計・決定・履歴の置き場所と、増分の年表。
---
```

```markdown
## 年表

| 日付 | 増分 | コンテキスト | Status |
|---|---|---|---|
| 2026-09-23 | [user-authentication](increments/2026-09-23-user-authentication/) | identity, billing | Phase 3 complete — features: [login](context/identity/features/login.feature) |
```

---

## フィーチャーファイル（フェーズ 3）

```gherkin
Feature: <Use case name>
  As a <actor>
  I want to <action>
  So that <business value>

  Background:
    Given <common precondition>

  Scenario: Happy path — <name>
    Given <precondition>
    When <actor performs action>
    Then <expected outcome>
    And <additional assertion>

  Scenario: Error — <name>
    Given <invalid state>
    When <actor performs action>
    Then an error "<message>" is returned

  Scenario Outline: Boundary — <name>
    Given a <entity> with "<param>"
    When <action>
    Then the result is "<expected>"
    Examples:
      | param | expected |
      | ...   | ...      |
```

---

## プロパティ表（フェーズ 4a）

`doc/context/<bc>/constraints.md` の `## Invariants` 節に追記する:

```markdown
## <Use case name>

| プロパティ | 種別 | 表現 |
|---|---|---|
| 残高が負にならない | 不変量 | `∀ deposit d: balance(after) ≥ 0` |
| シリアライズのラウンドトリップ | ラウンドトリップ | `decode(encode(x)) == x` |
```

---

## プロパティベーステスト（フェーズ 4b）

```typescript
// fast-check の例
import * as fc from "fast-check";

test("balance invariant: never negative after valid deposit", () => {
  fc.assert(
    fc.property(fc.integer({ min: 1, max: 1_000_000 }), (amount) => {
      const account = Account.empty();
      account.deposit(amount);
      expect(account.balance).toBeGreaterThanOrEqual(0);
    })
  );
});
```

---

## テストリスト（フェーズ 5a）

```markdown
## テストリスト

- [ ] <シナリオ: ハッピーパス> — unit
- [ ] <シナリオ: エラーケース> — unit
- [ ] <エッジ: 境界値> — unit
- [ ] <エッジ: 不正入力> — unit
...
```
