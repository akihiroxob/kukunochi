# ADR 0006: PostgreSQL + pgvector を採用する

## 背景

kukunochi では、Event / EventVersion / Narrative / Source などの正本データをRDBとして扱いたい。

また、将来的にBERT embeddingを使った意味検索を行う。

想定ベクトル件数は以下である。

- 当面: 1万未満
- 長期: 10万程度

## 決定

PostgreSQL + pgvector を採用する。

```text
Primary DB: PostgreSQL
Vector Search: pgvector
DB Access: Kysely
Embedding: BERT系ベクトル
```

## 採用理由

- RDBとして素直に設計できる
- SQLでJOIN、集計、制約を扱える
- pgvectorによりPostgreSQL内でVector検索を扱える
- 想定件数では専用Vector DBを初期導入する必要が薄い
- 将来Qdrantへ分離しやすい
- Kyselyと相性が良い

## 却下案

### MariaDB

慣れているが、Vector検索の成熟度と運用知見を考慮し、今回は採用しない。

### SurrealDB

RelationやVectorを同居させやすいが、現時点ではSQLとRDBの素直さを優先する。

### 専用Vector DB

Qdrant / Weaviate / Milvus は初期導入しない。
Vector検索負荷が増えた場合のみ、Qdrant分離を検討する。

## 影響

- migrationでは `CREATE EXTENSION IF NOT EXISTS vector;` を実行する
- embeddingは対象テーブルに直接持たず、専用テーブルに分離する
- 初期は Narrative embedding を主対象にする
- EventVersion embedding は詳細検索の段階で追加する
- pgvector固有演算子はKyselyの `sql` template利用を許容する
