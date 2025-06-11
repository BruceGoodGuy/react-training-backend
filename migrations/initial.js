const User = require('../models/user');
const Contact = require('../models/contact');
const Email = require('../models/email');
const Identification = require('../models/identification');
const Number = require('../models/number');
const Occupation = require('../models/occupation');
const Asset = require('../models/asset');
const Investment = require('../models/investment');
const Income = require('../models/income');
const KYC = require('../models/kyc');
const Liability = require('../models/liability');
const SourceOfWealth = require('../models/sourceofwealth');

async function runMigrations() {
  try {
    await User.createTable();
    await Contact.createTable();
    await Email.createTable();
    await Identification.createTable();
    await Number.createTable();
    await Occupation.createTable();
    await Asset.createTable();
    await Investment.createTable();
    await Income.createTable();
    await KYC.createTable();
    await Liability.createTable();
    await SourceOfWealth.createTable();
    console.log('All migrations completed');
  } catch (error) {
    console.error('Migration error:', error);
  }
}

runMigrations();