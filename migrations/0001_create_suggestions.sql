-- Content suggestions (future-facing). Public submits, admin reviews.
-- Apply with:  wrangler d1 migrations apply design101-db
CREATE TABLE IF NOT EXISTS suggestions (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  url        TEXT NOT NULL,
  category   TEXT,
  note       TEXT,
  submitter  TEXT,
  status     TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | rejected
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_suggestions_status ON suggestions (status);
