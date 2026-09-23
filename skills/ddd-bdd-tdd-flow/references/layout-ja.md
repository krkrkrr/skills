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
