// Pattern 1 — app.del() / router.del()
//
// In Express 4, `del` was an alias for `delete` because `delete` is a reserved
// keyword in older JavaScript environments. Both app.del() and router.del() were
// supported but the alias was deprecated and is fully removed in v5.
//
// Codemod: @expressjs/route-del-to-delete

const express = require('express')
const app = express()
const router = express.Router()

// ✗ Express 4 — deprecated alias
app.del('/user/:id', (req, res) => {
  res.send(`DELETE /user/${req.params.id}`)
})

// Also works on a Router instance
router.del('/:id', (req, res) => {
  res.json({ deleted: req.params.id })
})
