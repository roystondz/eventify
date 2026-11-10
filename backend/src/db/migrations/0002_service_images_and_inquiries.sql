ALTER TABLE services ADD COLUMN image TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL DEFAULT 'contact',
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    event_type TEXT NOT NULL DEFAULT '',
    event_date TEXT NOT NULL DEFAULT '',
    guest_count INTEGER,
    message TEXT NOT NULL DEFAULT '',
    -- JSON snapshot of the quote at submission time (names and prices).
    selection TEXT NOT NULL DEFAULT '{}',
    estimated_total REAL NOT NULL DEFAULT 0,
    has_price_on_request INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'new',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries (created_at);
