const router = require('express').Router();
const { authenticate, authorize } = require('../middleware/auth');
const ctrl = require('../controllers/admin.controller');

router.use(authenticate, authorize('admin'));

router.get('/dashboard', ctrl.getDashboard);
router.get('/users', ctrl.getUsers);
router.post('/users', ctrl.addUser);
router.get('/stores', ctrl.getStores);
router.post('/stores', ctrl.addStore);

module.exports = router;