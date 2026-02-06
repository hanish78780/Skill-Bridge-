import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useChat } from '../../context/ChatContext';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
};

const NotificationDropdown = () => {
    const { notifications, setNotifications, unreadNotificationsCount, setUnreadNotificationsCount } = useChat();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch notifications on mount
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await axios.get('/notifications');
                setNotifications(data.notifications);
                setUnreadNotificationsCount(data.unreadCount);
            } catch (error) {
                console.error('Failed to fetch notifications', error);
            }
        };

        fetchNotifications();
    }, [setNotifications, setUnreadNotificationsCount]);

    const handleMarkAsRead = async (id, e) => {
        e.stopPropagation();
        try {
            await axios.put(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadNotificationsCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Failed to mark as read', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.put('/notifications/read-all');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadNotificationsCount(0);
        } catch (error) {
            console.error('Failed to mark all as read', error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <Bell className="h-5 w-5" />
                {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
                            {unreadNotificationsCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-medium"
                                >
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No notifications yet</p>
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {notifications.map((notification) => (
                                        <li
                                            key={notification._id}
                                            className={clsx(
                                                "p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative group",
                                                !notification.read ? "bg-indigo-50/50 dark:bg-indigo-900/10" : ""
                                            )}
                                        >
                                            <Link
                                                to={notification.relatedLink || '#'}
                                                onClick={() => setIsOpen(false)}
                                                className="flex gap-3"
                                            >
                                                <div className="mt-1 flex-shrink-0">
                                                    {notification.sender?.avatar ? (
                                                        <img
                                                            src={(notification.sender.avatar.startsWith('http') ? notification.sender.avatar : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${notification.sender.avatar}`)}
                                                            alt=""
                                                            className="h-8 w-8 rounded-full border border-gray-200 dark:border-gray-700"
                                                        />
                                                    ) : (
                                                        <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                                            <Info className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={clsx("text-sm text-gray-900 dark:text-white", !notification.read && "font-medium")}>
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {timeAgo(notification.createdAt)}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <button
                                                        onClick={(e) => handleMarkAsRead(notification._id, e)}
                                                        className="self-start p-1 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"
                                                        title="Mark as read"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
