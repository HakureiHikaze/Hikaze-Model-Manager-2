SCHEMA_SQL = """
CREATE TABLE IF NOT EXISTS models (
    sha256 TEXT PRIMARY KEY,
    path TEXT NOT NULL,
    name TEXT,
    type TEXT,
    size_bytes INTEGER,
    created_at INTEGER,
    meta_json TEXT
);

CREATE INDEX IF NOT EXISTS idx_models_path ON models(path);

CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS model_tags (
    model_hash TEXT,
    tag_id INTEGER,
    PRIMARY KEY (model_hash, tag_id),
    FOREIGN KEY(model_hash) REFERENCES models(sha256) ON DELETE CASCADE,
    FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pending_model_tags (
    model_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (model_id, tag_id),
    FOREIGN KEY(model_id) REFERENCES pending_import(id) ON DELETE CASCADE,
    FOREIGN KEY(tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pending_import (
    id INTEGER PRIMARY KEY,
    path TEXT UNIQUE NOT NULL,
    sha256 TEXT,
    name TEXT,
    type TEXT,
    size_bytes INTEGER,
    created_at INTEGER,
    meta_json TEXT
);

CREATE TABLE IF NOT EXISTS db_meta (
    key TEXT PRIMARY KEY,
    value TEXT
);
"""