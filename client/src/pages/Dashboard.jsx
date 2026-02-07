import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus, Folder, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/UI/Button';
import KanbanBoard from '../components/KanbanBoard';
import RecommendedProjects from '../components/Dashboard/RecommendedProjects';

const Dashboard = () => {
    const { user } = useAuth();

    const [stats, setStats] = useState([
        { label: 'Active Projects', value: '0', icon: <Folder className="text-blue-500" /> },
        { label: 'Pending Tasks', value: '0', icon: <Clock className="text-orange-500" /> },
        { label: 'Completed', value: '0', icon: <CheckCircle className="text-green-500" /> },
    ]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axios.get('/projects/stats');
                setStats([
                    { label: 'Active Projects', value: data.activeProjects, icon: <Folder className="text-blue-500" /> },
                    { label: 'Pending Tasks', value: data.pendingTasks, icon: <Clock className="text-orange-500" /> },
                    { label: 'Completed', value: data.completedProjects, icon: <CheckCircle className="text-green-500" /> },
                ]);
            } catch (error) {
                console.error('Failed to fetch dashboard stats', error);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            <div className="flex justify-between items-end border-b border-gray-100 dark:border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Welcome back, {user?.name}</p>
                </div>
                <Link to="/projects/new">
                    <Button className="shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5">
                        <Plus className="h-5 w-5 mr-2" /> New Project
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <section>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, idx) => (
                        <div
                            key={stat.label}
                            className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${idx === 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                                    idx === 1 ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                                        'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                    } group-hover:scale-110 transition-transform duration-300`}>
                                    {stat.icon}
                                </div>
                                <span className={`text-sm font-bold px-2 py-1 rounded-full ${idx === 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' :
                                    idx === 1 ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20' :
                                        'bg-green-50 text-green-600 dark:bg-green-900/20'
                                    }`}>
                                    {idx === 0 ? 'Active' : idx === 1 ? 'Pending' : 'Done'}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Project Status Board */}
            {/* Project Status Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            <Folder className="h-6 w-6 text-indigo-600" />
                            Project Board
                        </h2>
                    </div>
                    <KanbanBoard />
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        Suggested for you
                    </h2>
                    <RecommendedProjects />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
