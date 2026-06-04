const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getOwnerDashboard } = require('../controllers/user.controller');

router.use(authenticate);
router.get('/owner/dashboard', authorize('store_owner'), getOwnerDashboard);

module.exports = router;