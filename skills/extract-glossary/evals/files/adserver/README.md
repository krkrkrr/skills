# adserver

Acme の広告配信サーバ。媒体社のサイトに設置した広告タグからのリクエストを受け、
**SSP**（Supply-Side Platform）経由で届く **bid request**（OpenRTB 2.6）に入札し、勝った広告を返す。

## 用語

- **枠（placement）**: 媒体社のページ上の広告表示位置。`adv_placements` テーブルで管理する。
- **入稿**: 広告主が管理画面からクリエイティブ（画像・動画）を登録すること。入稿されたクリエイティブは審査後に `approved` になる。
- **フロア価格（floor price）**: 枠ごとの最低落札価格。これを下回る入札は捨てる。
- **CPM**: 1000 インプレッションあたりの単価。入札額はすべて CPM（USD）で扱う。

## 構成

- `internal/bidder/`: bid request を受けて入札額を決める
- `internal/hbx/`: (see code)
- `api/openapi.yaml`: 管理画面向け API
- `terraform/`: AWS（ECS, ElastiCache Redis, RDS PostgreSQL）

詳しくは [docs/architecture.md](docs/architecture.md)。
