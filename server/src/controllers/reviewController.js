
const Project = require('../models/Project');
const Review = require('../models/Review');
const User = require('../models/User');

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
exports.addReview = async (req, res) => {
    try {
        const { revieweeId, rating, comment, projectId } = req.body;

        if (req.user.id === revieweeId) {
            return res.status(400).json({ message: 'You cannot review yourself' });
        }

        // Validate Project Constraints
        if (projectId) {
            const project = await Project.findById(projectId);
            if (!project) {
                return res.status(404).json({ message: 'Project context not found' });
            }

            if (project.status !== 'completed') {
                return res.status(400).json({ message: 'You can only review after the project is completed' });
            }

            // Verify participation
            const isCreator = project.createdBy.toString() === req.user.id;
            const isAssigned = project.assignedTo.includes(req.user.id);

            const isRevieweeCreator = project.createdBy.toString() === revieweeId;
            const isRevieweeAssigned = project.assignedTo.includes(revieweeId);

            if (!((isCreator && isRevieweeAssigned) || (isAssigned && isRevieweeCreator))) {
                return res.status(403).json({ message: 'You must be collaborators on this project to review' });
            }
        } else {
            // For now, require project context for "Verified" reviews
            // Or allow open reviews but mark them differently? 
            // Let's enforce it for the "Resume Logic" to be strong.
            return res.status(400).json({ message: 'Review must be associated with a completed project' });
        }

        // Check if user exists

        // Check if user exists
        const reviewee = await User.findById(revieweeId);
        if (!reviewee) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create review
        const review = await Review.create({
            reviewer: req.user.id,
            reviewee: revieweeId,
            rating,
            comment
        });

        // Update User Stats (Average Rating using Aggregation)
        // This is a "Resumable" pattern: Atomic updates or aggregation re-calculation
        const stats = await Review.aggregate([
            { $match: { reviewee: reviewee._id } },
            {
                $group: {
                    _id: '$reviewee',
                    averageRating: { $avg: '$rating' },
                    reviewCount: { $sum: 1 }
                }
            }
        ]);

        if (stats.length > 0) {
            await User.findByIdAndUpdate(revieweeId, {
                averageRating: stats[0].averageRating.toFixed(1),
                reviewCount: stats[0].reviewCount
            });

            // Check verification badge logic
            // Rule: > 3 reviews and rating >= 4.5 -> Verified
            if (stats[0].reviewCount >= 3 && stats[0].averageRating >= 4.5) {
                await User.findByIdAndUpdate(revieweeId, { isVerified: true });
            }
        }

        res.status(201).json(review);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/:userId
// @access  Public
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ reviewee: req.params.userId })
            .populate('reviewer', 'name avatar')
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};
