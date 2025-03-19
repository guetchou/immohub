
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

// Get all maintenance requests (with role-based filtering)
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    let query = `
      SELECT mr.*, 
             p.title as property_title, p.address as property_address,
             u1.full_name as tenant_name, 
             u2.full_name as owner_name
      FROM maintenance_requests mr
      LEFT JOIN properties p ON mr.property_id = p.id
      LEFT JOIN users u1 ON mr.tenant_id = u1.id
      LEFT JOIN users u2 ON mr.owner_id = u2.id
    `;
    
    // Filter by role
    const params = [];
    if (req.user.role === 'TENANT') {
      query += ' WHERE mr.tenant_id = ?';
      params.push(req.user.id);
    } else if (req.user.role === 'LANDLORD') {
      query += ' WHERE mr.owner_id = ?';
      params.push(req.user.id);
    } else if (req.user.role !== 'ADMIN') {
      // Regular users can only see their requests
      query += ' WHERE mr.tenant_id = ? OR mr.owner_id = ?';
      params.push(req.user.id, req.user.id);
    }
    
    // Add status filter if provided
    if (req.query.status) {
      if (params.length > 0) {
        query += ' AND mr.status = ?';
      } else {
        query += ' WHERE mr.status = ?';
      }
      params.push(req.query.status);
    }
    
    // Add priority filter if provided
    if (req.query.priority) {
      if (params.length > 0) {
        query += ' AND mr.priority = ?';
      } else {
        query += ' WHERE mr.priority = ?';
      }
      params.push(req.query.priority);
    }
    
    query += ' ORDER BY FIELD(mr.priority, "emergency", "high", "medium", "low"), mr.submitted_date DESC';
    
    const [requests] = await connection.execute(query, params);
    connection.release();
    
    res.status(200).json({ requests });
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({ message: 'Error fetching maintenance requests', error: error.message });
  }
});

// Get maintenance request by ID
router.get('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await dbPool.getConnection();
    const [requests] = await connection.execute(
      `SELECT mr.*, 
              p.title as property_title, p.address as property_address, p.city as property_city,
              u1.full_name as tenant_name, u1.email as tenant_email, u1.phone as tenant_phone,
              u2.full_name as owner_name, u2.email as owner_email, u2.phone as owner_phone
       FROM maintenance_requests mr
       LEFT JOIN properties p ON mr.property_id = p.id
       LEFT JOIN users u1 ON mr.tenant_id = u1.id
       LEFT JOIN users u2 ON mr.owner_id = u2.id
       WHERE mr.id = ?`,
      [id]
    );
    
    if (requests.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    
    const request = requests[0];
    
    // Check access rights
    if (req.user.role !== 'ADMIN' && 
        req.user.id !== request.tenant_id && 
        req.user.id !== request.owner_id) {
      connection.release();
      return res.status(403).json({ message: 'Not authorized to view this maintenance request' });
    }
    
    connection.release();
    
    res.status(200).json({ request });
  } catch (error) {
    console.error('Error fetching maintenance request:', error);
    res.status(500).json({ message: 'Error fetching maintenance request', error: error.message });
  }
});

