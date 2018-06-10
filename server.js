const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// Read .env file
const dotenv = require('dotenv').config()
if (dotenv.error) {
  throw dotenv.error
} else {
  console.log('Environment varialbes loaded:')
  console.log(dotenv.parsed)
}

app.use(express.static('dist'))

const pug = require('pug')
const index = pug.compileFile('templates/index.pug')
app.get('/', (req, res) => res.send(index()))

app.listen(port, function () { console.log('Listening on port ' + port) })
