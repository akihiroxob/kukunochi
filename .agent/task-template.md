# Task Template for Codex

以下のテンプレートをコピーして、Codex に作業依頼する。

```md
## Task
- 目的:
- 背景:

## Target files
- `apps/api/...`
- `apps/web/...`
- `packages/contracts/...`
- `docs/...`
- `specs/...`

## Constraints
- packages/contracts を API 契約の正とする
- Prisma を導入しない
- フロントエンドにドメインロジックを置かない
- feature 固有コードを shared に置かない
- aggregate / domain event を前提にしない

## Completion criteria
- 実装または文書更新が完了している
- 依存ルールに違反していない
- 変更理由が説明できる
- 必要な spec / docs / contracts が更新されている
```

必要に応じて、以下を追記する。
- 対象 module / feature
- 想定 endpoint
- UI の受け入れ条件
- 追加してはいけない実装範囲
