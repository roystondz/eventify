import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { config } from '../config.js';

const BCRYPT_ROUNDS = 10;

export const MIN_PASSWORD_LENGTH = 8;

export function hashPassword(password) {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function checkPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export function generateToken(admin) {
  return jwt.sign(
    { admin_id: admin.id, username: admin.username },
    config.jwtSecret,
    {
      algorithm: 'HS256',
      subject: String(admin.id),
      expiresIn: config.jwtExpiresIn,
    },
  );
}

// Throws if the token is malformed, tampered with, or expired.
export function verifyToken(token) {
  return jwt.verify(token, config.jwtSecret, { algorithms: ['HS256'] });
}
