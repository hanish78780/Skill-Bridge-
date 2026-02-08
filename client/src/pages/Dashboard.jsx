import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { usePayment } from '../context/PaymentContext'; // Import context
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Folder, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/UI/Button';
import ProjectCard from '../components/Projects/ProjectCard';
import ProfileCompletionWidget from '../components/Dashboard/ProfileCompletionWidget';
import RecommendedProjects from '../components/Dashboard/RecommendedProjects';

const Dashboard = () => {
    const { user } = useAuth();
    const { handleCreateProjectClick } = usePayment(); // Use global handler
    const [stats, setStats] = useState([
        { label: 'Active Projects', value: '0', icon: <Folder className="text-blue-500" /> },
        { label: 'Pending Tasks', value: '0', icon: <Clock className="text-orange-500" /> },
        { label: 'Completed', value: '0', icon: <CheckCircle className="text-green-500" /> },
    ]);
    const [myProjects, setMyProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const statsRes = await axios.get('/projects/stats');
                setStats([
                    { label: 'Active Projects', value: statsRes.data.activeProjects, icon: <Folder className="text-blue-500" /> },
                    { label: 'Pending Tasks', value: statsRes.data.pendingTasks, icon: <Clock className="text-orange-500" /> },
                    { label: 'Completed', value: statsRes.data.completedProjects, icon: <CheckCircle className="text-green-500" /> },
                ]);

                const projectsRes = await axios.get('/projects/my');
                setMyProjects(projectsRes.data);

            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            }
        };
        fetchData();
    }, []);

    // Helper to determine if user has projects based on stats
    const hasProjects = parseInt(stats[0].value) > 0 || parseInt(stats[2].value) > 0;

    return (
        <div className="space-y-12 animate-fade-in pb-12">
            <div className="flex justify-between items-end border-b border-gray-100 dark:border-gray-800 pb-6">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Welcome back, {user?.name}</p>
                </div>
                <Button
                    onClick={async (e) => {
                        const canProceed = await handleCreateProjectClick(e);
                        if (canProceed) navigate('/projects/new');
                    }}
                    className="shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-0.5"
                >
                    <Plus className="h-5 w-5 mr-2" /> New Project
                </Button>
            </div>

            {/* ... rest of the dashboard ... */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Stats Grid */}
                    <section>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {stats.map((stat, idx) => (
                                <div
                                    key={stat.label}
                                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] border border-gray-100 dark:border-gray-700/50 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${idx === 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                                            idx === 1 ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                                                'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                                            } group-hover:scale-110 transition-transform duration-300`}>
                                            {stat.icon}
                                        </div>
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${idx === 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20' :
                                            idx === 1 ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20' :
                                                'bg-green-50 text-green-600 dark:bg-green-900/20'
                                            }`}>
                                            {idx === 0 ? 'Active' : idx === 1 ? 'Pending' : 'Done'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <Folder className="h-6 w-6 text-indigo-600" />
                                My Projects
                            </h2>
                            <Link to="/projects" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                                View All
                            </Link>
                        </div>

                        {myProjects.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6">
                                {myProjects.map(project => (
                                    <ProjectCard key={project._id} project={project} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                <Folder className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No active projects</h3>
                                <p className="mt-1 text-gray-500 mb-6">Create a project or join one to get started.</p>
                                <Button
                                    onClick={async (e) => {
                                        const canProceed = await handleCreateProjectClick(e);
                                        if (canProceed) navigate('/projects/new');
                                    }}
                                    variant="secondary"
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Create Project
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Widget Area */}
                    <ProfileCompletionWidget user={user} hasProjects={hasProjects} />


                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                            Suggested for you
                        </h2>
                        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            <RecommendedProjects />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
