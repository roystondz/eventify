import { HttpError } from '../lib/http.js';

export function notFound(req, res) {
  res.status(404).type('text').send('not found');
}

// Errors are sent as plain text because the frontend surfaces
// `await res.text()` directly in its toasts.
export function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof HttpError) {
    return res.status(err.status).type('text').send(err.message);
  }

  // Malformed JSON or oversized body from express.json().
  if (err.type === 'entity.parse.failed') {
    return res.status(400).type('text').send('invalid request body');
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).type('text').send('request body too large');
  }

  console.error(err);
  res.status(500).type('text').send('internal server error');
}
