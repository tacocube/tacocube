// This script queries user emails from database and prints them out.

// Read .env file
const dotenv = require('dotenv').config()
if (dotenv.error) {
  throw dotenv.error
} else {
  console.log('Environment variables loaded:')
  console.log(dotenv.parsed)
}

const { Client } = require('pg')
const client = new Client()
client.connect().then(() => {
  let queryString = 'SELECT email FROM users'
  return client.query(queryString)
}).then(res => {
  console.log('Query result:')
  for (let u in res.rows) {
    console.log(res.rows[u].email)
  }
  return client.end()
}).catch((error) => {
  console.log(error)
  console.error('Error occured while querying user data.')
})
