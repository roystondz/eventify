import { Router } from 'express';

import { db } from '../db/index.js';
import {
  HttpError,
  nonNegativeNumber,
  parseId,
  requiredString,
  toISO,
  trimmedString,
} from '../lib/http.js';

// Builds the public list handler and the protected create/update/delete
// router for one catalog table (services, packages, addons).
//
//   readBody(body)  -> validated { column: value } to write
//   toResponse(row) -> JSON shape sent to the client
function createCatalog({ table, label, readBody, toResponse }) {
  const listStmt = db.prepare(`SELECT * FROM ${table} ORDER BY id ASC`);
  const deleteStmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`);

  const list = (req, res) => {
    res.json(listStmt.all().map(toResponse));
  };

  const admin = Router();

  admin.post('/', (req, res) => {
    const fields = readBody(req.body ?? {});
    const columns = Object.keys(fields);

    const row = db
      .prepare(
        `INSERT INTO ${table} (${columns.join(', ')})
         VALUES (${columns.map(() => '?').join(', ')})
         RETURNING *`,
      )
      .get(...Object.values(fields));

    res.status(201).json(toResponse(row));
  });

  admin.put('/:id', (req, res) => {
    const id = parseId(req.params.id, `${label} id`);
    const fields = readBody(req.body ?? {});
    const assignments = Object.keys(fields).map((column) => `${column} = ?`);

    const row = db
      .prepare(
        `UPDATE ${table}
         SET ${assignments.join(', ')}, updated_at = CURRENT_TIMESTAMP
         WHERE id = ?
         RETURNING *`,
      )
      .get(...Object.values(fields), id);

    if (!row) {
      throw new HttpError(404, `${label} not found`);
    }

    res.json(toResponse(row));
  });

  admin.delete('/:id', (req, res) => {
    const id = parseId(req.params.id, `${label} id`);

    if (deleteStmt.run(id).changes === 0) {
      throw new HttpError(404, `${label} not found`);
    }

    res.status(204).end();
  });

  return { list, admin };
}

function readBaseFields(body) {
  return {
    name: requiredString(body.name, 'name'),
    description: trimmedString(body.description),
    price: nonNegativeNumber(body.price, 'price'),
  };
}

function baseResponse(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    created_at: toISO(row.created_at),
    updated_at: toISO(row.updated_at),
  };
}

// The admin UI sends items as a JSON-encoded string; also accept a real
// array or newline-separated text.
function parseItems(value) {
  let items = value ?? [];

  if (typeof items === 'string') {
    try {
      items = JSON.parse(items);
    } catch {
      items = items.split('\n');
    }
  }

  if (!Array.isArray(items)) {
    throw new HttpError(400, 'items must be a list of strings');
  }

  return items
    .filter((item) => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

// Optional on update: when omitted the stored image is kept.
function readImage(body) {
  if (body.image === undefined) {
    return {};
  }

  const image = trimmedString(body.image);

  if (image && !image.startsWith('/') && !/^https:\/\//i.test(image)) {
    throw new HttpError(400, 'image must be a site path (/assets/...) or an https:// URL');
  }

  return { image };
}

export const services = createCatalog({
  table: 'services',
  label: 'service',
  readBody: (body) => ({ ...readBaseFields(body), ...readImage(body) }),
  toResponse: (row) => ({ ...baseResponse(row), image: row.image }),
});

export const addons = createCatalog({
  table: 'addons',
  label: 'addon',
  readBody: readBaseFields,
  toResponse: baseResponse,
});

export const packages = createCatalog({
  table: 'packages',
  label: 'package',
  readBody: (body) => ({
    ...readBaseFields(body),
    items: JSON.stringify(parseItems(body.items)),
    savings: trimmedString(body.savings),
  }),
  toResponse: (row) => ({
    ...baseResponse(row),
    items: JSON.parse(row.items),
    savings: row.savings,
  }),
});
