const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/products - Get all products with filters
router.get('/products', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, winery, search } = req.query;
    
    let queryText = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramIndex = 1;

    // Filter by Category name or ID
    if (category) {
      if (isNaN(category)) {
        queryText += ` AND c.name = $${paramIndex}`;
      } else {
        queryText += ` AND p.category_id = $${paramIndex}`;
      }
      queryParams.push(category);
      paramIndex++;
    }

    // Filter by Min Price
    if (minPrice) {
      queryText += ` AND p.price >= $${paramIndex}`;
      queryParams.push(parseFloat(minPrice));
      paramIndex++;
    }

    // Filter by Max Price
    if (maxPrice) {
      queryText += ` AND p.price <= $${paramIndex}`;
      queryParams.push(parseFloat(maxPrice));
      paramIndex++;
    }

    // Filter by Winery (bodega)
    if (winery) {
      queryText += ` AND p.winery ILIKE $${paramIndex}`;
      queryParams.push(`%${winery}%`);
      paramIndex++;
    }

    // Search query (name or description)
    if (search) {
      queryText += ` AND (p.name ILIKE $${paramIndex} OR p.description ILIKE $${paramIndex})`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // Order by created_at desc
    queryText += ` ORDER BY p.created_at DESC`;

    const { rows } = await db.query(queryText, queryParams);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ error: 'Error del servidor al obtener productos' });
  }
});

// GET /api/categories - Get all categories
router.get('/categories', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error del servidor al obtener categorías' });
  }
});

// GET /api/wineries - Get list of unique wineries for filter options
router.get('/wineries', async (req, res) => {
  try {
    const { rows } = await db.query('SELECT DISTINCT winery FROM products WHERE winery IS NOT NULL ORDER BY winery ASC');
    res.json(rows.map(r => r.winery));
  } catch (error) {
    console.error('Error al obtener bodegas:', error);
    res.status(500).json({ error: 'Error del servidor al obtener bodegas' });
  }
});

module.exports = router;
