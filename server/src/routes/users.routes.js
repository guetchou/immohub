const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { authMiddleware, requireRoles } = require('../middleware/auth');
const auditLog = require('../middleware/audit');

const ADMIN_ROLES = ['ADMIN', 'MINISTRY_ADMIN'];
const MIN_PASSWORD_LENGTH = 10;

// Roles that ADMIN/MINISTRY_ADMIN can assign
const ASSIGNABLE_ROLES = [
  'ADMIN', 'MINISTRY_ADMIN', 'MINISTRY_VIEWER', 'MINISTRY_INSPECTOR',
  'COMPLIANCE_AGENT', 'FINANCE_VIEWER', 'TAX_ANALYST',
  'FURNISHED_OPERATOR', 'LANDLORD', 'AGENCY', 'USER', 'TENANT',
];

// Roles that MINISTRY_ADMIN cannot assign (only ADMIN can)
const ADMIN_ONLY_ROLES = ['ADMIN'];

// Roles FINANCE_VIEWER cannot create
const MINISTRY_ROLES = ['MINISTRY_ADMIN', 'MINISTRY_VIEWER', 'MINISTRY_INSPECTOR', 'COMPLIANCE_AGENT', 'TAX_ANALYST'];

function sanitizeUser(u) {
  const { password, ...safe } = u;
  return { ...safe, status: (u.status || 'ACTIVE').toUpperCase() };
}

function logAudit(actorId, action, entityId, details, ip) {
  try {
    db.prepare(
      `INSERT INTO audit_logs (user_id, action, resource, resource_id, details, ip_address)
       VALUES (?, ?, 'users', ?, ?, ?)`
    ).run(actorId, action, entityId, details ? JSON.stringify(details) : null, ip);
  } catch {}
}

// ── GET /api/users ──────────────────────────────────────────────────────────
router.get('/', authMiddleware, requireRoles(...ADMIN_ROLES), (req, res) => {
  const { role, status, search, page = 1, limit = 50 } = req.query;
  let where = [];
  let params = [];

  if (role) { where.push('role = ?'); params.push(role); }
  if (status) { where.push('UPPER(status) = ?'); params.push(status.toUpperCase()); }
  if (search) {
    where.push('(LOWER(email) LIKE ? OR LOWER(full_name) LIKE ?)');
    const term = `%${search.toLowerCase()}%`;
    params.push(term, term);
  }

  const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const offset = (parseInt(page) - 1) * parseInt(limit);

  const users = db.prepare(
    `SELECT id, email, full_name, role, status, phone, organization, department, created_at, updated_at, last_login_at
     FROM users ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`
  ).all(...params, parseInt(limit), offset);

  const { total } = db.prepare(
    `SELECT COUNT(*) as total FROM users ${whereClause}`
  ).get(...params);

  res.json({ users: users.map(sanitizeUser), total, page: parseInt(page), limit: parseInt(limit) });
});

