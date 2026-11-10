import { db } from '../db/index.js';
import { checkPassword, generateToken, hashPassword } from '../lib/auth.js';
import { HttpError, trimmedString } from '../lib/http.js';

const findAdmin = db.prepare(
  'SELECT id, username, password_hash, is_active FROM admins WHERE username = ?',
);

// Compared against when the username doesn't exist, so a login attempt
// takes the same time whether or not the account is real.
const dummyHash = hashPassword('not-a-real-account');

// POST /admin/login  { username, password } -> { token, admin }
export async function login(req, res) {
  const username = trimmedString(req.body?.username);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!username || !password) {
    throw new HttpError(400, 'username and password are required');
  }

  const admin = findAdmin.get(username);
  const passwordMatches = await checkPassword(
    password,
    admin?.password_hash ?? (await dummyHash),
  );

  // Same message for every failure so usernames can't be probed.
  if (!admin || !admin.is_active || !passwordMatches) {
    throw new HttpError(401, 'invalid credentials');
  }

  res.json({
    token: generateToken(admin),
    admin: { id: admin.id, username: admin.username },
  });
}
