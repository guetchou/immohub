
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

// Get all payments (with role-based filtering)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    let query = `
      SELECT rp.*, 
             lc.monthly_rent, lc.property_id,
             p.title as property_title, p.address as property_address,
             u.full_name as tenant_name
      FROM rent_payments rp
      LEFT JOIN lease_contracts lc ON rp.contract_id = lc.id
      LEFT JOIN properties p ON lc.property_id = p.id
      LEFT JOIN users u ON rp.tenant_id = u.id
    `;
    
    // Filter by role
    const params = [];
    if (req.user.role === 'TENANT') {
      query += ' WHERE rp.tenant_id = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'LANDLORD') {
      query += ' WHERE lc.owner_id = ?';
      params.push(req.user.id);
    } else if (req.user.role !== 'ADMIN') {
      // Regular users can only see their related payments
      query += ' WHERE rp.tenant_id = ? OR lc.owner_id = ?';
      params.push(req.user.id, req.user.id);
    }
    
    query += ' ORDER BY rp.payment_date DESC';
    
    const [payments] = await connection.execute(query, params);
    connection.release();
    
    res.status(200).json({ payments });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Error fetching payments', error: error.message });
  }
});

// Get payment by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await dbPool.getConnection();
    const [payments] = await connection.execute(
      `SELECT rp.*, 
              lc.monthly_rent, lc.property_id, lc.owner_id,
              p.title as property_title, p.address as property_address,
              u.full_name as tenant_name, u.email as tenant_email
       FROM rent_payments rp
       LEFT JOIN lease_contracts lc ON rp.contract_id = lc.id
       LEFT JOIN properties p ON lc.property_id = p.id
       LEFT JOIN users u ON rp.tenant_id = u.id
       WHERE rp.id = ?`,
      [id]
    );
    
    if (payments.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    const payment = payments[0];
    
    // Check access rights
    if (req.user.role !== 'ADMIN' && 
        req.user.id !== payment.tenant_id && 
        req.user.id !== payment.owner_id) {
      connection.release();
      return res.status(403).json({ message: 'Not authorized to view this payment' });
    }
    
    connection.release();
    
    res.status(200).json({ payment });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Error fetching payment', error: error.message });
  }
});

// Create new payment
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { 
      contract_id, payment_date, amount, 
      payment_method, reference, note 
    } = req.body;
    
    // Validate required fields
    if (!contract_id || !payment_date || !amount) {
      return res.status(400).json({ 
        message: 'Contract, payment date, and amount are required' 
      });
    }
    
    const connection = await dbPool.getConnection();
    
    // Verify contract exists
    const [contracts] = await connection.execute(
      'SELECT * FROM lease_contracts WHERE id = ?',
      [contract_id]
    );
    
    if (contracts.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Lease contract not found' });
    }
    
    const contract = contracts[0];
    
    // For tenants, they can only pay for their own contracts
    if (req.user.role === 'TENANT' && req.user.id !== contract.tenant_id) {
      connection.release();
      return res.status(403).json({ message: 'Not authorized to make payment for this contract' });
    }
    
    // Insert payment
    const [result] = await connection.execute(
      `INSERT INTO rent_payments 
       (contract_id, tenant_id, payment_date, amount, payment_method, 
        reference, note, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
      [contract_id, contract.tenant_id, payment_date, amount, 
       payment_method, reference, note]
    );
    
    connection.release();
    
    res.status(201).json({
      message: 'Payment recorded successfully',
      payment: {
        id: result.insertId,
        contract_id,
        tenant_id: contract.tenant_id,
        amount,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
});

// Update payment status (requires authentication)
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, receipt_url, note } = req.body;
    
    const connection = await dbPool.getConnection();
    
    // Check if payment exists
    const [payments] = await connection.execute(
      `SELECT rp.*, lc.owner_id
       FROM rent_payments rp
       LEFT JOIN lease_contracts lc ON rp.contract_id = lc.id
       WHERE rp.id = ?`,
      [id]
    );
    
    if (payments.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    const payment = payments[0];
    
    // Only landlords, admins, or the paying tenant can update payment status
    if (req.user.role !== 'ADMIN' && 
        req.user.id !== payment.tenant_id && 
        req.user.id !== payment.owner_id) {
      connection.release();
      return res.status(403).json({ message: 'Not authorized to update this payment' });
    }
    
    // Tenants can only provide receipt, not change status
    if (req.user.role === 'TENANT' && status && status !== payment.status) {
      connection.release();
      return res.status(403).json({ message: 'Tenants cannot change payment status' });
    }
    
    // Update payment
    await connection.execute(
      `UPDATE rent_payments 
       SET status = ?, receipt_url = ?, note = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        status || payment.status, 
        receipt_url || payment.receipt_url, 
        note !== undefined ? note : payment.note, 
        id
      ]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'Payment updated successfully',
      payment: {
        id,
        status: status || payment.status
      }
    });
  } catch (error) {
    console.error('Error updating payment:', error);
    res.status(500).json({ message: 'Error updating payment', error: error.message });
  }
});

// Delete payment (admin only)
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only admin can delete payments
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Only administrators can delete payments' });
    }
    
    const connection = await dbPool.getConnection();
    
    // Check if payment exists
    const [payments] = await connection.execute(
      'SELECT * FROM rent_payments WHERE id = ?',
      [id]
    );
    
    if (payments.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Delete payment
    await connection.execute(
      'DELETE FROM rent_payments WHERE id = ?',
      [id]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ message: 'Error deleting payment', error: error.message });
  }
});

module.exports = router;
