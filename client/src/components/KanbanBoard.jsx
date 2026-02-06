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
        { id: 'pending', title: 'Pending', color: 'bg-yellow-50 text-yellow-800' },
        { id: 'active', title: 'Active', color: 'bg-blue-50 text-blue-800' },
        { id: 'completed', title: 'Completed', color: 'bg-green-50 text-green-800' }
    ];

    if (loading) return <div>Loading board...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full min-h-[500px]">
            {columns.map((col) => (
                <div
                    key={col.id}
                    className="bg-gray-50/50 rounded-xl p-4 flex flex-col border border-gray-200"
                    onDragOver={onDragOver}
                    onDrop={(e) => onDrop(e, col.id)}
                >
                    <div className={`p-3 rounded-lg mb-4 font-bold text-center ${col.color}`}>
                        {col.title} ({projects.filter(p => p.status === col.id).length})
                    </div>

                    <div className="space-y-4 flex-1">
                        {projects
                            .filter(p => p.status === col.id)
                            .map((project) => (
                                <motion.div
                                    key={project._id}
                                    layoutId={project._id}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, project._id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileDrag={{ scale: 1.05 }}
                                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-grab active:cursor-grabbing"
                                >
                                    <Link to={`/projects/${project._id}`} className="block">
                                        <h4 className="font-bold text-gray-900 mb-1">{project.title}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{project.description}</p>
                                        <div className="flex justify-between items-center text-xs text-gray-400">
                                            <span>{project.assignedTo?.length || 0} Members</span>
                                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default KanbanBoard;
