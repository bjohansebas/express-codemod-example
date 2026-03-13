// Pattern 4 — Replacing magic 'back' (Express 5)
//
// In Express 5, read Referrer explicitly and provide a fallback.

const express = require('express')
const app = express()
const router = express.Router()

app.get('/go-back', (req, res) => {
  res.redirect(req.get('Referrer') || '/')
})

router.post('/:id/review', (req, res) => {
  // ... save review ...
  res.location(req.get('Referrer') || '/')
  res.status(200).send('Review saved')
})
