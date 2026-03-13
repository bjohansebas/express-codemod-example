// Pattern 7 — Singular content-negotiation method names
//
// In Express 4, the content-negotiation helpers existed in both singular and
// plural forms: req.acceptsCharset() / req.acceptsCharsets(),
// req.acceptsEncoding() / req.acceptsEncodings(),
// req.acceptsLanguage() / req.acceptsLanguages().
// The singular forms were deprecated and are removed in v5.
//
// Codemod: @expressjs/pluralize-method-names

const express = require('express')
const app = express()
const router = express.Router()

// ✗ Express 4 — singular (deprecated) method names
app.get('/negotiate', (req, res) => {
  const charset  = req.acceptsCharset('utf-8')
  const encoding = req.acceptsEncoding('gzip')
  const language = req.acceptsLanguage('en')

  res.json({
    charset:  !!charset,
    encoding: !!encoding,
    language: !!language,
  })
})

router.get('/feed', (req, res) => {
  const wantsUtf8    = req.acceptsCharset('utf-8')
  const wantsBrotli  = req.acceptsEncoding('br')
  const wantsSpanish = req.acceptsLanguage('es')

  if (!wantsUtf8) {
    res.send('Charset not supported', 406)
    return
  }

  res.json({ feed: 'product data', locale: wantsSpanish ? 'es' : 'en' }, 200)
})
