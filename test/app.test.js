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

// ─── GET /health ─────────────────────────────────────────────────────────────
// Express 4: res.send(200) — bare status number (deprecated)
// Express 5: res.sendStatus(200)
describe('GET /health', () => {
  it('responds with 200', async () => {
    const res = await fetch(`${BASE}/health`);
    assert.equal(res.status, 200);
  });
});

// ─── GET /negotiate ───────────────────────────────────────────────────────────
// Express 4: req.acceptsCharset() / req.acceptsEncoding() / req.acceptsLanguage()
//            (singular, deprecated)
// Express 5: req.acceptsCharsets() / req.acceptsEncodings() / req.acceptsLanguages()
describe('GET /negotiate', () => {
  it('responds with 200 and negotiation flags', async () => {
    const res = await fetch(`${BASE}/negotiate`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok('charset' in body);
    assert.ok('encoding' in body);
    assert.ok('language' in body);
  });
});

// ─── GET /old-docs ────────────────────────────────────────────────────────────
// Express 4: res.redirect('/docs', 301) — URL first, status second (deprecated)
// Express 5: res.redirect(301, '/docs')
describe('GET /old-docs', () => {
  it('redirects to /docs with 301', async () => {
    const res = await fetch(`${BASE}/old-docs`, { redirect: 'manual' });
    assert.equal(res.status, 301);
    assert.ok(res.headers.get('location').endsWith('/docs'));
  });
});

// ─── GET /go-back ─────────────────────────────────────────────────────────────
// Express 4: res.redirect('back') — magic string (deprecated)
// Express 5: res.redirect(req.get('Referrer') || '/')
describe('GET /go-back', () => {
  it('redirects with 302 when no Referrer header is present', async () => {
    const res = await fetch(`${BASE}/go-back`, { redirect: 'manual' });
    assert.equal(res.status, 302);
  });
});

// ─── DELETE /legacy-user/:id ────────────────────────────────────────────────
// Express 4: app.del('/legacy-user/:id', ...)
// Express 5: app.delete('/legacy-user/:id', ...)
describe('DELETE /legacy-user/:id', () => {
  it('responds with 200 and plain text body', async () => {
    const res = await fetch(`${BASE}/legacy-user/99`, {
      method: 'DELETE',
    });
    assert.equal(res.status, 200);
    const body = await res.text();
    assert.equal(body, 'DELETE /legacy-user/99');
  });
});

// ─── Auth middleware ──────────────────────────────────────────────────────────
// Express 4: req.param('token') — searches params/body/query (deprecated)
// Express 5: explicit req.query.token / req.body.token
describe('Auth middleware', () => {
  it('rejects requests to /api/* with no token — 401', async () => {
    const res = await fetch(`${BASE}/api/users`);
    assert.equal(res.status, 401);
  });

  it('rejects requests to /api/* with invalid token — 403', async () => {
    const res = await fetch(`${BASE}/api/users?token=invalid`);
    assert.equal(res.status, 403);
  });
});
