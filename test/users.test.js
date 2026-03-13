'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

let server;
let BASE;

before(() => new Promise((resolve) => {
  server = app.listen(0, () => {
    BASE = `http://localhost:${server.address().port}`;
    resolve();
  });
}));

after(() => new Promise((resolve) => server.close(resolve)));

// All /api/users routes pass through authMiddleware.
// Token is sent via query string (req.param() reads it from req.query in Express 4).
const TOKEN = 'token=mytoken';

// ─── GET /api/users ───────────────────────────────────────────────────────────
// Express 4: res.json(users, 200) — wrong argument order (deprecated)
// Express 5: res.status(200).json(users)
describe('GET /api/users', () => {
  it('returns 200 and a list of users', async () => {
    const res = await fetch(`${BASE}/api/users?${TOKEN}`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body));
    assert.equal(body.length, 3);
  });
});

// ─── GET /api/users/:id ───────────────────────────────────────────────────────
// Express 4: req.param('id') — ambiguous lookup (deprecated)
// Express 5: req.params.id
describe('GET /api/users/:id', () => {
  it('returns 200 and the user object', async () => {
    const res = await fetch(`${BASE}/api/users/1?${TOKEN}`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok('id' in body);
    assert.ok('name' in body);
    assert.ok('email' in body);
  });
});

// ─── POST /api/users ──────────────────────────────────────────────────────────
// Express 4: req.param('name') + res.json(newUser, 201) — both deprecated
// Express 5: req.body.name  + res.status(201).json(newUser)
describe('POST /api/users', () => {
  it('creates a user and returns 201', async () => {
    const res = await fetch(`${BASE}/api/users?${TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Diana', email: 'diana@example.com' }),
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok('id' in body);
    assert.equal(body.name, 'Diana');
    assert.equal(body.email, 'diana@example.com');
  });

  it('returns 400 when name or email is missing', async () => {
    const res = await fetch(`${BASE}/api/users?${TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'NoEmail' }),
    });
    assert.equal(res.status, 400);
  });
});

// ─── PUT /api/users/:id ───────────────────────────────────────────────────────
// Express 4: req.param() + res.json(updated, 200) — both deprecated
// Express 5: req.params.id + req.body + res.status(200).json(updated)
describe('PUT /api/users/:id', () => {
  it('updates a user and returns 200', async () => {
    const res = await fetch(`${BASE}/api/users/1?${TOKEN}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Alice Updated', email: 'alice2@example.com' }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok('updatedAt' in body);
  });
});

// ─── DELETE /api/users/:id ────────────────────────────────────────────────────
// Runtime route uses router.delete() so tests run on current Express versions.
describe('DELETE /api/users/:id', () => {
  it('deletes a user and returns 200', async () => {
    const res = await fetch(`${BASE}/api/users/42?${TOKEN}`, {
      method: 'DELETE',
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.message.includes('42'));
  });
});

// ─── GET /api/users/:id/profile ───────────────────────────────────────────────
// Express 4: res.redirect(`/users/${req.param('id')}/details`, 302)
//            wrong argument order + req.param() — both deprecated
// Express 5: res.redirect(302, `/users/${req.params.id}/details`)
describe('GET /api/users/:id/profile', () => {
  it('redirects to /users/:id/details with 302', async () => {
    const res = await fetch(`${BASE}/api/users/1/profile?${TOKEN}`, {
      redirect: 'manual',
    });
    assert.equal(res.status, 302);
    assert.ok(res.headers.get('location').includes('/users/1/details'));
  });
});
