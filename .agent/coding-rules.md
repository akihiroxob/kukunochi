# Coding Rules

## 命名方針
### backend
- module 名は機能単位で付ける。
- UseCase は `VerbTargetUseCase` を基本とする。
- ValueObject は危険な primitive を明示するものだけ導入する。
- Repository interface は対象名 + `Repository` とする。

### frontend
- feature 名はユースケース単位で付ける。
- page 名は URL や画面責務に対応させる。
- shared/ui は再利用意図が明確なものだけ置く。

## レイヤ責務
### backend
- `presentation`: HTTP 入出力と認証コンテキストの受け渡し
- `application`: ユースケース実行と調停
- `domain`: 業務ルール、Entity、ValueObject、Repository interface
- `infrastructure`: DB、外部 API、永続化実装

### frontend
- `pages`: 画面構成
- `features`: ユースケース実装
- `entities`: UI が扱う対象整理
- `shared`: 汎用再利用部品

## shared に入れてよいもの
- 汎用 UI コンポーネント
- 汎用フォーマッタ
- API client の共通設定
- 全体設定値

## shared に入れてはいけないもの
- 特定 feature 専用 hook
- 特定画面専用 component
- 特定業務フローに依存する helper
- backend のドメインルールを模倣した処理

## frontend feature の切り方
- 画面単位ではなく、ユーザー行動やユースケース単位で切る。
- 例: `login-with-google`, `update-profile`, `session-check`
- 複数画面で共有されても、文脈が feature 固有なら `shared` に上げない。

## 補足
- aggregate / domain event は前提にしない。
- contracts 変更は `packages/contracts` を起点に行う。
