
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Menu, X, User as UserIcon, Briefcase, ChevronRight, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from './UI/Button';
import NotificationDropdown from './UI/NotificationDropdown';
import clsx from 'clsx';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Projects', path: '/projects' },
        { name: 'Find Talent', path: '/talent' },
        { name: 'Messages', path: '/chat' },
        { name: 'Dashboard', path: '/dashboard' },
    ];

    return (
        <nav className={clsx(
            "fixed w-full z-50 transition-all duration-300",
            scrolled ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 py-2" : "bg-transparent py-4"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center group">
                            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2 rounded-lg text-white group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                                <Briefcase className="h-6 w-6" />
                            </div>
                            <span className="ml-3 text-xl font-bold text-black dark:text-gray-100">
                                SkillBridge
                            </span>
                        </Link>
                    </div>

                    {/* Centered Desktop Menu */}
                    <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
                        {user && navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="inline-flex items-center px-1 pt-1 text-sm font-bold text-black dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    {/* Desktop Navigation */}
                    <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                        >
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </button>

                        {user ? (
                            <>
                                {/* Notification Bell */}
                                <div className="relative">
                                    <NotificationDropdown />
                                </div>

                                {/* User Dropdown */}
                                <div className="relative ml-2 group">
                                    <button className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-indigo-600 transition-colors focus:outline-none">
                                        <div className="h-9 w-9 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center border border-indigo-100 dark:border-indigo-800 overflow-hidden shadow-sm">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar.startsWith('http') ? user.avatar : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${user.avatar}`}
                                                    alt={user.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="font-bold text-sm">{user.name?.charAt(0)}</span>
                                            )}
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:rotate-90 transition-transform duration-200" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-50">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <UserIcon className="h-4 w-4 mr-3 text-gray-400" />
                                                Profile
                                            </Link>
                                            <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <Briefcase className="h-4 w-4 mr-3 text-gray-400" />
                                                Dashboard
                                            </Link>
                                        </div>
                                        <div className="py-2 border-t border-gray-100 dark:border-gray-700">
                                            <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <LogOut className="h-4 w-4 mr-3" />
                                                Sign out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-x-4 flex items-center">
                                <Link to="/login" className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                    Log in
                                </Link>
                                <Link to="/register">
                                    <Button className="shadow-lg shadow-indigo-500/20">
                                        Get Started <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={clsx('md:hidden overflow-hidden transition-all duration-300 ease-in-out', isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
                <div className="px-4 pt-2 pb-4 space-y-1 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-gray-800 shadow-xl">
                    <div className="flex items-center justify-between px-3 py-2">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Theme</span>
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                        >
                            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                        </button>
                    </div>
                    {user && navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="block px-3 py-2 rounded-md text-base font-bold text-black dark:text-gray-200 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-800"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="h-[1px] bg-gray-100 dark:bg-gray-800 my-2"></div>
                    {user ? (
                        <div className="space-y-2">
                            <Link to="/profile" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600" onClick={() => setIsOpen(false)}>
                                <UserIcon className="h-5 w-5 mr-3" />
                                {user.name}
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <LogOut className="h-5 w-5 mr-3" />
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3 pt-2">
                            <Link to="/login" onClick={() => setIsOpen(false)} className="block w-full text-center py-2 text-gray-700 dark:text-gray-200 font-medium">
                                Log in
                            </Link>
                            <Link to="/register" onClick={() => setIsOpen(false)}>
                                <Button className="w-full justify-center">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
