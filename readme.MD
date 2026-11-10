# Eventify

Website and admin panel for Eventify, a personalized event services business in Kuwait.
Visitors browse services and packages, build a live price estimate, and send an inquiry
(saved for the team, or sent over WhatsApp). Admins manage the catalog, site settings,
admin accounts, and incoming inquiries.

```
backend/    Node.js + Express REST API, SQLite (node:sqlite)
frontend/   React 18 + Vite single-page app
```

## Requirements

- Node.js 22.13 or newer

## Local development

```bash
# 1. Backend (http://localhost:8080)
cd backend
npm install
cp .env.example .env
npm run create-admin -- <username> <password>   # first admin, or reset a password
npm run dev

# 2. Frontend (http://localhost:3000), in another terminal
cd frontend
npm install
npm run dev
```

Vite forwards `/api/*` to the backend. The database is created at `backend/data/eventify.db`
on first start, with migrations applied automatically and a starter catalog seeded into
empty tables.

## Tests

```bash
cd backend && npm test    # API tests against an in-memory database
cd frontend && npm test   # pricing and WhatsApp link helpers
```

## Production

Build the frontend, then run the backend with `NODE_ENV=production`; it serves the API
and the built site from one port:

```bash
cd frontend && npm run build
cd ../backend && NODE_ENV=production JWT_SECRET=<long-random-string> npm start
```

| Variable      | Default                  | Notes                                               |
|---------------|--------------------------|-----------------------------------------------------|
| `PORT`        | `8080`                   |                                                     |
| `DB_PATH`     | `./data/eventify.db`     | Relative to `backend/`                              |
| `JWT_SECRET`  | dev-only fallback        | **Required** in production                          |
| `CORS_ORIGIN` | `http://localhost:3000`  | Only needed when the frontend is on another origin  |
| `TRUST_PROXY` | `0`                      | Number of reverse proxies in front (for rate limits)|

## API

Public: `GET /api/health`, `/api/services`, `/api/packages`, `/api/addons`, `/api/settings`,
`POST /api/inquiries`.

Admin (Bearer token from `POST /api/admin/login`): CRUD under `/api/admin/services`,
`/api/admin/packages`, `/api/admin/addons`; `PUT /api/admin/settings/:key`;
`/api/admin/admins` (list, create, activate/deactivate, change password);
`/api/admin/inquiries` (list, set status, delete).

Prices are in KD. A price of `0` means "price upon request" and is left out of estimates.
A package's inclusions that exactly match a service name are treated as included, so the
event builder never charges for them twice.
