const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['project_invite', 'project_request', 'task_assigned', 'review_received', 'system'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    relatedLink: {
        type: String // e.g., '/projects/123'
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 30 // Auto-delete after 30 days
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
