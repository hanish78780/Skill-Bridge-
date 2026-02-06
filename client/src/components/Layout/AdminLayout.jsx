import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import clsx from 'clsx';

const AdminLayout = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { name: 'Overview', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
        { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
        { name: 'Reports', path: '/admin/reports', icon: <FileText className="w-5 h-5" /> },
        // { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen fixed left-0 top-0 hidden md:block z-30">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Admin Panel</span>
                </div>
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                                location.pathname === item.path
                                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                            )}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 mt-8 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </nav>
            </aside>

            {/* Content Area */}
            <main className="flex-1 md:ml-64 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
