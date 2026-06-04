const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const { getAllStores, submitRating } = require('../controllers/store.controller');

router.use(authenticate);
router.get('/', authorize('user'), getAllStores);
router.post('/rate', authorize('user'), submitRating);

module.exports = router;