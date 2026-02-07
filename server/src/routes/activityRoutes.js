const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get activities for a project
// @route   GET /api/activities/project/:projectId
// @access  Private
router.get('/project/:projectId', protect, async (req, res) => {
    try {
        const activities = await Activity.find({ project: req.params.projectId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 })
            .limit(50); // Limit to last 50 activities for performance

        res.json(activities);
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ message: 'Server error fetching activities' });
    }
});

module.exports = router;
