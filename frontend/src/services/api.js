// Centralized API client. All requests go to /api (proxied to the backend
// by Vite in development, served by the backend itself in production).

import {
  DEFAULT_ADDONS,
  DEFAULT_PACKAGES,
  DEFAULT_SERVICES,
  DEFAULT_SETTINGS,
} from './defaults';

const TOKEN_KEY = 'eventify_admin_token';

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch {
    // Storage unavailable (private mode); the session lasts until reload.
  }
};

// Called when an authenticated request is rejected (expired or revoked
// session). AuthContext registers a handler that logs the admin out.
let unauthorizedHandler = null;
export const onUnauthorized = (handler) => {
  unauthorizedHandler = handler;
};

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function request(method, path, { body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.');
  }

  if (res.status === 401 && auth) {
    unauthorizedHandler?.();
    throw new ApiError(401, 'Your session has expired. Please log in again.');
  }

  if (!res.ok) {
    const text = (await res.text()).trim();
    const message = text ? text.charAt(0).toUpperCase() + text.slice(1) : `Request failed (${res.status})`;
    throw new ApiError(res.status, message);
  }

  return res.status === 204 ? null : res.json();
}

// Public pages keep working with built-in content if the backend is down.
async function withFallback(path, fallback) {
  try {
    return await request('GET', path);
  } catch (err) {
    console.warn(`GET /api${path} failed, using built-in content:`, err.message);
    return fallback;
  }
}

function catalog(resource) {
  return {
    list: () => request('GET', `/${resource}`),
    create: (data) => request('POST', `/admin/${resource}`, { body: data, auth: true }),
    update: (id, data) => request('PUT', `/admin/${resource}/${id}`, { body: data, auth: true }),
    remove: (id) => request('DELETE', `/admin/${resource}/${id}`, { auth: true }),
  };
}

export const api = {
  // Public site
  getServices: () => withFallback('/services', DEFAULT_SERVICES),
  getPackages: () => withFallback('/packages', DEFAULT_PACKAGES),
  getAddons: () => withFallback('/addons', DEFAULT_ADDONS),
  getSettings: async () => ({ ...DEFAULT_SETTINGS, ...(await withFallback('/settings', {})) }),
  submitInquiry: (inquiry) => request('POST', '/inquiries', { body: inquiry }),

  // Admin auth
  login: async (username, password) => {
    const data = await request('POST', '/admin/login', { body: { username, password } });
    setToken(data.token);
    return data;
  },

  // Admin panel: no fallbacks, errors are surfaced to the admin.
  admin: {
    services: catalog('services'),
    packages: catalog('packages'),
    addons: catalog('addons'),

    getSettings: () => request('GET', '/settings'),
    updateSetting: (key, value) =>
      request('PUT', `/admin/settings/${encodeURIComponent(key)}`, { body: { value }, auth: true }),

    listAdmins: () => request('GET', '/admin/admins', { auth: true }),
    createAdmin: (username, password) =>
      request('POST', '/admin/admins', { body: { username, password }, auth: true }),
    setAdminActive: (id, isActive) =>
      request('PUT', `/admin/admins/${id}`, { body: { is_active: isActive ? 1 : 0 }, auth: true }),
    changeAdminPassword: (id, password) =>
      request('PUT', `/admin/admins/${id}/password`, { body: { password }, auth: true }),

    listInquiries: () => request('GET', '/admin/inquiries', { auth: true }),
    setInquiryStatus: (id, status) =>
      request('PUT', `/admin/inquiries/${id}`, { body: { status }, auth: true }),
    deleteInquiry: (id) => request('DELETE', `/admin/inquiries/${id}`, { auth: true }),
  },
};
