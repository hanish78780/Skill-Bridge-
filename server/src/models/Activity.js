const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['task_created', 'task_updated', 'task_moved', 'task_completed', 'task_deleted', 'member_joined', 'member_removed', 'project_updated', 'comment_added', 'attachment_added']
    },
    details: {
        type: Object, // Flexible field to store metadata like task title, old/new status, etc.
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for efficient querying of project activities sorted by time
activitySchema.index({ project: 1, createdAt: -1 });

module.exports = mongoose.model('Activity', activitySchema);
