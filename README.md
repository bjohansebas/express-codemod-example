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
│   ├── users.js            # CRUD routes — router.del(), req.param(), res.json(obj, status)
│   └── products.js         # More routes — res.jsonp(obj, status), res.location('back'),
│                           #   res.send(body, status), singular methods
└── middleware/
    └── auth.js             # Middleware — req.param(), res.send(body, status)
```

## Deprecated Patterns Covered

| # | Pattern (Express 4)                | Codemod                              |
|---|-------------------------------------|--------------------------------------|
| 1 | `app.del()` / `router.del()`       | `@expressjs/route-del-to-delete`     |
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
