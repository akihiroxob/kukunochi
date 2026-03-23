# Get Me

## Goal
認証済みユーザーが自分のプロフィール情報を取得できるようにする。

## Scope
### 含む
- `GET /api/me`
- 認証済みセッションからユーザーを特定
- 最低限のユーザー情報返却

### 含まない
- 他ユーザー情報取得
- 権限別レスポンス差分

## Backend
### 関係 module
- `auth`
- `user`

### 想定処理
- 認証ミドルウェアで session を確認する。
- session から userId を解決する。
- user repository からユーザーを取得する。
- 表示に必要な情報のみ response に変換する。

## Frontend
### 関係 feature / entity
- `entities/user`
- `features/auth/session-check`
- 認証済みレイアウトまたは初期化処理

### 想定動作
- 画面初期化時に `GET /api/me` を実行する。
- 成功時はログイン中ユーザーとして表示する。
- `401` の場合は未認証として扱う。

## Contracts
- request body はなし
- response 例: `id`, `email`, `displayName`, `authProvider`
- error: `401`, `404`

## Rules
- API 契約は `packages/contracts` を正とする。
- パスワードや内部監査情報は返さない。
- backend domain モデルをそのまま JSON 化しない。

## Error handling
- `401 Unauthorized`: session なし、または無効
- `404 Not Found`: session 上は存在するが user が見つからない場合
- `500 Internal Server Error`: 想定外障害

## Acceptance criteria
- 認証済みユーザー情報取得 endpoint の責務が明確である。
- 未認証時の挙動が `401` として定義されている。
- frontend が認証状態確認に利用できる仕様になっている。
