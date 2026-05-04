const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, requireRoles } = require('../middleware/auth');

const financeRoles = ['ADMIN', 'FINANCE_VIEWER', 'TAX_ANALYST'];

router.use(authMiddleware);

router.get('/dashboard', requireRoles(...financeRoles), (req, res) => {
  const totalProps = db.prepare("SELECT COUNT(*) as n FROM furnished_properties").get().n;
  const withNimt = db.prepare("SELECT COUNT(*) as n FROM furnished_properties WHERE nimt_number IS NOT NULL").get().n;
  const totalTransmissions = db.prepare("SELECT COUNT(*) as n FROM finance_transmissions").get().n;
  const pendingTransmissions = db.prepare("SELECT COUNT(*) as n FROM finance_transmissions WHERE status = 'PENDING'").get().n;
  const totalRevenueDeclared = db.prepare(
    "SELECT COALESCE(SUM(total_revenue), 0) as s FROM tax_declarations WHERE status = 'SUBMITTED'"
  ).get().s;
  const criticalRiskCount = db.prepare(
    "SELECT COUNT(*) as n FROM furnished_properties WHERE tax_risk_score >= 75"
  ).get().n;
  const totalTaxAmount = db.prepare(
    "SELECT COALESCE(SUM(tax_amount), 0) as s FROM finance_transmissions"
  ).get().s;

  res.json({
    totalRegisteredProperties: totalProps,
    propertiesWithNimt: withNimt,
    totalTransmissions,
    pendingTransmissions,
    totalRevenueDeclared,
    criticalRiskCount,
    totalTaxAmount,
  });
});

router.get('/transmissions', requireRoles(...financeRoles), (req, res) => {
  res.json(db.prepare('SELECT * FROM finance_transmissions ORDER BY transmitted_at DESC').all());
});

router.put('/transmissions/:id/status', requireRoles('ADMIN', 'TAX_ANALYST'), (req, res) => {
  const { status, notes } = req.body;
  if (!status) return res.status(400).json({ message: 'status requis' });
  db.prepare(
    "UPDATE finance_transmissions SET status = ?, notes = ?, processed_at = datetime('now') WHERE id = ?"
  ).run(status, notes || null, req.params.id);
  res.json({ message: 'Mis à jour' });
});

module.exports = router;
