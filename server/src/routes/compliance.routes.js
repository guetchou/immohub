const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware, requireRoles } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/documents', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'COMPLIANCE_AGENT', 'MINISTRY_VIEWER'), (req, res) => {
  res.json(db.prepare('SELECT * FROM compliance_documents ORDER BY created_at DESC').all());
});

router.post('/documents', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'COMPLIANCE_AGENT', 'FURNISHED_OPERATOR'), (req, res) => {
  const { property_id, property_name, type, file_name } = req.body;
  if (!property_id || !type) return res.status(400).json({ message: 'property_id et type requis' });
  const id = require('crypto').randomUUID();
  db.prepare(
    `INSERT INTO compliance_documents (id, property_id, property_name, type, status, file_name, submitted_at)
     VALUES (?, ?, ?, ?, 'SUBMITTED', ?, datetime('now'))`
  ).run(id, property_id, property_name || null, type, file_name || null);
  res.status(201).json({ id });
});

router.put('/documents/:id/validate', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'COMPLIANCE_AGENT'), (req, res) => {
  db.prepare(
    `UPDATE compliance_documents SET status='VALIDATED', validated_at=datetime('now'), reviewed_by_id=?, reviewed_by_name=? WHERE id=?`
  ).run(req.user.id, req.body.reviewed_by_name || req.user.email, req.params.id);
  res.json({ message: 'Validé' });
});

router.put('/documents/:id/reject', requireRoles('ADMIN', 'MINISTRY_ADMIN', 'COMPLIANCE_AGENT'), (req, res) => {
  const { rejection_reason } = req.body;
  db.prepare(
    `UPDATE compliance_documents SET status='REJECTED', rejected_at=datetime('now'), rejection_reason=?, reviewed_by_id=? WHERE id=?`
  ).run(rejection_reason || null, req.user.id, req.params.id);
  res.json({ message: 'Rejeté' });
});

module.exports = router;
