
const User = require('../models/User');

// @desc    Search users by skill, name, or availability
// @route   GET /api/users/search
// @access  Public
exports.searchUsers = async (req, res) => {
    try {
        const { query, availability } = req.query;
        let searchCriteria = {};

        // Search by skill or name
        if (query) {
            searchCriteria.$or = [
                { 'skills.name': { $regex: query, $options: 'i' } }, // Uses compound index on skills.name
                { name: { $regex: query, $options: 'i' } },
                { title: { $regex: query, $options: 'i' } }
            ];
        }

        // Filter by availability
        if (availability) {
            searchCriteria.availabilityStatus = availability; // Uses compound index on availabilityStatus
        }

        // Execute query with projection (exclude sensitive data)
        const users = await User.find(searchCriteria)
            .select('name title avatar skills availabilityStatus bio')
            .limit(20); // Limit results for performance

        res.status(200).json({
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password -googleId -email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
