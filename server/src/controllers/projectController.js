const Project = require('../models/Project');
const User = require('../models/User');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');
const { getIo } = require('../socket/socket');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        // Check if user has sufficient credits
        if (!user.projectCredits || user.projectCredits < 1) {
            return res.status(403).json({
                message: 'Insufficient credits to create a project. Please purchase credits.',
                code: 'PAYMENT_REQUIRED'
            });
        }

        const project = await Project.create({
            ...req.body,
            createdBy: req.user.id
        });

        // Deduct credit
        user.projectCredits -= 1;
        await user.save();

        res.status(201).json(project);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
    try {
        const projects = await Project.find().populate('createdBy', 'name email');
        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's projects (Created or Member)
// @route   GET /api/projects/my
// @access  Private
const getMyProjects = async (req, res, next) => {
    try {
        const projects = await Project.find({
            $or: [
                { createdBy: req.user.id },
                { assignedTo: req.user.id }
            ]
        })
            .populate('createdBy', 'name avatar')
            .populate('assignedTo', 'name avatar') // useful to see team
            .sort({ updatedAt: -1 });

        res.status(200).json(projects);
    } catch (error) {
        next(error);
    }
};

// @desc    Get Recommended Projects based on User Skills
// @route   GET /api/projects/recommended
// @access  Private
const getRecommendedProjects = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        let projects = [];
        let userSkillNames = [];

        if (user && user.skills && user.skills.length > 0) {
            userSkillNames = user.skills.map(s => s.name);

            // 1. Try finding by skills
            projects = await Project.find({
                status: 'active',
                createdBy: { $ne: req.user.id },
                requiredSkills: { $in: userSkillNames }
            })
                .populate('createdBy', 'name avatar')
                .limit(5);
        }

        // 2. Fallback: If no skill matches or no skills, get recent active projects
        if (projects.length === 0) {
            projects = await Project.find({
                status: 'active',
                createdBy: { $ne: req.user.id }
            })
                .populate('createdBy', 'name avatar')
                .sort({ createdAt: -1 })
                .limit(5);
        }

        // Calculate match score
        const rankedProjects = projects.map(project => {
            const matchCount = project.requiredSkills ? project.requiredSkills.filter(skill => userSkillNames.includes(skill)).length : 0;
            const totalRequired = project.requiredSkills ? project.requiredSkills.length : 1;
            const matchScore = Math.round((matchCount / totalRequired) * 100);

            return {
                ...project.toObject(),
                matchScore
            };
        }).sort((a, b) => b.matchScore - a.matchScore);

        res.json(rankedProjects);
    } catch (error) {
        next(error);
    }
};

// @desc    Get dashboard stats
// @route   GET /api/projects/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
    try {
        const activeProjects = await Project.countDocuments({
            createdBy: req.user.id,
            status: 'active'
        });

        const completedProjects = await Project.countDocuments({
            createdBy: req.user.id,
            status: 'completed'
        });

        // Count pending tasks across all projects created by user
        const projects = await Project.find({ createdBy: req.user.id });
        let pendingTasks = 0;
        projects.forEach(project => {
            pendingTasks += project.tasks.filter(task => task.status === 'todo').length;
        });

        res.json({
            activeProjects,
            completedProjects,
            pendingTasks
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
const getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('createdBy', 'name email avatar')
            .populate('assignedTo', 'name email avatar')
            .populate('tasks.assignedTo', 'name avatar');

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check ownership or admin
        if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update this project' });
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Log Activity if members changed
        // This is a simplified check; deeper diffing might be needed for perfect accuracy
        if (req.body.assignedTo) {
            await Activity.create({
                project: project._id,
                user: req.user.id,
                action: 'project_updated',
                details: {
                    changes: 'Members updated'
                }
            });
        }

        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this project' });
        }

        await project.deleteOne();

        res.status(200).json({ message: 'Project removed' });
    } catch (error) {
        next(error);
    }
};



