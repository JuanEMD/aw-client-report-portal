const { db } = require('../config/database');

const AccountModel = {
  getByClient(clientId) {
    return db.prepare(
      'SELECT * FROM accounts WHERE client_id = ? AND is_active = 1 ORDER BY category, owner'
    ).all(clientId);
  },

  getById(id) {
    return db.prepare('SELECT * FROM accounts WHERE id = ?').get(id);
  },

  create(data) {
    const result = db.prepare(`
      INSERT INTO accounts (client_id, owner, category, account_last4,
        balance, cash_balance, interest_rate, property_address, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.client_id, data.owner, data.category,
      data.account_last4 || '', data.balance || 0, data.cash_balance || 0,
      data.interest_rate || 0, data.property_address || '', data.type || ''
    );
    return result.lastInsertRowid;
  },

  update(id, data) {
    db.prepare(`
      UPDATE accounts SET
        owner = ?, category = ?, account_last4 = ?,
        balance = ?, cash_balance = ?, interest_rate = ?, property_address = ?, type = ?
      WHERE id = ?
    `).run(
      data.owner, data.category, data.account_last4 || '',
      data.balance || 0, data.cash_balance || 0, data.interest_rate || 0,
      data.property_address || '', data.type || '', id
    );
  },

  delete(id) {
    db.prepare('DELETE FROM accounts WHERE id = ?').run(id);
  },
};

module.exports = AccountModel;
