// Pattern 1 — app.delete()
//
// Express 5 removes app.del(). Use app.delete() directly.

const express = require('express')
const app = express()

app.delete('/user/:id', (req, res) => {
  res.send(`DELETE /user/${req.params.id}`)
})
