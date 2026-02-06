const User = require('../models/User');
const Project = require('../models/Project');
const Report = require('../models/Report');
const AdminLog = require('../models/AdminLog');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });
        const totalProjects = await Project.countDocuments();
        const pendingReports = await Report.countDocuments({ status: 'pending' });

        // Recent Activity (User signups)
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email createdAt status');

        res.status(200).json({
            counts: {
                totalUsers,
                activeUsers,
                totalProjects,
                pendingReports
            },
            recentUsers
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get All Users (Paginated)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        const count = await User.countDocuments({ ...keyword });
        const users = await User.find({ ...keyword })
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .select('-password');

        res.json({ users, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        next(error);
    }
};

// @desc    Update User Status (Ban/Suspend/Verify)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserStatus = async (req, res, next) => {
    try {
        const { status, role, isVerified } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Log the action
        await AdminLog.create({
            admin: req.user.id,
            action: 'UPDATE_USER',
            targetId: user._id,
            targetModel: 'User',
            details: { previous: { status: user.status, role: user.role }, new: { status, role } },
            ipAddress: req.ip
        });

        if (status) user.status = status;
        if (role) user.role = role;
        if (isVerified !== undefined) user.isVerified = isVerified;

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdminStats,
    getAllUsers,
    updateUserStatus
};
