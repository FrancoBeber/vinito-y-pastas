const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'vinitoypastassecretkey123';

// POST /api/auth/register - Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Por favor completa todos los campos obligatorios' });
    }

    // Check if user already exists
    const userExistQuery = 'SELECT * FROM users WHERE email = $1';
    const { rows: existingUsers } = await db.query(userExistQuery, [email.toLowerCase().trim()]);

    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Ya existe una cuenta con este correo electrónico' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user (role defaults to 'customer')
    const insertQuery = `
      INSERT INTO users (name, email, password, phone)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email, phone, role, created_at
    `;
    const { rows: insertedRows } = await db.query(insertQuery, [
      name.trim(),
      email.toLowerCase().trim(),
      hashedPassword,
      phone ? phone.trim() : null
    ]);

    const user = insertedRows[0];

    // Create JWT Token (include role)
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor al registrarse' });
  }
});

// POST /api/auth/login - User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Por favor ingresa tu email y contraseña' });
    }

    // Find user in DB
    const findQuery = 'SELECT * FROM users WHERE email = $1';
    const { rows: users } = await db.query(findQuery, [email.toLowerCase().trim()]);

    if (users.length === 0) {
      return res.status(400).json({ error: 'Credenciales inválidas (email o contraseña incorrectos)' });
    }

    const user = users[0];

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas (email o contraseña incorrectos)' });
    }

    // Create JWT Token (include role)
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor al iniciar sesión' });
  }
});

module.exports = router;
