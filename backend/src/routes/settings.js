import { Router } from 'express';

import { db } from '../db/index.js';
import { HttpError, toISO } from '../lib/http.js';

const KEY_PATTERN = /^[a-z0-9_]{1,64}$/i;

const listStmt = db.prepare('SELECT key, value FROM settings ORDER BY key ASC');
const upsertStmt = db.prepare(`
  INSERT INTO settings (key, value, updated_at)
  VALUES (?, ?, CURRENT_TIMESTAMP)
  ON CONFLICT(key) DO UPDATE SET
    value = excluded.value,
    updated_at = CURRENT_TIMESTAMP
  RETURNING key, value, updated_at
`);

// GET /api/settings -> { company_name: "...", phone: "...", ... }
export function listSettings(req, res) {
  const settings = Object.fromEntries(
    listStmt.all().map(({ key, value }) => [key, value]),
  );

  res.json(settings);
}

export const settingsAdmin = Router();

// PUT /admin/settings/:key  { "value": "..." }
settingsAdmin.put('/:key', (req, res) => {
  const { key } = req.params;

  if (!KEY_PATTERN.test(key)) {
    throw new HttpError(400, 'invalid setting key');
  }

  const value = req.body?.value;

  if (value === undefined || value === null || typeof value === 'object') {
    throw new HttpError(400, 'value is required');
  }

  const row = upsertStmt.get(key, String(value).trim());

  res.json({ ...row, updated_at: toISO(row.updated_at) });
});
