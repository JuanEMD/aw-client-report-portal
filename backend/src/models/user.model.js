const { db } = require('../config/database');
const bcrypt = require('bcryptjs');

const UserModel = {
  findByUsername(username) {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  },

  findById(id) {
    return db.prepare('SELECT id, username, display_name, role FROM users WHERE id = ?').get(id);
  },

  create({ username, password, displayName, role = 'editor' }) {
    const hash = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      'INSERT INTO users (username, password_hash, display_name, role) VALUES (?, ?, ?, ?)'
    ).run(username, hash, displayName, role);
    return result.lastInsertRowid;
  },

  validatePassword(user, password) {
    return bcrypt.compareSync(password, user.password_hash);
  },
};

module.exports = UserModel;
