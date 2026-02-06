import { useEffect, useState } from 'react';
import axios from 'axios';
import { Target, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';

const RecommendedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const { data } = await axios.get('/projects/recommended');
                setProjects(data);
            } catch (error) {
                console.error('Failed to load recommendations', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    if (loading) return <div className="animate-pulse h-48 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>;

    if (projects.length === 0) return (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white text-center">
            <Target className="h-12 w-12 mx-auto mb-3 text-white/80" />
            <h3 className="text-lg font-bold">No Matches Yet</h3>
            <p className="text-white/80 text-sm mb-4">Add more skills to your profile to get personalized project recommendations.</p>
            <Link to="/profile">
                <Button variant="secondary" size="sm" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    Update Profile
                </Button>
            </Link>
        </div>
    );

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                    Recommended For You
                </h3>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {projects.map((project) => (
                    <div key={project._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                                {project.title}
                            </h4>
                            <span className="text-xs text-gray-500">{new Date(project.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm text-gray-500 line-clamp-2 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1 mb-3">
                            {project.requiredSkills.slice(0, 3).map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded">
                                    {skill}
                                </span>
                            ))}
                            {project.requiredSkills.length > 3 && (
                                <span className="px-2 py-0.5 text-xs text-gray-400">+{project.requiredSkills.length - 3}</span>
                            )}
                        </div>
                        <Link to={`/projects/${project._id}`} className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700">
                            View Project <ArrowRight className="h-4 w-4 ml-1" />
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendedProjects;
