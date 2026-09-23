---
type: Architecture Decision Record
title: "ADR-0003: モバイルアプリとの通信に REST API を採用する"
description: 立ち上げの速さを優先し、モバイルアプリとの通信に REST API（OpenAPI 3.1）を採用する。
status: stable
generated: { by: human:suzuki, at: 2025-06-10T00:00:00Z }
verified: { by: human:tanaka, at: 2025-06-10T09:00:00Z }
---

# ADR-0003: モバイルアプリとの通信に REST API を採用する

- 日付: 2025-06-10

## ステータス

Accepted

## 背景

モバイルアプリ（iOS / Android）からバックエンドへアクセスする API の方式を決める必要がある。
バックエンドチームは REST API の開発経験が豊富で、既存の Web 管理画面も REST で実装している。
リリースまで 3 か月しかなく、新しい技術の習得に時間を割けない。

## 決定

モバイルアプリとの通信には、リソース指向の REST API（JSON）を採用する。
スキーマは OpenAPI 3.1 で記述し、クライアントコードを生成する。

## 影響

既存の知識と Web 管理画面の実装を流用でき、立ち上げが速い。
画面ごとに必要なフィールドが異なる場合、過剰取得や複数回の往復が起きやすくなる。
