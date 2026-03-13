// Pattern 2 — Status + body response methods (Express 5 form)
//
// Express 5 requires status to be set explicitly or passed first where supported.

const express = require('express')
const app = express()

app.get('/json', (req, res) => {
  res.status(201).json({ name: 'Ruben' })
})

app.get('/send', (req, res) => {
  res.status(200).send({ data: '...' })
})

app.get('/jsonp', (req, res) => {
  res.status(201).jsonp({ name: 'Ruben' })
})

app.get('/health', (req, res) => {
  res.sendStatus(200)
})
