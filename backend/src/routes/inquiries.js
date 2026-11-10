import { Router } from 'express';

import { db } from '../db/index.js';
import { HttpError, parseId, requiredString, toISO, trimmedString } from '../lib/http.js';

const STATUSES = ['new', 'contacted', 'booked', 'closed'];
const SOURCES = ['contact', 'builder'];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const getPackage = db.prepare('SELECT id, name, price, items FROM packages WHERE id = ?');
const getService = db.prepare('SELECT id, name, price FROM services WHERE id = ?');
const getAddon = db.prepare('SELECT id, name, price FROM addons WHERE id = ?');

function limited(value, field, max) {
  const text = trimmedString(value);

  if (text.length > max) {
    throw new HttpError(400, `${field} must be at most ${max} characters`);
  }

  return text;
}

function idList(value) {
  if (value === undefined || value === null) {
    return [];
  }

  if (!Array.isArray(value) || value.length > 50) {
    throw new HttpError(400, 'invalid selection');
  }

  return [...new Set(value.map((id) => parseId(id, 'selection id')))];
}

// Prices are looked up here rather than trusted from the client. Services
// already included in the chosen package are not charged twice, and items
// with price 0 are "price upon request" and excluded from the total.
function buildQuote(selection = {}) {
  const pkg = selection.packageId ? getPackage.get(parseId(selection.packageId, 'package id')) : null;

  if (selection.packageId && !pkg) {
    throw new HttpError(400, 'selected package no longer exists');
  }

  const lookup = (stmt, ids, label) =>
    ids.map((id) => {
      const row = stmt.get(id);
      if (!row) {
        throw new HttpError(400, `selected ${label} no longer exists`);
      }
      return { id: row.id, name: row.name, price: row.price };
    });

  const included = new Set(
    pkg ? JSON.parse(pkg.items).map((item) => item.trim().toLowerCase()) : [],
  );

  const services = lookup(getService, idList(selection.serviceIds), 'service')
    .filter((service) => !included.has(service.name.trim().toLowerCase()));
  const addons = lookup(getAddon, idList(selection.addonIds), 'add-on');
  const extras = [...services, ...addons];

  return {
    selection: {
      package: pkg ? { id: pkg.id, name: pkg.name, price: pkg.price } : null,
      services,
      addons,
    },
    total: (pkg?.price ?? 0) + extras.reduce((sum, item) => sum + item.price, 0),
    hasPriceOnRequest: extras.some((item) => item.price === 0),
  };
}

function toResponse(row) {
  return {
    id: row.id,
    source: row.source,
    name: row.name,
    email: row.email,
    phone: row.phone,
    event_type: row.event_type,
    event_date: row.event_date,
    guest_count: row.guest_count,
    message: row.message,
    selection: JSON.parse(row.selection),
    estimated_total: row.estimated_total,
    has_price_on_request: row.has_price_on_request === 1,
    status: row.status,
    created_at: toISO(row.created_at),
    updated_at: toISO(row.updated_at),
  };
}

const insertStmt = db.prepare(`
  INSERT INTO inquiries (
    source, name, email, phone, event_type, event_date, guest_count,
    message, selection, estimated_total, has_price_on_request
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  RETURNING *
`);

// POST /api/inquiries (public)
export function createInquiry(req, res) {
  const body = req.body ?? {};

  const source = SOURCES.includes(body.source) ? body.source : 'contact';
  const name = requiredString(limited(body.name, 'name', 120), 'name');
  const email = requiredString(limited(body.email, 'email', 200), 'email');
  const phone = limited(body.phone, 'phone', 40);
  const eventType = limited(body.event_type, 'event type', 120);
  const eventDate = limited(body.event_date, 'event date', 10);
  const message = limited(body.message, 'message', 4000);

  if (!EMAIL_PATTERN.test(email)) {
    throw new HttpError(400, 'email is invalid');
  }

  if (eventDate && !DATE_PATTERN.test(eventDate)) {
    throw new HttpError(400, 'event date must be YYYY-MM-DD');
  }

  let guestCount = null;
  if (body.guest_count !== undefined && body.guest_count !== null && body.guest_count !== '') {
    guestCount = Number(body.guest_count);
    if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 100000) {
      throw new HttpError(400, 'guest count must be a whole number');
    }
  }

  const quote = source === 'builder' ? buildQuote(body.selection) : null;

  const row = insertStmt.get(
    source,
    name,
    email,
    phone,
    eventType,
    eventDate,
    guestCount,
    message,
    JSON.stringify(quote?.selection ?? {}),
    quote?.total ?? 0,
    quote?.hasPriceOnRequest ? 1 : 0,
  );

  res.status(201).json({ id: row.id, estimated_total: row.estimated_total });
}

export const inquiriesAdmin = Router();

inquiriesAdmin.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC, id DESC').all();
  res.json(rows.map(toResponse));
});

inquiriesAdmin.put('/:id', (req, res) => {
  const id = parseId(req.params.id, 'inquiry id');
  const status = req.body?.status;

  if (!STATUSES.includes(status)) {
    throw new HttpError(400, `status must be one of: ${STATUSES.join(', ')}`);
  }

  const row = db
    .prepare(
      `UPDATE inquiries SET status = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ? RETURNING *`,
    )
    .get(status, id);

  if (!row) {
    throw new HttpError(404, 'inquiry not found');
  }

  res.json(toResponse(row));
});

inquiriesAdmin.delete('/:id', (req, res) => {
  const id = parseId(req.params.id, 'inquiry id');

  if (db.prepare('DELETE FROM inquiries WHERE id = ?').run(id).changes === 0) {
    throw new HttpError(404, 'inquiry not found');
  }

  res.status(204).end();
});
