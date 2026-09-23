---
name: upstream-fix-and-pin
description: 依存ライブラリのバグや機能不足を上流の PR で直し、取り込まれるまで下流プロジェクトを止めずに進めたいときに使う。自分や同じ org が PR を出せる OSS に修正が要るとき、`github:owner/repo#<sha>` で git 依存を固定したいとき、`ERR_PNPM_FETCH_404`（短縮 SHA）や `ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED`（pnpm v10 の build script 制限）に当たったときは、ユーザーが「pin」と言わなくても使う。git ref pin（branch HEAD SHA → merge commit SHA）、`link:` への退避判断を含む。npm に公開済みの修正版へ上げるだけなら使わない。
license: MIT
---

# Upstream Fix and Pin

## When to use

依存ライブラリの修正が必要で、その修正が下流プロジェクトの実装やデバッグに必要なとき。具体的には:

- 自分（または同じ org）が owner の OSS で、PR を自分で投げられる
- 修正が merge されるまで、下流が止まると困る
- monkey-patch / fork publish / vendor 相当の重い手段を取る前に試したい

## The flow

```
[1] 上流に branch を切って fix
        │
        ▼
[2] push して PR
        │
        ▼  下流は (3) で繋ぐ
[3] 下流 package.json を git ref で pin (branch HEAD SHA)
        │
        ▼
[4] PR が merge されたら merge commit の SHA に張り替え
        │
        ▼
[5] (任意) 上流が npm publish するならそれに乗り換え
```

PR が長期化したら `link:` に退避（後述）。

## Pin syntax

pnpm / npm 共通:

```json
{
  "dependencies": {
    "<pkg>": "github:<owner>/<repo>#<full-40-char-sha>"
  }
}
```

ブランチ名 pin (`#fix/foo`) は便利だが、merge / rebase で SHA が動くので **再現性が無い**。lab / 検証用なら full SHA 一択。

## SHA を取得する

GitHub の codeload は **full 40-char SHA** を要求する。短縮 SHA を渡すと:

```
ERR_PNPM_FETCH_404  GET https://codeload.github.com/<owner>/<repo>/tar.gz/<short>: Not Found - 404
```

打ち間違いも同じエラーで来る。確実に取るには:

```bash
# upstream の clone から
git -C <upstream-clone> rev-parse <branch>

# クローン無しで origin 直
git ls-remote https://github.com/<owner>/<repo> <branch>
```

PR 用の検証スクリプトでは `git ls-remote` を使うのが安全（手元の clone が古いと違う SHA を引く）。

## pnpm v10: build script の allowlist

PR で `"prepare": "tsc"` のような install-time hook を入れたパッケージを git ref で pin すると、pnpm v10 はビルドスクリプト実行をデフォルト拒否する。エラー:

```
ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED
The git-hosted package "<pkg>@<ver>" needs to execute build scripts but is not in the "onlyBuiltDependencies" allowlist.
```

下流の `package.json` で明示 allow:

```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["<pkg>"]
  }
}
```

(workspace なら `pnpm-workspace.yaml` 側に同等の field)

これは supply-chain mitigation。`prepare` を持たない PR、または build artefact (`dist/`) を git track するタイプの PR では allowlist は不要。

## PR 側に何を入れるか

「git install で動く」ためには下流が困らないこと。最低限:

1. **`dist/` を git track**（`tsc` 出力など）。`.gitignore` から外して commit。`.gitattributes` で `dist/** linguist-generated=true` と `-diff` を付けておくと PR レビュー時に diff が爆発しない。
2. （補助）`"prepare": "tsc"` を `package.json` に追加。npm install 経由なら走る。pnpm git ref では allowlist が要るので user 動線が増える点はトレードオフ。

両方入れるか、`dist/` 常時 track のみにするかは好み。後者の方が consumer 側の摩擦が少ない。

長期メンテ視点では「commit hook で `pnpm build && git diff --exit-code dist/`」を CI に入れて、`src/` 変更時に `dist/` 同期忘れを止める。

## merge 後の張り替え

PR が merge されたら、下流の SHA を **その PR の merge commit** に更新する:

```bash
# PR の merge commit SHA を取得（squash / rebase merge でも main 上の該当コミットが返る）
gh pr view <number> --repo <owner>/<repo> --json mergeCommit -q .mergeCommit.oid
```

`origin/main` の HEAD は merge 後に積まれた無関係なコミットを含むことがあるので、張り替え先にしない。GitHub の PR ページの `merged commit <sha>` 表示も同じ SHA。
その SHA を下流の `package.json` に貼り、`pnpm install` → tests → commit。

## merge が長期化したら `link:` に退避

PR が review 待ちで動かない、レビュアーがいない、main が改修中で merge できない…等で 1-2 週間以上塩漬けになるなら `link:` に切り替えてローカル開発を進める:

```json
{
  "dependencies": {
    "<pkg>": "link:<path-to-upstream-clone>"
  }
}
```

この間、上流は別 branch で hack してても干渉しない。lockfile に SHA は乗らないので **再現性は手元の clone の HEAD に暗黙依存** する点に注意（チームで共有する repo では別解が要る）。

## 自動化の余地

`/schedule` で「2 週間後に PR が merge されていたら、下流の specifier を merge commit の SHA に書き換えて commit」する agent を仕込めると、merge 待ちを忘れずに回収できる。merge timing が読めない PR ほど効く。

## チェックリスト

PR を出す側:

- [ ] `dist/` を git track（tsc 出力含めて）
- [ ] `.gitattributes` に `dist/** linguist-generated=true` `-diff`
- [ ] PR 本文に「下流での install 動作確認」の記述
- [ ] (希望なら) `"prepare": "tsc"` も入れる

下流（消費者）側:

- [ ] full 40-char SHA で pin (`github:owner/repo#<full-sha>`)
- [ ] pnpm v10 で `prepare` 持ちなら `onlyBuiltDependencies` に追加
- [ ] `pnpm install` → `dist/` の存在確認
- [ ] tsc / tests / 実機検証
- [ ] PR が merge されるまでこの SHA に固定

## Anti-patterns

- ブランチ名で pin する（`#fix/foo`）— rebase で SHA が動く、再現性ゼロ
- 短縮 SHA で pin する（`#abc1234`）— GitHub codeload が 404 を返す
- `link:` のまま長期間 merge を待つ（意図して退避するのは可、ただし lockfile が手元の clone の HEAD に依存する点を忘れない）
- 上流の `prepare` script を当てにして `dist/` を git track しない（pnpm v10 の allowlist で詰まる、user 体験が悪化する）
