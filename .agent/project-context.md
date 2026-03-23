# Project Context

## このプロジェクトについて
KUKUNOCHI は、Fastify ベースの API と React + Vite ベースの Web フロントエンドを pnpm モノレポで管理するプロジェクトである。初期段階では、実装量よりも設計方針と運用ルールの固定を重視する。

## 構造
- `apps/api`: DDD を中程度の強さで適用したバックエンド
- `apps/web`: feature-based 構成のフロントエンド
- `packages/contracts`: Zod ベースの API 契約共有
- `docs`: 中長期で維持する設計資料
- `specs`: 機能ごとの実装仕様
- `.agent`: エージェント作業ルール

## backend の基本構造
- module ごとに分割する。
- 各 module は `presentation` / `application` / `domain` / `infrastructure` の 4 層を持つ。
- domain には Entity / ValueObject / Repository interface を置く。
- aggregate / domain event は将来拡張候補であり、現時点では前提にしない。

## frontend の基本構造
- `src/app`
- `src/pages`
- `src/features`
- `src/entities`
- `src/shared`

frontend の `entities` は UI が扱う対象の整理単位であり、backend の DDD Entity とは別概念である。

## 守るべき重要ルール
- API 契約の正は `packages/contracts`。
- packages から apps へ依存しない。
- shared に feature 固有コードを置かない。
- backend の業務判断を frontend に持ち込まない。
- Prisma は導入しない。
- Kysely は infrastructure で使う。
