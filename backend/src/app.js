import path from 'node:path';

import cors from 'cors';
import express, { Router } from 'express';

import { config } from './config.js';
import { requireAuth } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { inquiryLimiter, loginLimiter } from './middleware/rateLimit.js';
import { admins } from './routes/admins.js';
import { login } from './routes/auth.js';
import { addons, packages, services } from './routes/catalog.js';
import { createInquiry, inquiriesAdmin } from './routes/inquiries.js';
import { listSettings, settingsAdmin } from './routes/settings.js';

export const app = express();

app.disable('x-powered-by');
app.set('trust proxy', config.trustProxy);
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '100kb' }));

// Admin API, under /api/admin so it never collides with the /admin pages
// of the frontend. Login is the only unauthenticated admin route.
const adminApi = Router();
adminApi.post('/login', loginLimiter, login);
adminApi.use(requireAuth);
adminApi.use('/services', services.admin);
adminApi.use('/packages', packages.admin);
adminApi.use('/addons', addons.admin);
adminApi.use('/settings', settingsAdmin);
adminApi.use('/admins', admins);
adminApi.use('/inquiries', inquiriesAdmin);

// Public API.
const api = Router();
api.get('/health', (_req, res) => res.json({ status: 'ok' }));
api.get('/services', services.list);
api.get('/packages', packages.list);
api.get('/addons', addons.list);
api.get('/settings', listSettings);
api.post('/inquiries', inquiryLimiter, createInquiry);
api.use('/admin', adminApi);
api.use(notFound);

app.use('/api', api);

// Production: serve the built frontend, falling back to index.html so
// client-side routes like /admin/dashboard load on refresh.
if (config.frontendDist) {
  app.use(express.static(config.frontendDist, { maxAge: '1h' }));
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      return next();
    }
    res.sendFile(path.join(config.frontendDist, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);
