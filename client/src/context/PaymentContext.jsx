import { createContext, useContext, useState } from 'react';
import PaymentModal from '../components/Payment/PaymentModal';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const openPaymentModal = () => setIsPaymentModalOpen(true);
    const closePaymentModal = () => setIsPaymentModalOpen(false);

    const handleCreateProjectClick = (e) => {
        if (e) e.preventDefault();

        // Logic: Checks credits. If 0, opens modal. If > 0, navigates.
        if (!user) {
            navigate('/login');
            return;
        }

        if (!user.projectCredits || user.projectCredits < 1) {
            openPaymentModal();
        } else {
            navigate('/projects/new');
        }
    };

    return (
        <PaymentContext.Provider value={{ openPaymentModal, closePaymentModal, handleCreateProjectClick }}>
            {children}
            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={closePaymentModal}
                onSuccess={() => {
                    // Navigate to project creation on success
                    navigate('/projects/new');
                }}
            />
        </PaymentContext.Provider>
    );
};
