# アーキテクチャ概要

## 目的

kukunochi は、大量の Event を年表として蓄積し、そこから特定の問い・視点に沿って Narrative を作るためのアプリケーションである。

初期段階では、Next.js を前提にせず、**Hono API + Vite React** で体験を素早く検証できる構成を採用する。

## 全体像

```text
apps/
  api/   Hono API server
  web/   Vite + React UI
packages/
  contracts/  Zod schemas and shared API types
```

- `apps/api`: Hono ベースの API サーバ。UseCase、DBアクセス、APIルーティングを担う。
- `apps/web`: Vite + React ベースの UI。年表、Event詳細、Narrative編集などの体験を担う。
- `packages/contracts`: Zod ベースの API 契約を置く。リクエスト、レスポンス、エラー形式の正とする。
- `docs`: 中長期で参照する設計資料。方針、責務、依存ルール、ADR を蓄積する。
- `specs`: 機能単位の実装仕様。個別機能のスコープ、契約、受け入れ条件を明確にする。
- `.agent`: Codex / エージェント向けの作業ルール。文脈共有、禁止事項、タスク依頼テンプレートをまとめる。

## ランタイム方針

### 開発時

開発時は、UI開発体験を優先して2プロセスで動かす。

```text
Vite dev server  -> React UI
Hono dev server  -> API
```

### 本番時

本番では、Hono 1プロセスで API と静的Reactアプリ配信を担う。

```text
Hono server
  ├─ /api/*  API routes
  └─ /*      static files from apps/web/dist
```

つまり、リポジトリはモノレポだが、本番運用はHono単一プロセスを基本とする。

## モノレポ方針

- パッケージマネージャーは `pnpm` を使う。
- `apps` はユーザーに直接価値を届ける実行単位を置く。
- `packages` は `apps` から参照される共通部品を置く。
- `packages` から `apps` へ依存してはいけない。
- 実装初期は共通化を急がず、再利用の必然性が明確なものだけを `packages` に切り出す。

## バックエンド方針の要約

- API framework は Hono を採用する。
- 機能は module 単位で分ける。
- 各 module は `presentation` / `application` / `domain` / `infrastructure` の 4 層を持つ。
- DDD は中程度の強さで採用し、Entity、ValueObject、Repository interface、UseCase を中心に整理する。
- aggregate や domain event は現時点では採用しない。必要になった時点で将来拡張候補として再評価する。
- DB アクセスは Kysely を前提とする。
- DB は PostgreSQL + pgvector を採用する。

## フロントエンド方針の要約

- React + Vite を採用する。
- `src` 配下は `app` / `pages` / `features` / `entities` / `shared` を基本構成とする。
- `features` はユースケース単位で分割する。
- `entities` は UI が扱う対象の整理単位であり、バックエンドの DDD Entity とは別概念とする。
- `shared` には feature 固有コードを置かない。再利用 UI は `shared/ui` に置く。
- サーバー状態管理やUI状態管理は、必要になった段階で TanStack Query / Zustand の導入を検討する。

## 初期MVP

初期MVPは、認証やNarrativeより先に Event を扱う。

1. Eventを登録できる
2. Eventを年表として一覧できる
3. Event詳細で代表EventVersionと候補Versionを見られる
4. EventVersionにSourceを紐づけられる
5. その後、NarrativeでEventを選び、順序づけ、意味づける

## 認証と契約

- 初期MVPでは認証は後回しにする。
- 投稿者が必要な場合は仮ユーザーを使う。
- 将来的には OAuth を導入できるよう、auth関連docs/specsは維持する。
- API 契約の single source of truth は `packages/contracts` とする。

## docs / specs / .agent の使い分け

### docs

- 長く維持する設計判断を書く。
- 実装詳細ではなく、構造・原則・理由を中心に残す。

### specs

- 1機能ごとの実装スコープと完了条件を書く。
- 実装前後で参照する実務向け文書とする。

### .agent

- エージェントが迷わず作業するための運用ルールを書く。
- 設計上の禁止事項や作業テンプレートを明示する。

## 将来拡張候補

- Narrative編集UIの強化
- pgvectorによるNarrative検索
- Annotation / Reaction / Report
- OAuth認証
- Qdrant分離
- Next.js導入はSEOや公開ページ要件が強くなった場合に再検討する
