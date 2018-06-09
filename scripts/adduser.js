// This script takes user email and password to create a new user in database.
// The first argument should be the email and
// the second argument should be the password.

// Check if there are exactly two command line arguments provided.
if (process.argv.length !== 4) {
  console.log('Please pass user email and password as arguments.')
  process.exit(1)
}

// Parse command line arguments.
const bcrypt = require('bcrypt')
const conf = require('../dataconfig')
var email = process.argv[2]
var password = bcrypt.hashSync(process.argv[3], conf.BCRYPT_SALT_ROUNDS)
console.log('email: ' + email)
console.log('password: ' + password)

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
  let queryString = 'INSERT INTO users (email, password) VALUES ($1, $2)'
  return client.query(queryString, [email, password])
}).then(() => {
  return client.end()
}).then(() => {
  console.log('User successfully created.')
}).catch((error) => {
  console.log(error)
  console.error('Error occured while inserting new user data.')
})