// @desc    Add task to project
// @route   POST /api/projects/:id/tasks
// @access  Private
const addTask = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if user is part of the project (creator or accessing member)
        // For simplicity, allowing any authenticated user to add tasks for now, 
        // ideally should check against assignedTo or createdBy

        const newTask = {
            id: req.body.id,
            content: req.body.content,
            status: 'todo',
            assignedTo: req.user.id
        };

        project.tasks.push(newTask);
        await project.save();

        // Log Activity
        await Activity.create({
            project: project._id,
            user: req.user.id,
            action: 'task_created',
            details: {
                taskId: newTask.id,
                taskContent: newTask.content
            }
        });

        // Notify Assignee (if not self)
        if (newTask.assignedTo && newTask.assignedTo.toString() !== req.user.id) {
            const notification = await Notification.create({
                recipient: newTask.assignedTo,
                sender: req.user.id,
                type: 'task_assigned',
                message: `${req.user.name} assigned you a task: "${newTask.content.substring(0, 30)}${newTask.content.length > 30 ? '...' : ''}"`,
                relatedLink: `/projects/${project._id}`
            });

            // Emit Socket Event
            try {
                const io = getIo();
                const recipientSocketId = io.getSocketId(newTask.assignedTo.toString());
                if (recipientSocketId) {
                    await notification.populate('sender', 'name avatar');
                    io.to(recipientSocketId).emit('notification', notification);
                }
            } catch (socketError) {
                console.error('Socket emit error:', socketError);
            }
        }

        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

// @desc    Update task details (status, content, priority, etc.)
// @route   PUT /api/projects/:id/tasks/:taskId
// @access  Private
const updateTask = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const taskIndex = project.tasks.findIndex(t => t.id === req.params.taskId);

        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update task fields if provided
        const task = project.tasks[taskIndex];
        if (req.body.content) task.content = req.body.content;
        if (req.body.description !== undefined) task.description = req.body.description;
        if (req.body.status) task.status = req.body.status;
        if (req.body.priority) task.priority = req.body.priority;
        if (req.body.dueDate) task.dueDate = req.body.dueDate;
        if (req.body.assignedTo) task.assignedTo = req.body.assignedTo;
        if (req.body.comments) task.comments = req.body.comments;
        if (req.body.attachments) task.attachments = req.body.attachments;

        // Ensure changes are marked for Mongoose
        project.markModified('tasks');

        await project.save();

        // Log Activity
        let action = 'task_updated';
        if (req.body.status && req.body.status !== task.status) action = 'task_moved';
        if (req.body.status === 'done') action = 'task_completed';

        await Activity.create({
            project: project._id,
            user: req.user.id,
            action: action,
            details: {
                taskId: task.id,
                taskContent: task.content,
                changes: req.body
            }
        });

        // NOTIFICATIONS
        const io = getIo();

        // 1. Task Re-assigned
        if (req.body.assignedTo && req.body.assignedTo !== task.assignedTo?.toString() && req.body.assignedTo !== req.user.id) {
            const notification = await Notification.create({
                recipient: req.body.assignedTo,
                sender: req.user.id,
                type: 'task_assigned',
                message: `${req.user.name} assigned you a task: "${task.content.substring(0, 30)}..."`,
                relatedLink: `/projects/${project._id}`
            });

            try {
                const recipientSocketId = io.getSocketId(req.body.assignedTo.toString());
                if (recipientSocketId) {
                    await notification.populate('sender', 'name avatar');
                    io.to(recipientSocketId).emit('notification', notification);
                }
            } catch (err) { console.error(err); }
        }

        // 2. Task Completed (Notify Owner if not self)
        if (req.body.status === 'done' && project.createdBy.toString() !== req.user.id) {
            const notification = await Notification.create({
                recipient: project.createdBy,
                sender: req.user.id,
                type: 'system', // or create new 'task_completed' type
                message: `${req.user.name} completed a task in "${project.title}"`,
                relatedLink: `/projects/${project._id}`
            });

            try {
                const ownerSocketId = io.getSocketId(project.createdBy.toString());
                if (ownerSocketId) {
                    await notification.populate('sender', 'name avatar');
                    io.to(ownerSocketId).emit('notification', notification);
                }
            } catch (err) { console.error(err); }
        }

        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    getRecommendedProjects,
    getDashboardStats,
    getMyProjects
};
