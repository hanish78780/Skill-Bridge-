import { Link } from 'react-router-dom';
import { Briefcase, Github, Linkedin, Twitter, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 mt-auto">
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
                        <p className="mt-4 text-gray-500 text-sm leading-relaxed max-w-xs">
                            Connect, collaborate, and showcase your skills. The premium platform for developers to manage projects and build their portfolio.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">
                                <Github className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                                <Linkedin className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-sky-500 transition-colors">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-blue-700 transition-colors">
                                <Facebook className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">Platform</h3>
                        <ul className="space-y-3">
                            <li><Link to="/projects" className="text-gray-500 hover:text-indigo-600 transition-colors">Browse Projects</Link></li>
                            <li><Link to="/login" className="text-gray-500 hover:text-indigo-600 transition-colors">Login</Link></li>
                            <li><Link to="/register" className="text-gray-500 hover:text-indigo-600 transition-colors">Sign Up</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 tracking-wider uppercase mb-4">Support</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 text-sm">
                        &copy; {new Date().getFullYear()} SkillBridge Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
