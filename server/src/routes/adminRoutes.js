const express = require('express');
const router = express.Router();
const {
    getAdminStats,
    getAllUsers,
    updateUserStatus
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.use(protect); // Protect all routes
router.use(admin);   // Require Admin role for all routes

router.get('/stats', getAdminStats);
router.route('/users')
    .get(getAllUsers);

router.route('/users/:id')
    .put(updateUserStatus);

module.exports = router;
