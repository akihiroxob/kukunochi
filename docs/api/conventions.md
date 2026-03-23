# API 規約

## 目的
API の命名と入出力形式を統一し、バックエンドとフロントエンドの認識ずれを減らす。詳細なエンドポイント仕様は `specs/` に置き、この文書では横断ルールを定義する。

## 命名ルール
- ベースパスは `/api` とする。
- リソース名は複数形ではなく、扱う概念に応じて自然な形を採用する。
  - 例: `/api/me`
  - 例: `/api/auth/google/login`
- パスは小文字・ケバブケースを基本とする。
- 操作名を path に増やしすぎず、HTTP メソッドで意図を表す。

## HTTP メソッドの使い分け
- `GET`: 取得
- `POST`: 新規作成、または副作用を伴う開始操作
- `PATCH`: 部分更新
- `DELETE`: 削除

OAuth の開始など、リソース更新ではなくフロー開始を表す場合は `POST` を許容する。

## request の基本方針
- request body は Zod schema で定義し、`packages/contracts` を正とする。
- query parameter が必要な場合も schema 化する。
- 認証済みユーザー情報のようにサーバー側で解決できる値は、body で受け取らない。
- primitive の寄せ集めではなく、意味のある名前の contract にまとめる。

## response の基本方針
- 成功 response は、画面で必要な情報に限定する。
- DB の内部都合のカラムは返さない。
- 日時、ID、認証関連の値は形式を明示する。
- 将来の後方互換性を意識し、曖昧なフィールド名を避ける。

## error の基本方針
エラーは、HTTP ステータスと機械可読なコードを併用する。

最低限の分類:
- `400 Bad Request`: 入力不正
- `401 Unauthorized`: 未認証、または有効なセッションなし
- `403 Forbidden`: 認可不足
- `404 Not Found`: 対象なし
- `409 Conflict`: 競合
- `500 Internal Server Error`: 想定外エラー

推奨項目:
- `code`: 機械可読なエラーコード
- `message`: 開発者向けの要約
- `details`: バリデーション詳細など、必要な場合のみ

## バリデーション方針
- 入力値の形式検証は contract と presentation で行う。
- 業務上の妥当性検証は domain / application で行う。
- フロントエンドは契約に基づき入力補助を行うが、最終的な判定はバックエンドが持つ。

## バージョニング方針
初期段階では URL バージョンは導入しない。
互換性を壊す変更が増えた時点で再検討する。

## 認証 API の補足
- OAuth フロー開始、callback、session 確認は auth module に集約する。
- セッションの実体や cookie 詳細は backend 管理とし、フロントエンドは契約された endpoint を介して状態確認する。
