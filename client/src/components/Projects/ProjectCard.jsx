
import { Link } from 'react-router-dom';
import { Calendar, Users, BarChart2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const ProjectCard = ({ project }) => {
    const difficultyColors = {
        beginner: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
        intermediate: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
        advanced: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    };

    return (
        <Link to={`/projects/${project._id}`} className="block h-full">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 h-full flex flex-col hover:shadow-xl hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all duration-300 group"
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-md mb-2 uppercase tracking-wide ${difficultyColors[project.difficulty || 'intermediate']}`}>
                            {project.difficulty || 'Intermediate'}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 transition-colors">
                            {project.title}
                        </h3>
                    </div>
                </div>

                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                    {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {project.requiredSkills?.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-md border border-gray-100 dark:border-gray-700">
                            {skill}
                        </span>
                    ))}
                    {project.requiredSkills?.length > 3 && (
                        <span className="px-2 py-1 text-xs text-gray-400">+{project.requiredSkills.length - 3}</span>
                    )}
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-xs font-medium text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center" title="Duration">
                            <Clock className="h-3.5 w-3.5 mr-1.5" />
                            {project.duration || 'Medium'}
                        </span>
                        <span className="flex items-center" title="Team Size">
                            <Users className="h-3.5 w-3.5 mr-1.5" />
                            {project.assignedTo?.length || 0}
                        </span>
                    </div>
                    {project.deadline && (
                        <span className="flex items-center text-orange-500">
                            <Calendar className="h-3.5 w-3.5 mr-1.5" />
                            {new Date(project.deadline).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </motion.div>
        </Link>
    );
};

export default ProjectCard;
