const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, requireRoles } = require('../middleware/auth');

const ministryRoles = ['ADMIN', 'MINISTRY_ADMIN', 'MINISTRY_VIEWER', 'MINISTRY_INSPECTOR', 'COMPLIANCE_AGENT', 'TAX_ANALYST'];

router.use(authMiddleware);

router.get('/dashboard', requireRoles(...ministryRoles), (req, res) => {
  const total = db.prepare('SELECT COUNT(*) as n FROM furnished_properties').get().n;
  const declared = db.prepare("SELECT COUNT(*) as n FROM furnished_properties WHERE compliance_status NOT IN ('UNDECLARED')").get().n;
  const openCases = db.prepare("SELECT COUNT(*) as n FROM ministry_cases WHERE status NOT IN ('CLOSED', 'REGULARIZED')").get().n;
  const pendingInspections = db.prepare("SELECT COUNT(*) as n FROM inspections WHERE status = 'SCHEDULED'").get().n;
  const criticalRisk = db.prepare('SELECT COUNT(*) as n FROM furnished_properties WHERE tax_risk_score >= 75').get().n;
  res.json({
    totalFurnishedProperties: total,
    declaredProperties: declared,
    undeclaredProperties: total - declared,
    openCases,
    pendingInspections,
    criticalRiskProperties: criticalRisk,
    complianceRate: total > 0 ? Math.round((declared / total) * 100) : 0,
  });
});

router.get('/registry', requireRoles(...ministryRoles), (req, res) => {
  const rows = db.prepare('SELECT * FROM furnished_properties ORDER BY tax_risk_score DESC').all();
  res.json(rows);
});

router.get('/alerts', requireRoles(...ministryRoles), (req, res) => {
  const undeclared = db.prepare("SELECT * FROM furnished_properties WHERE compliance_status = 'UNDECLARED'").all();
  const alerts = undeclared.map(p => ({
    id: `alert-${p.id}`,
    type: 'MISSING_DECLARATION',
    propertyId: p.id,
    propertyName: p.name,
    message: `Aucune déclaration d'activité pour ${p.name}`,
    severity: p.tax_risk_score >= 75 ? 'URGENT' : 'WARNING',
    createdAt: p.updated_at,
  }));
  res.json(alerts);
});

router.get('/cases', requireRoles(...ministryRoles), (req, res) => {
  const rows = db.prepare('SELECT * FROM ministry_cases ORDER BY opened_at DESC').all();
  res.json(rows);
});

router.post('/cases', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'MINISTRY_INSPECTOR', 'COMPLIANCE_AGENT'), (req, res) => {
  const { property_id, property_name, operator_name, district, notes } = req.body;
  if (!property_id) return res.status(400).json({ message: 'property_id requis' });
  const id = require('crypto').randomUUID();
  const ref = `MIN-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;
  db.prepare(
    `INSERT INTO ministry_cases (id, reference_number, property_id, property_name, operator_name, district, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, ref, property_id, property_name || null, operator_name || null, district || null, notes || null);
  res.status(201).json({ id, reference_number: ref });
});

router.put('/cases/:id', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'MINISTRY_INSPECTOR', 'COMPLIANCE_AGENT'), (req, res) => {
  const { status, notes, assigned_inspector_name } = req.body;
  db.prepare(
    `UPDATE ministry_cases SET status=?, notes=?, assigned_inspector_name=?, updated_at=datetime('now') WHERE id=?`
  ).run(status, notes, assigned_inspector_name, req.params.id);
  res.json({ message: 'Mis à jour' });
});

module.exports = router;
