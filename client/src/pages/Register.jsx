import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [formError, setFormError] = useState(null);

    const { register, error: authError } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        const { name, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setFormError("Passwords don't match");
            return;
        }

        try {
            await register({ name, email, password });
            navigate('/dashboard');
        } catch (err) {
            setFormError(authError);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 animate-slide-up">
            <div className="glass p-8 rounded-2xl">
                <h2 className="text-3xl font-bold mb-2 text-center text-gray-900 dark:text-white">Create Account</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center mb-8">Join SkillBridge today</p>

                {formError && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm text-center">
                        {formError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        id="name"
                        type="text"
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id="email"
                        type="email"
                        label="Email Address"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        id="password"
                        type="password"
                        label="Password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                    <Input
                        id="confirmPassword"
                        type="password"
                        label="Confirm Password"
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />


                    <Button className="w-full py-3 mt-4" type="submit">
                        Sign Up
                    </Button>
                </form>

                <div className="mt-6 flex items-center justify-between">
                    <span className="border-b border-gray-300 dark:border-gray-600 w-full"></span>
                    <span className="px-2 text-gray-500 dark:text-gray-400 text-sm whitespace-nowrap">Or continue with</span>
                    <span className="border-b border-gray-300 dark:border-gray-600 w-full"></span>
                </div>

                <div className="mt-6">
                    <a
                        href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}
                        className="w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <img
                            className="h-5 w-5 mr-2"
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google logo"
                        />
                        Sign up with Google
                    </a>
                </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">
                    Log in
                </Link>
            </p>
        </div>

    );
};

export default Register;
