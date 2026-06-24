const { db } = require('../config/database');

const ACCOUNT_CATEGORIES = {
  'retirement': 'retirement',
  'non-retirement': 'non_retirement',
  'joint': 'joint',
  'trust': 'trust',
};

const ReportModel = {
  create(clientId, quarter, year) {
    const result = db.prepare(
      'INSERT INTO reports (client_id, quarter, year) VALUES (?, ?, ?)'
    ).run(clientId, quarter, year);
    return result.lastInsertRowid;
  },

  getById(id) {
    return db.prepare(`
      SELECT r.*, c.full_name AS client_name
      FROM reports r
      JOIN clients c ON c.id = r.client_id
      WHERE r.id = ?
    `).get(id);
  },

  getByClient(clientId) {
    return db.prepare(
      'SELECT * FROM reports WHERE client_id = ? ORDER BY year DESC, quarter DESC'
    ).all(clientId);
  },

  saveData(reportId, fields) {
    const upsert = db.prepare(
      'INSERT INTO report_data (report_id, field_key, field_value) VALUES (?, ?, ?)'
    );
    const del = db.prepare('DELETE FROM report_data WHERE report_id = ? AND field_key = ?');

    const tx = db.transaction((entries) => {
      for (const [key, value] of Object.entries(entries)) {
        del.run(reportId, key);
        upsert.run(reportId, key, String(value ?? ''));
      }
    });

    tx(fields);
  },

  getData(reportId) {
    const rows = db.prepare(
      'SELECT field_key, field_value FROM report_data WHERE report_id = ?'
    ).all(reportId);
    const data = {};
    for (const row of rows) {
      data[row.field_key] = row.field_value;
    }
    return data;
  },

  calculateSACS(data) {
    const inflow = parseFloat(data.inflow) || 0;
    const floor = parseFloat(data.floor) || 0;
    const outflow = parseFloat(data.outflow) || 0;
    const excess = inflow - outflow;

    let deductibles = [];
    try { deductibles = JSON.parse(data.deductibles || '[]'); } catch {}
    const totalDeductibles = deductibles.reduce((s, d) => s + (parseFloat(d.amount) || 0), 0);

    const ficaAccountBalance = (outflow * 6) + totalDeductibles;
    const privateReserve = parseFloat(data.private_reserve_balance) || 0;
    const investmentBalance = parseFloat(data.investment_balance) || 0;

    return {
      inflow,
      floor,
      outflow,
      excess,
      private_reserve: privateReserve,
      deductibles,
      total_deductibles: totalDeductibles,
      fica_account_balance: ficaAccountBalance,
      investment_balance: investmentBalance,
    };
  },

  _parseTccAccounts(raw) {
    let accounts = [];
    try { accounts = JSON.parse(raw || '[]'); } catch {}
    return accounts.map((a) => ({
      id: a.id,
      name: a.type,
      last4: a.last4,
      current_amount: a.current_amount || 0,
      amount_to_invest: a.amount_to_invest || 0,
      category: ACCOUNT_CATEGORIES[a.type] || 'non_retirement',
    }));
  },

  calculateTCC(data, accounts, client) {
    const mainAccounts = [];
    const spouseAccounts = [];
    const jointAccounts = [];
    const trustItems = [];
    const liabilityItems = [];

    const c1Name = client?.full_name;
    const c2Name = client?.spouse_name;

    // Process existing DB accounts
    for (const acc of accounts) {
      const curAmount = parseFloat(data[`account_${acc.id}_balance`]) || acc.balance || 0;
      const displayName = acc.category;
      const item = { id: acc.id, name: displayName, last4: acc.account_last4, current_amount: curAmount, amount_to_invest: 0 };

      if (acc.category === 'trust') {
        trustItems.push({ balance: curAmount, address: acc.property_address || '' });
      } else if (acc.category === 'liability') {
        liabilityItems.push({ name: acc.owner || displayName, interestRate: acc.interest_rate, balance: curAmount });
      } else if (acc.owner === 'Joint') {
        jointAccounts.push(item);
      } else if (acc.owner === c2Name) {
        spouseAccounts.push(item);
      } else {
        mainAccounts.push(item);
      }
    }

    // Process report-form accounts (new format)
    const formAccountsC1 = this._parseTccAccounts(data.tcc_accounts_client_1);
    const formAccountsC2 = this._parseTccAccounts(data.tcc_accounts_client_2);

    for (const acc of formAccountsC1) {
      if (acc.category === 'trust') {
        trustItems.push({ balance: acc.current_amount + acc.amount_to_invest, address: '' });
      } else if (acc.category === 'joint') {
        jointAccounts.push(acc);
      } else {
        mainAccounts.push(acc);
      }
    }

    for (const acc of formAccountsC2) {
      if (acc.category === 'trust') {
        trustItems.push({ balance: acc.current_amount + acc.amount_to_invest, address: '' });
      } else if (acc.category === 'joint') {
        jointAccounts.push(acc);
      } else {
        spouseAccounts.push(acc);
      }
    }

    // Form-level trust overrides
    const formTrustAmount = parseFloat(data.trust_amount);
    const trust = formTrustAmount
      ? { balance: formTrustAmount, address: '' }
      : trustItems.length > 0 ? trustItems[trustItems.length - 1] : { balance: 0, address: '' };

    // Form-level liabilities (appended to DB liabilities)
    let formLiabilities = [];
    try { formLiabilities = JSON.parse(data.liabilities || '[]'); } catch {}
    for (const l of formLiabilities) {
      liabilityItems.push({
        name: l.name || '',
        interestRate: parseFloat(l.interestRate) || 0,
        balance: parseFloat(l.amount) || 0,
      });
    }

    const sumValues = (items) => items.reduce((s, a) => s + (a.current_amount || 0) + (a.amount_to_invest || 0), 0);
    const mainTotal = sumValues(mainAccounts);
    const spouseTotal = sumValues(spouseAccounts);
    const jointTotal = sumValues(jointAccounts);

    const liabilitiesTotal = liabilityItems.reduce((s, l) => s + l.balance, 0);
    const grandTotal = mainTotal + spouseTotal + jointTotal + trust.balance;

    return {
      main_client: { accounts: mainAccounts, total: mainTotal },
      spouse: { accounts: spouseAccounts, total: spouseTotal },
      non_retirement: { accounts: jointAccounts, total: jointTotal },
      trust,
      liabilities: { items: liabilityItems, total: liabilitiesTotal },
      grand_total: grandTotal,
    };
  },

  generate(id) {
    db.prepare(
      "UPDATE reports SET status = 'generated', generated_at = datetime('now') WHERE id = ?"
    ).run(id);
  },
};

module.exports = ReportModel;
