const mongoose = require('mongoose');

const adminLogSchema = new mongoose.Schema({
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        uppercase: true // e.g., 'USER_BAN', 'PROJECT_SUSPEND'
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    targetModel: {
        type: String,
        required: true,
        enum: ['User', 'Project', 'Review', 'Report'] // Added 'Report'
    },
    reason: {
        type: String
    },
    details: {
        type: Object // Any extra metadata
    },
    ipAddress: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
