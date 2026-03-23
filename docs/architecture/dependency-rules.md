# 依存ルール

## 目的
依存方向を早い段階で固定し、機能追加時に責務の逆流を防ぐ。特にモノレポでは、参照可能だから依存してよいとは限らないことを明確にする。

## バックエンドの依存方向
各 module の依存は以下を基本とする。
- `presentation -> application`
- `application -> domain`
- `infrastructure -> domain`

補足:
- `presentation` は HTTP と認証コンテキストに関心を持つ。
- `application` はユースケース調停に集中する。
- `domain` は他層を知らない。
- `infrastructure` は DB や外部サービスの詳細を閉じ込める。

禁止:
- `domain -> infrastructure`
- `domain -> presentation`
- `application -> presentation`
- `presentation` に業務判断を置くこと

## フロントエンドの依存方向
フロントエンドは以下の参照方向を基本とする。
- `app -> pages / features / entities / shared`
- `pages -> features / entities / shared`
- `features -> entities / shared`
- `entities -> shared`
- `shared -> どこにも依存しない`

禁止:
- `shared -> features`
- `shared -> pages`
- `entities -> features`
- feature 間の無秩序な相互依存

feature 間連携が必要な場合は、`pages` または `app` で組み合わせることを優先する。

## packages と apps の依存ルール
### 許可する依存
- `apps/api -> packages/contracts`
- `apps/web -> packages/contracts`
- 将来追加される共通 package への参照

### 禁止する依存
- `packages/* -> apps/*`
- `apps/api -> apps/web`
- `apps/web -> apps/api` の直接 import

アプリ間連携は API 契約を介して行う。

## contracts のルール
`packages/contracts` は API 契約の single source of truth とする。
- request schema
- response schema
- error schema
- 必要に応じた型エクスポート

禁止:
- API 実装側だけで独自 schema を正とすること
- フロントエンド側だけで独自の通信型を定義すること

## 依存違反を避ける運用
- 共通化したくなったら、まず本当に複数箇所で必要か確認する。
- UI 都合の helper を `packages` に上げない。
- DB 都合の型を `contracts` に漏らさない。
- feature 固有コードを `shared` に入れない。

## 将来拡張候補
- lint ルールでの import 制約
- package 境界の自動検証
- contracts と OpenAPI 生成の接続
