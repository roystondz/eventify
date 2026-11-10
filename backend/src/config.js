import fs from 'node:fs';
import path from 'node:path';

const backendDir = path.resolve(import.meta.dirname, '..');

// Load backend/.env if present. Real environment variables take precedence.
try {
  process.loadEnvFile(path.join(backendDir, '.env'));
} catch {
  // No .env file; rely on the environment.
}

const isProduction = process.env.NODE_ENV === 'production';

if (isProduction && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production');
}

const dbPath = process.env.DB_PATH || './data/eventify.db';
const frontendDist = path.resolve(backendDir, '../frontend/dist');

export const config = {
  isProduction,
  port: Number(process.env.PORT) || 8080,
  dbPath: dbPath === ':memory:' ? dbPath : path.resolve(backendDir, dbPath),
  jwtSecret: process.env.JWT_SECRET || 'development-secret',
  jwtExpiresIn: '24h',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  // Number of reverse proxies in front of the app (for correct client IPs
  // in rate limiting). 0 when Node is exposed directly.
  trustProxy: Number(process.env.TRUST_PROXY) || 0,
  // In production the built frontend is served by this same server.
  frontendDist:
    isProduction && fs.existsSync(path.join(frontendDist, 'index.html'))
      ? frontendDist
      : null,
};
