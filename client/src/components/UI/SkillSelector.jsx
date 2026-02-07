import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Check } from 'lucide-react';

const SkillSelector = ({ selectedSkills, onChange, maxSkills = 10 }) => {
    const [allSkills, setAllSkills] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const { data } = await axios.get('/skills');
                setAllSkills(data);
            } catch (error) {
                console.error('Failed to fetch skills', error);
            }
        };
        fetchSkills();

        // Click outside handler
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (value.length > 0) {
            const filtered = allSkills.filter(skill =>
                skill.name.toLowerCase().includes(value.toLowerCase()) &&
                !selectedSkills.includes(skill.name)
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const addSkill = (skillName) => {
        if (!selectedSkills.includes(skillName) && selectedSkills.length < maxSkills) {
            onChange([...selectedSkills, skillName]);
            setInputValue('');
            setShowSuggestions(false);
        }
    };

    const removeSkill = (skillName) => {
        onChange(selectedSkills.filter(s => s !== skillName));
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue) {
            e.preventDefault();
            // Allow adding custom skills not in list
            addSkill(inputValue.trim());
        }
    };

    return (
        <div className="space-y-3" ref={wrapperRef}>
            <div className="flex flex-wrap gap-2 mb-2">
                {selectedSkills.map((skill, index) => (
                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                        {skill}
                        <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            className="ml-2 inline-flex items-center justify-center h-4 w-4 rounded-full text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200 focus:outline-none"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </span>
                ))}
            </div>

            <div className="relative">
                <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Type to search skills (e.g. React, Node.js)..."
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    disabled={selectedSkills.length >= maxSkills}
                />

                {showSuggestions && suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                        {suggestions.map((skill) => (
                            <li
                                key={skill._id}
                                className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                                onClick={() => addSkill(skill.name)}
                            >
                                <div className="flex justify-between">
                                    <span className="font-medium truncate">{skill.name}</span>
                                    <span className="text-gray-500 text-xs self-center bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{skill.category}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                {maxSkills - selectedSkills.length} slots remaining. Press Enter to add custom skills.
            </p>
        </div>
    );
};

export default SkillSelector;
