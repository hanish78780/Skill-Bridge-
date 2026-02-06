import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SkillAutocompleteInput = ({ value, onChange, placeholder, className }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [allSkills, setAllSkills] = useState([]);
    const wrapperRef = useRef(null);

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                // Ideally cache this or pass from parent to avoid many requests
                const { data } = await axios.get('/skills');
                setAllSkills(data);
            } catch (error) {
                console.error('Failed to fetch skills');
            }
        };
        fetchSkills();

        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const val = e.target.value;
        onChange(val);

        if (val.length > 0) {
            const filtered = allSkills.filter(skill =>
                skill.name.toLowerCase().includes(val.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelect = (skillName) => {
        onChange(skillName);
        setShowSuggestions(false);
    };

    return (
        <div className="relative flex-1" ref={wrapperRef}>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                className={className}
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 shadow-lg max-h-48 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {suggestions.map((skill) => (
                        <li
                            key={skill._id}
                            className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
                            onClick={() => handleSelect(skill.name)}
                        >
                            <span className="block truncate">{skill.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SkillAutocompleteInput;
