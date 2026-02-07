const Project = require('../models/Project');

// Middleware to check if user has required role for a project
const checkProjectRole = (requiredRole) => {
    return async (req, res, next) => {
        try {
            const projectId = req.params.id || req.params.projectId;

            if (!projectId) {
                return res.status(400).json({ message: 'Project ID is required' });
            }

            const project = await Project.findById(projectId);

            if (!project) {
                return res.status(404).json({ message: 'Project not found' });
            }

            const userId = req.user.id;
            const isOwner = project.createdBy.toString() === userId;
            const isMember = project.assignedTo.some(id => id.toString() === userId);

            // Admin override
            if (req.user.role === 'admin') {
                req.project = project; // Attach project to req for controller use
                return next();
            }

            if (requiredRole === 'owner') {
                if (!isOwner) {
                    return res.status(403).json({ message: 'Not authorized. Project Owner role required.' });
                }
            } else if (requiredRole === 'member') {
                if (!isOwner && !isMember) {
                    return res.status(403).json({ message: 'Not authorized. Project Member role required.' });
                }
            }

            req.project = project; // Attach project to req for controller use
            next();
        } catch (error) {
            console.error('Role check error:', error);
            res.status(500).json({ message: 'Server error checking project role' });
        }
    };
};

module.exports = { checkProjectRole };
