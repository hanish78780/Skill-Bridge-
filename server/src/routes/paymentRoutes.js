const express = require('express');
const { checkout, paymentVerification, getApiKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/checkout', protect, checkout);
router.post('/paymentverification', protect, paymentVerification);
router.get('/getkey', protect, getApiKey);

module.exports = router;
