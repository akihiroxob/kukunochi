# Google OAuth Login

## Goal
Google OAuth によりログインを開始し、callback を経てセッション確立まで完了できるようにする。

## Scope
### 含む
- Google OAuth 開始 endpoint
- callback endpoint
- ユーザー特定または初回作成
- session 作成と cookie 設定
- ログイン完了後の認証状態確認導線

### 含まない
- 複数 OAuth provider 対応
- 権限管理の詳細
- アカウント連携画面

## Backend
### 関係 module
- `auth`
- `user`
- 必要に応じて `session`

### 想定責務
- `presentation`: login / callback route、redirect または URL 応答
- `application`: OAuth フロー実行、ユーザー特定、session 発行
- `domain`: `AuthProvider`、`Email`、`SessionId`、Repository interface
- `infrastructure`: Google OAuth client、Kysely repository、session store

## Frontend
### 関係 page / feature
- `pages/login`
- `features/auth/login-with-google`
- `entities/session`

### 想定動作
- ログイン画面で Google ログイン開始操作を提供する。
- callback 後は認証済み画面またはトップへ遷移する。
- 認証結果の最終確認は `/api/me` などで行う。

## Contracts
- OAuth 開始 response または redirect 方針
- callback 完了後の遷移方針
- 認証確認用 `GET /api/me`

## Rules
- OAuth provider との通信は backend に限定する。
- state 検証を必須とする。
- session cookie の詳細を frontend に持ち込まない。
- `packages/contracts` を API 契約の正とする。

## Error handling
- Google から認可コードが返らない場合はログイン失敗とする。
- state 不一致は不正なリクエストとして扱う。
- callback 中の外部通信失敗は再試行可能な失敗として記録する。
- UI は汎用的なログイン失敗メッセージを表示し、内部詳細は出しすぎない。

## Acceptance criteria
- Google ログイン開始から callback 完了まで一連の遷移を説明できる。
- session cookie 発行後、認証確認 API でログイン済みを判定できる。
- backend module と frontend feature / page の責務分担が明確である。
