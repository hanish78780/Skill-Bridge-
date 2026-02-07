import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import Toast from '../components/UI/Toast';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type, duration }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const error = (message) => addToast(message, 'error');
    const success = (message) => addToast(message, 'success');
    const warning = (message) => addToast(message, 'warning');
    const info = (message) => addToast(message, 'info');

    return (
        <ToastContext.Provider value={{ addToast, removeToast, error, success, warning, info }}>
            {children}
            {createPortal(
                <div className="fixed bottom-0 right-0 p-6 flex flex-col gap-2 z-50 pointer-events-none sm:p-6 w-full sm:w-auto sm:items-end">
                    <AnimatePresence>
                        {toasts.map((toast) => (
                            <Toast key={toast.id} {...toast} onClose={removeToast} />
                        ))}
                    </AnimatePresence>
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
};
