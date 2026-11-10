import assert from 'node:assert/strict';
import { after, before, describe, test } from 'node:test';

// Must be set before the app (and its database) is imported.
process.env.NODE_ENV = 'test';
process.env.DB_PATH = ':memory:';

const { app } = await import('../src/app.js');
const { db } = await import('../src/db/index.js');
const { hashPassword } = await import('../src/lib/auth.js');

let server;
let baseUrl;
let token;

async function request(method, path, { body, auth = token } = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(auth ? { Authorization: `Bearer ${auth}` } : {}),
    },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
  const text = await res.text();
  let data = text;
  try {
    data = JSON.parse(text);
  } catch {
    // plain-text error
  }
  return { status: res.status, data };
}

before(async () => {
  db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)').run(
    'owner',
    await hashPassword('password123'),
  );

  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  const res = await request('POST', '/api/admin/login', {
    body: { username: 'owner', password: 'password123' },
    auth: null,
  });
  token = res.data.token;
});

after(() => server.close());

describe('public API', () => {
  test('health', async () => {
    assert.deepEqual((await request('GET', '/api/health')).data, { status: 'ok' });
  });

  test('catalog is seeded', async () => {
    const services = await request('GET', '/api/services');
    const packages = await request('GET', '/api/packages');
    const addons = await request('GET', '/api/addons');

    assert.equal(services.data.length, 9);
    assert.match(services.data[0].image, /^\/assets\/services\/.+\.webp$/);
    assert.equal(packages.data.length, 3);
    assert.ok(Array.isArray(packages.data[0].items));
    assert.equal(addons.data.length, 4);
  });

  test('settings are returned as an object', async () => {
    const { data } = await request('GET', '/api/settings');
    assert.equal(data.company_name, 'Eventify');
    assert.equal(data.whatsapp_number, '+965 6643 3680');
  });

  test('unknown API routes 404', async () => {
    assert.equal((await request('GET', '/api/nope')).status, 404);
  });
});

describe('auth', () => {
  test('rejects bad credentials with one generic message', async () => {
    const wrongPassword = await request('POST', '/api/admin/login', {
      body: { username: 'owner', password: 'nope' },
      auth: null,
    });
    const unknownUser = await request('POST', '/api/admin/login', {
      body: { username: 'ghost', password: 'nope' },
      auth: null,
    });

    assert.equal(wrongPassword.status, 401);
    assert.equal(unknownUser.status, 401);
    assert.equal(wrongPassword.data, unknownUser.data);
  });

  test('rejects malformed JSON', async () => {
    const res = await request('POST', '/api/admin/login', { body: '{bad', auth: null });
    assert.equal(res.status, 400);
  });

  test('protects admin routes', async () => {
    assert.equal((await request('GET', '/api/admin/admins', { auth: null })).status, 401);
    assert.equal((await request('GET', '/api/admin/admins', { auth: 'garbage' })).status, 401);
  });
});

describe('catalog admin', () => {
  test('create, update, delete a service', async () => {
    const created = await request('POST', '/api/admin/services', {
      body: { name: ' Drone Show ', price: '120', image: '/assets/services/x.webp' },
    });
    assert.equal(created.status, 201);
    assert.equal(created.data.name, 'Drone Show');
    assert.equal(created.data.price, 120);

    // Image is kept when omitted from an update.
    const updated = await request('PUT', `/api/admin/services/${created.data.id}`, {
      body: { name: 'Drone Light Show', price: 150 },
    });
    assert.equal(updated.data.name, 'Drone Light Show');
    assert.equal(updated.data.image, '/assets/services/x.webp');

    assert.equal((await request('DELETE', `/api/admin/services/${created.data.id}`)).status, 204);
    assert.equal((await request('DELETE', `/api/admin/services/${created.data.id}`)).status, 404);
  });

  test('validates input', async () => {
    assert.equal((await request('POST', '/api/admin/services', { body: { name: '' } })).status, 400);
    assert.equal(
      (await request('POST', '/api/admin/services', { body: { name: 'x', price: -1 } })).status,
      400,
    );
    assert.equal(
      (await request('POST', '/api/admin/services', { body: { name: 'x', image: 'javascript:alert(1)' } }))
        .status,
      400,
    );
    assert.equal((await request('PUT', '/api/admin/services/abc', { body: { name: 'x' } })).status, 400);
    assert.equal((await request('PUT', '/api/admin/services/9999', { body: { name: 'x' } })).status, 404);
  });

  test('package items accept the JSON string the admin UI sends', async () => {
    const res = await request('POST', '/api/admin/packages', {
      body: { name: 'Test', price: 10, items: JSON.stringify(['A', ' ', 'B']) },
    });
    assert.deepEqual(res.data.items, ['A', 'B']);
  });

  test('settings upsert', async () => {
    const res = await request('PUT', '/api/admin/settings/phone', { body: { value: ' +965 1 ' } });
    assert.equal(res.data.value, '+965 1');
    assert.equal((await request('PUT', '/api/admin/settings/bad%20key', { body: { value: 'x' } })).status, 400);
  });
});

