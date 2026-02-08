import { motion, AnimatePresence } from 'framer-motion';
import { Lock, X } from 'lucide-react';
import Button from '../UI/Button';

const PaymentPromptModal = ({ isOpen, onClose, onConfirm, amount }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-800"
                >
                    <div className="p-8 text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                            <Lock className="h-8 w-8 text-indigo-400" />
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-3">Unlock Project Creation</h2>
                        <p className="text-gray-400 text-sm leading-relaxed mb-8">
                            To maintain quality and prevent spam, we charge a small one-time fee for each new project.
                        </p>

                        <div className="bg-gray-800/50 rounded-xl p-4 mb-8 border border-gray-700/50">
                            <div className="flex justify-between items-center mb-2 text-gray-400 text-sm">
                                <span>Project Fee</span>
                                <span>₹{amount}.00</span>
                            </div>
                            <div className="h-px bg-gray-700 my-2"></div>
                            <div className="flex justify-between items-center text-white font-bold text-lg">
                                <span>Total</span>
                                <span className="text-indigo-400">₹{amount}.00</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Button
                                onClick={onConfirm}
                                className="w-full py-3.5 text-base font-semibold shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all"
                            >
                                Pay & Create Project
                            </Button>
                            <button
                                onClick={onClose}
                                className="w-full py-3 text-sm font-medium text-gray-500 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                        </div>

                        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-600 uppercase tracking-wider font-medium">
                            <Lock className="h-3 w-3" />
                            Secure payment via Razorpay
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentPromptModal;
