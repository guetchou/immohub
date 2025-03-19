
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const { authenticateJWT } = require('../middleware/auth');

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

// Get all leases (with role-based filtering)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    let query = `
      SELECT lc.*, 
             p.title as property_title, p.address as property_address,
             u1.full_name as tenant_name, u1.email as tenant_email,
             u2.full_name as owner_name, u2.email as owner_email
      FROM lease_contracts lc
      LEFT JOIN properties p ON lc.property_id = p.id
      LEFT JOIN users u1 ON lc.tenant_id = u1.id
      LEFT JOIN users u2 ON lc.owner_id = u2.id
    `;
    
    // Filter by role
    const params = [];
    if (req.user.role === 'TENANT') {
      query += ' WHERE lc.tenant_id = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'LANDLORD') {
      query += ' WHERE lc.owner_id = ?';
      params.push(req.user.id);
    } else if (req.user.role !== 'ADMIN') {
      // Regular users can only see their leases
      query += ' WHERE lc.tenant_id = ? OR lc.owner_id = ?';
      params.push(req.user.id, req.user.id);
    }
    
    query += ' ORDER BY lc.created_at DESC';
    
    const [leases] = await connection.execute(query, params);
    connection.release();
    
    res.status(200).json({ leases });
  } catch (error) {
    console.error('Error fetching leases:', error);
    res.status(500).json({ message: 'Error fetching leases', error: error.message });
  }
});

// Get lease by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await dbPool.getConnection();
    const [leases] = await connection.execute(
      `SELECT lc.*, 
              p.title as property_title, p.address as property_address, p.city as property_city,
              u1.full_name as tenant_name, u1.email as tenant_email, u1.phone as tenant_phone,
              u2.full_name as owner_name, u2.email as owner_email
       FROM lease_contracts lc
       LEFT JOIN properties p ON lc.property_id = p.id
       LEFT JOIN users u1 ON lc.tenant_id = u1.id
       LEFT JOIN users u2 ON lc.owner_id = u2.id
       WHERE lc.id = ?`,
      [id]
    );
    
    if (leases.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Lease not found' });
    }
    
    const lease = leases[0];
    
    // Check access rights
    if (req.user.role !== 'ADMIN' && 
        req.user.id !== lease.tenant_id && 
        req.user.id !== lease.owner_id) {
      connection.release();
      return res.status(403).json({ message: 'Not authorized to view this lease' });
    }
    
    // Get payments for this lease
    const [payments] = await connection.execute(
      `SELECT * FROM rent_payments WHERE contract_id = ? ORDER BY payment_date DESC`,
      [id]
    );
    
    lease.payments = payments;
    
    connection.release();
    
    res.status(200).json({ lease });
  } catch (error) {
    console.error('Error fetching lease:', error);
    res.status(500).json({ message: 'Error fetching lease', error: error.message });
  }
});

// Create new lease (requires authentication)
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { 
      property_id, tenant_id, start_date, end_date, 
      monthly_rent, deposit_amount, terms 
    } = req.body;
    
    // Validate required fields
    if (!property_id || !tenant_id || !start_date || !end_date || !monthly_rent || !deposit_amount) {
      return res.status(400).json({ 
        message: 'Property, tenant, dates, rent, and deposit amount are required' 
      });
    }
    
    const connection = await dbPool.getConnection();
    
    // Verify property exists and caller is owner
    const [properties] = await connection.execute(
      'SELECT * FROM properties WHERE id = ?',
      [property_id]
    );
    
    if (properties.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Set owner_id based on property owner or current user if admin
    const owner_id = req.user.role === 'ADMIN' 
      ? properties[0].owner_id 
      : req.user.id;
    
    // Check if user is authorized (must be admin or property owner)
    if (req.user.role !== 'ADMIN' && req.user.id !== properties[0].owner_id) {
      connection.release();
      return res.status(403).json({ message: 'Not authorized to create lease for this property' });
    }
    
    // Verify tenant exists
    const [tenants] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [tenant_id]
    );
    
    if (tenants.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    // Insert lease
    const [result] = await connection.execute(
      `INSERT INTO lease_contracts 
       (property_id, tenant_id, owner_id, start_date, end_date, 
        monthly_rent, deposit_amount, terms, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', NOW(), NOW())`,
      [property_id, tenant_id, owner_id, start_date, end_date, 
       monthly_rent, deposit_amount, terms || null]
    );
    
    connection.release();
    
    res.status(201).json({
      message: 'Lease created successfully',
      lease: {
        id: result.insertId,
        property_id,
        tenant_id,
        owner_id,
        status: 'active'
      }
    });
  } catch (error) {
    console.error('Error creating lease:', error);
    res.status(500).json({ message: 'Error creating lease', error: error.message });
  }
});

// Update lease (requires authentication)
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      start_date, end_date, monthly_rent, 
      deposit_amount, terms, status 
    } = req.body;
    
    const connection = await dbPool.getConnection();
    
    // Check if lease exists
    const [leases] = await connection.execute(
      'SELECT * FROM lease_contracts WHERE id = ?',
      [id]
    );
    
    if (leases.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Lease not found' });
    }
    
    const lease = leases[0];
    
    // Check authorization (must be admin or lease owner)
    if (req.user.role !== 'ADMIN' && req.user.id !== lease.owner_id) {
      connection.release();
      return res.status(403).json({ message: 'Not authorized to update this lease' });
    }
    
    // Update lease
    await connection.execute(
      `UPDATE lease_contracts 
       SET start_date = ?, end_date = ?, monthly_rent = ?,
           deposit_amount = ?, terms = ?, status = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        start_date || lease.start_date, 
        end_date || lease.end_date, 
        monthly_rent || lease.monthly_rent,
        deposit_amount || lease.deposit_amount, 
        terms !== undefined ? terms : lease.terms, 
        status || lease.status, 
        id
      ]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'Lease updated successfully',
      lease: {
        id,
        status: status || lease.status
      }
    });
  } catch (error) {
    console.error('Error updating lease:', error);
    res.status(500).json({ message: 'Error updating lease', error: error.message });
  }
});

// Delete lease (requires authentication)
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await dbPool.getConnection();
    
    // Check if lease exists
    const [leases] = await connection.execute(
      'SELECT * FROM lease_contracts WHERE id = ?',
      [id]
    );
    
    if (leases.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Lease not found' });
    }
    
    // Check authorization (must be admin or lease owner)
    if (req.user.role !== 'ADMIN' && req.user.id !== leases[0].owner_id) {
      connection.release();
      return res.status(403).json({ message: 'Not authorized to delete this lease' });
    }
    
    // Delete lease
    await connection.execute(
      'DELETE FROM lease_contracts WHERE id = ?',
      [id]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'Lease deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting lease:', error);
    res.status(500).json({ message: 'Error deleting lease', error: error.message });
  }
});

module.exports = router;
