const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a project title']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    status: {
        type: String,
        enum: ['draft', 'pending', 'active', 'completed', 'suspended'],
        default: 'pending'
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    adminFlagged: {
        type: Boolean,
        default: false
    },
    deadline: {
        type: Date
    },
    requiredSkills: [{
        type: String
    }],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate'
    },
    duration: {
        type: String,
        enum: ['short', 'medium', 'long'],
        default: 'medium'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assignedTo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tasks: [{
        id: String,
        content: String,
        description: String,
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'done'],
            default: 'todo'
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium'
        },
        dueDate: Date,
        tags: [String],
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: [{
            text: String,
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        attachments: [{
            name: String,
            url: String,
            type: String
        }]
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Project', projectSchema);
