import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Clock, CheckCircle, Plus, Edit2, UserPlus, Move } from 'lucide-react';

const ActivityFeed = ({ projectId }) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
        // Poll every 30 seconds
        const interval = setInterval(fetchActivities, 30000);
        return () => clearInterval(interval);
    }, [projectId]);

    const fetchActivities = async () => {
        try {
            const { data } = await axios.get(`/activities/project/${projectId}`);
            setActivities(data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch activities", error);
            setLoading(false);
        }
    };

    const getActionIcon = (action) => {
        switch (action) {
            case 'task_created': return <Plus className="h-3 w-3 text-blue-500" />;
            case 'task_completed': return <CheckCircle className="h-3 w-3 text-green-500" />;
            case 'task_moved': return <Move className="h-3 w-3 text-purple-500" />;
            case 'member_joined': return <UserPlus className="h-3 w-3 text-indigo-500" />;
            default: return <Edit2 className="h-3 w-3 text-gray-500" />;
        }
    };

    const getActionText = (activity) => {
        const { user, action, details } = activity;
        const userName = user?.name || 'Unknown User';
        const taskName = details?.taskContent ? `"${details.taskContent}"` : 'a task';

        switch (action) {
            case 'task_created': return <span><span className="font-semibold">{userName}</span> created task {taskName}</span>;
            case 'task_completed': return <span><span className="font-semibold">{userName}</span> completed {taskName}</span>;
            case 'task_moved': return <span><span className="font-semibold">{userName}</span> moved {taskName}</span>;
            case 'member_joined': return <span><span className="font-semibold">{userName}</span> joined the project</span>;
            case 'task_updated': return <span><span className="font-semibold">{userName}</span> updated {taskName}</span>;
            default: return <span><span className="font-semibold">{userName}</span> performed an action</span>;
        }
    };

    if (loading) return <div className="p-4 text-center text-sm text-gray-500 underline animate-pulse">Loading updates...</div>;

    if (activities.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent activity</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4" /> Recent Activity
            </h3>
            <div className="relative border-l border-gray-200 dark:border-gray-700 ml-3 space-y-6 pb-2">
                <AnimatePresence>
                    {activities.map((activity, idx) => (
                        <motion.div
                            key={activity._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="relative pl-6"
                        >
                            <span className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center">
                                {getActionIcon(activity.action)}
                            </span>

                            <div className="flex flex-col">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    {getActionText(activity)}
                                </p>
                                <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(activity.createdAt).toLocaleDateString()} {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ActivityFeed;
