// Pattern 2 — Wrong argument order on res.send() / res.json() / res.jsonp()
//
// In Express 4, the response body methods accepted the status code as a
// *second* argument. Express 5 flips this: status must come via res.status()
// or be the first argument, and the body-only overloads have been removed.
// Passing a raw number to res.send() sent just the status line; that is also
// removed in v5.
//
// Codemod: @expressjs/status-send-order

const express = require('express')
const app = express()

// ✗ Express 4 — status as second argument
app.get('/json', (req, res) => {
  res.json({ name: 'Ruben' }, 201)
})

app.get('/send', (req, res) => {
  res.send({ data: '...' }, 200)
})

app.get('/jsonp', (req, res) => {
  res.jsonp({ name: 'Ruben' }, 201)
})

// ✗ Express 4 — bare status number (no body)
app.get('/health', (req, res) => {
  res.send(200)
})
