
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter, User, Briefcase, MapPin } from 'lucide-react';
import Input from '../components/UI/Input';
import { Link, useNavigate } from 'react-router-dom';
import { useChat } from '../context/ChatContext';
import { MessageSquare } from 'lucide-react';

const TalentSearch = () => {
    const [query, setQuery] = useState('');
    const [availability, setAvailability] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const { startChat } = useChat();
    const navigate = useNavigate();

    // Debounce logic
    useEffect(() => {
        const timer = setTimeout(() => {
            searchUsers();
        }, 500); // 500ms delay

        return () => clearTimeout(timer);
    }, [query, availability]);

    const searchUsers = async () => {
        try {
            setLoading(true);
            // Don't search if empty query and no filter (optional, but good for perf)
            // But we might want to show "all" initially? Let's show all if empty.

            const params = {};
            if (query) params.query = query;
            if (availability) params.availability = availability;

            const { data } = await axios.get('/users/search', { params });
            setResults(data.data);
        } catch (err) {
            console.error('Search failed', err);
        } finally {
            setLoading(false);
        }
    };

    const handleMessage = async (userId) => {
        await startChat(userId);
        navigate('/chat');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Find Talent</h1>
                <p className="text-gray-600 dark:text-gray-400">Discover skilled developers for your next project</p>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, title, or skill (e.g. React, Node.js)"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48 relative">
                    <Filter className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={availability}
                        onChange={(e) => setAvailability(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Busy">Busy</option>
                        <option value="Open to Work">Open to Work</option>
                    </select>
                </div>
            </div>

            {/* Results Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((user) => (
                        <div key={user._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <Link to={`/profile/${user._id}`} className="hover:opacity-80 transition-opacity">
                                        <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg overflow-hidden">
                                            {user.avatar ? <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" /> : user.name.charAt(0)}
                                        </div>
                                    </Link>
                                    <div>
                                        <Link to={`/profile/${user._id}`} className="hover:underline">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{user.title || 'Developer'}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.availabilityStatus === 'Available' ? 'bg-green-100 text-green-700' :
                                    user.availabilityStatus === 'Open to Work' ? 'bg-blue-100 text-blue-700' :
                                        'bg-red-100 text-red-700'
                                    }`}>
                                    {user.availabilityStatus || 'Available'}
                                </span>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{user.bio || 'No bio available'}</p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {user.skills?.map((skill, i) => (
                                    <span key={i} className="px-2 py-1 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-text-xs">
                                        {skill.name}
                                    </span>
                                )).slice(0, 3)}
                                {(user.skills?.length || 0) > 3 && (
                                    <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded text-xs">+{user.skills.length - 3} more</span>
                                )}
                            </div>

                            <button
                                onClick={() => handleMessage(user._id)}
                                className="w-full flex items-center justify-center py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                            >
                                <MessageSquare className="h-4 w-4 mr-2" /> Message
                            </button>
                        </div>
                    ))}
                    {results.length === 0 && !loading && (
                        <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                            No users found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TalentSearch;
