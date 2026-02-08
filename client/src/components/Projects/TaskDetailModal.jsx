import { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar, User, AlignLeft, CheckSquare, Clock, Trash2, Send, Tag, Paperclip } from 'lucide-react';
import Button from '../UI/Button';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const TaskDetailModal = ({ isOpen, onClose, task, projectId, members, onUpdate, onDelete, readOnly }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [priority, setPriority] = useState('medium');
    const [assignedTo, setAssignedTo] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.content || '');
            setDescription(task.description || '');
            setStatus(task.status || 'todo');
            setPriority(task.priority || 'medium');
            setAssignedTo(task.assignedTo || '');
            setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
        }
    }, [task]);

    if (!isOpen || !task) return null;

    const handleSave = () => {
        onUpdate({
            ...task,
            content: title,
            description,
            status,
            priority,
            assignedTo,
            dueDate
        });
        onClose();
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;

        // In a real implementation this would call an API to add a comment to the task
        // For now we'll just optimistically update the UI if the onUpdate supports deep merging
        // or just clear the input

        // Mock implementation
        const newComment = {
            id: Date.now(),
            text: comment,
            user: { name: user.name, avatar: user.avatar },
            createdAt: new Date()
        };

        // Update task locally
        const updatedTask = {
            ...task,
            comments: [...(task.comments || []), newComment]
        };

        // onUpdate(updatedTask); // This might cause a full re-render/close if not handled carefully
        // Ideally we call an API endpoint: POST /projects/:id/tasks/:taskId/comments

        try {
            // Check if backend supports comments yet
            // Assuming the passed onUpdate handles the backend call for the whole task
            onUpdate({ ...task, comments: [...(task.comments || []), { text: comment, user: user.id }] });
            setComment('');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-start">
                        <div className="w-full mr-4">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => !readOnly && setTitle(e.target.value)}
                                className="w-full text-xl font-bold bg-transparent border-none focus:ring-0 p-0 text-gray-900 dark:text-white placeholder-gray-400"
                                placeholder="Task Title"
                                readOnly={readOnly}
                            />
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                                <span>in list</span>
                                <span className="underline capitalize">{status.replace('-', ' ')}</span>
                            </div>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-8">
                        {/* Main Column */}
                        <div className="flex-1 space-y-6">
                            {/* Description */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                                    <AlignLeft className="h-4 w-4" /> Description
                                </h4>
                                <textarea
                                    value={description}
                                    onChange={(e) => !readOnly && setDescription(e.target.value)}
                                    placeholder="Add a more detailed description..."
                                    className="w-full h-32 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-none resize-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    readOnly={readOnly}
                                />
                            </div>

                            {/* Attachments (Placeholder) */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                                    <Paperclip className="h-4 w-4" /> Attachments
                                </h4>
                                <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-4 text-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    Click to upload files
                                </div>
                            </div>

                            {/* Comments */}
                            <div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                                    <AlignLeft className="h-4 w-4" /> Activity
                                </h4>
                                <div className="space-y-4 mb-4">
                                    {task.comments?.map((c, i) => (
                                        <div key={i} className="flex gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                {c.user?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-sm text-gray-900 dark:text-white">{c.user?.name || 'User'}</span>
                                                    <span className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{c.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {!readOnly && (
                                    <div className="flex gap-2">
                                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Write a comment..."
                                                className="w-full pl-4 pr-10 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                            />
                                            <button
                                                onClick={handleAddComment}
                                                disabled={!comment.trim()}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600 disabled:opacity-50"
                                            >
                                                <Send className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Column */}
                        <div className="w-full md:w-48 space-y-6">
                            {/* Status */}
                            <div>
                                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</span>
                                <select
                                    value={status}
                                    onChange={(e) => !readOnly && setStatus(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-sm p-2"
                                    disabled={readOnly}
                                >
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="done">Done</option>
                                </select>
                            </div>

                            {/* Priority */}
                            <div>
                                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Priority</span>
                                <select
                                    value={priority}
                                    onChange={(e) => !readOnly && setPriority(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-sm p-2"
                                    disabled={readOnly}
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            {/* Assignee */}
                            <div>
                                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Assignee</span>
                                <select
                                    value={assignedTo}
                                    onChange={(e) => !readOnly && setAssignedTo(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-sm p-2"
                                    disabled={readOnly}
                                >
                                    <option value="">Unassigned</option>
                                    {members?.map(m => (
                                        <option key={m._id} value={m._id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Due Date */}
                            <div>
                                <span className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Due Date</span>
                                <input
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => !readOnly && setDueDate(e.target.value)}
                                    className="w-full bg-gray-50 dark:bg-gray-700 border-none rounded-lg text-sm p-2"
                                    disabled={readOnly}
                                />
                            </div>

                            {/* Actions */}
                            {!readOnly && (
                                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <button
                                        onClick={onDelete}
                                        className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium w-full p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="h-4 w-4" /> Delete Task
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    {!readOnly && (
                        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end gap-3 bg-gray-50 dark:bg-gray-800/50">
                            <Button variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                Save Changes
                            </Button>
                        </div>
                    )}
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default TaskDetailModal;
