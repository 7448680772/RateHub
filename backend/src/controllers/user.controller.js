const pool = require('../config/db');

exports.getOwnerDashboard = async (req, res) => {
  const store = await pool.query(
    `SELECT s.id, s.name, ROUND(AVG(r.rating), 1) as avg_rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id = s.id
     WHERE s.owner_id = $1
     GROUP BY s.id`,
    [req.user.id]
  );
  if (!store.rows[0]) return res.status(404).json({ message: 'No store found' });

  const raters = await pool.query(
    `SELECT u.name, u.email, r.rating
     FROM ratings r
     JOIN users u ON u.id = r.user_id
     WHERE r.store_id = $1`,
    [store.rows[0].id]
  );
  res.json({ store: store.rows[0], raters: raters.rows });
};