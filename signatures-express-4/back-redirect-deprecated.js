// Pattern 4 — The magic string 'back'
//
// In Express 4, passing the string 'back' to res.redirect() or res.location()
// made Express resolve the value of the Referrer (or Referer) request header
// and redirect the user there. This implicit behaviour is removed in v5.
// You must now read req.get('Referrer') yourself and handle the fallback.
//
// Codemod: @expressjs/back-redirect-deprecated

const express = require('express')
const app = express()
const router = express.Router()

// ✗ Express 4 — magic 'back' string in res.redirect()
app.get('/go-back', (req, res) => {
  res.redirect('back')
})

// ✗ Express 4 — magic 'back' string in res.location()
router.post('/:id/review', (req, res) => {
  // ... save review ...
  res.location('back')
  res.send('Review saved', 200)
})
