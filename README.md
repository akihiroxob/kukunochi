# kukunochi

KUKUNOCHI is an event timeline and narrative exploration application.

## Architecture

This repository uses a pnpm monorepo.

```text
apps/
  api/   Hono API server
  web/   Vite + React UI
packages/
  contracts/  Zod schemas and shared API types
```

## Runtime policy

### Development

Development uses two processes for a better UI development experience.

```text
Vite dev server  -> React UI
Hono dev server  -> API
```

### Production

Production is designed to run as a single Hono process.

```text
Hono server
  ├─ /api/*  API routes
  └─ /*      static files from apps/web/dist
```

## MVP focus

The first MVP focuses on events before narratives.

1. Create Event with initial EventVersion
2. Show Event timeline
3. Show Event detail
4. Attach Source to EventVersion
5. Add Narrative later

## Database

The project uses PostgreSQL + pgvector.

- PostgreSQL is the source of truth
- pgvector stores BERT embeddings
- Kysely is used for typed SQL access
- Qdrant may be considered later only if vector search load grows

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm --filter api start
```
