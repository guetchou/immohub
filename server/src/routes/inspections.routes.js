const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, requireRoles } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'MINISTRY_INSPECTOR', 'COMPLIANCE_AGENT'), (req, res) => {
  res.json(db.prepare('SELECT * FROM inspections ORDER BY scheduled_date DESC').all());
});

router.post('/', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'MINISTRY_INSPECTOR'), (req, res) => {
  const { case_id, property_id, property_name, scheduled_date, inspector_name } = req.body;
  if (!property_id || !scheduled_date) return res.status(400).json({ message: 'property_id et scheduled_date requis' });
  const id = require('crypto').randomUUID();
  db.prepare(
    `INSERT INTO inspections (id, case_id, property_id, property_name, scheduled_date, inspector_id, inspector_name)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(id, case_id || null, property_id, property_name || null, scheduled_date, req.user.id, inspector_name || req.user.email);
  res.status(201).json({ id });
});

router.put('/:id', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'MINISTRY_INSPECTOR'), (req, res) => {
  const { status, conducted_date, report_url } = req.body;
  db.prepare(
    `UPDATE inspections SET status=?, conducted_date=?, report_url=? WHERE id=?`
  ).run(status, conducted_date || null, report_url || null, req.params.id);
  res.json({ message: 'Mis à jour' });
});

module.exports = router;
