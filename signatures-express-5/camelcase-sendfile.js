// Pattern 6 — res.sendFile() (Express 5)
//
// Use camelCase sendFile(); lowercase sendfile() is removed.

const express = require('express')
const path = require('path')
const app = express()
const router = express.Router()

app.get('/download/:filename', (req, res) => {
  res.sendFile(path.join(__dirname, 'files', req.params.filename))
})

router.get('/:id/avatar', (req, res) => {
  res.sendFile(`/uploads/avatars/${req.params.id}.png`)
})
