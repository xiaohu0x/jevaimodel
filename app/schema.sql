-- JEV AI Model - D1 schema for accounts, sessions, and classifier usage controls

CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY,
  google_sub    TEXT UNIQUE NOT NULL,
  email         TEXT NOT NULL,
  name          TEXT,
  picture       TEXT,
  created_at    INTEGER NOT NULL,
  last_login_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY,
  user_id    TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

-- Exact per-guest and per-user run quotas. Guest keys are SHA-256 hashes of
-- random HttpOnly cookie values; user keys contain the app's random user UUID.
CREATE TABLE IF NOT EXISTS usage_buckets (
  actor_key       TEXT NOT NULL,
  bucket_key      TEXT NOT NULL,
  request_count   INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  last_request_at INTEGER NOT NULL,
  created_at      INTEGER NOT NULL,
  updated_at      INTEGER NOT NULL,
  PRIMARY KEY (actor_key, bucket_key)
);

CREATE INDEX IF NOT EXISTS idx_usage_buckets_updated_at ON usage_buckets(updated_at);
