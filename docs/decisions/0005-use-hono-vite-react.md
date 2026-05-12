# ADR 0005: Hono API + Vite React を採用する

## 背景

kukunochi は、出来事を年表として蓄積し、そこから Narrative を作る体験が重要なプロダクトである。

当初は Fastify + React/Vite や Next.js の可能性もあったが、現時点では以下を優先する。

- 体験をReactで素早く作る
- API境界をHonoで軽く保つ
- 本番ではHono 1プロセスでAPIと静的UI配信を行う
- Next.jsはSEOや公開ページ要件が強くなった場合に再検討する

## 決定

以下の構成を採用する。

```text
apps/api: Hono
apps/web: Vite + React
packages/contracts: Zod
```

開発時はHonoとViteを別プロセスで動かす。

```text
Vite dev server  -> React UI
Hono dev server  -> API
```

本番ではHono 1プロセスで動かす。

```text
Hono server
  ├─ /api/*  API routes
  └─ /*      static files from apps/web/dist
```

## 採用理由

- UI体験をReactで育てやすい
- HonoによりAPIが軽く、明確に保てる
- Next.jsなしでもCSR中心のアプリ体験は十分作れる
- 本番サーバをHono 1プロセスにできる
- 将来Next.jsが必要になった場合も、Hono APIとcontractsを残せる

## 却下・保留案

### Hono SSR一本

初期は軽いが、CSRやインタラクティブUIが増えた場合に移行コストが出やすい。

### Next.js + Hono

SEO、OGP、公開ページ要件が強い場合は有力。
ただし現時点では、サーバ構成とNext.js固有設計の負荷が先に来るため採用しない。

### Next.js一本

初速は速いが、API境界やHonoの軽量性を活かしにくい。
現時点では採用しない。

## 影響

- フロントエンドは `apps/web` に置く
- APIは `apps/api` に置く
- API契約は `packages/contracts` を正とする
- 本番ではHonoが `apps/web/dist` を静的配信する
- Next.js導入は将来のADRで再検討する
