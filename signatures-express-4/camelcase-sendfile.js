// Pattern 6 — res.sendfile() (lowercase 'f')
//
// In Express 4, the file-sending method existed in two forms: res.sendfile()
// (lowercase 'f', deprecated) and res.sendFile() (camelCase, the correct one).
// The lowercase version is removed entirely in v5.
//
// Codemod: @expressjs/camelcase-sendfile

const express = require('express')
const path = require('path')
const app = express()
const router = express.Router()

// ✗ Express 4 — lowercase 'f'
app.get('/download/:filename', (req, res) => {
  res.sendfile(path.join(__dirname, 'files', req.params.filename))
})

router.get('/:id/avatar', (req, res) => {
  res.sendfile(`/uploads/avatars/${req.params.id}.png`)
})
