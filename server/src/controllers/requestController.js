const Request = require('../models/Request');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const { getIo } = require('../socket/socket');

// @desc    Create a request to join a project
// @route   POST /api/requests
// @access  Private
const createRequest = async (req, res, next) => {
    try {
        const { projectId, message } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.createdBy.toString() === req.user.id) {
            return res.status(400).json({ message: 'You cannot join your own project' });
        }

        // Check if already requested
        const existingRequest = await Request.findOne({
            project: projectId,
            user: req.user.id
        });

        if (existingRequest) {
            return res.status(400).json({ message: 'You have already requested to join this project' });
        }

        const request = await Request.create({
            project: projectId,
            user: req.user.id,
            message
        });

        // Create Notification for Project Owner
        const notification = await Notification.create({
            recipient: project.createdBy,
            sender: req.user.id,
            type: 'project_request',
            message: `${req.user.name} requested to join "${project.title}"`,
            relatedLink: `/projects/${projectId}`
        });

        // Emit Socket Event
        try {
            const io = getIo();
            const recipientSocketId = io.getSocketId(project.createdBy.toString());
            if (recipientSocketId) {
                // Populate sender for realtime UI
                await notification.populate('sender', 'name avatar');
                io.to(recipientSocketId).emit('notification', notification);
            }
        } catch (socketError) {
            console.error('Socket emit error:', socketError);
        }

        res.status(201).json(request);
    } catch (error) {
        next(error);
    }
};

// @desc    Get requests for a project
// @route   GET /api/projects/:projectId/requests
// @access  Private (Project Owner)
const getProjectRequests = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Only owner can see requests
        if (project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view requests' });
        }

        const requests = await Request.find({ project: req.params.projectId })
            .populate('user', 'name email title skills');

        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};

// @desc    Update request status (Accept/Reject)
// @route   PUT /api/requests/:id
// @access  Private (Project Owner)
const updateRequestStatus = async (req, res, next) => {
    try {
        const { status } = req.body; // 'accepted' or 'rejected'

        const request = await Request.findById(req.params.id)
            .populate('project');

        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Verify owner
        if (request.project.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to manage this request' });
        }

        request.status = status;
        await request.save();

        // If accepted, add user to project team
        if (status === 'accepted') {
            const project = await Project.findById(request.project._id);
            if (!project.assignedTo.includes(request.user)) {
                project.assignedTo.push(request.user);
                await project.save();
            }

            // Notify User
            const notification = await Notification.create({
                recipient: request.user,
                sender: req.user.id,
                type: 'project_invite', // reusing type or create new 'request_accepted'
                message: `Your request to join "${project.title}" was accepted!`,
                relatedLink: `/projects/${project._id}`
            });

            // Emit Socket Event
            try {
                const io = getIo();
                const recipientSocketId = io.getSocketId(request.user.toString());
                if (recipientSocketId) {
                    await notification.populate('sender', 'name avatar');
                    io.to(recipientSocketId).emit('notification', notification);
                }
            } catch (socketError) {
                console.error('Socket emit error:', socketError);
            }
        }

        res.status(200).json(request);
    } catch (error) {
        next(error);
    }
};

// @desc    Get my requests (User)
// @route   GET /api/requests/me
// @access  Private
const getMyRequests = async (req, res, next) => {
    try {
        const requests = await Request.find({ user: req.user.id })
            .populate('project', 'title status');
        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createRequest,
    getProjectRequests,
    updateRequestStatus,
    getMyRequests
};
