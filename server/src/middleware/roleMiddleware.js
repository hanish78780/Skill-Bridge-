const Project = require('../models/Project');

// Middleware to check if user has specific system role (admin, moderator)
exports.checkRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user.role} is not authorized to access this route`
            });
        }
        next();
    };
};

// Middleware to check project-specific roles (owner, member)
exports.checkProjectRole = (role) => {
    return async (req, res, next) => {
        try {
            const projectId = req.params.id || req.body.projectId;

            if (!projectId) {
                return res.status(400).json({ message: 'Project ID is required' });
            }

            const project = await Project.findById(projectId);

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            // Check if user is owner
            if (role === 'owner') {
                if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
                    return res.status(403).json({ message: 'Not authorized. Only project owner can perform this action' });
                }
            }

            // Check if user is member (or owner)
            if (role === 'member') {
                const isMember = project.assignedTo.includes(req.user.id);
                const isOwner = project.createdBy.toString() === req.user.id;

                if (!isMember && !isOwner && req.user.role !== 'admin') {
                    return res.status(403).json({ message: 'Not authorized. You must be a project member.' });
                }
            }

            // Check if user is reviewee (for reviews) - specific logic can be added here if needed

            next();
        } catch (error) {
            console.error('Role middleware error:', error);
            res.status(500).json({ message: 'Server error checking roles' });
        }
    };
};
