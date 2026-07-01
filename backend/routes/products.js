const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'wine-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype.split('/')[1]);
    if (extOk && mimeOk) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten imágenes (jpg, png, webp, gif)'));
    }
  }
});

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

// GET /api/products/:id - Get single product
router.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ error: 'Error del servidor al obtener producto' });
  }
});

// GET /api/products/:id/reviews - Get reviews for a product
router.get('/products/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query(
      'SELECT * FROM reviews WHERE product_id = $1 ORDER BY created_at DESC',
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ error: 'Error del servidor al obtener reseñas' });
  }
});

// POST /api/products/:id/reviews - Create a review for a product
router.post('/products/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { author_name, rating, comment, user_id } = req.body;

    if (!author_name || !rating) {
      return res.status(400).json({ error: 'El nombre y la calificación son obligatorios' });
    }

    const { rows } = await db.query(
      `INSERT INTO reviews (product_id, user_id, author_name, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [id, user_id || null, author_name, rating, comment || null]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al guardar reseña:', error);
    res.status(500).json({ error: 'Error del servidor al guardar la reseña' });
  }
});

// POST /api/products - Create a new product (admin only)
router.post('/products', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, stock, category_id, image_url, winery } = req.body;

    if (!name || !price || stock === undefined || !category_id) {
      return res.status(400).json({ error: 'Por favor, completa los campos obligatorios (nombre, precio, stock, categoría)' });
    }

    // Use uploaded file path if present, otherwise use provided URL
    let finalImageUrl = image_url || null;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    const { rows } = await db.query(
      `INSERT INTO products (name, description, price, stock, category_id, image_url, winery)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, description || null, parseFloat(price), parseInt(stock), parseInt(category_id), finalImageUrl, winery || null]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error del servidor al crear producto' });
  }
});

// PUT /api/products/:id - Update a product (admin only)
router.put('/products/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category_id, image_url, winery } = req.body;

    if (!name || !price || stock === undefined || !category_id) {
      return res.status(400).json({ error: 'Por favor, completa los campos obligatorios' });
    }

    // Use uploaded file path if present, otherwise keep provided URL
    let finalImageUrl = image_url || null;
    if (req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }

    const { rows } = await db.query(
      `UPDATE products 
       SET name = $1, description = $2, price = $3, stock = $4, category_id = $5, image_url = $6, winery = $7
       WHERE id = $8
       RETURNING *`,
      [name, description || null, parseFloat(price), parseInt(stock), parseInt(category_id), finalImageUrl, winery || null, id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ error: 'Error del servidor al actualizar producto' });
  }
});

// DELETE /api/products/:id - Delete a product (admin only)
router.delete('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado correctamente', product: rows[0] });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ error: 'Error del servidor al eliminar producto' });
  }
});

// GET /api/admin/orders - Get all orders with details (admin only)
router.get('/admin/orders', async (req, res) => {
  try {
    const ordersResult = await db.query(`
      SELECT o.*, u.name as user_name, u.email as user_email
      FROM orders o
      JOIN users u ON o.user_id = u.id
      ORDER BY o.created_at DESC
    `);
    
    const orders = ordersResult.rows;
    
    // Fetch items for each order
    for (let order of orders) {
      const itemsResult = await db.query(`
        SELECT oi.*, p.name as product_name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
      `, [order.id]);
      order.items = itemsResult.rows;
    }
    
    res.json(orders);
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({ error: 'Error del servidor al obtener pedidos' });
  }
});

// PUT /api/admin/orders/:id/status - Update order status (admin only)
router.put('/admin/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: 'El estado es requerido' });
    }
    
    const { rows } = await db.query(`
      UPDATE orders
      SET status = $1, notes = COALESCE($2, notes), updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [status, notes || null, id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Pedido no encontrado' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    res.status(500).json({ error: 'Error del servidor al actualizar pedido' });
  }
});

module.exports = router;
