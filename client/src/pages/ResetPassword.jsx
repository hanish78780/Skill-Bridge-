
import { useState } from 'react';
import axios from 'axios';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setMessage('');
        setError('');

        try {
            await axios.post(`/auth/reset-password/${token}`, { password });
            setMessage('Password reset successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Link may be expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Reset Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your new password below.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label="New Password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={Lock}
                            placeholder="Enter new password"
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={Lock}
                            placeholder="Confirm new password"
                        />

                        {message && (
                            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                                {message}
                            </div>
                        )}

                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            isLoading={loading}
                        >
                            Reset Password
                        </Button>
                    </form>

                    <div className="mt-6 flex justify-center">
                        <Link to="/login" className="flex items-center text-indigo-600 hover:text-indigo-500 font-medium">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
