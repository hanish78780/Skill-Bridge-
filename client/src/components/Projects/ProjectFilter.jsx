
import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSection = ({ title, options, selected, onChange }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border-b border-gray-100 dark:border-gray-800 py-4 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full text-sm font-semibold text-gray-900 dark:text-white mb-2"
            >
                {title}
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-2 pt-2">
                            {options.map((option) => (
                                <label key={option.value} className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(option.value)}
                                        onChange={() => onChange(option.value)}
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition duration-150 ease-in-out"
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-indigo-600 transition-colors">
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ProjectFilter = ({ filters, setFilters, clearFilters }) => {
    const toggleFilter = (category, value) => {
        setFilters(prev => {
            const current = prev[category];
            const updated = current.includes(value)
                ? current.filter(item => item !== value)
                : [...current, value];
            return { ...prev, [category]: updated };
        });
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 dark:text-white">Filters</h3>
                {(filters.difficulty.length > 0 || filters.duration.length > 0 || filters.status.length > 0) && (
                    <button
                        onClick={clearFilters}
                        className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center"
                    >
                        Clear All <X className="h-3 w-3 ml-1" />
                    </button>
                )}
            </div>

            <FilterSection
                title="Difficulty"
                options={[
                    { label: 'Beginner', value: 'beginner' },
                    { label: 'Intermediate', value: 'intermediate' },
                    { label: 'Advanced', value: 'advanced' }
                ]}
                selected={filters.difficulty}
                onChange={(val) => toggleFilter('difficulty', val)}
            />

            <FilterSection
                title="Duration"
                options={[
                    { label: 'Short (< 1 week)', value: 'short' },
                    { label: 'Medium (1-4 weeks)', value: 'medium' },
                    { label: 'Long (> 1 month)', value: 'long' }
                ]}
                selected={filters.duration}
                onChange={(val) => toggleFilter('duration', val)}
            />

            <FilterSection
                title="Status"
                options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Pending', value: 'pending' },
                    { label: 'Completed', value: 'completed' }
                ]}
                selected={filters.status}
                onChange={(val) => toggleFilter('status', val)}
            />
        </div>
    );
};

export default ProjectFilter;
