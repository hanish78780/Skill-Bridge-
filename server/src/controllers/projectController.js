const Project = require('../models/Project');
const User = require('../models/User');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
    try {
        const project = await Project.create({
            ...req.body,
            createdBy: req.user.id
        });
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

// @desc    Get Recommended Projects based on User Skills
// @route   GET /api/projects/recommended
// @access  Private
const getRecommendedProjects = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user || !user.skills || user.skills.length === 0) {
            return res.json([]);
        }

        const userSkillNames = user.skills.map(s => s.name);

        const projects = await Project.find({
            status: 'active',
            createdBy: { $ne: req.user.id },
            requiredSkills: { $in: userSkillNames }
        })
            .populate('createdBy', 'name avatar')
            .limit(5);

        const rankedProjects = projects.sort((a, b) => {
            const aMatches = a.requiredSkills.filter(skill => userSkillNames.includes(skill)).length;
            const bMatches = b.requiredSkills.filter(skill => userSkillNames.includes(skill)).length;
            return bMatches - aMatches;
        });

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

        res.status(200).json(project);
    } catch (error) {
        next(error);
    }
};

// @desc    Update task status
// @route   PUT /api/projects/:id/tasks/:taskId
// @access  Private
const updateTaskStatus = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const task = project.tasks.find(t => t.id === req.params.taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.status = req.body.status;
        await project.save();

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
    updateTaskStatus,
    getRecommendedProjects,
    getDashboardStats
};
