const express = require('express');
const router = express.Router();

// ─── GET all users ───
router.get('/', (req, res) => {
  const users = [
    { id: 1, name: 'Alice', role: 'admin' },
    { id: 2, name: 'Bob', role: 'user' },
    { id: 3, name: 'Charlie', role: 'user' },
  ];

  // PATTERN: res.json(obj, status) — wrong argument order
  res.json(users, 200);
});

// ─── GET single user ───
router.get('/:id', (req, res) => {
  // PATTERN: req.param() — ambiguous param lookup
  const id = req.param('id');

  const user = { id, name: 'Alice', email: 'alice@example.com' };

  if (!user) {
    // PATTERN: res.send(body, status) — wrong argument order
    res.send({ error: 'User not found' }, 404);
    return;
  }

  res.json(user, 200);
});

// ─── POST create user ───
router.post('/', (req, res) => {
  // PATTERN: req.param() — pulls from body
  const name = req.param('name');
  const email = req.param('email');
  const role = req.param('role');

  if (!name || !email) {
    res.json({ error: 'Name and email are required' }, 400);
    return;
  }

  const newUser = { id: Date.now(), name, email, role: role || 'user' };

  // PATTERN: res.json(obj, status) — wrong argument order
  res.json(newUser, 201);
});

// ─── PUT update user ───
router.put('/:id', (req, res) => {
  const id = req.param('id');
  const name = req.param('name');
  const email = req.param('email');

  const updated = { id, name, email, updatedAt: new Date().toISOString() };

  res.json(updated, 200);
});

// ─── DELETE user ───
// PATTERN: app.del() — deprecated alias for .delete()
router.del('/:id', (req, res) => {
  const id = req.param('id');

  res.json({ message: `User ${id} deleted` }, 200);
});

// ─── User avatar ───
// PATTERN: res.sendfile() — lowercase 'f'
router.get('/:id/avatar', (req, res) => {
  const id = req.param('id');
  res.sendfile(`/uploads/avatars/${id}.png`);
});

// ─── Redirect to profile ───
// PATTERN: res.redirect(url, status) — wrong argument order
router.get('/:id/profile', (req, res) => {
  res.redirect(`/users/${req.param('id')}/details`, 302);
});

module.exports = router;