// Create new maintenance request
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { 
      property_id, title, description, 
      location, priority = 'medium' 
    } = req.body;
    
    // Validate required fields
    if (!property_id || !title || !description || !location) {
      return res.status(400).json({ 
        message: 'Property, title, description, and location are required' 
      });
    }
    
    const connection = await dbPool.getConnection();
    
    // Verify property exists
    const [properties] = await connection.execute(
      'SELECT * FROM properties WHERE id = ?',
      [property_id]
    );
    
    if (properties.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Check if the user is related to this property (tenant or owner)
    const [leases] = await connection.execute(
      `SELECT * FROM lease_contracts 
       WHERE property_id = ? AND 
       (tenant_id = ? OR owner_id = ?) AND 
       status = 'active'`,
      [property_id, req.user.id, req.user.id]
    );
    
    // Only tenants with active leases or property owners can create maintenance requests
    if (req.user.role !== 'ADMIN' && leases.length === 0) {
      connection.release();
      return res.status(403).json({ 
        message: 'Not authorized to create maintenance request for this property' 
      });
    }
    
    // Set tenant_id and owner_id based on the lease
    let tenant_id = req.user.id;
    let owner_id = properties[0].owner_id;
    
    if (req.user.role === 'LANDLORD') {
      tenant_id = leases[0].tenant_id;
    }
    
    // Insert maintenance request
    const [result] = await connection.execute(
      `INSERT INTO maintenance_requests 
       (property_id, tenant_id, owner_id, title, description, 
        location, priority, status, submitted_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW(), NOW())`,
      [property_id, tenant_id, owner_id, title, description, 
       location, priority]
    );
    
    connection.release();
    
    res.status(201).json({
      message: 'Maintenance request created successfully',
      request: {
        id: result.insertId,
        property_id,
        tenant_id,
        owner_id,
        title,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    res.status(500).json({ message: 'Error creating maintenance request', error: error.message });
  }
});

// Update maintenance request
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, description } = req.body;
    
    const connection = await dbPool.getConnection();
    
    // Check if maintenance request exists
    const [requests] = await connection.execute(
      `SELECT * FROM maintenance_requests WHERE id = ?`,
      [id]
    );
    
    if (requests.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Maintenance request not found' });
    }
    
    const request = requests[0];
    
    // Check authorization (must be related to the request)
    if (req.user.role !== 'ADMIN' && 
        req.user.id !== request.tenant_id && 
        req.user.id !== request.owner_id) {
      connection.release();
      return res.status(403).json({ 
        message: 'Not authorized to update this maintenance request' 
      });
    }
    
    // Tenants can only update priority and description
    if (req.user.role === 'TENANT' && status && status !== request.status) {
      connection.release();
      return res.status(403).json({ 
        message: 'Tenants cannot change the status of maintenance requests' 
      });
    }
    
    // Update resolved_date if status is changing to resolved
    let resolved_date = request.resolved_date;
    if (status === 'resolved' && request.status !== 'resolved') {
      resolved_date = new Date();
    }
    
    // Update maintenance request
    await connection.execute(
      `UPDATE maintenance_requests 
       SET status = ?, priority = ?, description = ?, 
           resolved_date = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        status || request.status, 
        priority || request.priority, 
        description !== undefined ? description : request.description, 
        status === 'resolved' ? resolved_date : request.resolved_date, 
        id
      ]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'Maintenance request updated successfully',
      request: {
        id,
        status: status || request.status,
        priority: priority || request.priority
      }
    });
  } catch (error) {
    console.error('Error updating maintenance request:', error);
    res.status(500).json({ message: 'Error updating maintenance request', error: error.message });
  }
});

// Delete maintenance request (admin only)
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Only admin or the request creator can delete
    if (req.user.role !== 'ADMIN') {
      const connection = await dbPool.getConnection();
      const [requests] = await connection.execute(
        'SELECT * FROM maintenance_requests WHERE id = ?',
        [id]
      );
      
      if (requests.length === 0) {
        connection.release();
        return res.status(404).json({ message: 'Maintenance request not found' });
      }
      
      // Check if user is the creator
      if (req.user.id !== requests[0].tenant_id) {
        connection.release();
        return res.status(403).json({ 
          message: 'Only the creator or admin can delete maintenance requests' 
        });
      }
      
      connection.release();
    }
    
    const connection = await dbPool.getConnection();
    
    // Delete maintenance request
    await connection.execute(
      'DELETE FROM maintenance_requests WHERE id = ?',
      [id]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'Maintenance request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting maintenance request:', error);
    res.status(500).json({ message: 'Error deleting maintenance request', error: error.message });
  }
});

module.exports = router;
