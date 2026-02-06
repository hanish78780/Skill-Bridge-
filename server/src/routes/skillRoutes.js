const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');

// @desc    Get all standardized skills
// @route   GET /api/skills
// @access  Public
router.get('/', async (req, res, next) => {
    try {
        const skills = await Skill.find({ approved: true }).select('name category').sort({ popularity: -1, name: 1 });
        res.json(skills);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
