const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, requireRoles } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/monthly', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'TAX_ANALYST'), (req, res) => {
  const stats = db.prepare('SELECT * FROM monthly_statistics ORDER BY year DESC, month DESC LIMIT 12').all();
  res.json(stats);
});

router.get('/export', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'TAX_ANALYST'), (req, res) => {
  const { type = 'registry' } = req.query;
  let data = [];
  if (type === 'registry') {
    data = db.prepare('SELECT * FROM furnished_properties').all();
  } else if (type === 'cases') {
    data = db.prepare('SELECT * FROM ministry_cases').all();
  } else if (type === 'compliance') {
    data = db.prepare('SELECT * FROM compliance_documents').all();
  }
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="immohub_${type}_${Date.now()}.json"`);
  res.json(data);
});

module.exports = router;