describe('admin users', () => {
  test('create, toggle, change password, deactivate', async () => {
    const created = await request('POST', '/api/admin/admins', {
      body: { username: 'helper', password: 'password123' },
    });
    assert.equal(created.status, 201);
    assert.equal(created.data.is_active, 1);

    assert.equal(
      (await request('POST', '/api/admin/admins', { body: { username: 'helper', password: 'password123' } }))
        .status,
      409,
    );
    assert.equal(
      (await request('POST', '/api/admin/admins', { body: { username: 'x', password: 'short' } })).status,
      400,
    );

    const id = created.data.id;
    const disabled = await request('PUT', `/api/admin/admins/${id}`, { body: { is_active: 0 } });
    assert.equal(disabled.data.is_active, 0);

    const login = await request('POST', '/api/admin/login', {
      body: { username: 'helper', password: 'password123' },
      auth: null,
    });
    assert.equal(login.status, 401);

    await request('PUT', `/api/admin/admins/${id}`, { body: { is_active: 1 } });
    const changed = await request('PUT', `/api/admin/admins/${id}/password`, {
      body: { password: 'newpassword1' },
    });
    assert.equal(changed.status, 200);

    const helperLogin = await request('POST', '/api/admin/login', {
      body: { username: 'helper', password: 'newpassword1' },
      auth: null,
    });
    const helperToken = helperLogin.data.token;
    assert.ok(helperToken);

    // Deactivation takes effect immediately, even for an unexpired token.
    assert.equal((await request('DELETE', `/api/admin/admins/${id}`)).status, 204);
    assert.equal((await request('GET', '/api/admin/admins', { auth: helperToken })).status, 401);
  });

  test('an admin cannot deactivate themselves', async () => {
    assert.equal((await request('PUT', '/api/admin/admins/1', { body: { is_active: 0 } })).status, 400);
    assert.equal((await request('DELETE', '/api/admin/admins/1')).status, 400);
  });
});

describe('inquiries', () => {
  test('contact form inquiry', async () => {
    const res = await request('POST', '/api/inquiries', {
      auth: null,
      body: { source: 'contact', name: 'Sara', email: 'sara@example.com', phone: '+965 1', message: 'Hi' },
    });
    assert.equal(res.status, 201);
  });

  test('builder quote is priced on the server without double-counting', async () => {
    // Package 1 (KD 85) already includes Photography (service 7, KD 45).
    // DJ (service 3) is KD 80; addon 2 is price-on-request.
    const res = await request('POST', '/api/inquiries', {
      auth: null,
      body: {
        source: 'builder',
        name: 'Omar',
        email: 'omar@example.com',
        event_date: '2026-12-01',
        guest_count: 120,
        selection: { packageId: 1, serviceIds: [7, 3], addonIds: [2] },
      },
    });
    assert.equal(res.status, 201);
    assert.equal(res.data.estimated_total, 85 + 80);

    const list = await request('GET', '/api/admin/inquiries');
    const saved = list.data.find((inquiry) => inquiry.id === res.data.id);
    assert.deepEqual(
      saved.selection.services.map((service) => service.id),
      [3],
    );
    assert.equal(saved.has_price_on_request, true);
  });

  test('validates input', async () => {
    const bad = (body) => request('POST', '/api/inquiries', { auth: null, body });
    assert.equal((await bad({ name: '', email: 'a@b.co' })).status, 400);
    assert.equal((await bad({ name: 'A', email: 'not-an-email' })).status, 400);
    assert.equal((await bad({ name: 'A', email: 'a@b.co', event_date: 'tomorrow' })).status, 400);
    assert.equal(
      (await bad({ source: 'builder', name: 'A', email: 'a@b.co', selection: { packageId: 999 } })).status,
      400,
    );
  });

  test('admin can update status and delete', async () => {
    const list = await request('GET', '/api/admin/inquiries');
    const id = list.data[0].id;

    assert.equal(
      (await request('PUT', `/api/admin/inquiries/${id}`, { body: { status: 'contacted' } })).data.status,
      'contacted',
    );
    assert.equal(
      (await request('PUT', `/api/admin/inquiries/${id}`, { body: { status: 'bogus' } })).status,
      400,
    );
    assert.equal((await request('DELETE', `/api/admin/inquiries/${id}`)).status, 204);
  });

  test('inquiries require auth to read', async () => {
    assert.equal((await request('GET', '/api/admin/inquiries', { auth: null })).status, 401);
  });
});
