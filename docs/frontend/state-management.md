# フロントエンド state 管理方針

## 基本方針
状態管理は 1 つの手段に集約するのではなく、責務ごとに使い分ける。
このプロジェクトでは以下を基本とする。
- server state: TanStack Query
- UI state: Zustand
- form state: React Hook Form

## TanStack Query
用途:
- API から取得する server state の保持
- キャッシュ
- 再取得
- mutation と invalidation

例:
- 現在ログイン中のユーザー取得
- セッション状態確認
- ユーザー情報更新後の再取得

ルール:
- サーバー由来データを Zustand に複製しない。
- query key は feature や entity の単位で整理する。
- API 契約は `packages/contracts` を参照する。

## Zustand
用途:
- 一時的な UI state
- 画面をまたいで共有したい軽量な表示状態
- モーダル開閉、フィルタ表示状態など

ルール:
- 永続化前提の業務データを持たせない。
- server state のキャッシュ置き場にしない。
- feature ごとの state か、全体 UI state かを明確にする。

## React Hook Form
用途:
- 入力値管理
- バリデーション連携
- submit 状態管理

例:
- 表示名更新フォーム
- ログイン補助入力が必要になった場合のフォーム

ルール:
- フォーム入力中の状態は React Hook Form に集約する。
- submit 後の server state 更新は TanStack Query 側で扱う。
- Zod resolver を使う場合も、契約との責務差を意識する。

## 役割分担のまとめ
- API の取得結果: TanStack Query
- 画面上の開閉状態や一時フラグ: Zustand
- フォーム入力と送信状態: React Hook Form

## 避けること
- 同じデータを Query と Zustand の両方で持つこと
- feature 固有フォームロジックを shared に置くこと
- バックエンドの業務ルールをフロントエンドの状態管理で再実装すること

## 将来拡張候補
- query key 命名規約の厳密化
- 永続化が必要な UI state の限定導入
- form schema と contracts の整合チェック自動化
