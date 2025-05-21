const User = require('../models/user');
const Contact = require('../models/contact');
const Email = require('../models/email');
const Identification = require('../models/identification');
const Number = require('../models/number');
const Occupation = require('../models/occupation');

async function runMigrations() {
  try {
    await User.createTable();
    await Contact.createTable();
    await Email.createTable();
    await Identification.createTable();
    await Number.createTable();
    await Occupation.createTable();
    console.log('All migrations completed');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

runMigrations();