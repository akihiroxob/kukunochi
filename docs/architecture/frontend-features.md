# フロントエンド feature-based 方針

## 基本方針
フロントエンドは feature-based 構成を採用する。目的は、画面単位ではなくユースケース単位で責務を整理し、変更が入ったときに影響範囲を追いやすくすることにある。

基本ディレクトリは以下とする。
- `app`
- `pages`
- `features`
- `entities`
- `shared`

## 各領域の責務
### app
アプリケーション全体の初期化と横断設定を置く。
- router
- provider 設定
- query client 設定
- global styles
- 認証ガードの起点

### pages
ページ単位の構成を置く。
- URL に対応する画面の組み立て
- 複数 feature / entities の配置
- レイアウトへの接続

`pages` には業務ロジックを置かず、画面の構成責務に寄せる。

### features
ユースケース単位の実装を置く。
- ログイン開始
- プロフィール更新
- セッション確認

feature に含めるものの例:
- feature 専用 hook
- feature 専用 component
- feature 専用 state
- feature 専用 API 呼び出しの組み立て

### entities
UI が扱う対象の整理単位を置く。
- user
- session

entities に含めるものの例:
- UI 表示用 model
- 対象にひもづく小さな表示 component
- 契約型を UI に合わせて整形する helper

### shared
アプリ全体で再利用する汎用部品を置く。
- `shared/ui`: 共通 UI コンポーネント
- `shared/lib`: 汎用関数
- `shared/config`: 設定値
- `shared/api`: API client の共通処理

feature 固有の文脈を持つものは `shared` に置かない。

## frontend entities と backend Entity の違い
両者は同じ名前を使う場合があるが、目的が異なる。

### backend Entity
- DDD 上の業務オブジェクト
- 識別子と不変条件を持つ
- domain 層に属する

### frontend entities
- UI が対象を整理するための単位
- 表示や操作の関心に寄る
- 必ずしも識別子や業務ルールを中心にしない

つまり、フロントエンドの `entities/user` は、バックエンドの `User` Entity の写しではない。UI に必要な表現へ適応してよいが、業務ルールそのものは持たせない。

## 依存の基本ルール
- `app` は全体を組み立てるため、下位層を参照してよい。
- `pages` は `features` / `entities` / `shared` を参照してよい。
- `features` は `entities` / `shared` を参照してよい。
- `entities` は `shared` を参照してよい。
- `shared` は他の layer に依存しない。

## state の置き場所
- サーバー状態: TanStack Query
- UI 状態: Zustand
- フォーム状態: React Hook Form

1 つの責務を複数の state 手段に分散させないことを基本とする。

## shared/ui とアトミックデザイン
アトミックデザインは、アプリ全体の構造原則としては採用しない。
必要であれば `shared/ui` の整理方法として限定的に使う。

例:
- `shared/ui/button`
- `shared/ui/form`
- `shared/ui/layout`

## 初期実装で重視すること
- feature の境界をユースケースで切る
- shared に文脈依存コードを入れない
- page にロジックを溜めない
- バックエンドのドメインロジックをフロントエンドへ持ち込まない
