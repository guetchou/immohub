
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const { authenticateJWT, authorizeRole } = require('../middleware/auth');

// Database Connection Pool
const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get all users (admin only)
router.get('/', authenticateJWT, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    const [users] = await connection.execute(
      `SELECT id, email, full_name, role, phone, company_name, website, 
              status, created_at, updated_at, last_login 
       FROM users
       ORDER BY created_at DESC`
    );
    
    connection.release();
    
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Get user by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only admins or the user themselves can access user details
    if (req.user.role !== 'ADMIN' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Not authorized to access this user' });
    }
    
    const connection = await dbPool.getConnection();
    const [users] = await connection.execute(
      `SELECT id, email, full_name, role, phone, company_name, website, 
              status, created_at, updated_at, last_login 
       FROM users 
       WHERE id = ?`,
      [id]
    );
    
    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'User not found' });
    }
    
    connection.release();
    
    res.status(200).json({ user: users[0] });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
});

// Update user profile
router.put('/profile', authenticateJWT, async (req, res) => {
  try {
    const { full_name, phone, company_name, website } = req.body;
    
    const connection = await dbPool.getConnection();
    
    // Update user profile
    await connection.execute(
      `UPDATE users 
       SET full_name = ?, phone = ?, company_name = ?, website = ?, updated_at = NOW() 
       WHERE id = ?`,
      [full_name, phone, company_name, website, req.user.id]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: req.user.id,
        full_name,
        phone,
        company_name,
        website
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// Change password
router.put('/password', authenticateJWT, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    
    if (!current_password || !new_password) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }
    
    if (new_password.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }
    
    const connection = await dbPool.getConnection();
    
    // Get current user
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[0];
    
    // Verify current password
    const passwordMatch = await bcrypt.compare(current_password, user.password);
    
    if (!passwordMatch) {
      connection.release();
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    
    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(new_password, saltRounds);
    
    // Update password
    await connection.execute(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, req.user.id]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
});

// Update user role (admin only)
router.put('/:id/role', authenticateJWT, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({ message: 'Role is required' });
    }
    
    const validRoles = ['USER', 'TENANT', 'LANDLORD', 'AGENCY', 'ADMIN'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const connection = await dbPool.getConnection();
    
    // Check if user exists
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update role
    await connection.execute(
      'UPDATE users SET role = ?, updated_at = NOW() WHERE id = ?',
      [role, id]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'User role updated successfully',
      user: {
        id,
        role
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
});

// Deactivate/reactivate user (admin only)
router.put('/:id/status', authenticateJWT, authorizeRole(['ADMIN']), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Status must be active or inactive' });
    }
    
    const connection = await dbPool.getConnection();
    
    // Check if user exists
    const [users] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    if (users.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update status
    await connection.execute(
      'UPDATE users SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, id]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'User status updated successfully',
      user: {
        id,
        status
      }
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
});

module.exports = router;
