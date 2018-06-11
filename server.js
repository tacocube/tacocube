const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
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

// Connect to database.
const { Pool } = require('pg')
const pool = new Pool()

const session = require('express-session')
const MemoryStore = require('memorystore')(session)
app.use(session({
  cookie: {
    maxAge: 10 * 60 * 1000,
    secure: false
  },
  resave: false,
  rolling: true,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
  store: new MemoryStore({
    checkPeriod: 24 * 60 * 60 * 1000
  })
}))

app.use(express.static('dist'))

const pug = require('pug')
const index = pug.compileFile('templates/index.pug')
app.get('/', (req, res) => {
  var compiled = index({
    user: req.session.user
  })
  res.send(compiled)
})

app.use('/login', bodyParser.urlencoded({
  extended: false
}))
app.post('/login', async function (req, res) {
  if (req.body && req.body.email && req.body.password) {
    // POST request has all required fields.
    // Lookup a user with matching email address.
    let query = 'SELECT password FROM users WHERE email = $1'
    var queryResult = await pool.query(query, [req.body.email])
    if (queryResult.rowCount === 1 && bcrypt.compareSync(req.body.password, queryResult.rows[0].password)) {
      // Valid password.
      // Create user object in session data.
      req.session.user = {
        email: req.body.email
      }
    }
  }
  // Redirect to homepage.
  res.redirect('/')
})

app.listen(port, function () { console.log('Listening on port ' + port) })
