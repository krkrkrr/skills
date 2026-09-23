# Architecture

1. 広告タグ → SSP → `POST /openrtb/bid`（bidder）
2. bidder は Redis から枠設定とキャンペーン予算を読む（TTL 60 秒）
3. 予算の残りは Redis の DECRBY で原子的に減らす
4. 管理画面（別 repo: acme/console）で入稿・キャンペーン設定 → PostgreSQL → 5 分ごとの sync ジョブで Redis に反映
5. インプレッションログは Kinesis Firehose → S3 → 日次で Snowflake に取り込み、レポートに使う

VAST 4.2 で動画広告を返す場合がある。
