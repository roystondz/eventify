import { Router } from 'express';

import { db } from '../db/index.js';
import { hashPassword, MIN_PASSWORD_LENGTH } from '../lib/auth.js';
import { HttpError, parseId, requiredString, toISO } from '../lib/http.js';

const COLUMNS = 'id, username, is_active, created_at, updated_at';

const listStmt = db.prepare(`SELECT ${COLUMNS} FROM admins ORDER BY id ASC`);
const getStmt = db.prepare(`SELECT ${COLUMNS} FROM admins WHERE id = ?`);
const findByUsernameStmt = db.prepare('SELECT id FROM admins WHERE username = ?');

function toResponse(row) {
  return {
    id: row.id,
    username: row.username,
    is_active: row.is_active ? 1 : 0,
    created_at: toISO(row.created_at),
    updated_at: toISO(row.updated_at),
  };
}

function readPassword(body) {
  const password = typeof body?.password === 'string' ? body.password : '';

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new HttpError(400, `password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  }

  return password;
}

function assertUsernameAvailable(username, exceptId = null) {
  const existing = findByUsernameStmt.get(username);

  if (existing && existing.id !== exceptId) {
    throw new HttpError(409, 'username already exists');
  }
}

function assertNotSelf(req, id, action) {
  if (req.admin.id === id) {
    throw new HttpError(400, `you cannot ${action} your own account`);
  }
}

export const admins = Router();

admins.get('/', (req, res) => {
  res.json(listStmt.all().map(toResponse));
});

admins.post('/', async (req, res) => {
  const username = requiredString(req.body?.username, 'username');
  const password = readPassword(req.body);

  assertUsernameAvailable(username);

  const row = db
    .prepare(
      `INSERT INTO admins (username, password_hash) VALUES (?, ?) RETURNING ${COLUMNS}`,
    )
    .get(username, await hashPassword(password));

  res.status(201).json(toResponse(row));
});

// Accepts { username } and/or { is_active: 0 | 1 }.
admins.put('/:id', (req, res) => {
  const id = parseId(req.params.id, 'admin id');
  const body = req.body ?? {};
  const updates = {};

  if (body.username !== undefined) {
    updates.username = requiredString(body.username, 'username');
    assertUsernameAvailable(updates.username, id);
  }

  if (body.is_active !== undefined) {
    updates.is_active = body.is_active === true || Number(body.is_active) === 1 ? 1 : 0;

    if (!updates.is_active) {
      assertNotSelf(req, id, 'deactivate');
    }
  }

  if (Object.keys(updates).length === 0) {
    throw new HttpError(400, 'nothing to update: provide username or is_active');
  }

  const assignments = Object.keys(updates).map((column) => `${column} = ?`);
  const row = db
    .prepare(
      `UPDATE admins
       SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
       RETURNING ${COLUMNS}`,
    )
    .get(...Object.values(updates), id);

  if (!row) {
    throw new HttpError(404, 'admin not found');
  }

  res.json(toResponse(row));
});

admins.put('/:id/password', async (req, res) => {
  const id = parseId(req.params.id, 'admin id');
  const password = readPassword(req.body);

  const row = db
    .prepare(
      `UPDATE admins
       SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?
       RETURNING ${COLUMNS}`,
    )
    .get(await hashPassword(password), id);

  if (!row) {
    throw new HttpError(404, 'admin not found');
  }

  res.json(toResponse(row));
});

// Soft delete: the account is deactivated, not removed.
admins.delete('/:id', (req, res) => {
  const id = parseId(req.params.id, 'admin id');
  assertNotSelf(req, id, 'deactivate');

  if (!getStmt.get(id)) {
    throw new HttpError(404, 'admin not found');
  }

  db.prepare(
    'UPDATE admins SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
  ).run(id);

  res.status(204).end();
});
