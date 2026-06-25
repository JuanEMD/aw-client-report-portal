const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { DATABASE_PATH } = require('./env');

const dbDir = path.dirname(DATABASE_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(DATABASE_PATH);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initialize() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'editor',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      spouse_name TEXT DEFAULT '',
      dob TEXT,
      spouse_dob TEXT,
      ssn_last4 TEXT DEFAULT '',
      spouse_ssn_last4 TEXT DEFAULT '',
      monthly_salary REAL DEFAULT 0,
      expense_budget REAL DEFAULT 0,
      private_reserve_target REAL DEFAULT 0,
      insurance_deductibles REAL DEFAULT 0,
      notes TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      owner TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('retirement','non_retirement','trust','liability')),
      account_last4 TEXT DEFAULT '',
      balance REAL DEFAULT 0,
      cash_balance REAL DEFAULT 0,
      interest_rate REAL DEFAULT 0,
      property_address TEXT DEFAULT '',
      is_active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS reports (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      quarter INTEGER NOT NULL CHECK(quarter IN (1,2,3,4)),
      year INTEGER NOT NULL,
      status TEXT DEFAULT 'draft' CHECK(status IN ('draft','generated')),
      generated_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS report_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      report_id INTEGER NOT NULL,
      field_key TEXT NOT NULL,
      field_value TEXT NOT NULL DEFAULT '',
      FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_accounts_client ON accounts(client_id);
    CREATE INDEX IF NOT EXISTS idx_reports_client ON reports(client_id);
    CREATE INDEX IF NOT EXISTS idx_report_data_report ON report_data(report_id);
  `);

  // Migration: remove account_name, relax owner constraint
  const accNameCol = db.prepare("SELECT COUNT(*) AS cnt FROM pragma_table_info('accounts') WHERE name = 'account_name'").get();
  if (accNameCol.cnt > 0) {
    db.exec(`
      CREATE TABLE IF NOT EXISTS accounts_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        client_id INTEGER NOT NULL,
        owner TEXT NOT NULL,
        category TEXT NOT NULL CHECK(category IN ('retirement','non_retirement','trust','liability')),
        account_last4 TEXT DEFAULT '',
        balance REAL DEFAULT 0,
        cash_balance REAL DEFAULT 0,
        interest_rate REAL DEFAULT 0,
        property_address TEXT DEFAULT '',
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
      );
      INSERT INTO accounts_new (id, client_id, owner, category, account_last4, balance, cash_balance, interest_rate, property_address, is_active, created_at)
        SELECT id, client_id, CASE WHEN owner IN ('client_1','client_2') THEN (SELECT COALESCE(NULLIF(CASE WHEN owner='client_2' THEN spouse_name ELSE full_name END,''), full_name) FROM clients WHERE id=accounts.client_id) ELSE 'Joint' END, category, account_last4, balance, cash_balance, interest_rate, property_address, is_active, created_at FROM accounts;
      DROP TABLE accounts;
      ALTER TABLE accounts_new RENAME TO accounts;
    `);
    console.log('Migration: accounts table updated (removed account_name, owner uses names)');
  }

  // Migration: add spouse financial columns
  const spouseSalaryCol = db.prepare("SELECT COUNT(*) AS cnt FROM pragma_table_info('clients') WHERE name = 'spouse_monthly_salary'").get();
  if (spouseSalaryCol.cnt === 0) {
    db.exec(`
      ALTER TABLE clients ADD COLUMN spouse_monthly_salary REAL DEFAULT 0;
      ALTER TABLE clients ADD COLUMN spouse_expense_budget REAL DEFAULT 0;
      ALTER TABLE clients ADD COLUMN spouse_private_reserve_target REAL DEFAULT 0;
      ALTER TABLE clients ADD COLUMN spouse_insurance_deductibles REAL DEFAULT 0;
    `);
    console.log('Migration: added spouse financial columns to clients table');
  }

  // Migration: add type column to accounts
  const accTypeCol = db.prepare("SELECT COUNT(*) AS cnt FROM pragma_table_info('accounts') WHERE name = 'type'").get();
  if (accTypeCol.cnt === 0) {
    db.exec(`
      ALTER TABLE accounts ADD COLUMN type TEXT DEFAULT '';
      UPDATE accounts SET type = CASE category
        WHEN 'retirement' THEN 'IRA'
        WHEN 'non_retirement' THEN 'Brokerage'
        WHEN 'trust' THEN 'Trust'
        WHEN 'liability' THEN 'Other'
        ELSE ''
      END WHERE type = '';
    `);
    console.log('Migration: added type column to accounts table');
  }
}

module.exports = { db, initialize };
