/**
 * Seed DEMO — insère un meublé touristique de démonstration.
 * Idempotent : ne fait rien si le NIMT existe déjà.
 * Aucune donnée privée réelle.
 */
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'data', 'immohub.sqlite');
const db = new Database(dbPath);

const DEMO_NIMT = 'CG-BZV-MT-2026-000001';

const existing = db.prepare('SELECT id FROM furnished_properties WHERE nimt_number = ?').get(DEMO_NIMT);
if (existing) {
  console.log(`NIMT ${DEMO_NIMT} déjà présent (id: ${existing.id}). Rien à faire.`);
  process.exit(0);
}

const crypto = require('crypto');
const id = crypto.randomUUID();

db.prepare(`
  INSERT INTO furnished_properties
    (id, name, address, district, city, operator_name, total_units, active_units,
     price_per_night, compliance_status, classification_level, nimt_number,
     declared_at, tax_risk_score, created_at, updated_at)
  VALUES
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 0, datetime('now'), datetime('now'))
`).run(
  id,
  'Studio DEMO ImmoHub',
  'Adresse non publique',
  'Bacongo',
  'Brazzaville',
  'Compte Démo ImmoHub',
  2,
  2,
  0,
  'DECLARED',
  null,
  DEMO_NIMT,
);

console.log(`Seed OK — id: ${id} — NIMT: ${DEMO_NIMT}`);
