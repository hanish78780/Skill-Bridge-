import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search, Shield, Ban, CheckCircle, MoreVertical } from 'lucide-react';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/admin/users?pageNumber=${page}&keyword=${keyword}`);
            setUsers(data.users);
            setPages(data.pages);
            setPage(data.page);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, keyword]);

    const handleAction = async (id, action, value) => {
        if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
        try {
            await axios.put(`/admin/users/${id}`, value);
            fetchUsers(); // Refresh
        } catch (error) {
            console.error(`Failed to ${action} user`, error);
            alert('Action failed');
        }
    };

    const searchHandler = (e) => {
        e.preventDefault();
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
                <form onSubmit={searchHandler} className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </form>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {users.map(user => (
                            <tr key={user._id}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold overflow-hidden">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                user.name.charAt(0)
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                                {user.name}
                                                {user.isVerified && <CheckCircle className="h-3 w-3 text-blue-500" />}
                                            </div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{user.role}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {user.status !== 'banned' ? (
                                            <button
                                                onClick={() => handleAction(user._id, 'ban', { status: 'banned' })}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg title='Ban User'"
                                            >
                                                <Ban className="h-4 w-4" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAction(user._id, 'activate', { status: 'active' })}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg title='Activate User'"
                                            >
                                                <CheckCircle className="h-4 w-4" />
                                            </button>
                                        )}

                                        {!user.isVerified ? (
                                            <button
                                                onClick={() => handleAction(user._id, 'verify', { isVerified: true })}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg title='Verify User'"
                                            >
                                                <Shield className="h-4 w-4" />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAction(user._id, 'unverify', { isVerified: false })}
                                                className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg title='Unverify User'"
                                            >
                                                <Shield className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Pagination (Simple) */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-center gap-2">
                    {[...Array(pages).keys()].map(x => (
                        <button
                            key={x + 1}
                            onClick={() => setPage(x + 1)}
                            className={`px-3 py-1 rounded-md ${page === x + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                        >
                            {x + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
