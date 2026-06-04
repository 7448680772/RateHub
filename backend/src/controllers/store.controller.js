const pool = require('../config/db');

exports.getAllStores = async (req, res) => {
  const { name, address, sortBy = 'name', order = 'ASC' } = req.query;
  const allowed = ['name', 'address'];
  const sortCol = allowed.includes(sortBy) ? sortBy : 'name';
  const sortOrder = order === 'DESC' ? 'DESC' : 'ASC';

  let query = `SELECT s.id, s.name, s.address,
    ROUND(AVG(r.rating), 1) as avg_rating,
    MAX(CASE WHEN r.user_id = $1 THEN r.rating END) as user_rating
    FROM stores s
    LEFT JOIN ratings r ON r.store_id = s.id
    WHERE 1=1`;
  const params = [req.user.id];
  let i = 2;
  if (name)    { query += ` AND s.name ILIKE $${i++}`;    params.push(`%${name}%`); }
  if (address) { query += ` AND s.address ILIKE $${i++}`; params.push(`%${address}%`); }
  query += ` GROUP BY s.id ORDER BY s.${sortCol} ${sortOrder}`;

  const result = await pool.query(query, params);
  res.json(result.rows);
};

exports.submitRating = async (req, res) => {
  const { store_id, rating } = req.body;
  try {
    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id) DO UPDATE SET rating = $3`,
      [req.user.id, store_id, rating]
    );
    res.json({ message: 'Rating submitted' });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};