import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, X } from 'lucide-react';
import Button from '../components/UI/Button';
import ProjectCard from '../components/Projects/ProjectCard';
import ProjectFilter from '../components/Projects/ProjectFilter';
import PageTransition from '../components/PageTransition';

import { usePayment } from '../context/PaymentContext';

const Projects = () => {
    const { handleCreateProjectClick } = usePayment();
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Filter State
    const [filters, setFilters] = useState({
        difficulty: [],
        duration: [],
        status: []
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const { data } = await axios.get('/projects');
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setFilters({ difficulty: [], duration: [], status: [] });
    };

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                project.requiredSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));

            const matchesDifficulty = filters.difficulty.length === 0 || filters.difficulty.includes(project.difficulty || 'intermediate');
            const matchesDuration = filters.duration.length === 0 || filters.duration.includes(project.duration || 'medium');
            const matchesStatus = filters.status.length === 0 || filters.status.includes(project.status);

            return matchesSearch && matchesDifficulty && matchesDuration && matchesStatus;
        });
    }, [projects, searchTerm, filters]);

    return (
        <PageTransition>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discover Projects</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Find the perfect project to build your skills.</p>
                    </div>
                    <Button
                        onClick={async (e) => {
                            const canProceed = await handleCreateProjectClick(e);
                            if (canProceed) {
                                navigate('/projects/new');
                            }
                        }}
                        className="shadow-lg shadow-indigo-500/20"
                    >
                        <Plus className="h-5 w-5 mr-1" /> Create Project
                    </Button>
                </div>

                {/* Mobile Filter Toggle */}
                <div className="md:hidden mb-4">
                    <Button variant="secondary" onClick={() => setShowMobileFilters(!showMobileFilters)} className="w-full justify-between">
                        <span className="flex items-center"><Filter className="h-4 w-4 mr-2" /> Filters</span>
                        {showMobileFilters ? <X className="h-4 w-4" /> : null}
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className={`md:w-64 flex-shrink-0 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
                        <ProjectFilter
                            filters={filters}
                            setFilters={setFilters}
                            clearFilters={clearFilters}
                        />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 space-y-6">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by title, description, or skills..."
                                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Active Filter Chips */}
                        {(filters.difficulty.length > 0 || filters.duration.length > 0 || filters.status.length > 0) && (
                            <div className="flex flex-wrap gap-2">
                                {Object.entries(filters).map(([category, values]) =>
                                    values.map(value => (
                                        <button
                                            key={`${category}-${value}`}
                                            onClick={() => setFilters(prev => ({
                                                ...prev,
                                                [category]: prev[category].filter(v => v !== value)
                                            }))}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                                        >
                                            <span className="capitalize">{value}</span>
                                            <X className="h-3 w-3 ml-1.5" />
                                        </button>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Results Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {filteredProjects.map((project) => (
                                        <ProjectCard key={project._id} project={project} />
                                    ))}
                                </div>

                                {filteredProjects.length === 0 && (
                                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                                        <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                                            <Search className="h-full w-full" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">No projects found</h3>
                                        <p className="mt-1 text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
                                        <button
                                            onClick={clearFilters}
                                            className="mt-4 text-indigo-600 font-semibold hover:text-indigo-500"
                                        >
                                            Clear all filters
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Projects;
