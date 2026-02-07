import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

const Toast = ({ id, type = 'info', message, duration = 3000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    const variants = {
        initial: { opacity: 0, y: 50, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
    };

    const icons = {
        success: <CheckCircle className="h-5 w-5 text-green-500" />,
        error: <AlertCircle className="h-5 w-5 text-red-500" />,
        warning: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
        info: <Info className="h-5 w-5 text-blue-500" />
    };

    const styles = {
        success: 'border-l-4 border-green-500 bg-white dark:bg-gray-800',
        error: 'border-l-4 border-red-500 bg-white dark:bg-gray-800',
        warning: 'border-l-4 border-yellow-500 bg-white dark:bg-gray-800',
        info: 'border-l-4 border-blue-500 bg-white dark:bg-gray-800'
    };

    return (
        <motion.div
            layout
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={clsx(
                "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 flex items-center p-4 gap-3",
                styles[type]
            )}
        >
            <div className="flex-shrink-0">
                {icons[type]}
            </div>
            <div className="flex-1 w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {message}
                </p>
            </div>
            <div className="flex flex-shrink-0 ml-4">
                <button
                    onClick={() => onClose(id)}
                    className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <span className="sr-only">Close</span>
                    <X className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
};

export default Toast;
