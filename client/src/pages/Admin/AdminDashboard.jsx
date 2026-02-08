import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Briefcase, FileText, Activity, ArrowUpRight, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6B7280'];

const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
    </motion.div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error('Failed to fetch admin stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    // Format data for charts
    const userGrowthData = stats?.charts?.userGrowth?.map(item => ({
        name: `${item._id.month}/${item._id.year}`,
        users: item.count
    })) || [];

    const projectStatusData = stats?.charts?.projectStatus?.map(item => ({
        name: item._id,
        value: item.count
    })) || [];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, Admin</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/admin/users" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                        <Users className="w-4 h-4" /> Manage Users
                    </Link>
                    <Link to="/admin/reports" className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                        <FileText className="w-4 h-4" /> View Reports
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={stats?.counts.totalUsers} icon={Users} color="bg-blue-500" />
                <StatCard title="Active Users" value={stats?.counts.activeUsers} icon={Activity} color="bg-green-500" />
                <StatCard title="Total Projects" value={stats?.counts.totalProjects} icon={Briefcase} color="bg-purple-500" />
                <StatCard title="Pending Reports" value={stats?.counts.pendingReports} icon={FileText} color="bg-red-500" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* User Growth Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">User Growth</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={userGrowthData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                />
                                <Area type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Project Status Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Project Status</h2>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={projectStatusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {projectStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-4 space-y-2">
                            {projectStatusData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-gray-600 dark:text-gray-300 capitalize">{entry.name}</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tables Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Signups</h2>
                        <Link to="/admin/users" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center gap-1">
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {stats?.recentUsers?.map(user => (
                                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Projects */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Projects</h2>
                        <span className="text-gray-400 text-xs uppercase font-medium tracking-wider">Newest 5</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Project</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Owner</th>
                                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                {stats?.recentProjects?.map(project => (
                                    <tr key={project._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[150px]">{project.title}</div>
                                            <div className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 dark:text-gray-300">{project.createdBy?.name || 'Unknown'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full capitalize 
                                                ${project.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                    project.status === 'active' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                                        'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                {project.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
