// Pattern 3 — res.redirect() argument order
//
// In Express 4, res.redirect() accepted the destination URL as the first
// argument and an optional HTTP status code as the second argument.
// Express 5 reverses this: the status code comes first, the URL second —
// matching the convention of all other response methods.
//
// Codemod: @expressjs/redirect-arg-order

const express = require('express')
const app = express()

// ✗ Express 4 — URL first, status second
app.get('/old-docs', (req, res) => {
  res.redirect('/new-path', 301)
})

app.get('/login', (req, res) => {
  res.redirect('/dashboard', 302)
})
