// Pattern 7 — Plural content-negotiation methods (Express 5)
//
// Use acceptsCharsets/acceptsEncodings/acceptsLanguages.

const express = require('express')
const app = express()
const router = express.Router()

app.get('/negotiate', (req, res) => {
  const charset = req.acceptsCharsets('utf-8')
  const encoding = req.acceptsEncodings('gzip')
  const language = req.acceptsLanguages('en')

  res.json({
    charset: !!charset,
    encoding: !!encoding,
    language: !!language,
  })
})

router.get('/feed', (req, res) => {
  const wantsUtf8 = req.acceptsCharsets('utf-8')
  const wantsBrotli = req.acceptsEncodings('br')
  const wantsSpanish = req.acceptsLanguages('es')

  if (!wantsUtf8) {
    res.sendStatus(406)
    return
  }

  res.status(200).json({ feed: 'product data', locale: wantsSpanish ? 'es' : 'en' })
})
