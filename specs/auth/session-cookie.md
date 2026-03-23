# Session Cookie

## Goal
セッション Cookie の責務と扱いを明確にし、認証状態確認の実装方針を固定する。

## Scope
### 含む
- session cookie の基本属性
- cookie 発行と破棄の責務
- 認証状態確認 API の使い方

### 含まない
- refresh token の導入
- SPA 以外のクライアント対応

## Session Cookie の扱い
- session cookie はバックエンドが発行する。
- cookie の値はクライアントから意味解釈しない。
- `HttpOnly` を前提とし、JavaScript から直接参照しない。
- `Secure` / `SameSite` は配備環境と OAuth フローに応じて決める。

## 認証状態の確認方針
- フロントエンドは cookie の有無を直接判定材料にしない。
- 認証状態確認は `GET /api/me` のような endpoint で行う。
- server state として TanStack Query で扱う。
- 未認証時は `401 Unauthorized` を基準に状態遷移する。

## Backend
- session 発行は auth callback 完了時に行う。
- session 検証は認証ミドルウェアまたは application 入り口で行う。
- session 失効時は cookie を適切に破棄できる設計にする。

## Frontend
- ログイン完了判定は `/api/me` 成功を基準にする。
- 認証エラー時はログイン画面へ誘導する。
- セッション値を Zustand に保持しない。

## Error handling
- 無効な session は `401` を返す。
- session に対応するユーザーが存在しない場合は `401` または `404` を仕様で明示する。初期方針では `401` を優先する。

## Acceptance criteria
- session cookie の責務が backend にあると明記されている。
- frontend の認証確認方針が API ベースで整理されている。
- cookie をクライアントの業務ロジックに使わない方針が共有されている。
