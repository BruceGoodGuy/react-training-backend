require('dotenv').config();
const knex = require('knex');

const db = knex({
  client: 'sqlite3',
  connection: {
    filename: process.env.DB_FILE || './database.sqlite'
  },
  useNullAsDefault: true
});

module.exports = db;