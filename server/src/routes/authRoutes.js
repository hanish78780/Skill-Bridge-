const express = require('express');
const router = express.Router();
const passport = require('passport');
const { register, login, getMe, updateDetails, uploadAvatar } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
    passport.authenticate('google', { session: false, failureRedirect: '/login' }),
    (req, res) => {
        // Convert Mongoose document to plain object to access _id
        const user = req.user;

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });

        // Redirect to frontend with token
        res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/auth/success?token=${token}`);
    }
);

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
// Upload Avatar
const upload = require('../config/upload'); // Import multer config
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);
router.put('/updatedetails', protect, updateDetails);

module.exports = router;
