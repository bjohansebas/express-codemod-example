const express = require('express');
const path = require('path');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const authMiddleware = require('./middleware/auth');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Middleware ───
app.use('/api', authMiddleware);

// ─── Routes ───
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// ─── Health check ───
// PATTERN: res.send(status) — sending a bare status code
app.get('/health', (req, res) => {
  res.send(200);
});

// ─── Catch-all redirect ───
// PATTERN: res.redirect(url, status) — wrong argument order
app.get('/old-docs', (req, res) => {
  res.redirect('/docs', 301);
});

// ─── Go back ───
// PATTERN: res.redirect('back') — magic string
app.get('/go-back', (req, res) => {
  res.redirect('back');
});

// ─── Static file serving ───
// PATTERN: res.sendfile() — lowercase 'f'
app.get('/download/:filename', (req, res) => {
  res.sendfile(path.join(__dirname, 'files', req.params.filename));
});

// ─── Content negotiation ───
// PATTERN: req.acceptsCharset/Encoding/Language — singular methods
app.get('/negotiate', (req, res) => {
  const charset = req.acceptsCharset('utf-8');
  const encoding = req.acceptsEncoding('gzip');
  const language = req.acceptsLanguage('en');

  res.json({
    charset: !!charset,
    encoding: !!encoding,
    language: !!language,
  });
});

// ─── Error handler ───
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.send('Internal Server Error', 500);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
