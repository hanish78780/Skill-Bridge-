
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reviewee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: { // Optional: link to a specific project context
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent multiple reviews from same user to same user (optional, or per project)
// reviewSchema.index({ reviewer: 1, reviewee: 1 }, { unique: true });
// Better to scope it to a project if possible, but for now simple user-to-user is fine.

module.exports = mongoose.model('Review', reviewSchema);
