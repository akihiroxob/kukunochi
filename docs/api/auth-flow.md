# 認証フロー概要

## 前提
- 認証は OAuth を前提とする。
- 初期段階では Google OAuth を想定する。
- フロントエンドは OAuth プロバイダと直接やり取りせず、バックエンド経由でフローを扱う。
- セッション管理はバックエンドが責務を持つ。

## 概念整理
### login
ログイン開始 endpoint。Google の認可画面へ遷移するための入口である。
- 例: `POST /api/auth/google/login` または `GET /api/auth/google/login`
- state 生成や redirect URL 構築はバックエンドで行う。

### callback
Google からの認可結果を受け取る endpoint。
- 認可コードを受け取り、アクセストークン取得とユーザー情報取得を行う。
- 既存ユーザーの特定、必要であれば初回ユーザー作成を行う。
- セッションを発行し、cookie を設定する。

### session
ログイン状態を表す継続情報。
- 実体はサーバー側で管理する。
- クライアントには session cookie を返す。
- フロントエンドは cookie の中身を読まず、認証確認 API で状態を判断する。

## Google OAuth の想定フロー
1. ユーザーが Web 画面で「Google でログイン」を選択する。
2. フロントエンドがバックエンドの login endpoint を呼ぶ。
3. バックエンドが OAuth state を生成し、Google 認可 URL を返す、または redirect する。
4. ユーザーが Google で認証・同意する。
5. Google が callback endpoint に認可コードを返す。
6. バックエンドが Google と通信してトークンとプロフィール情報を取得する。
7. バックエンドがユーザーを特定し、必要に応じて作成または更新する。
8. バックエンドが session を作成し、session cookie を設定する。
9. フロントエンドは `/api/me` などで認証済み状態を確認する。

## login / callback / session の責務分離
- login: フロー開始と state 管理
- callback: OAuth 結果の確定とセッション発行
- session: 継続ログイン状態の保持と検証

## セキュリティ上の基本方針
- OAuth state を必ず利用する。
- cookie は `HttpOnly` を前提とする。
- `Secure` や `SameSite` は配備形態に応じて設定する。
- Google 由来のプロフィール情報をそのまま信用しすぎず、必要最小限だけ保持する。

## 将来拡張候補
- Google 以外の OAuth provider 追加
- リフレッシュ方針の明確化
- session ストアの冗長化
- 監査ログの追加
