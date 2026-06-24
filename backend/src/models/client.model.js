const { db } = require('../config/database');

const ClientModel = {
  getAll() {
    return db.prepare(`
      SELECT c.*,
        (SELECT COUNT(*) FROM accounts WHERE client_id = c.id) AS account_count,
        (SELECT MAX(generated_at) FROM reports WHERE client_id = c.id AND status = 'generated') AS last_report_date
      FROM clients c
      ORDER BY c.full_name
    `).all();
  },

  getById(id) {
    return db.prepare('SELECT * FROM clients WHERE id = ?').get(id);
  },

  create(data) {
    const result = db.prepare(`
      INSERT INTO clients (full_name, spouse_name, dob, spouse_dob, ssn_last4, spouse_ssn_last4,
        monthly_salary, expense_budget, private_reserve_target, insurance_deductibles, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.full_name, data.spouse_name || '', data.dob || null, data.spouse_dob || null,
      data.ssn_last4 || '', data.spouse_ssn_last4 || '', data.monthly_salary || 0,
      data.expense_budget || 0, data.private_reserve_target || 0,
      data.insurance_deductibles || 0, data.notes || ''
    );
    return result.lastInsertRowid;
  },

  update(id, data) {
    db.prepare(`
      UPDATE clients SET
        full_name = ?, spouse_name = ?, dob = ?, spouse_dob = ?,
        ssn_last4 = ?, spouse_ssn_last4 = ?, monthly_salary = ?,
        expense_budget = ?, private_reserve_target = ?, insurance_deductibles = ?,
        notes = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(
      data.full_name, data.spouse_name || '', data.dob || null, data.spouse_dob || null,
      data.ssn_last4 || '', data.spouse_ssn_last4 || '', data.monthly_salary || 0,
      data.expense_budget || 0, data.private_reserve_target || 0,
      data.insurance_deductibles || 0, data.notes || '', id
    );
  },

  delete(id) {
    db.prepare('DELETE FROM clients WHERE id = ?').run(id);
  },

  getAge(dob) {
    if (!dob) return null;
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  },
};

module.exports = ClientModel;
