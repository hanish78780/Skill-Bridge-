import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { Link } from 'react-router-dom';

const EmptyState = ({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionLink,
    onAction,
    className = ""
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center text-center p-8 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700/50 ${className}`}
        >
            <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-4">
                {Icon && <Icon className="w-8 h-8 text-gray-400 dark:text-gray-500" />}
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-6 text-sm leading-relaxed">{description}</p>

            {actionLabel && (
                actionLink ? (
                    <Link to={actionLink}>
                        <Button variant="secondary" size="sm" className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600">
                            {actionLabel}
                        </Button>
                    </Link>
                ) : (
                    <Button variant="secondary" size="sm" onClick={onAction} className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600">
                        {actionLabel}
                    </Button>
                )
            )}
        </motion.div>
    );
};

export default EmptyState;
