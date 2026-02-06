import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [formError, setFormError] = useState(null);
    const { login, error: authError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setFormError(authError);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 animate-slide-up">
            <div className="glass p-8 rounded-2xl">
                <h2 className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-white">Welcome Back</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Sign in to your account</p>

                {formError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                        {formError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        id="email"
                        type="email"
                        label="Email Address"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button className="w-full py-3" type="submit">
                        Sign In
                    </Button>
                </form>

                <div className="mt-6 flex items-center justify-between">
                    <span className="border-b border-gray-300 dark:border-gray-600 w-full"></span>
                    <span className="px-2 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">Or continue with</span>
                    <span className="border-b border-gray-300 dark:border-gray-600 w-full"></span>
                </div>

                <div className="mt-6">
                    <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}>
                        <Button variant="secondary" className="w-full flex justify-center items-center py-3">
                            <svg className="h-5 w-5 mr-3" aria-hidden="true" viewBox="0 0 24 24">
                                <path d="M12.0003 20.45c4.6593 0 7.8286-3.1977 7.8286-7.8285 0-.7567-.1079-1.3916-.2545-2.0717h-7.5741v3.9189h4.3168c-.1939 1.1896-.8676 2.1558-1.7891 2.802l2.7681 2.1462c1.644-1.5272 2.7042-3.8052 2.7042-6.4952 0-5.2638-4.2662-9.53-9.53-9.53-2.6791 0-5.1121 1.057-6.9333 2.7719l2.8465 2.8465c1.0264-1.0101 2.457-1.5546 3.9868-1.5546 3.2355 0 6.027 2.1747 7.0094 5.234h-7.0094v4.0631h7.0094c-.9824 3.0593-3.7739 5.234-7.0094 5.234-3.2356 0-6.027-2.1747-7.0094-5.234h-3.9515v3.1332c1.9211 3.5229 5.5673 5.8629 9.9609 5.8629z" fill="#4285F4" />
                                <path d="M5.0003 14.2821c-.2444-.7255-.3836-1.5037-.3836-2.2821s.1392-1.5566.3836-2.2821v-3.1332h-3.9515c-.815 1.6373-1.2821 3.5073-1.2821 5.4153s.4671 3.778 1.2821 5.4153l3.9515-3.1332z" fill="#FBBC05" />
                                <path d="M12.0003 4.7937c2.3087 0 4.3822.8277 5.9686 2.1977l2.8465-2.8465c-2.4549-2.2968-5.7461-3.6449-8.8151-3.6449-4.3936 0-8.0398 2.34-9.9609 5.8629l3.9515 3.1332c.9824-3.0593 3.7738-5.234 7.0094-5.234z" fill="#EA4335" />
                                <path d="M12.0003 20.45c-3.2356 0-6.027-2.1747-7.0094-5.234l-3.9515 3.1332c1.9211 3.5229 5.5673 5.8629 9.9609 5.8629 4.3936 0 8.0398-2.34 9.9609-5.8629l-3.9515-3.1332c-.9824 3.0593-3.7738 5.234-7.0094 5.234z" fill="#34A853" />
                            </svg>
                            Sign in with Google
                        </Button>
                    </a>
                </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Create one
                </Link>
            </p>
        </div>

    );
};

export default Login;
