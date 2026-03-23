# ADR 0002: DB アクセスに Kysely を採用する

## 背景
バックエンドでは SQL の見通しを保ちながら、TypeScript で安全に DB アクセスを扱いたい。過度な ORM 抽象は初期設計に不要と判断した。

## 採用理由
- SQL を明示的に扱いやすい。
- TypeScript の型支援を受けやすい。
- infrastructure 層に閉じ込めやすく、DDD 構成と相性がよい。
- Prisma を導入しない方針と整合する。

## 却下案
### Prisma
- 初期段階では ORM 主導のモデル設計に寄りやすい。
- 今回の方針では、DB 都合を domain へ強く持ち込みたくない。

### 生 SQL のみ
- 柔軟だが、型安全性と再利用性の設計負荷が高い。

## 影響
- DB 詳細は infrastructure 層に寄せる。
- query 設計と migration 設計の方針を別途整備する必要がある。
