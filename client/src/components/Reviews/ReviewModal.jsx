import { useState } from 'react';
import { Star, X } from 'lucide-react';
import axios from 'axios';
import Button from '../UI/Button';
import { useToast } from '../../context/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewModal = ({ isOpen, onClose, projectId, revieweeId, role }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const { success, error } = useToast();

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            error('Please select a rating');
            return;
        }

        setSubmitting(true);
        try {
            await axios.post('/reviews', {
                project: projectId,
                reviewee: revieweeId,
                rating,
                comment,
                role // 'owner' or 'member' - context of the review
            });
            success('Review submitted successfully!');
            onClose();
            // Reset form
            setRating(0);
            setComment('');
        } catch (err) {
            error(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="p-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Leave a Review</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">How was your experience working with this project?</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Star Rating */}
                            <div className="flex justify-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`h-8 w-8 ${star <= (hoverRating || rating)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300 dark:text-gray-600'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                            <div className="text-center text-sm font-medium text-gray-500">
                                {rating > 0 ? ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating - 1] : 'Select a rating'}
                            </div>

                            {/* Comment */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Comment (Optional)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                                    placeholder="Share your thoughts..."
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={onClose}
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={submitting || rating === 0}
                                    className="flex-1"
                                >
                                    {submitting ? 'Submitting...' : 'Submit Review'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ReviewModal;
