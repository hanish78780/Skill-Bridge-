import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../UI/Button';
import { Send, Trash2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectComments = ({ projectId }) => {
    const { user } = useAuth();
    const { success, error: toastError } = useToast();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchComments();
    }, [projectId]);

    const fetchComments = async () => {
        try {
            const res = await axios.get(`/comments/project/${projectId}`);
            setComments(res.data);
        } catch (err) {
            console.error('Failed to fetch comments', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSubmitting(true);
        try {
            const res = await axios.post('/comments', {
                content: newComment,
                projectId
            });
            setComments([res.data, ...comments]);
            setNewComment('');
            success('Comment posted');
        } catch (err) {
            toastError(err.response?.data?.message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await axios.delete(`/comments/${commentId}`);
            setComments(comments.filter(c => c._id !== commentId));
            success('Comment deleted');
        } catch (err) {
            toastError('Failed to delete comment');
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500 animate-pulse">Loading discussion...</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                <MessageSquare className="h-5 w-5 text-indigo-500" />
                Discussion ({comments.length})
            </h3>

            {/* Comment List */}
            <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2 max-h-[500px] scrollbar-hide">
                {comments.length === 0 ? (
                    <div className="text-center py-10 text-gray-400 dark:text-gray-500">
                        <p>No comments yet. Start the discussion!</p>
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {comments.map((comment) => (
                            <motion.div
                                key={comment._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="flex gap-3 group"
                            >
                                <div className="flex-shrink-0">
                                    {comment.author?.avatar ? (
                                        <img
                                            src={(comment.author.avatar.startsWith('http') ? comment.author.avatar : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${comment.author.avatar}`)}
                                            alt={comment.author.name}
                                            className="h-8 w-8 rounded-full object-cover border border-gray-100 dark:border-gray-700"
                                        />
                                    ) : (
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-xs">
                                            {comment.author?.name?.charAt(0) || '?'}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl rounded-tl-none p-3 px-4 relative">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-sm text-gray-900 dark:text-white">{comment.author?.name}</span>
                                            <span className="text-xs text-gray-400 ml-2">
                                                {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{comment.content}</p>

                                        {(user && (user.id === comment.author?._id || user._id === comment.author?._id)) && (
                                            <button
                                                onClick={() => handleDelete(comment._id)}
                                                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                title="Delete comment"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="mt-auto relative">
                <div className="relative">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm dark:text-white transition-all shadow-sm"
                        rows="2"
                        required
                    />
                    <button
                        type="submit"
                        disabled={submitting || !newComment.trim()}
                        className="absolute right-2 bottom-2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md shadow-indigo-500/20"
                    >
                        {submitting ? (
                            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProjectComments;
