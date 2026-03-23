# アーキテクチャ概要

## 目的
このリポジトリは、Fastify を用いた API と React + Vite を用いた Web フロントエンドを、pnpm ベースのモノレポで管理するための土台である。初期段階では、実装を急ぎすぎず、設計判断と作業ルールを先にそろえることを優先する。

## 全体像
- `apps/api`: Fastify ベースのバックエンド。認証、セッション、ユーザー管理などのアプリケーション機能を提供する。
- `apps/web`: React + Vite ベースのフロントエンド。feature-based 構成で画面と UI のユースケースを管理する。
- `packages/contracts`: Zod ベースの API 契約を置く。リクエスト、レスポンス、エラー形式の正とする。
- `docs`: 中長期で参照する設計資料。方針、責務、依存ルール、ADR を蓄積する。
- `specs`: 機能単位の実装仕様。個別機能のスコープ、契約、受け入れ条件を明確にする。
- `.agent`: Codex / エージェント向けの作業ルール。文脈共有、禁止事項、タスク依頼テンプレートをまとめる。

## モノレポ方針
- パッケージマネージャーは `pnpm` を使う。
- `apps` はユーザーに直接価値を届ける実行単位を置く。
- `packages` は `apps` から参照される共通部品を置く。
- `packages` から `apps` へ依存してはいけない。
- 実装初期は共通化を急がず、再利用の必然性が明確なものだけを `packages` に切り出す。

## バックエンド方針の要約
- 機能は module 単位で分ける。
- 各 module は `presentation` / `application` / `domain` / `infrastructure` の 4 層を持つ。
- DDD は中程度の強さで採用し、Entity、ValueObject、Repository interface、UseCase を中心に整理する。
- aggregate や domain event は現時点では採用しない。必要になった時点で将来拡張候補として再評価する。
- DB アクセスは Kysely を前提とする。

## フロントエンド方針の要約
- `src` 配下は `app` / `pages` / `features` / `entities` / `shared` を基本構成とする。
- `features` はユースケース単位で分割する。
- `entities` は UI が扱う対象の整理単位であり、バックエンドの DDD Entity とは別概念とする。
- `shared` には feature 固有コードを置かない。再利用 UI は `shared/ui` に置く。
- サーバー状態は TanStack Query、UI 状態は Zustand、フォームは React Hook Form で役割分担する。

## 認証と契約
- 認証は OAuth を前提とし、初期段階では Google OAuth を想定する。
- セッション管理の詳細はバックエンドで担い、フロントエンドはセッションの存在を API を通じて確認する。
- API 契約の single source of truth は `packages/contracts` とする。

## docs / specs / .agent の使い分け
### docs
- 長く維持する設計判断を書く。
- 実装詳細ではなく、構造・原則・理由を中心に残す。

### specs
- 1 機能ごとの実装スコープと完了条件を書く。
- 実装前後で参照する実務向け文書とする。

### .agent
- エージェントが迷わず作業するための運用ルールを書く。
- 設計上の禁止事項や作業テンプレートを明示する。

## 将来拡張候補
- aggregate / domain event の導入
- OAuth プロバイダの追加
- 複数アプリ間での契約共有の拡張
- フロントエンド entities の細分化ルールの強化
