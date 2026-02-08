import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-orange-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
};

const styles = {
    success: 'bg-white border-l-4 border-green-500',
    error: 'bg-white border-l-4 border-red-500',
    warning: 'bg-white border-l-4 border-orange-500',
    info: 'bg-white border-l-4 border-blue-500',
};

const Toast = ({ id, message, type = 'info', duration = 3000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, id, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            layout
            className={`pointer-events-auto flex items-center justify-between gap-3 min-w-[300px] max-w-sm p-4 rounded-lg shadow-lg border border-gray-100 dark:border-gray-800 dark:bg-gray-800 ${styles[type]}`}
        >
            <div className="flex items-center gap-3">
                {icons[type]}
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{message}</p>
            </div>
            <button
                onClick={() => onClose(id)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
                <X className="h-4 w-4" />
            </button>
        </motion.div>
    );
};

export default Toast;
