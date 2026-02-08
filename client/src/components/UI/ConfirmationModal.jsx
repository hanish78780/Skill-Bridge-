import { AlertTriangle, HelpCircle, X } from 'lucide-react';
import Button from '../UI/Button';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger', confirmText = 'Confirm' }) => {
    if (!isOpen) return null;

    const isDanger = type === 'danger';

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className={`p-3 rounded-full ${isDanger ? 'bg-red-50 text-red-600 dark:bg-red-900/20' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'}`}>
                                {isDanger ? <AlertTriangle className="h-6 w-6" /> : <HelpCircle className="h-6 w-6" />}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            {message}
                        </p>

                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button
                                variant={isDanger ? 'danger' : 'primary'}
                                onClick={() => {
                                    onConfirm();
                                    onClose();
                                }}
                            >
                                {confirmText}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmationModal;
