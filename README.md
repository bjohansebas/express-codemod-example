# Express.js v5 Migration Codemods — Demo Project

This project is a sample Express 4 API that intentionally uses **every deprecated pattern** that the official Express.js v5 codemods can fix automatically.

Use it to see the codemods in action before applying them to your own codebase.

---

## Project Structure

```
src/
├── app.js                  # Main app — res.send(status), res.redirect(url, status),
│                           #   res.redirect('back'), res.sendfile(), singular methods
├── routes/
│   ├── users.js            # CRUD routes — req.param(), res.json(obj, status)
│   └── products.js         # More routes — res.jsonp(obj, status), res.location('back'),
│                           #   res.send(body, status), singular methods
└── middleware/
    └── auth.js             # Middleware — req.param(), res.send(body, status)
```

## Running & Testing the API

This section shows how to start the server and hit every route with `curl`. The goal is to prove that the app works as expected with **Express 4** (deprecated patterns and all), and that after running the codemods + upgrading to Express 5 **the exact same requests produce the exact same responses**.

### Start the server

```bash
npm install
node src/app.js
# → Server running on port 3000
```

> All `/api/*` routes go through `authMiddleware`, which expects a `token` or `api_key` query parameter (or in the request body). Use `?token=mytoken` in every request below.

---

### Utility endpoints

```bash
# Health check — Express 4 uses res.send(200), codemods fix it to res.sendStatus(200)
curl http://localhost:3000/health

# Redirect from /old-docs → /docs  (Express 4: res.redirect(url, status))
curl -v http://localhost:3000/old-docs

# Redirect back  (Express 4: res.redirect('back'))
curl -v http://localhost:3000/go-back

# Content negotiation  (Express 4: singular req.acceptsCharset/Encoding/Language)
curl http://localhost:3000/negotiate

# Download a static file  (Express 4: res.sendfile())
curl http://localhost:3000/download/sample.pdf
```

---

### Users routes  (`/api/users`)

```bash
# GET all users
curl "http://localhost:3000/api/users?token=mytoken"

# GET single user by ID
curl "http://localhost:3000/api/users/1?token=mytoken"

# POST — create a user  (token in body, name/email from body via req.param())
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"token":"mytoken","name":"Diana","email":"diana@example.com","role":"user"}'

# PUT — update a user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"token":"mytoken","name":"Alice Updated","email":"alice2@example.com"}'

# DELETE a user
curl -X DELETE "http://localhost:3000/api/users/1?token=mytoken"

# GET user avatar  (Express 4: res.sendfile())
curl "http://localhost:3000/api/users/1/avatar?token=mytoken"

# GET user profile — redirects to /users/:id/details  (Express 4: res.redirect(url, status))
curl -v "http://localhost:3000/api/users/1/profile?token=mytoken"
```

---

### Products routes  (`/api/products`)

```bash
# GET all products
curl "http://localhost:3000/api/products?token=mytoken"

# GET products filtered by category  (Express 4: req.param() reads query params)
curl "http://localhost:3000/api/products?token=mytoken&category=electronics"

# GET single product by ID
curl "http://localhost:3000/api/products/1?token=mytoken"

# POST — create a product
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{"token":"mytoken","name":"Monitor","price":"320","category":"electronics"}'

# DELETE a product
curl -X DELETE "http://localhost:3000/api/products/1?token=mytoken"

# GET product image  (Express 4: res.sendfile())
curl "http://localhost:3000/api/products/1/image?token=mytoken"

# GET catalog as JSONP  (Express 4: res.jsonp(obj, status))
curl "http://localhost:3000/api/products/catalog/jsonp?token=mytoken&callback=handleData"

# GET product feed — content negotiation  (Express 4: singular method names)
curl "http://localhost:3000/api/products/feed?token=mytoken"

# Redirect from legacy URL  (Express 4: res.redirect(url, status))
curl -v "http://localhost:3000/api/products/legacy/items?token=mytoken"

# POST — favorite a product  (Express 4: res.redirect('back'))
curl -X POST "http://localhost:3000/api/products/1/favorite?token=mytoken"

# POST — review a product  (Express 4: res.location('back'))
curl -X POST http://localhost:3000/api/products/1/review \
  -H "Content-Type: application/json" \
  -d '{"token":"mytoken","rating":5,"comment":"Great product!"}'
```

---

### After migrating to Express 5

Run the codemods, then upgrade:

```bash
npx codemod@latest @expressjs/v5-migration-recipe
npm install express@5
node src/app.js
```

Every `curl` command above works **identically** — the codemods only fix the internal API call signatures; the HTTP behaviour (status codes, response bodies, redirects) stays exactly the same.

---

## Pattern Signatures (Express 4 vs 5)

You can compare both versions side by side:

- [`signatures-express-4/`](./signatures-express-4/): deprecated/removed Express 4 signatures.
- [`signatures-express-5/`](./signatures-express-5/): equivalent Express 5-safe signatures.

