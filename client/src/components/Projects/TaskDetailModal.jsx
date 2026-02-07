import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Tag, AlignLeft, MessageSquare, Paperclip, Clock, CheckSquare, AlertCircle } from 'lucide-react';
import Button from '../UI/Button';
import Avatar from '../UI/Avatar'; // Assuming we have or will create this, or use img tag
import clsx from 'clsx';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const PRIORITIES = {
    low: { label: 'Low', color: 'bg-green-100 text-green-700', icon: 'bg-green-500' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-700', icon: 'bg-yellow-500' },
    high: { label: 'High', color: 'bg-red-100 text-red-700', icon: 'bg-red-500' }
};

const TaskDetailModal = ({ isOpen, onClose, task, projectId, onUpdate, onDelete }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState(task?.content || '');
    const [description, setDescription] = useState(task?.description || '');
    const [status, setStatus] = useState(task?.status || 'todo');
    const [priority, setPriority] = useState(task?.priority || 'medium');
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState(task?.comments || []);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (task) {
            setTitle(task.content);
            setDescription(task.description || '');
            setStatus(task.status);
            setPriority(task.priority || 'medium');
            setComments(task.comments || []);
        }
    }, [task]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const updatedTask = {
                ...task,
                content: title,
                description,
                status,
                priority,
                comments
            };

            // In a real app, we'd probably have a specialized endpoint for updating task details
            // For now, re-using a generic update or assuming the parent handles the API call
            await onUpdate(updatedTask);
            onClose();
        } catch (error) {
            console.error("Failed to update task", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        const newComment = {
            _id: Math.random().toString(), // Temp ID until saved
            text: commentText,
            user: user,
            createdAt: new Date()
        };

        const updatedComments = [...comments, newComment];
        setComments(updatedComments);
        setCommentText('');

        // Optimistic update - in real app, save comment immediately
    };

    if (!isOpen || !task) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600 dark:text-indigo-400">
                                        <CheckSquare className="h-5 w-5" />
                                    </div>
                                    <span className="text-sm font-mono text-gray-500 dark:text-gray-400">TASK-{task.id.slice(0, 8)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={onDelete}
                                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <i className="fas fa-trash-alt"></i> Delete
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto block md:flex">
                                {/* Main Content */}
                                <div className="flex-1 p-6 space-y-8 border-r border-gray-100 dark:border-gray-700">
                                    {/* Title Editor */}
                                    <div>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            className="w-full text-2xl font-bold bg-transparent border-0 focus:ring-0 p-0 text-gray-900 dark:text-white placeholder-gray-400"
                                            placeholder="Task title"
                                        />
                                        <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                                            In list <span className="font-medium px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300 capitalize">{status.replace('-', ' ')}</span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                            <AlignLeft className="h-5 w-5 text-gray-400" />
                                            Description
                                        </h3>
                                        <textarea
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            rows={6}
                                            placeholder="Add a more detailed description..."
                                            className="w-full p-4 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-gray-300 text-sm leading-relaxed"
                                        />
                                    </div>

                                    {/* Attachments (Placeholder for now) */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                            <Paperclip className="h-5 w-5 text-gray-400" />
                                            Attachments
                                        </h3>
                                        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                                            <p className="text-sm text-gray-500 group-hover:text-indigo-600 transition-colors">Drop files here to upload</p>
                                        </div>
                                    </div>

                                    {/* Comments */}
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                            <MessageSquare className="h-5 w-5 text-gray-400" />
                                            Activity
                                        </h3>

                                        <div className="space-y-6">
                                            <div className="flex gap-3">
                                                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs flex-shrink-0">
                                                    {user?.name?.charAt(0)}
                                                </div>
                                                <div className="flex-1">
                                                    <form onSubmit={handleAddComment}>
                                                        <input
                                                            type="text"
                                                            value={commentText}
                                                            onChange={(e) => setCommentText(e.target.value)}
                                                            placeholder="Write a comment..."
                                                            className="w-full p-3 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:text-white text-sm"
                                                        />
                                                    </form>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {comments.map((comment, i) => (
                                                    <div key={i} className="flex gap-3 group">
                                                        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold text-xs flex-shrink-0">
                                                            {comment.user?.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-baseline gap-2">
                                                                <span className="font-bold text-sm text-gray-900 dark:text-white">{comment.user?.name || 'User'}</span>
                                                                <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{comment.text}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Sidebar */}
                                <div className="w-full md:w-80 bg-gray-50/50 dark:bg-gray-800/30 p-6 space-y-6">
                                    {/* Status */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Proccess</label>
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full p-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                        >
                                            <option value="todo">To Do</option>
                                            <option value="in-progress">In Progress</option>
                                            <option value="done">Done</option>
                                        </select>
                                    </div>

                                    {/* Priority */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Priority</label>
                                        <div className="flex gap-2">
                                            {['low', 'medium', 'high'].map((p) => (
                                                <button
                                                    key={p}
                                                    onClick={() => setPriority(p)}
                                                    className={clsx(
                                                        "flex-1 py-2 text-xs font-medium rounded-lg border transition-all",
                                                        priority === p
                                                            ? `${PRIORITIES[p].color} border-transparent ring-2 ring-offset-1 dark:ring-offset-gray-900 border-opacity-100`
                                                            : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                                                    )}
                                                >
                                                    {PRIORITIES[p].label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Assignee (Mock) */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assignee</label>
                                        <button className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left transition-colors">
                                            <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-xs">
                                                <User className="h-3 w-3" />
                                            </div>
                                            <span className="text-sm text-gray-600 dark:text-gray-300">Unassigned</span>
                                        </button>
                                    </div>

                                    {/* Due Date (Mock) */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Due Date</label>
                                        <button className="flex items-center gap-2 w-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-left transition-colors text-gray-500">
                                            <Calendar className="h-4 w-4" />
                                            <span className="text-sm">No due date</span>
                                        </button>
                                    </div>

                                    <div className="h-px bg-gray-200 dark:bg-gray-700 my-4" />

                                    {/* Notification (Mock) */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300 mb-2">
                                            <AlertCircle className="h-4 w-4" />
                                            Updates
                                        </h4>
                                        <p className="text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
                                            You will be notified of any changes to this task.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-white dark:bg-gray-800">
                                <Button variant="secondary" onClick={onClose}>Cancel</Button>
                                <Button onClick={handleSave} disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default TaskDetailModal;
