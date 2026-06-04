const pool = require('../config/db');
const bcrypt = require('bcryptjs');

exports.getDashboard = async (req, res) => {
  const users = await pool.query(`SELECT COUNT(*) FROM users WHERE role != 'admin'`);
  const stores = await pool.query('SELECT COUNT(*) FROM stores');
  const ratings = await pool.query('SELECT COUNT(*) FROM ratings');
  res.json({
    totalUsers: users.rows[0].count,
    totalStores: stores.rows[0].count,
    totalRatings: ratings.rows[0].count,
  });
};

exports.addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role`,
      [name, email, hashed, address, role]
    );
    // If store_owner, also create a store entry
    if (role === 'store_owner') {
      await pool.query(
        `INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4)`,
        [name, email, address, result.rows[0].id]
      );
    }
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ message: 'Email already exists' });
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUsers = async (req, res) => {
  const { name, email, address, role, sortBy = 'name', order = 'ASC' } = req.query;
  const allowed = ['name', 'email', 'address', 'role'];
  const sortCol = allowed.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order === 'DESC' ? 'DESC' : 'ASC';

  let query = `SELECT u.id, u.name, u.email, u.address, u.role,
    ROUND(AVG(r.rating), 1) as avg_rating
    FROM users u
    LEFT JOIN stores s ON s.owner_id = u.id
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1=1`;
  const params = [];
  let i = 1;
  if (name)    { query += ` AND u.name ILIKE $${i++}`;    params.push(`%${name}%`); }
  if (email)   { query += ` AND u.email ILIKE $${i++}`;   params.push(`%${email}%`); }
  if (address) { query += ` AND u.address ILIKE $${i++}`; params.push(`%${address}%`); }
  if (role)    { query += ` AND u.role = $${i++}`;         params.push(role); }

  query += ` GROUP BY u.id ORDER BY u.${sortCol} ${sortOrder}`;
  const result = await pool.query(query, params);
  res.json(result.rows);
};

exports.getStores = async (req, res) => {
  const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
  const allowed = ['name', 'email', 'address'];
  const sortCol = allowed.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order === 'DESC' ? 'DESC' : 'ASC';

  let query = `SELECT s.id, s.name, s.email, s.address,
    ROUND(AVG(r.rating), 1) as avg_rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1=1`;
  const params = [];
  let i = 1;
  if (name)    { query += ` AND s.name ILIKE $${i++}`;    params.push(`%${name}%`); }
  if (address) { query += ` AND s.address ILIKE $${i++}`; params.push(`%${address}%`); }

  query += ` GROUP BY s.id ORDER BY s.${sortCol} ${sortOrder}`;
  const result = await pool.query(query, params);
  res.json(result.rows);
};

exports.addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id) VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, email, address, owner_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ message: 'Store email already exists' });
    res.status(500).json({ message: 'Server error' });
  }
};