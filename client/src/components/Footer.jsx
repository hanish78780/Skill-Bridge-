import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 mt-auto transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center">
                            <Briefcase className="h-8 w-8 text-indigo-600" />
                            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                                SkillBridge
                            </span>
                        </Link>
                        <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
                            Connect, collaborate, and showcase your skills. The premium platform for developers to manage projects and build their portfolio.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            <a href="https://github.com/hanish78780" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="https://www.linkedin.com/in/hanishsinghal" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="https://www.instagram.com/infinite_hanish" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="https://www.facebook.com/hanish.singhal.77" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-700 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-wider uppercase mb-4">Platform</h3>
                        <ul className="space-y-3">
                            <li><Link to="/projects" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Browse Projects</Link></li>
                            <li><Link to="/login" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Login</Link></li>
                            <li><Link to="/register" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sign Up</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white tracking-wider uppercase mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li><Link to="/help" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Help Center</Link></li>
                            <li><Link to="/privacy" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} SkillBridge Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
