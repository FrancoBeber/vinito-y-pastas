const { Pool } = require('pg');
require('dotenv').config();

// Standard PostgreSQL configuration using DATABASE_URL or individual params
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/vinito_y_pastas'
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error al conectar a PostgreSQL:', err.stack);
  } else {
    console.log('Conectado a PostgreSQL exitosamente');
    release();
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
