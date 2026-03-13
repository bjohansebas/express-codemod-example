// Pattern 5 — Explicit request param sources (Express 5)
//
// req.param() is removed. Use params, body, or query explicitly.

const express = require('express')
const router = express.Router()

router.get('/:id', (req, res) => {
  const id = req.params.id
  res.json({ id })
})

router.post('/', (req, res) => {
  const name = req.body.name
  const role = req.body.role
  res.json({ name, role })
})

router.get('/', (req, res) => {
  const category = req.query.category
  res.json({ category })
})
