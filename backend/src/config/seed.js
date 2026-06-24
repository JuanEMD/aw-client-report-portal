const { initialize } = require('./database');
const UserModel = require('../models/user.model');

initialize();

const existing = UserModel.findByUsername('andrew');
if (!existing) {
  UserModel.create({ username: 'andrew', password: 'changeme', displayName: 'Andrew', role: 'admin' });
  UserModel.create({ username: 'rebecca', password: 'changeme', displayName: 'Rebecca', role: 'editor' });
  UserModel.create({ username: 'maryann', password: 'changeme', displayName: 'Maryann', role: 'editor' });
  console.log('Seed: 3 users created (change passwords after first login)');
} else {
  console.log('Seed: users already exist');
}
