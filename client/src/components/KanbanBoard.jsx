import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const KanbanBoard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get('/projects');
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects', error);
        } finally {
            setLoading(false);
        }
    };

    const updateProjectStatus = async (projectId, newStatus) => {
        // Optimistic update
        const updatedProjects = projects.map(p =>
            p._id === projectId ? { ...p, status: newStatus } : p
        );
        setProjects(updatedProjects);

        try {
            await axios.put(`/projects/${projectId}`, { status: newStatus });
        } catch (error) {
            console.error('Failed to update status', error);
            fetchProjects(); // Revert on error
        }
    };

    const onDragStart = (e, projectId) => {
        e.dataTransfer.setData('projectId', projectId);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    };

    const onDrop = (e, status) => {
        const projectId = e.dataTransfer.getData('projectId');
        if (projectId) {
            updateProjectStatus(projectId, status);
        }
    };

    const columns = [
        { id: 'pending', title: 'Pending', color: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200' },
        { id: 'active', title: 'Active', color: 'bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200' },
        { id: 'completed', title: 'Completed', color: 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-200' }
    ];

    if (loading) return <div>Loading board...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[500px]">
            {columns.map((col) => {
                const columnProjects = projects.filter(p => p.status === col.id);
                return (
                    <div
                        key={col.id}
                        className="bg-gray-50/50 dark:bg-gray-900/50 rounded-2xl p-4 flex flex-col border border-gray-200 dark:border-gray-800"
                        onDragOver={onDragOver}
                        onDrop={(e) => onDrop(e, col.id)}
                    >
                        <div className={`p-3 rounded-xl mb-4 font-bold text-center flex justify-between items-center ${col.color}`}>
                            <span>{col.title}</span>
                            <span className="bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-full text-xs">
                                {columnProjects.length}
                            </span>
                        </div>

                        <div className="space-y-3 flex-1">
                            {columnProjects.length === 0 ? (
                                <div className="h-32 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-400">
                                    <span className="text-sm">No tasks</span>
                                </div>
                            ) : (
                                columnProjects.map((project) => (
                                    <motion.div
                                        key={project._id}
                                        layoutId={project._id}
                                        draggable
                                        onDragStart={(e) => onDragStart(e, project._id)}
                                        whileHover={{ scale: 1.03, y: -2 }}
                                        whileDrag={{ scale: 1.1, zIndex: 10 }}
                                        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                                    >
                                        <Link to={`/projects/${project._id}`} className="block">
                                            <h4 className="font-bold text-gray-900 dark:text-white mb-1.5">{project.title}</h4>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 leading-relaxed">{project.description}</p>
                                            <div className="flex justify-between items-center">
                                                <div className="flex -space-x-1.5">
                                                    {[...Array(Math.min(3, project.assignedTo?.length || 0))].map((_, i) => (
                                                        <div key={i} className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900 border border-white dark:border-gray-800 flex items-center justify-center text-[10px] text-indigo-700 font-bold">
                                                            {project.assignedTo?.[i]?.name?.[0] || 'U'}
                                                        </div>
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-medium bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                                                    {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                </span>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default KanbanBoard;
