const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM furnished_properties ORDER BY created_at DESC').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM furnished_properties WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ message: 'Bien meublé non trouvé' });
  res.json(row);
});

router.post('/', authMiddleware, (req, res) => {
  const { name, address, district, city, operator_name, total_units, price_per_night, compliance_status } = req.body;
  if (!name) return res.status(400).json({ message: 'Nom requis' });
  const id = require('crypto').randomUUID();
  db.prepare(
    `INSERT INTO furnished_properties (id, name, address, district, city, operator_id, operator_name, total_units, price_per_night, compliance_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, name, address || null, district || null, city || null, req.user.id, operator_name || null, total_units || 0, price_per_night || 0, compliance_status || 'UNDECLARED');
  res.status(201).json({ id });
});

router.put('/:id', authMiddleware, (req, res) => {
  const existing = db.prepare('SELECT id FROM furnished_properties WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Bien meublé non trouvé' });
  const { name, address, district, city, compliance_status, tax_risk_score } = req.body;
  db.prepare(
    `UPDATE furnished_properties SET name=?, address=?, district=?, city=?, compliance_status=?, tax_risk_score=?, updated_at=datetime('now') WHERE id=?`
  ).run(name, address, district, city, compliance_status, tax_risk_score, req.params.id);
  res.json({ message: 'Mis à jour' });
});

router.get('/:id/compliance', (req, res) => {
  const docs = db.prepare('SELECT * FROM compliance_documents WHERE property_id = ?').all(req.params.id);
  res.json(docs);
});

module.exports = router;
