---
type: Architecture Decision Record
title: "ADR-0004: モバイルアプリとの通信に GraphQL を採用する"
description: 過剰取得を解消するため、モバイルアプリとの通信を REST から GraphQL に切り替える。
status: draft
generated: { by: human:suzuki, at: 2026-09-20T00:00:00Z }
---

# ADR-0004: モバイルアプリとの通信に GraphQL を採用する

- 日付: 2026-09-20

## ステータス

Proposed

Supersedes [ADR-0003](0003-use-rest-api.md)

## 背景

[ADR-0003](0003-use-rest-api.md) では、モバイルアプリとの通信に REST API を採用した。
ADR-0003 が影響として挙げていたとおり、画面ごとに必要なフィールドが異なるため過剰取得が起きている。

## 決定

モバイルアプリとの通信には GraphQL を採用し、各画面が必要なフィールドをクエリで指定して取得する。
Web 管理画面の API は対象外とする。

## 影響

過剰取得が解消される。
移行期間中は REST と GraphQL の両方を保守する必要がある。
