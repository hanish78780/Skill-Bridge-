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
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="bg-white dark:bg-gray-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Target className="h-8 w-8 text-indigo-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Matches Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-xs mx-auto">Add more skills to your profile to get personalized project recommendations.</p>
            <Link to="/profile">
                <Button size="sm" className="shadow-lg shadow-indigo-500/20">
                    Update Profile
                </Button>
            </Link>
        </div>
    );

    return (
        <div className="space-y-4">
            {projects.map((project) => (
                <div
                    key={project._id}
                    className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group cursor-pointer"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors text-lg">
                            {project.title}
                        </h4>
                        <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                            {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {project.requiredSkills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-medium rounded-md">
                                {skill}
                            </span>
                        ))}
                        {project.requiredSkills.length > 3 && (
                            <span className="px-2 py-1 text-xs text-gray-400">+{project.requiredSkills.length - 3}</span>
                        )}
                    </div>
                    <Link to={`/projects/${project._id}`} className="block">
                        <Button variant="ghost" className="w-full justify-between group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            View Details <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default RecommendedProjects;
