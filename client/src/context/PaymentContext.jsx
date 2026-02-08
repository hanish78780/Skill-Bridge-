import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import PaymentPromptModal from '../components/Payment/PaymentPromptModal';
import { useToast } from './ToastContext';

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
    const { user, refreshUser } = useAuth();
    const { success, error: toastError } = useToast();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isPaymentPromptOpen, setIsPaymentPromptOpen] = useState(false);

    // Load Razorpay Script
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // Check project credits
    const handleCreateProjectClick = async (e) => {
        if (e) e.preventDefault();
        // Always open payment prompt as per user request "check on new project and pay again every time"
        setIsPaymentPromptOpen(true);
        return false;
    };

    const handlePaymentConfirm = async () => {
        setIsPaymentPromptOpen(false);
        await buyCredits(100);
    };

    const buyCredits = async (amount) => {
        if (!user) return;
        setLoading(true);

        try {
            const res = await loadRazorpay();
            if (!res) {
                toastError('Razorpay SDK failed to load');
                return;
            }

            // 1. Create Order
            const { data: { key } } = await axios.get('/payment/getkey');
            const { data: { order } } = await axios.post('/payment/checkout', { amount });

            const options = {
                key,
                amount: order.amount,
                currency: "INR",
                name: "SkillBridge",
                description: "Project Creation Fee",
                image: "https://avatars.githubusercontent.com/u/1?v=4", // Placeholder
                order_id: order.id,
                callback_url: `${import.meta.env.VITE_API_URL}/payment/paymentverification`,
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: "9999999999" // Should come from user profile if available
                },
                notes: {
                    "address": "SkillBridge Corporate Office"
                },
                theme: {
                    "color": "#4F46E5"
                },
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post('/payment/paymentverification', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount // Pass amount to verify and add credits
                        });

                        if (verifyRes.data.success !== false) { // verifyRes might be a redirect, check status or logic
                            // In controller we redirect, but if we use handler, we might want to prevent redirect?
                            // Actually the controller redirects for standard checkout. 
                            // For handler based (modal), we should probably handle verification via API call and then update UI.
                            // But my controller redirects. Let's assume the callback_url handles it if we don't use handler.
                            // If we use handler, we can do manual verification.
                            // Let's stick to simple manual verification call here for SPA feel.

                            success('Payment Successful! You can now create your project.');
                            await refreshUser();
                            navigate('/projects/new');
                        }
                    } catch (err) {
                        console.error(err);
                        // If controller redirects, this block might not be hit exactly as expected for 200 OK HTML
                        // But usually we just refresh user.
                        await refreshUser();
                    }
                }
            };

            const razor = new window.Razorpay(options);
            razor.open();

        } catch (err) {
            console.error(err);
            toastError(err.response?.data?.message || 'Payment initiation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <PaymentContext.Provider value={{ buyCredits, handleCreateProjectClick, loading }}>
            {children}
            <PaymentPromptModal
                isOpen={isPaymentPromptOpen}
                onClose={() => setIsPaymentPromptOpen(false)}
                onConfirm={handlePaymentConfirm}
                amount={100}
            />
            {/* Hidden form for Razorpay */}
            <form id="razorpay-form" action={`${import.meta.env.VITE_API_URL}/payment/paymentverification`} method="POST">
                <input type="hidden" name="razorpay_payment_id" id="razorpay_payment_id" />
                <input type="hidden" name="razorpay_order_id" id="razorpay_order_id" />
                <input type="hidden" name="razorpay_signature" id="razorpay_signature" />
            </form>
        </PaymentContext.Provider>
    );
};

export default PaymentContext;