// ── GET /api/users/:id ──────────────────────────────────────────────────────
router.get('/:id', authMiddleware, requireRoles(...ADMIN_ROLES), (req, res) => {
  const user = db.prepare(
    `SELECT id, email, full_name, role, status, phone, organization, department, created_at, updated_at, last_login_at
     FROM users WHERE id = ?`
  ).get(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
  res.json({ user: sanitizeUser(user) });
});

// ── POST /api/users ─────────────────────────────────────────────────────────
router.post('/', authMiddleware, requireRoles(...ADMIN_ROLES), (req, res) => {
  const { email, password, full_name, role = 'USER', phone, organization, department, status = 'ACTIVE' } = req.body;

  if (!email || !password || !full_name) {
    return res.status(400).json({ message: 'Email, mot de passe et nom requis' });
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ message: `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères` });
  }

  const actorRole = req.user.role;

  // MINISTRY_ADMIN cannot create ADMIN accounts
  if (actorRole === 'MINISTRY_ADMIN' && ADMIN_ONLY_ROLES.includes(role)) {
    return res.status(403).json({ message: 'MINISTRY_ADMIN ne peut pas créer un compte ADMIN' });
  }
  // Role must be in allowed list
  if (!ASSIGNABLE_ROLES.includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) return res.status(409).json({ message: 'Email déjà utilisé' });

  const hash = bcrypt.hashSync(password, 10);
  const id = crypto.randomUUID();

  db.prepare(
    `INSERT INTO users (id, email, password, full_name, role, status, phone, organization, department)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, email, hash, full_name, role, status.toUpperCase(), phone || null, organization || null, department || null);

  logAudit(req.user.id, 'CREATE_USER', id, { email, role, status }, req.ip);

  const created = db.prepare(
    `SELECT id, email, full_name, role, status, phone, organization, department, created_at
     FROM users WHERE id = ?`
  ).get(id);

  res.status(201).json({ user: sanitizeUser(created) });
});

// ── PUT /api/users/profile ── (own profile update, any authenticated user) ──
router.put('/profile', authMiddleware, (req, res) => {
  const { full_name, phone, organization, department } = req.body;
  db.prepare(
    `UPDATE users SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone),
     organization = COALESCE(?, organization), department = COALESCE(?, department),
     updated_at = datetime('now') WHERE id = ?`
  ).run(full_name || null, phone || null, organization || null, department || null, req.user.id);

  const updated = db.prepare(
    `SELECT id, email, full_name, role, status, phone, organization, department FROM users WHERE id = ?`
  ).get(req.user.id);
  res.json({ user: sanitizeUser(updated) });
});

// ── PUT /api/users/password ── (change own password, any authenticated user) ─
router.put('/password', authMiddleware, (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ message: 'Mot de passe actuel et nouveau mot de passe requis' });
  }
  if (new_password.length < MIN_PASSWORD_LENGTH) {
    return res.status(400).json({ message: `Le nouveau mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères` });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  if (!bcrypt.compareSync(current_password, user.password)) {
    return res.status(401).json({ message: 'Mot de passe actuel incorrect' });
  }

  const hash = bcrypt.hashSync(new_password, 10);
  db.prepare(`UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?`).run(hash, user.id);

  logAudit(req.user.id, 'CHANGE_PASSWORD', user.id, null, req.ip);
  res.json({ message: 'Mot de passe mis à jour' });
});

// ── PUT /api/users/avatar ── (own avatar, any authenticated user) ────────────
router.put('/avatar', authMiddleware, (req, res) => {
  const { avatar } = req.body; // base64 data-url

  // Accept null (delete avatar) or a data-url starting with "data:image/"
  if (avatar !== null && avatar !== undefined) {
    if (typeof avatar !== 'string' || !avatar.startsWith('data:image/')) {
      return res.status(400).json({ message: 'Format invalide. Attendu: data-url image' });
    }
    // Limit to ~5 MB (base64 ≈ 4/3 × raw, so 5MB raw ≈ 6.8MB base64 ≈ ~7M chars)
    if (avatar.length > 7_000_000) {
      return res.status(413).json({ message: 'Image trop volumineuse (max 5 Mo)' });
    }
  }

  db.prepare(`UPDATE users SET avatar = ?, updated_at = datetime('now') WHERE id = ?`)
    .run(avatar ?? null, req.user.id);

  res.json({ message: 'Avatar mis à jour' });
});

// ── PUT /api/users/:id ──────────────────────────────────────────────────────
router.put('/:id', authMiddleware, requireRoles(...ADMIN_ROLES), (req, res) => {
  const { full_name, phone, organization, department } = req.body;
  const user = db.prepare('SELECT id FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  db.prepare(
    `UPDATE users SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone),
     organization = COALESCE(?, organization), department = COALESCE(?, department),
     updated_at = datetime('now') WHERE id = ?`
  ).run(full_name || null, phone || null, organization || null, department || null, req.params.id);

  const updated = db.prepare(
    `SELECT id, email, full_name, role, status, phone, organization, department, created_at, updated_at, last_login_at
     FROM users WHERE id = ?`
  ).get(req.params.id);

  logAudit(req.user.id, 'UPDATE_USER', req.params.id, { full_name, phone }, req.ip);
  res.json({ user: sanitizeUser(updated) });
});

// ── PUT /api/users/:id/role ─────────────────────────────────────────────────
router.put('/:id/role', authMiddleware, requireRoles(...ADMIN_ROLES), (req, res) => {
  const { role } = req.body;
  if (!role || !ASSIGNABLE_ROLES.includes(role)) {
    return res.status(400).json({ message: 'Rôle invalide' });
  }

  const actorRole = req.user.role;
  if (actorRole === 'MINISTRY_ADMIN' && ADMIN_ONLY_ROLES.includes(role)) {
    return res.status(403).json({ message: 'MINISTRY_ADMIN ne peut pas assigner le rôle ADMIN' });
  }

  const user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  // Prevent changing own role
  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'Vous ne pouvez pas changer votre propre rôle' });
  }

  db.prepare(`UPDATE users SET role = ?, updated_at = datetime('now') WHERE id = ?`).run(role, req.params.id);
  logAudit(req.user.id, 'CHANGE_ROLE', req.params.id, { from: user.role, to: role }, req.ip);
  res.json({ message: 'Rôle mis à jour', role });
});

// ── PUT /api/users/:id/status ───────────────────────────────────────────────
router.put('/:id/status', authMiddleware, requireRoles(...ADMIN_ROLES), (req, res) => {
  const VALID_STATUSES = ['ACTIVE', 'SUSPENDED', 'DISABLED', 'PENDING'];
  const { status } = req.body;
  if (!status || !VALID_STATUSES.includes(status.toUpperCase())) {
    return res.status(400).json({ message: 'Statut invalide. Valeurs: ACTIVE, SUSPENDED, DISABLED, PENDING' });
  }

  const user = db.prepare('SELECT id, status FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'Vous ne pouvez pas changer votre propre statut' });
  }

  const newStatus = status.toUpperCase();
  db.prepare(`UPDATE users SET status = ?, updated_at = datetime('now') WHERE id = ?`).run(newStatus, req.params.id);
  logAudit(req.user.id, 'CHANGE_STATUS', req.params.id, { from: user.status, to: newStatus }, req.ip);
  res.json({ message: 'Statut mis à jour', status: newStatus });
});

// ── POST /api/users/:id/reset-password ─────────────────────────────────────
router.post('/:id/reset-password', authMiddleware, requireRoles('ADMIN'), (req, res) => {
  const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  // Generate secure temporary password
  const tempPassword = crypto.randomBytes(8).toString('hex'); // 16 chars hex
  const hash = bcrypt.hashSync(tempPassword, 10);

  db.prepare(`UPDATE users SET password = ?, updated_at = datetime('now') WHERE id = ?`).run(hash, user.id);
  logAudit(req.user.id, 'RESET_PASSWORD', user.id, { email: user.email }, req.ip);

  // Return temp password once — only visible in local console, never in prod logs
  res.json({
    message: 'Mot de passe temporaire généré',
    temp_password: tempPassword,
    note: 'À transmettre manuellement à l\'utilisateur. Ce mot de passe ne sera affiché qu\'une seule fois.',
  });
});

// ── DELETE /api/users/:id ── soft delete uniquement ─────────────────────────
router.delete('/:id', authMiddleware, requireRoles('ADMIN'), (req, res) => {
  const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(req.params.id);
  if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

  if (req.params.id === req.user.id) {
    return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
  }

  // Soft delete = DISABLED
  db.prepare(`UPDATE users SET status = 'DISABLED', updated_at = datetime('now') WHERE id = ?`).run(req.params.id);
  logAudit(req.user.id, 'DISABLE_USER', user.id, { email: user.email }, req.ip);
  res.json({ message: 'Utilisateur désactivé (soft delete)' });
});

module.exports = router;
