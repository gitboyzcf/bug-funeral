import os
import sqlite3

from app.config import DB_PATH

CREATE_BUGS_SQL = """
CREATE TABLE IF NOT EXISTS bugs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    error_type TEXT NOT NULL,
    error_message TEXT NOT NULL,
    language TEXT NOT NULL,
    location TEXT NOT NULL DEFAULT '',
    stack_excerpt TEXT NOT NULL DEFAULT '',
    biography TEXT NOT NULL DEFAULT '',
    cause_of_death TEXT NOT NULL DEFAULT '',
    epitaph TEXT NOT NULL DEFAULT '',
    severity INTEGER NOT NULL DEFAULT 3,
    burial_type TEXT NOT NULL DEFAULT 'earth',
    incense_count INTEGER NOT NULL DEFAULT 0,
    flower_count INTEGER NOT NULL DEFAULT 0,
    paper_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
)
"""


def get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_conn()
    try:
        conn.execute(CREATE_BUGS_SQL)
        conn.commit()
    finally:
        conn.close()