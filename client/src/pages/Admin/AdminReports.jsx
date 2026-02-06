import { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '../../components/UI/Button';
import { AlertTriangle, CheckCircle, XCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminReports = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const { data } = await axios.get('/reports');
            setReports(data);
        } catch (error) {
            console.error('Failed to fetch reports', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleResolve = async (id, status) => {
        const notes = prompt('Add admin notes (optional):');
        if (notes === null) return;

        try {
            await axios.put(`/reports/${id}`, { status, adminNotes: notes });
            fetchReports();
        } catch (error) {
            alert('Failed to update report');
        }
    };

    if (loading) return <div>Loading reports...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Abuse Reports</h1>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                {reports.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-3" />
                        <p>No pending reports! Good job.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Reporter</th>
                                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Target</th>
                                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Reason</th>
                                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {reports.map(report => (
                                <tr key={report._id}>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{report.reporter?.name || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white flex items-center gap-2">
                                            {report.targetModel}: {report.targetId}
                                            {report.targetModel === 'Project' && (
                                                <Link to={`/projects/${report.targetId}`} target="_blank">
                                                    <ExternalLink className="h-3 w-3 text-blue-500" />
                                                </Link>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-red-600">{report.reason}</div>
                                        <div className="text-sm text-gray-500 truncate max-w-xs">{report.description}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs rounded-full ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                                                    'bg-gray-100 text-gray-800'
                                            }`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {report.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleResolve(report._id, 'resolved')}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    Resolve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={() => handleResolve(report._id, 'dismissed')}
                                                >
                                                    Dismiss
                                                </Button>
                                            </div>
                                        )}
                                        {report.status !== 'pending' && (
                                            <span className="text-xs text-gray-400">
                                                By Admin: {report.adminNotes || 'No notes'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminReports;
