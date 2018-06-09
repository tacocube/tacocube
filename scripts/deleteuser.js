// This script deletes users with matching emails from database.

// Take command line arguments.
var emails = process.argv.slice(2)
console.log('Users with following email addresses will be deleted:')
for (let u in emails) {
  console.log(emails[u])
}

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
  var promises = []
  for (let u in emails) {
    let queryString = 'DELETE FROM users WHERE email=$1'
    promises.push(client.query(queryString, [emails[u]]))
  }
  return Promise.all(promises)
}).then(res => {
  console.log('Delete query complete.')
  return client.end()
}).catch((error) => {
  console.log(error)
  console.error('Error occured while deleting users.')
})
