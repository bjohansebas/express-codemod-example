// Pattern 3 — res.redirect() argument order (Express 5)
//
// In Express 5, status goes first and URL goes second.

const express = require('express')
const app = express()

app.get('/old-docs', (req, res) => {
  res.redirect(301, '/new-path')
})

app.get('/login', (req, res) => {
  res.redirect(302, '/dashboard')
})
