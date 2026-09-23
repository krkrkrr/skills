---
name: external-api-tos-check
description: Use before writing or modifying code that integrates, embeds, or calls any third-party API/SDK/service (video/stream embeds like YouTube or Twitch, payment providers, LLM APIs, maps, ads SDKs, auth providers, etc.). Trigger whenever a task adds a new external provider, changes embed/autoplay/player behavior, upgrades an SDK across a major version, or touches code under a provider-named directory (e.g. src/youtube/, src/twitch/) — even if the user does not say "terms of service" or "ToS". Confirms the provider's official Terms of Service / Developer Policy / Developer Agreement allows the planned behavior before implementation, and records material constraints as an ADR.
license: Unlicense
---

# External API / Service ToS Check

外部API（例: 動画埋め込みプロバイダ）の利用規約を確認しないまま実装を進めた結果、規約違反のリスクが後から発覚するケースがある（例: 複数プレーヤーの同時自動再生を禁じる規約に、実装が知らずに抵触していた等)。このスキルは、外部API/サービスへの新規連携や既存連携の変更に着手する前に規約確認を必須の手順として組み込み、同種の再発を防ぐ。

## いつ使うか

以下のいずれかに該当するタスクでは、実装コードを書き始める前に必ずこのスキルを実行する。

- 新しい外部プロバイダ（動画/配信embed、決済、地図、広告SDK、認証、LLM API等）を初めて組み込む
- 既存プロバイダの使い方を変える（自動再生の追加、同時表示枚数の変更、UI要素の非表示/改変、新しいAPIエンドポイントの利用など）
- プロバイダの公式SDK/embed APIをメジャーバージョンアップする
- ユーザーが規約確認を明示的に依頼した場合

「ToS」「利用規約」という単語が会話に出ていなくても、上記の状況に当てはまれば発動する。

対象外:
- 自社ドメイン内の内部API・内部サービス
- 規約が既にADRで確認済みで、今回の変更がその確認範囲を超えない場合（該当ADRを引用して終了してよい）

## 手順

1. **対象プロバイダを列挙する**: このタスクで新規に、または変更を加えて利用する外部API/SDK/サービスをすべて洗い出す。「YouTube IFrame Player API」のように具体名まで特定する。

2. **公式規約文書を探す**: 検索エンジンやブログ記事ではなく、プロバイダ自身が公開する一次情報を探す。
   - Developer Policy / Terms of Service / Developer Agreement / Acceptable Use Policy などの正式名称のページ
   - APIリファレンス内の "Required Minimum Functionality" のような制約セクション
   - 見つからない・判断がつかない場合はユーザーに確認する（規約なしを前提に実装を進めない）
   - 文書ごとに、URL、ページに記載された最終更新日または版、読んだ日を控える。規約は予告なく改定されるので、この記録がないと、後から判断がどの版に照らしたものか誰にも分からなくなる。

3. **実装計画と照らし合わせる**: これから書くコードが行う具体的な挙動（同時自動再生、UI要素の非表示、データの保存・再配布、独自プレーヤーでの表示、キャッシュ、スクレイピング等）を、規約の該当条項と突き合わせる。特に確認すべき観点:
   - 同時実行数・レート制限・クォータの上限
   - 埋め込みUI要素（ロゴ、広告、コントロール）の非表示・改変の可否
   - 公式クライアント/プレーヤー以外での独自実装の可否
   - 「本質的な付加価値なしに体験を複製する」ことの禁止など、抽象度の高い条項の解釈
   - データの保存・キャッシュ・再配布・学習利用の可否
   - 埋め込み先ドメインの申告・ホワイトリスト要件

4. **抵触リスクを判定する**:
   - **抵触なし** — 実装を進めてよい。何を確認して問題なしと判断したかを、文書の URL、版または最終更新日、読んだ日とともに簡潔に残す(コミットメッセージ、PR説明、または該当コード近くのコメントで十分。ADRを作る必要はない)。
   - **抵触の可能性あり / 条項が曖昧** — 実装前にユーザーに提示し、判断を仰ぐ。自己判断で「たぶん大丈夫」として進めない。
   - **明確な抵触** — 実装を止め、規約に適合する代替設計をユーザーと相談する。

5. **アーキテクチャに影響する制約はADRに記録する**: 制約が原因でドメインモデルやUI設計を変える場合（例: 「同時に使えるプロバイダは1枠まで」という不変条件を追加する）は、規約の該当箇所を、文書の URL、版または最終更新日、読んだ日とともに引用したうえで decision と consequences を書き、プロジェクトのADRとして残す。`adr-writing-ja` スキルがあればそれに従って書き（`ddd-bdd-tdd-flow` を使うプロジェクトでは、そのADR運用フェーズの規約にも合わせる）、なければ Nygard 形式で `doc/ADR/NNNN-<title>.md` に作成する。単なる確認で設計変更を伴わない場合はADRは不要。

## Not in scope

- 規約文の法的解釈の最終判断（弁護士判断が必要な曖昧なケースは、リスクをユーザーに明示した上で委ねる。このスキルはリスクの発見と可視化までを担う）
- OSSライブラリのライセンス確認（MIT/Apache等のコード再利用条件）は別軸の問題であり対象外。プロバイダが提供する「実行時APIサービス」としての利用規約が対象。

## Related

- `adr-writing-ja` — Step 5 で記録するADRの書式・置き場所・論証の点検はそちらに委ねる。
- `ddd-bdd-tdd-flow` — 新規アプリ/機能構築フローの一部としてADRの作成・運用（Nygard形式, `doc/ADR/NNNN-<title>.md`）を定義している。`adr-writing-ja` が入っていない環境では、この規約に従う。
