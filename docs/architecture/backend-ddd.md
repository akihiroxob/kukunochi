# バックエンド DDD 方針

## 適用範囲
このプロジェクトのバックエンドでは、DDD を中程度の強さで採用する。目的は、業務ルールと入出力処理を分離し、機能追加時に責務が崩れにくい構造を保つことにある。

適用対象は主に以下とする。
- module ごとの責務分割
- domain 層への業務概念の集約
- UseCase 単位でのアプリケーション処理の整理
- 永続化詳細の infrastructure への隔離

一方で、現時点では以下は前提にしない。
- 複雑な aggregate 設計
- domain event の本格導入
- event sourcing
- 過度な抽象化や汎用化

## module 構成
各 module は、最低限以下の 4 層で構成する。

### presentation
責務:
- HTTP ルーティング
- リクエストの受け取り
- 認証情報の受け渡し
- UseCase 呼び出し
- レスポンス変換

置くものの例:
- Fastify route 定義
- request parser
- response mapper

### application
責務:
- ユースケースの実行
- トランザクション境界の調整
- domain と infrastructure の橋渡し
- アプリケーション固有の入出力 DTO 定義

置くものの例:
- `GetMeUseCase`
- `UpdateUserUseCase`
- `LoginWithGoogleCallbackUseCase`

### domain
責務:
- 業務ルールの表現
- Entity / ValueObject / Repository interface の定義
- 不変条件の維持

置くものの例:
- `User`
- `UserId`
- `Email`
- `UserRepository`

### infrastructure
責務:
- DB アクセス
- 外部 API 呼び出し
- セッション保存
- OAuth プロバイダとの接続
- Repository interface の実装

置くものの例:
- Kysely を用いた repository 実装
- Google OAuth client
- session store adapter

## 主要概念
### Entity
Entity は識別子を持ち、状態変化を追跡する業務上の対象である。
- 例: User
- 同一性は ID で判定する。
- DB レコードの写像ではなく、業務上の整合性を表現する。

### ValueObject
ValueObject は、ただの primitive のままだと危険な値を型として明確化するために使う。
対象は絞る。
- `UserId`
- `Email`
- `SessionId`
- `AuthProvider`

方針:
- 乱用しない。
- 変換や検証に意味がある値だけを対象にする。
- ただの文字列ラッパーではなく、最低限の妥当性を持たせる。

### Repository
Repository は domain 層に定義する永続化の抽象である。
- interface は domain に置く。
- 実装は infrastructure に置く。
- UseCase は具体的な DB 実装ではなく Repository interface に依存する。

### UseCase
UseCase は application 層で定義する処理単位である。
- 1 つのユースケースは 1 つの目的に集中させる。
- presentation から見た入口になる。
- domain のルールを呼び出し、必要に応じて Repository を調停する。

## 依存の基本ルール
- `presentation -> application -> domain`
- `infrastructure -> domain`
- `application` は `infrastructure` の具体実装に直接依存しない。
- 依存性注入で接続する。

## aggregate / domain event を採用しない理由
現時点では、想定ユースケースが比較的単純であり、集約境界やイベント駆動を先に導入すると設計コストが先行しやすい。
そのため、初期段階では以下の判断を取る。
- aggregate は明示的に導入しない。
- domain event は前提にしない。
- 複数 Entity 間の整合は、必要な範囲で UseCase と Repository によって管理する。

ただし、将来以下の状況になった場合は再検討する。
- 複数の副作用連携が増える
- 変更履歴や通知が増える
- 1 つの操作で扱う整合性の境界が複雑になる

## Kysely の位置づけ
- Kysely は infrastructure 層で使う。
- SQL を明示的に扱える利点を活かしつつ、domain と application には漏らさない。
- query の最適化や DB 方言対応は infrastructure 側で閉じる。

## 初期実装で重視すること
- module と層を崩さない
- domain に業務判断を集める
- presentation にロジックを溜めない
- DB の都合で domain モデルを歪めすぎない
