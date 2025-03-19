
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

// Get all properties
router.get('/', async (req, res) => {
  try {
    const connection = await dbPool.getConnection();
    const [properties] = await connection.execute(
      `SELECT p.*, pt.name as type_name 
       FROM properties p 
       LEFT JOIN property_types pt ON p.type_id = pt.id
       WHERE p.status = 'available'
       ORDER BY p.created_at DESC`
    );
    
    connection.release();
    
    res.status(200).json({ properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties', error: error.message });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await dbPool.getConnection();
    const [properties] = await connection.execute(
      `SELECT p.*, pt.name as type_name 
       FROM properties p 
       LEFT JOIN property_types pt ON p.type_id = pt.id
       WHERE p.id = ?`,
      [id]
    );
    
    if (properties.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Get property prices
    const [prices] = await connection.execute(
      `SELECT * FROM property_prices WHERE property_id = ?`,
      [id]
    );
    
    // Get property features
    const [features] = await connection.execute(
      `SELECT * FROM property_features WHERE property_id = ?`,
      [id]
    );
    
    connection.release();
    
    const property = properties[0];
    property.prices = prices;
    property.features = features;
    
    res.status(200).json({ property });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Error fetching property', error: error.message });
  }
});

// Create new property (requires authentication)
router.post('/', authenticateJWT, async (req, res) => {
  try {
    const { 
      title, description, address, city, type_id, 
      surface_area, bedrooms, bathrooms, image_url,
      status = 'available', country = 'Congo' 
    } = req.body;
    
    // Validate required fields
    if (!title || !address || !city) {
      return res.status(400).json({ message: 'Title, address, and city are required' });
    }
    
    const connection = await dbPool.getConnection();
    
    // Insert property
    const [result] = await connection.execute(
      `INSERT INTO properties 
       (title, description, address, city, type_id, surface_area, bedrooms, 
        bathrooms, image_url, status, country, owner_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, description, address, city, type_id, surface_area, bedrooms, 
       bathrooms, image_url, status, country, req.user.id]
    );
    
    connection.release();
    
    res.status(201).json({
      message: 'Property created successfully',
      property: {
        id: result.insertId,
        title,
        address,
        city,
        owner_id: req.user.id
      }
    });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Error creating property', error: error.message });
  }
});

// Update property (requires authentication)
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      title, description, address, city, type_id, 
      surface_area, bedrooms, bathrooms, image_url, status 
    } = req.body;
    
    const connection = await dbPool.getConnection();
    
    // Check if property exists and belongs to the user
    const [properties] = await connection.execute(
      `SELECT * FROM properties WHERE id = ?`,
      [id]
    );
    
    if (properties.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Property not found' });
    }
    
    const property = properties[0];
    
    // Check ownership unless user is admin
    if (property.owner_id !== req.user.id && req.user.role !== 'ADMIN') {
      connection.release();
      return res.status(403).json({ message: 'Not authorized to update this property' });
    }
    
    // Update property
    await connection.execute(
      `UPDATE properties 
       SET title = ?, description = ?, address = ?, city = ?, type_id = ?,
           surface_area = ?, bedrooms = ?, bathrooms = ?, image_url = ?, 
           status = ?, updated_at = NOW()
       WHERE id = ?`,
      [title || property.title, 
       description || property.description, 
       address || property.address, 
       city || property.city, 
       type_id || property.type_id,
       surface_area || property.surface_area, 
       bedrooms || property.bedrooms, 
       bathrooms || property.bathrooms, 
       image_url || property.image_url, 
       status || property.status, 
       id]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'Property updated successfully',
      property: {
        id,
        title: title || property.title,
        status: status || property.status
      }
    });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ message: 'Error updating property', error: error.message });
  }
});

// Delete property (requires authentication)
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await dbPool.getConnection();
    
    // Check if property exists and belongs to the user
    const [properties] = await connection.execute(
      `SELECT * FROM properties WHERE id = ?`,
      [id]
    );
    
    if (properties.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Property not found' });
    }
    
    const property = properties[0];
    
    // Check ownership unless user is admin
    if (property.owner_id !== req.user.id && req.user.role !== 'ADMIN') {
      connection.release();
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }
    
    // Delete property
    await connection.execute(
      `DELETE FROM properties WHERE id = ?`,
      [id]
    );
    
    connection.release();
    
    res.status(200).json({
      message: 'Property deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Error deleting property', error: error.message });
  }
});

module.exports = router;
