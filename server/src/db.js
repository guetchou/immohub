const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const config = require('./config');

const dbPath = path.resolve(config.databasePath);
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'USER',
      phone TEXT,
      company_name TEXT,
      website TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      title TEXT NOT NULL,
      description TEXT,
      address TEXT,
      city TEXT,
      district TEXT,
      type TEXT,
      status TEXT DEFAULT 'available',
      price REAL,
      surface REAL,
      rooms INTEGER,
      latitude REAL,
      longitude REAL,
      owner_id TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS furnished_properties (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      name TEXT NOT NULL,
      address TEXT,
      district TEXT,
      city TEXT,
      operator_id TEXT,
      operator_name TEXT,
      total_units INTEGER DEFAULT 0,
      active_units INTEGER DEFAULT 0,
      price_per_night REAL,
      compliance_status TEXT DEFAULT 'UNDECLARED',
      classification_level TEXT,
      declared_at TEXT,
      last_inspection_date TEXT,
      tax_risk_score INTEGER DEFAULT 0,
      latitude REAL,
      longitude REAL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS compliance_documents (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      property_id TEXT NOT NULL,
      property_name TEXT,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'PENDING',
      file_name TEXT,
      file_url TEXT,
      submitted_at TEXT,
      validated_at TEXT,
      rejected_at TEXT,
      rejection_reason TEXT,
      expires_at TEXT,
      reviewed_by_id TEXT,
      reviewed_by_name TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS ministry_cases (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      reference_number TEXT UNIQUE NOT NULL,
      property_id TEXT,
      property_name TEXT,
      operator_name TEXT,
      district TEXT,
      status TEXT DEFAULT 'NEW',
      opened_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      assigned_inspector_id TEXT,
      assigned_inspector_name TEXT,
      notes TEXT,
      tax_risk_score INTEGER
    );

    CREATE TABLE IF NOT EXISTS inspections (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      case_id TEXT,
      property_id TEXT,
      property_name TEXT,
      scheduled_date TEXT,
      conducted_date TEXT,
      inspector_id TEXT,
      inspector_name TEXT,
      status TEXT DEFAULT 'SCHEDULED',
      report_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tax_declarations (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      property_id TEXT NOT NULL,
      property_name TEXT,
      month TEXT,
      year INTEGER,
      total_nights INTEGER DEFAULT 0,
      total_revenue REAL DEFAULT 0,
      foreign_guests INTEGER DEFAULT 0,
      local_guests INTEGER DEFAULT 0,
      submitted_at TEXT,
      validated_at TEXT,
      status TEXT DEFAULT 'PENDING',
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT,
      action TEXT NOT NULL,
      resource TEXT,
      resource_id TEXT,
      details TEXT,
      ip_address TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS monthly_statistics (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      month TEXT NOT NULL,
      year INTEGER NOT NULL,
      total_properties INTEGER DEFAULT 0,
      declared_properties INTEGER DEFAULT 0,
      total_revenue_estimated REAL DEFAULT 0,
      total_revenue_declared REAL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

initSchema();

// Safe column migrations for existing databases
const columnMigrations = [
  "ALTER TABLE furnished_properties ADD COLUMN nimt_number TEXT",
];
for (const m of columnMigrations) {
  try { db.exec(m); } catch {}
}

// New tables for finance module
db.exec(`
  CREATE TABLE IF NOT EXISTS finance_transmissions (
    id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
    property_id TEXT,
    property_name TEXT,
    operator_name TEXT,
    nimt_number TEXT,
    year INTEGER,
    total_nights INTEGER DEFAULT 0,
    total_revenue REAL DEFAULT 0,
    tax_amount REAL DEFAULT 0,
    status TEXT DEFAULT 'PENDING',
    transmitted_at TEXT DEFAULT (datetime('now')),
    processed_at TEXT,
    notes TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

module.exports = db;
