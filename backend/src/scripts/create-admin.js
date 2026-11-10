// Creates an admin, or resets the password and reactivates an existing one.
//
//   npm run create-admin -- <username> <password>

import { db } from '../db/index.js';
import { hashPassword, MIN_PASSWORD_LENGTH } from '../lib/auth.js';

const [username, password] = process.argv.slice(2);

if (!username || !password) {
  console.error('usage: npm run create-admin -- <username> <password>');
  process.exit(1);
}

if (password.length < MIN_PASSWORD_LENGTH) {
  console.error(`password must be at least ${MIN_PASSWORD_LENGTH} characters`);
  process.exit(1);
}

const passwordHash = await hashPassword(password);
const existing = db.prepare('SELECT id FROM admins WHERE username = ?').get(username);

if (existing) {
  db.prepare(
    `UPDATE admins
     SET password_hash = ?, is_active = 1, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
  ).run(passwordHash, existing.id);
  console.log(`Updated password for admin "${username}" and reactivated it`);
} else {
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(
    username,
    passwordHash,
  );
  console.log(`Created admin "${username}"`);
}

db.close();
