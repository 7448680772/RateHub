const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seed() {
  const hashed = await bcrypt.hash('Admin@123', 10);
  await pool.query(
    `INSERT INTO users (name, email, password, address, role)
     VALUES ($1, $2, $3, $4, 'admin')
     ON CONFLICT (email) DO NOTHING`,
    ['System Administrator', 'admin@ratehub.com', hashed, 'RateHub HQ, Chennai']
  );
  console.log('Admin seeded: admin@ratehub.com / Admin@123');
  process.exit();
}

seed();