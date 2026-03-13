const express = require('express');
const path = require('path');
const router = express.Router();

// ─── GET all products ───
router.get('/', (req, res) => {
  // PATTERN: req.param() — searching query params
  const category = req.param('category');
  const sort = req.param('sort');

  const products = [
    { id: 1, name: 'Laptop', category: 'electronics', price: 999 },
    { id: 2, name: 'Headphones', category: 'electronics', price: 149 },
    { id: 3, name: 'Desk', category: 'furniture', price: 450 },
  ];

  const filtered = category
    ? products.filter((p) => p.category === category)
    : products;

  res.json(filtered, 200);
});

// ─── GET single product ───
router.get('/:id', (req, res) => {
  const id = req.param('id');

  const product = { id, name: 'Laptop', price: 999, stock: 42 };

  if (!product) {
    res.json({ error: 'Product not found' }, 404);
    return;
  }

  // PATTERN: res.json(obj, status) — wrong argument order
  res.json(product, 200);
});

// ─── POST create product ───
router.post('/', (req, res) => {
  const name = req.param('name');
  const price = req.param('price');
  const category = req.param('category');

  if (!name || !price) {
    res.send({ error: 'Name and price are required' }, 400);
    return;
  }

  const product = {
    id: Date.now(),
    name,
    price: parseFloat(price),
    category: category || 'uncategorized',
  };

  res.json(product, 201);
});

// ─── DELETE product ───
// PATTERN: router.del() — deprecated alias
router.del('/:id', (req, res) => {
  const id = req.param('id');
  res.json({ message: `Product ${id} deleted` }, 200);
});

// ─── Product image ───
// PATTERN: res.sendfile() — lowercase 'f'
router.get('/:id/image', (req, res) => {
  const id = req.param('id');
  res.sendfile(path.join(__dirname, '..', 'uploads', 'products', `${id}.jpg`));
});

// ─── Export catalog as JSONP ───
// PATTERN: res.jsonp(obj, status) — wrong argument order
router.get('/catalog/jsonp', (req, res) => {
  const catalog = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Headphones', price: 149 },
  ];

  res.jsonp(catalog, 200);
});

// ─── Content negotiation on product feed ───
// PATTERN: singular method names
router.get('/feed', (req, res) => {
  const wantsUtf8 = req.acceptsCharset('utf-8');
  const wantsBrotli = req.acceptsEncoding('br');
  const wantsSpanish = req.acceptsLanguage('es');

  if (!wantsUtf8) {
    res.send('Charset not supported', 406);
    return;
  }

  res.json({ feed: 'product data', locale: wantsSpanish ? 'es' : 'en' }, 200);
});

// ─── Redirect legacy endpoint ───
// PATTERN: res.redirect(url, status) — wrong argument order
router.get('/legacy/items', (req, res) => {
  res.redirect('/api/products', 301);
});

// ─── Back to previous page after action ───
// PATTERN: res.redirect('back') / res.location('back')
router.post('/:id/favorite', (req, res) => {
  // save favorite...
  res.redirect('back');
});

router.post('/:id/review', (req, res) => {
  // save review...
  res.location('back');
  res.send('Review saved', 200);
});

module.exports = router;
