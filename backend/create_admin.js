const bcrypt = require('bcryptjs');
const db = require('./db');

async function createAdmin() {
  const name = 'Administrador Test';
  const email = 'admin@vinitoypastas.com';
  const plainPassword = 'admin';
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(plainPassword, salt);
  
  try {
    // Delete if already exists to allow rerunning
    await db.query('DELETE FROM users WHERE email = $1', [email]);
    
    // Insert with admin role
    const { rows } = await db.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, 'admin')
       RETURNING id, name, email, role`,
      [name, email, password]
    );
    console.log('SUCCESS: Admin user created successfully:', rows[0]);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin();
