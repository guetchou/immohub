const express = require('express');
const router = express.Router();
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM properties ORDER BY created_at DESC').all();
  res.json(rows);
});

router.get('/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ message: 'Propriété non trouvée' });
  res.json(row);
});

router.post('/', authMiddleware, (req, res) => {
  const { title, description, address, city, district, type, status, price, surface, rooms, latitude, longitude } = req.body;
  if (!title) return res.status(400).json({ message: 'Titre requis' });
  const id = require('crypto').randomUUID();
  db.prepare(
    `INSERT INTO properties (id, title, description, address, city, district, type, status, price, surface, rooms, latitude, longitude, owner_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, title, description || null, address || null, city || null, district || null, type || null, status || 'available', price || null, surface || null, rooms || null, latitude || null, longitude || null, req.user.id);
  res.status(201).json({ id });
});

router.put('/:id', authMiddleware, (req, res) => {
  const { title, description, address, city, district, type, status, price, surface, rooms } = req.body;
  const existing = db.prepare('SELECT id FROM properties WHERE id = ?').get(req.params.id);
  if (!existing) return res.status(404).json({ message: 'Propriété non trouvée' });
  db.prepare(
    `UPDATE properties SET title=?, description=?, address=?, city=?, district=?, type=?, status=?, price=?, surface=?, rooms=?, updated_at=datetime('now') WHERE id=?`
  ).run(title, description, address, city, district, type, status, price, surface, rooms, req.params.id);
  res.json({ message: 'Mis à jour' });
});

router.delete('/:id', authMiddleware, (req, res) => {
  db.prepare('DELETE FROM properties WHERE id = ?').run(req.params.id);
  res.json({ message: 'Supprimé' });
});

module.exports = router;
