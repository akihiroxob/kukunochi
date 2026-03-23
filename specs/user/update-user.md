# Update User

## Goal
認証済みユーザーが自分の表示名を更新できるようにする。

## Scope
### 含む
- `PATCH /api/me`
- 表示名のバリデーション
- 更新後ユーザー情報の返却

### 含まない
- メールアドレス変更
- 管理者による他ユーザー更新
- 画像アップロード

## Backend
### 関係 module
- `user`
- `auth`

### 想定処理
- session から対象 user を特定する。
- request body を contract で検証する。
- UseCase で表示名更新を実行する。
- repository 経由で保存し、response を返す。

## Frontend
### 関係 page / feature
- `pages/settings/profile`
- `features/user/update-profile`
- `entities/user`

### 想定動作
- 表示名フォームを表示する。
- React Hook Form で入力管理する。
- 成功後は `GET /api/me` を再取得するか、response で UI を更新する。

## Contracts
### Request
- `displayName: string`

### Validation
- 必須
- 前後空白を trim したうえで判定する。
- 空文字は不可
- 最大文字数を定義する。初期値は 50 文字を想定する。

### Response
- 更新後の `id`, `email`, `displayName`, `authProvider`

### Error
- `400 Bad Request`: バリデーション不正
- `401 Unauthorized`: 未認証
- `404 Not Found`: 対象ユーザーなし

## Rules
- 表示名の業務ルールは backend で最終判定する。
- frontend は入力補助を行うが、ドメインロジックを持たない。
- `packages/contracts` を正とする。

## Error handling
- `400`: 長すぎる、空文字、形式不正
- `401`: session なし、または無効
- `404`: 認証済みだが対象 user が存在しない
- `500`: 想定外エラー

## Acceptance criteria
- `PATCH /api/me` のスコープが表示名更新に限定されている。
- バリデーション条件が明記されている。
- `401 / 400 / 404` の整理が共有されている。
