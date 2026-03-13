// Pattern 1 — app.del()
//
// In Express 4, `del` was an alias for `delete` because `delete` is a reserved
// keyword in older JavaScript environments. The alias existed on the app object,
// was deprecated, and is fully removed in v5.
//
// Codemod: @expressjs/route-del-to-delete

const express = require('express')
const app = express()

// ✗ Express 4 — deprecated alias
app.del('/user/:id', (req, res) => {
  res.send(`DELETE /user/${req.params.id}`)
})
