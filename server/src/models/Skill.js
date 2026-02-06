const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    category: {
        type: String, // e.g., 'Frontend', 'Backend', 'DevOps', 'Language'
        enum: ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile', 'Data Science', 'Design', 'Language', 'Other'],
        default: 'Other'
    },
    popularity: {
        type: Number,
        default: 0
    },
    approved: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Skill', skillSchema);
