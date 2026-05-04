const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, requireRoles } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/risk', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'TAX_ANALYST'), (req, res) => {
  const rows = db.prepare(
    'SELECT id, name, district, tax_risk_score, compliance_status FROM furnished_properties ORDER BY tax_risk_score DESC'
  ).all();
  const assessments = rows.map(r => ({
    propertyId: r.id,
    propertyName: r.name,
    district: r.district,
    riskScore: r.tax_risk_score || 0,
    riskLevel: r.tax_risk_score >= 75 ? 'CRITICAL' : r.tax_risk_score >= 50 ? 'HIGH' : r.tax_risk_score >= 25 ? 'MEDIUM' : 'LOW',
    complianceStatus: r.compliance_status,
    lastAssessedAt: new Date().toISOString(),
  }));
  res.json(assessments);
});

router.get('/declarations', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'TAX_ANALYST', 'FURNISHED_OPERATOR'), (req, res) => {
  res.json(db.prepare('SELECT * FROM tax_declarations ORDER BY year DESC, month DESC').all());
});

router.post('/declarations', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'FURNISHED_OPERATOR'), (req, res) => {
  const { property_id, property_name, month, year, total_nights, total_revenue, foreign_guests, local_guests } = req.body;
  if (!property_id || !month || !year) return res.status(400).json({ message: 'property_id, month et year requis' });
  const id = require('crypto').randomUUID();
  db.prepare(
    `INSERT INTO tax_declarations (id, property_id, property_name, month, year, total_nights, total_revenue, foreign_guests, local_guests, submitted_at, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), 'SUBMITTED')`
  ).run(id, property_id, property_name || null, month, year, total_nights || 0, total_revenue || 0, foreign_guests || 0, local_guests || 0);
  res.status(201).json({ id });
});

module.exports = router;
