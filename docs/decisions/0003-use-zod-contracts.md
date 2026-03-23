# ADR 0003: Zod ベースの contracts package を採用する

## 背景
API の request / response / error を、バックエンドとフロントエンドでずれなく共有したい。型だけの共有ではなく、実行時バリデーションも扱いたい。

## 採用理由
- `packages/contracts` を single source of truth にできる。
- 実行時 schema と TypeScript 型を同時に扱える。
- API 実装と UI 実装の認識ずれを減らせる。

## 却下案
### TypeScript 型定義のみ共有
- 実行時検証が別実装になりやすい。
- 契約の一貫性が崩れやすい。

### OpenAPI を先に正にする
- 将来的には検討余地があるが、初期段階では運用コストが高い。
- まずは実装近接の schema 管理を優先する。

## 影響
- API 契約変更時は `packages/contracts` を起点に更新する。
- バックエンドとフロントエンドの独自通信型は原則作らない。