Briefly: both folders use the same file names so you can diff each pattern directly (v4 form vs v5 replacement).

| Pattern File | Express 4 | Express 5 |
|------|---------|---------|
| `route-del.js` | [`signatures-express-4/route-del.js`](./signatures-express-4/route-del.js) (`app.del()`) | [`signatures-express-5/route-del.js`](./signatures-express-5/route-del.js) (`app.delete()`) |
| `status-send-order.js` | [`signatures-express-4/status-send-order.js`](./signatures-express-4/status-send-order.js) (`res.json(obj, status)`, `res.send(200)`) | [`signatures-express-5/status-send-order.js`](./signatures-express-5/status-send-order.js) (`res.status(...).json()`, `res.sendStatus(200)`) |
| `redirect-arg-order.js` | [`signatures-express-4/redirect-arg-order.js`](./signatures-express-4/redirect-arg-order.js) (`res.redirect(url, status)`) | [`signatures-express-5/redirect-arg-order.js`](./signatures-express-5/redirect-arg-order.js) (`res.redirect(status, url)`) |
| `back-redirect-deprecated.js` | [`signatures-express-4/back-redirect-deprecated.js`](./signatures-express-4/back-redirect-deprecated.js) (`'back'`) | [`signatures-express-5/back-redirect-deprecated.js`](./signatures-express-5/back-redirect-deprecated.js) (`req.get('Referrer') \|\| '/'`) |
| `explicit-request-params.js` | [`signatures-express-4/explicit-request-params.js`](./signatures-express-4/explicit-request-params.js) (`req.param()`) | [`signatures-express-5/explicit-request-params.js`](./signatures-express-5/explicit-request-params.js) (`req.params` / `req.body` / `req.query`) |
| `camelcase-sendfile.js` | [`signatures-express-4/camelcase-sendfile.js`](./signatures-express-4/camelcase-sendfile.js) (`res.sendfile()`) | [`signatures-express-5/camelcase-sendfile.js`](./signatures-express-5/camelcase-sendfile.js) (`res.sendFile()`) |
| `pluralize-method-names.js` | [`signatures-express-4/pluralize-method-names.js`](./signatures-express-4/pluralize-method-names.js) (singular accepts methods) | [`signatures-express-5/pluralize-method-names.js`](./signatures-express-5/pluralize-method-names.js) (plural accepts methods) |

---

## Deprecated Patterns Covered

| # | Pattern (Express 4)                | Codemod                              |
|---|-------------------------------------|--------------------------------------|
| 1 | `app.del()`                        | `@expressjs/route-del-to-delete`     |
| 2 | `res.send(body, status)`           | `@expressjs/status-send-order`       |
| 3 | `res.json(obj, status)`            | `@expressjs/status-send-order`       |
| 4 | `res.jsonp(obj, status)`           | `@expressjs/status-send-order`       |
| 5 | `res.send(status)` (bare number)   | `@expressjs/status-send-order`       |
| 6 | `res.redirect(url, status)`        | `@expressjs/redirect-arg-order`      |
| 7 | `res.redirect('back')`             | `@expressjs/back-redirect-deprecated`|
| 8 | `res.location('back')`             | `@expressjs/back-redirect-deprecated`|
| 9 | `req.param('name')`                | `@expressjs/explicit-request-params` |
|10 | `res.sendfile()`                   | `@expressjs/camelcase-sendfile`      |
|11 | `req.acceptsCharset()` (singular)  | `@expressjs/pluralize-method-names`  |
|12 | `req.acceptsEncoding()` (singular) | `@expressjs/pluralize-method-names`  |
|13 | `req.acceptsLanguage()` (singular) | `@expressjs/pluralize-method-names`  |

---

## How to Run the Codemods

### 1. Run all codemods at once (recommended)

```bash
npx codemod@latest @expressjs/v5-migration-recipe
```

### 2. Or run a specific one

```bash
npx codemod@latest @expressjs/status-send-order
npx codemod@latest @expressjs/redirect-arg-order
npx codemod@latest @expressjs/back-redirect-deprecated
npx codemod@latest @expressjs/explicit-request-params
npx codemod@latest @expressjs/route-del-to-delete
npx codemod@latest @expressjs/camelcase-sendfile
npx codemod@latest @expressjs/pluralize-method-names
```

### 3. Review the diff

```bash
git diff
```

### 4. Upgrade to Express 5

```bash
npm install express@5
```

### 5. Run tests and review the migration guide

The codemods handle the API signature changes, but there are other breaking changes in Express 5 (path matching syntax, `req.body`, `req.query`, `express.static` dotfiles, etc.) that require manual review.

Full migration guide: https://expressjs.com/en/guide/migrating-5.html

---

## Notes

- The codemods are **idempotent** — safe to run multiple times.
- Initialize a git repo first (`git init && git add -A && git commit -m "v4 baseline"`) so you can see a clean diff after running the codemods.
