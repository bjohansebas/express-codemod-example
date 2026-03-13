// ─── Simple auth middleware ───
// Demonstrates deprecated patterns in middleware context

function authMiddleware(req, res, next) {
  // PATTERN: req.param() — looking for token in params/query/body
  const token = req.param('token');
  const apiKey = req.param('api_key');

  if (!token && !apiKey) {
    // PATTERN: res.send(body, status) — wrong argument order
    res.send({ error: 'Authentication required' }, 401);
    return;
  }

  if (token === 'invalid' || apiKey === 'invalid') {
    // PATTERN: res.json(obj, status) — wrong argument order
    res.json({ error: 'Invalid credentials' }, 403);
    return;
  }

  // PATTERN: singular method name
  const wantsJson = req.acceptsEncoding('gzip');

  req.user = { id: 1, name: 'Authenticated User' };
  next();
}

module.exports = authMiddleware;
