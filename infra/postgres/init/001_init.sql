CREATE EXTENSION IF NOT EXISTS vector;

CREATE TYPE date_precision AS ENUM (
  'day',
  'month',
  'year',
  'decade',
  'century',
  'unknown'
);

CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE event_versions (
  id BIGSERIAL PRIMARY KEY,
  event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  date_precision date_precision NOT NULL DEFAULT 'day',
  date_note TEXT,
  summary TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  confidence NUMERIC(4,3),
  disputed BOOLEAN NOT NULL DEFAULT false,
  reaction_score INTEGER NOT NULL DEFAULT 0,
  source_count INTEGER NOT NULL DEFAULT 0,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sources (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  title TEXT,
  publisher TEXT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE event_version_sources (
  event_version_id BIGINT NOT NULL REFERENCES event_versions(id) ON DELETE CASCADE,
  source_id BIGINT NOT NULL REFERENCES sources(id) ON DELETE CASCADE,
  PRIMARY KEY (event_version_id, source_id)
);

CREATE INDEX event_versions_event_id_idx ON event_versions(event_id);
CREATE INDEX event_versions_score_idx ON event_versions(event_id, score DESC, source_count DESC, created_at DESC);
CREATE INDEX event_versions_tags_idx ON event_versions USING gin(tags);
