const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../db');
const { authMiddleware, requireRoles } = require('../middleware/auth');

const ministryRoles = ['ADMIN', 'MINISTRY_ADMIN', 'MINISTRY_VIEWER', 'MINISTRY_INSPECTOR', 'COMPLIANCE_AGENT', 'TAX_ANALYST'];

// Public: verify NIMT (no auth)
router.get('/verify/:nimt', (req, res) => {
  const row = db.prepare(
    `SELECT id, name, district, city, compliance_status, classification_level, total_units, nimt_number
     FROM furnished_properties WHERE nimt_number = ?`
  ).get(req.params.nimt.toUpperCase());

  if (!row) return res.status(404).json({ found: false });

  res.json({
    found: true,
    nimt: row.nimt_number,
    status: row.compliance_status,
    district: row.district,
    city: row.city,
    type: 'Meublé touristique',
    totalUnits: row.total_units,
    classificationLevel: row.classification_level || null,
  });
});

// Protected routes below
router.use(authMiddleware);

router.get('/', requireRoles(...ministryRoles), (req, res) => {
  const rows = db.prepare(
    `SELECT id, name, address, district, city, operator_name, compliance_status,
     classification_level, nimt_number, total_units, active_units, price_per_night,
     tax_risk_score, declared_at, last_inspection_date, created_at, updated_at
     FROM furnished_properties ORDER BY created_at DESC`
  ).all();
  res.json(rows);
});

router.post('/', requireRoles('ADMIN', 'MINISTRY_ADMIN'), (req, res) => {
  const { name, address, district, city, operator_name, total_units, price_per_night } = req.body;
  if (!name || !operator_name) return res.status(400).json({ message: 'name et operator_name requis' });

  const id = crypto.randomUUID();
  db.prepare(
    `INSERT INTO furnished_properties (id, name, address, district, city, operator_name, total_units, price_per_night, compliance_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'UNDECLARED')`
  ).run(id, name, address || null, district || null, city || 'Brazzaville', operator_name, total_units || 0, price_per_night || 0);

  res.status(201).json({ id });
});

router.post('/:id/generate-nimt', requireRoles('ADMIN', 'MINISTRY_ADMIN'), (req, res) => {
  const property = db.prepare('SELECT * FROM furnished_properties WHERE id = ?').get(req.params.id);
  if (!property) return res.status(404).json({ message: 'Bien non trouvé' });
  if (property.nimt_number) return res.status(409).json({ message: 'NIMT déjà attribué', nimt: property.nimt_number });

  const count = db.prepare("SELECT COUNT(*) as n FROM furnished_properties WHERE nimt_number IS NOT NULL").get().n;
  const year = new Date().getFullYear();
  const seq = String(count + 1).padStart(6, '0');
  const nimt = `CG-BZV-MT-${year}-${seq}`;

  db.prepare(
    "UPDATE furnished_properties SET nimt_number = ?, compliance_status = 'DECLARED', updated_at = datetime('now') WHERE id = ?"
  ).run(nimt, req.params.id);

  res.json({ nimt });
});

router.post('/:id/transmit-finance', requireRoles('ADMIN', 'MINISTRY_ADMIN'), (req, res) => {
  const property = db.prepare('SELECT * FROM furnished_properties WHERE id = ?').get(req.params.id);
  if (!property) return res.status(404).json({ message: 'Bien non trouvé' });

  const { year, total_nights, total_revenue } = req.body;
  const id = crypto.randomUUID();
  const taxAmount = (total_revenue || 0) * 0.1;

  db.prepare(
    `INSERT INTO finance_transmissions (id, property_id, property_name, operator_name, nimt_number, year, total_nights, total_revenue, tax_amount)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, property.id, property.name, property.operator_name, property.nimt_number, year || new Date().getFullYear(), total_nights || 0, total_revenue || 0, taxAmount);

  res.status(201).json({ id });
});

module.exports = router;
