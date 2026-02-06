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
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Welcome back, {user?.name}!</p>
                </div>
                <Link to="/projects/new">
                    <Button>
                        <Plus className="h-5 w-5 mr-1" /> New Project
                    </Button>
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center space-x-4">
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Project Status Board */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recommended For You</h2>
                <RecommendedProjects />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Project Status Board</h2>
                <KanbanBoard />
            </div>
        </div>
    );
};

export default Dashboard;
