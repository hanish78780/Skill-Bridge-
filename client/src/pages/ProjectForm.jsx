import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import SkillSelector from '../components/UI/SkillSelector';

const ProjectForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        deadline: '',
        status: 'pending',
        requiredSkills: [],
        difficulty: 'intermediate',
        duration: 'medium'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isEditMode) {
            fetchProject();
        }
    }, [id]);

    const fetchProject = async () => {
        try {
            const { data } = await axios.get(`/projects/${id}`);
            setFormData({
                title: data.title,
                description: data.description,
                deadline: data.deadline ? data.deadline.split('T')[0] : '', // Format for date input
                status: data.status,
                requiredSkills: data.requiredSkills || [],
                difficulty: data.difficulty || 'intermediate',
                duration: data.duration || 'medium'
            });
        } catch (err) {
            setError('Failed to fetch project details');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = {
            ...formData,
            requiredSkills: formData.requiredSkills // Already an array
        };

        try {
            if (isEditMode) {
                await axios.put(`/projects/${id}`, payload);
            } else {
                await axios.post('/projects', payload);
            }
            navigate('/projects');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save project');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{isEditMode ? 'Edit Project' : 'Create New Project'}</h1>

                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-6 text-sm border border-red-100 dark:border-red-900/30">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        id="title"
                        label="Project Title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="e.g. E-commerce Platform"
                    />

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            rows="4"
                            className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="Describe the project requirements..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            id="deadline"
                            type="date"
                            label="Deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                        />

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="pending">Pending</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Difficulty Level
                            </label>
                            <select
                                id="difficulty"
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={formData.difficulty}
                                onChange={handleChange}
                            >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Estimated Duration
                            </label>
                            <select
                                id="duration"
                                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={formData.duration}
                                onChange={handleChange}
                            >
                                <option value="short">Short (&lt; 1 week)</option>
                                <option value="medium">Medium (1-4 weeks)</option>
                                <option value="long">Long (&gt; 1 month)</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Required Skills</label>
                        <SkillSelector
                            selectedSkills={formData.requiredSkills}
                            onChange={(skills) => setFormData({ ...formData, requiredSkills: skills })}
                        />
                    </div>

                    <div className="flex justify-end space-x-4 pt-4">
                        <Button type="button" variant="secondary" onClick={() => navigate('/projects')}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (isEditMode ? 'Update Project' : 'Create Project')}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectForm;
