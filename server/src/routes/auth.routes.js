const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { authMiddleware } = require('../middleware/auth');

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email et mot de passe requis' });
  }
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Identifiants invalides' });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwtSecret,
    { expiresIn: config.jwtExpiry }
  );

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      phone: user.phone,
      company_name: user.company_name,
      website: user.website,
    },
  });
});

router.post('/register', (req, res) => {
  const { email, password, full_name, role = 'USER', phone, company_name, website } = req.body;
  if (!email || !password || !full_name) {
    return res.status(400).json({ message: 'Email, mot de passe et nom requis' });
  }
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ message: 'Email déjà utilisé' });

  const hash = bcrypt.hashSync(password, 10);
  const id = require('crypto').randomUUID();
  db.prepare(
    `INSERT INTO users (id, email, password, full_name, role, phone, company_name, website)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, email, hash, full_name, role, phone || null, company_name || null, website || null);

  const token = jwt.sign({ id, email, role }, config.jwtSecret, { expiresIn: config.jwtExpiry });
  res.status(201).json({ token, user: { id, email, fullName: full_name, role } });
});

router.get('/me', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, email, full_name, role, phone, company_name, website, created_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  res.json({ user: { ...user, fullName: user.full_name } });
});

module.exports = router;
