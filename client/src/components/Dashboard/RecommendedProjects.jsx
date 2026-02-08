import { useEffect, useState } from 'react';
import axios from 'axios';
import { Target, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import EmptyState from '../UI/EmptyState';

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
        <EmptyState
            icon={Target}
            title="No Matches Yet"
            description="Add more skills to your profile to get personalized project recommendations."
            actionLabel="Update Profile"
            actionLink="/profile"
        />
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
                        <div className="flex flex-col items-end gap-1">
                            {project.matchScore > 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                                    {project.matchScore}% Match
                                </span>
                            )}
                            <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300">
                                {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
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
