
import { useState } from 'react';
import axios from 'axios';
import { Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            await axios.post('/auth/forgot-password', { email });
            setMessage('Password reset email sent. Please check your inbox.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send email. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Forgot your password?
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            label="Email address"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={Mail}
                            placeholder="Enter your email"
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
                            Send Reset Link
                        </Button>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    Or
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-center">
                            <Link to="/login" className="flex items-center text-indigo-600 hover:text-indigo-500 font-medium">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
