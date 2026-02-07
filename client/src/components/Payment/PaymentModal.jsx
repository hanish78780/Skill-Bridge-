import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, CheckCircle, AlertTriangle, Lock } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../UI/Button';

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
    const { user, refreshUser } = useAuth();
    const { success, error: toastError } = useToast();
    const [loading, setLoading] = useState(false);

    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async () => {
        try {
            setLoading(true);

            // Load Razorpay SDK
            const res = await loadRazorpay();
            if (!res) {
                toastError('Razorpay SDK failed to load. Are you online?');
                setLoading(false);
                return;
            }

            // 1. Create Order
            const { data: order } = await axios.post('/payment/order');
            console.log("Backend Order Response:", order); // DEBUG

            if (!order || !order.id) {
                throw new Error('Invalid order received from backend');
            }

            // 2. Open Razorpay Checkout
            // Fallback to hardcoded key if env var fails (prevents undefined error)
            const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SDMMQDazMEPOWQ';

            const options = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: "SkillBridge",
                description: "Create New Project", // Updated description
                order_id: order.id,
                handler: async function (response) {
                    try {
                        // 3. Verify Payment
                        const verifyRes = await axios.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.status === 'success') {
                            success('Payment successful! You can now create a project.');
                            await refreshUser(); // Update user credits in context
                            onSuccess();
                            onClose();
                        } else {
                            toastError('Payment verification failed.');
                        }
                    } catch (verifyErr) {
                        console.error(verifyErr);
                        toastError('Payment verification failed.');
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user?.name,
                    email: user?.email,
                    contact: user?.phone || '9999999999' // Added fallback contact for UPI testing
                },
                notes: {
                    address: "Razorpay Corporate Office" // Optional: adds credibility
                },
                theme: {
                    color: "#635BFF"
                },
                modal: {
                    ondismiss: () => setLoading(false)
                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.open();

        } catch (err) {
            console.error(err);
            toastError('Failed to initiate payment.');
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                >
                    <div className="p-6 text-center">
                        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Unlock Project Creation</h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            To maintain quality and prevent spam, we charge a small one-time fee for each new project.
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 border border-gray-100 dark:border-gray-700">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600 dark:text-gray-300">Project Fee</span>
                                <span className="font-bold text-gray-900 dark:text-white">₹1.00</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                                <span className="font-bold text-indigo-600 dark:text-indigo-400 text-lg">₹1.00</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={handlePayment}
                                isLoading={loading}
                                className="w-full h-12 text-lg shadow-lg shadow-indigo-500/20"
                            >
                                Pay & Create Project
                            </Button>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium"
                            >
                                Cancel
                            </button>
                        </div>

                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                            <Lock className="h-3 w-3" />
                            Secure payment via Razorpay
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
