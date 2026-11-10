// An error carrying the HTTP status to respond with. Anything thrown from a
// route that is not an HttpError is treated as a 500 by the error handler.
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export function parseId(value, label = 'id') {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, `invalid ${label}`);
  }

  return id;
}

export function trimmedString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export function requiredString(value, field) {
  const text = trimmedString(value);

  if (!text) {
    throw new HttpError(400, `${field} is required`);
  }

  return text;
}

export function nonNegativeNumber(value, field) {
  const number = value === undefined || value === null || value === '' ? 0 : Number(value);

  if (!Number.isFinite(number)) {
    throw new HttpError(400, `${field} must be a number`);
  }

  if (number < 0) {
    throw new HttpError(400, `${field} cannot be negative`);
  }

  return number;
}

// SQLite CURRENT_TIMESTAMP is "YYYY-MM-DD HH:MM:SS" in UTC.
export function toISO(timestamp) {
  return timestamp ? `${timestamp.replace(' ', 'T')}Z` : null;
}
