import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth(); // Need to see if login function accepts token directly or if I need to update AuthContext

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // Manually set token in localStorage and context
            localStorage.setItem('token', token);
            // Ideally useAuth should expose a method to set token or refresh user
            // For now, let's force a reload or just navigate to dashboard and let AuthContext pick it up on mount?
            // AuthContext reads from localStorage on mount.
            // But if we are already mounted, we might need to trigger a state update.
            // Let's assume a full reload for simplicity or use a proper setToken method.
            // Actually, looks like AuthContext.jsx doesn't have a specific "setToken" exposed, 
            // but `login` function takes (email, password).
            // Let's forcefully reload the window to simplify integration with existing AuthContext.

            // Or better: update AuthContext to handle token set.
            window.location.href = '/dashboard';
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Completing login...</span>
        </div>
    );
};

export default AuthSuccess;
