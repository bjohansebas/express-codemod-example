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

const TOKEN = 'token=mytoken';

// ─── GET /api/products ────────────────────────────────────────────────────────
// Express 4: res.json(filtered, 200) — wrong argument order (deprecated)
// Express 5: res.status(200).json(filtered)
describe('GET /api/products', () => {
  it('returns 200 and a list of all products', async () => {
    const res = await fetch(`${BASE}/api/products?${TOKEN}`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body));
    assert.equal(body.length, 3);
  });

  it('filters by category when ?category= is provided', async () => {
    // Express 4: req.param('category') reads from req.query (deprecated)
    // Express 5: req.query.category
    const res = await fetch(`${BASE}/api/products?${TOKEN}&category=electronics`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body));
    assert.equal(body.length, 2);
    assert.ok(body.every((p) => p.category === 'electronics'));
  });
});

// ─── GET /api/products/:id ────────────────────────────────────────────────────
// Express 4: req.param('id') + res.json(product, 200) — both deprecated
// Express 5: req.params.id  + res.status(200).json(product)
describe('GET /api/products/:id', () => {
  it('returns 200 and the product object', async () => {
    const res = await fetch(`${BASE}/api/products/1?${TOKEN}`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok('id' in body);
    assert.ok('name' in body);
    assert.ok('price' in body);
  });
});

// ─── POST /api/products ───────────────────────────────────────────────────────
// Express 4: req.param('name') + res.json(product, 201) — both deprecated
// Express 5: req.body.name   + res.status(201).json(product)
describe('POST /api/products', () => {
  it('creates a product and returns 201', async () => {
    const res = await fetch(`${BASE}/api/products?${TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Monitor', price: '320', category: 'electronics' }),
    });
    assert.equal(res.status, 201);
    const body = await res.json();
    assert.ok('id' in body);
    assert.equal(body.name, 'Monitor');
    assert.equal(body.price, 320);
  });

  it('returns 400 when name or price is missing', async () => {
    // Express 4: res.send({ error: '...' }, 400) — wrong argument order (deprecated)
    // Express 5: res.status(400).send({ error: '...' })
    const res = await fetch(`${BASE}/api/products?${TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'NoPrice' }),
    });
    assert.equal(res.status, 400);
  });
});

// ─── DELETE /api/products/:id ─────────────────────────────────────────────────
// Runtime route uses router.delete() so tests run on current Express versions.
describe('DELETE /api/products/:id', () => {
  it('deletes a product and returns 200', async () => {
    const res = await fetch(`${BASE}/api/products/7?${TOKEN}`, {
      method: 'DELETE',
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.message.includes('7'));
  });
});

// ─── GET /api/products/feed ───────────────────────────────────────────────────
// Note: /feed is defined AFTER /:id, so Express matches /:id first.
// This test documents that behaviour: 'feed' is treated as a product id.
// Express 4: req.acceptsCharset/Encoding/Language (singular, deprecated) are
//            only reachable if the route order is fixed in a future refactor.
describe('GET /api/products/feed (matched by /:id)', () => {
  it('returns 200 — route is caught by /:id due to declaration order', async () => {
    const res = await fetch(`${BASE}/api/products/feed?${TOKEN}`);
    assert.equal(res.status, 200);
  });
});

// ─── POST /api/products/:id/favorite ─────────────────────────────────────────
// Express 4: res.redirect('back') — magic string (deprecated)
// Express 5: res.redirect(req.get('Referrer') || '/')
describe('POST /api/products/:id/favorite', () => {
  it('redirects with 302 when no Referrer header is present', async () => {
    const res = await fetch(`${BASE}/api/products/1/favorite?${TOKEN}`, {
      method: 'POST',
      redirect: 'manual',
    });
    assert.equal(res.status, 302);
  });
});

// ─── POST /api/products/:id/review ───────────────────────────────────────────
// Express 4: res.location('back') + res.send('Review saved', 200)
//            magic 'back' string + wrong argument order — both deprecated
// Express 5: res.location(req.get('Referrer') || '/') + res.status(200).send(...)
describe('POST /api/products/:id/review', () => {
  it('returns 200 and sets Location header', async () => {
    const res = await fetch(`${BASE}/api/products/1/review?${TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating: 5, comment: 'Great!' }),
    });
    assert.equal(res.status, 200);
    assert.ok(res.headers.has('location'));
  });
});
