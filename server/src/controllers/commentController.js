const Comment = require('../models/Comment');
const Project = require('../models/Project');

// @desc    Get comments for a project
// @route   GET /api/comments/project/:projectId
// @access  Private (Project members only)
exports.getProjectComments = async (req, res) => {
    try {
        const comments = await Comment.find({ project: req.params.projectId })
            .populate('author', 'name avatar')
            .sort({ createdAt: -1 }); // Newest first

        res.status(200).json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add a comment to a project
// @route   POST /api/comments
// @access  Private
exports.addComment = async (req, res) => {
    try {
        const { content, projectId } = req.body;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // internal check: Ensure user is member or owner (can be moved to middleware ideally, but doing here for safety)
        const isOwner = project.createdBy.toString() === req.user.id;
        const isMember = project.assignedTo.includes(req.user.id);

        if (!isOwner && !isMember) {
            return res.status(403).json({ message: 'Not authorized to comment on this project' });
        }

        const comment = await Comment.create({
            content,
            project: projectId,
            author: req.user.id
        });

        const populatedComment = await Comment.findById(comment._id).populate('author', 'name avatar');

        // Notification Logic
        const Notification = require('../models/Notification');
        const recipients = new Set();

        // Add owner if not the commenter
        if (project.createdBy.toString() !== req.user.id) {
            recipients.add(project.createdBy.toString());
        }

        // Add members if not the commenter
        project.assignedTo.forEach(memberId => {
            if (memberId.toString() !== req.user.id) {
                recipients.add(memberId.toString());
            }
        });

        // Create notifications
        const notificationPromises = Array.from(recipients).map(recipientId => {
            return Notification.create({
                recipient: recipientId,
                sender: req.user.id,
                type: 'new_comment',
                message: `New comment on ${project.title}: ${content.substring(0, 30)}${content.length > 30 ? '...' : ''}`,
                relatedLink: `/projects/${projectId}`
            });
        });

        await Promise.all(notificationPromises);

        res.status(201).json(populatedComment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Allow author or project owner to delete
        // We need to fetch project to check owner
        const project = await Project.findById(comment.project);

        const isAuthor = comment.author.toString() === req.user.id;
        const isProjectOwner = project && project.createdBy.toString() === req.user.id;

        if (!isAuthor && !isProjectOwner) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();

        res.status(200).json({ message: 'Comment deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
