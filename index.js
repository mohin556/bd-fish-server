const express = require('express')
const app = express()
const port = 5000
var cors = require('cors')
require('dotenv').config()
app.use(cors())


app.get('/', (req, res) => {
    res.send('BD FISH WORLD!')
  })

  app.listen(port, () => {
    console.log(`BD FISH CORNER listening on port ${port}`)
  })