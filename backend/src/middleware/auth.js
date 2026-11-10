import { db } from '../db/index.js';
import { verifyToken } from '../lib/auth.js';
import { HttpError } from '../lib/http.js';

const findActiveAdmin = db.prepare(
  'SELECT id, username FROM admins WHERE id = ? AND is_active = 1',
);

// Requires "Authorization: Bearer <jwt>" and attaches the admin to req.admin.
// The admin is re-checked on every request so a disabled account loses
// access immediately rather than when its token expires.
export function requireAuth(req, res, next) {
  const header = req.get('Authorization');

  if (!header) {
    throw new HttpError(401, 'authorization required');
  }

  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw new HttpError(401, 'invalid authorization header');
  }

  let claims;
  try {
    claims = verifyToken(token);
  } catch {
    throw new HttpError(401, 'invalid or expired token');
  }

  const admin = findActiveAdmin.get(claims.admin_id);

  if (!admin) {
    throw new HttpError(401, 'invalid or expired token');
  }

  req.admin = admin;
  next();
}
