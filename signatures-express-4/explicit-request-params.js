// Pattern 5 — req.param()
//
// In Express 4, req.param(name) searched req.params, req.body, and req.query
// all in one call. This convenience method was deprecated because the source of
// the value is completely opaque — a name collision between route params, the
// body, and the query string can silently return the wrong value, which is a
// security risk. The method is removed in v5.
// You must now read from the explicit source.
//
// Codemod: @expressjs/explicit-request-params

const express = require('express')
const router = express.Router()

// ✗ Express 4 — ambiguous lookup across params / body / query
router.get('/:id', (req, res) => {
  const id = req.param('id')          // could come from req.params
  res.json({ id })
})

router.post('/', (req, res) => {
  const name = req.param('name')      // could come from req.body
  const role = req.param('role')      // could come from req.body
  res.json({ name, role })
})

router.get('/', (req, res) => {
  const category = req.param('category')  // could come from req.query
  res.json({ category })
})
