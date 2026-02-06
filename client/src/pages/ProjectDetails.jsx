import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Button from '../components/UI/Button';
import { Calendar, Clock, Users, CheckCircle, AlertCircle, Edit, Trash2, Layout, Kanban, FileText } from 'lucide-react';
import KanbanBoard from '../components/Projects/KanbanBoard';
import ReportModal from '../components/UI/ReportModal';
import clsx from 'clsx';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [requests, setRequests] = useState([]);
    const [myRequest, setMyRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [requestMessage, setRequestMessage] = useState('');
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [showReportModal, setShowReportModal] = useState(false);


    useEffect(() => {
        fetchProjectData();
    }, [id, user]);

    const fetchProjectData = async () => {
        try {
            setLoading(true);

            // Fetch project data
            const projectRes = await axios.get(`/projects/${id}`);
            setProject(projectRes.data);

            // Try to fetch requests, but don't fail if it errors (403, etc.)
            try {
                const requestsRes = await axios.get(`/requests/project/${id}`);
                setRequests(requestsRes.data);

                if (user) {
                    const myReq = requestsRes.data.find(r => r.user?._id === (user.id || user._id));
                    setMyRequest(myReq);
                }
            } catch (requestErr) {
                // Silently fail if requests endpoint is not accessible
                console.warn('Could not fetch project requests:', requestErr.response?.status);
                setRequests([]);
            }

            setError(null);
        } catch (err) {
            setError('Failed to load project details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRequest = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/requests', { projectId: id, message: requestMessage });
            setMyRequest(data);
            setShowRequestForm(false);
            setRequestMessage('');
            fetchProjectData();
        } catch (err) {
            alert('Failed to send request');
        }
    };

    const handleRequestAction = async (requestId, status) => {
        try {
            await axios.put(`/requests/${requestId}`, { status });
            fetchProjectData();
        } catch (err) {
            alert('Failed to update request');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await axios.delete(`/projects/${id}`);
            navigate('/dashboard');
        } catch (err) {
            alert('Failed to delete project');
        }
    };

    const isOwner = user && project && project.createdBy?._id === (user.id || user._id);
    const isMember = user && project && project.assignedTo?.some(m => m._id === (user.id || user._id));
    const canViewBoard = isOwner || isMember;

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-8 animate-pulse space-y-8">
                <div className="h-10 w-1/3 bg-gray-200 rounded"></div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 h-64 bg-gray-100 rounded-xl"></div>
                    <div className="h-64 bg-gray-100 rounded-xl"></div>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="max-w-7xl mx-auto p-8 text-center pt-20">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{error || 'Project not found'}</h2>
                <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800 mt-4 block">Return to Dashboard</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12 h-[calc(100vh-100px)] flex flex-col">
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                targetId={id}
                targetModel="Project"
            />
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 flex-shrink-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
                        <span className={`px-2 py-1 text-xs rounded-full uppercase font-bold tracking-wide ${project.status === 'completed' ? 'bg-green-100 text-green-700' :
                            project.status === 'active' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {project.status}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {user && !isOwner && (
                        <Button variant="secondary" onClick={() => setShowReportModal(true)} className="text-gray-500 hover:text-red-500 border-gray-200 dark:border-gray-700">
                            <AlertCircle className="h-4 w-4 mr-2" /> Report
                        </Button>
                    )}
                    {isOwner && (
                        <>
                            <Link to={`/projects/${id}/edit`}>
                                <Button variant="secondary">
                                    <Edit className="h-4 w-4 mr-2" /> Edit
                                </Button>
                            </Link>
                            <Button variant="danger" onClick={handleDelete}>
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* Tabs */}
            {canViewBoard && (
                <div className="flex border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={clsx(
                            "px-6 py-3 font-medium text-sm flex items-center transition-colors border-b-2",
                            activeTab === 'overview'
                                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        )}
                    >
                        <FileText className="h-4 w-4 mr-2" /> Overview
                    </button>
                    <button
                        onClick={() => setActiveTab('board')}
                        className={clsx(
                            "px-6 py-3 font-medium text-sm flex items-center transition-colors border-b-2",
                            activeTab === 'board'
                                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                                : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        )}
                    >
                        <Kanban className="h-4 w-4 mr-2" /> Project Board
                    </button>
                </div>
            )}

            {/* Tab Content */}
            <div className="flex-1 min-h-0">
                {activeTab === 'overview' ? (
                    <div className="grid md:grid-cols-3 gap-8 pb-10">
                        <div className="md:col-span-2 space-y-8">
                            {/* Description */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Description</h2>
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                    {project.description}
                                </p>
                            </div>

                            {/* Required Skills */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Required Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {project.requiredSkills?.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Incoming Requests (Owner Only) */}
                            {isOwner && requests.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                                        <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
                                        Join Requests ({requests.length})
                                    </h2>
                                    <div className="space-y-4">
                                        {requests.map((req) => (
                                            <div key={req._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">{req.user?.name}</p>
                                                    <p className="text-sm text-gray-500">{req.user?.title}</p>
                                                    {req.message && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">"{req.message}"</p>}
                                                </div>
                                                {req.status === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => handleRequestAction(req._id, 'accepted')} className="bg-green-600 hover:bg-green-700">
                                                            Accept
                                                        </Button>
                                                        <Button size="sm" variant="danger" onClick={() => handleRequestAction(req._id, 'rejected')}>
                                                            Reject
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <span className={`text-sm font-bold ${req.status === 'accepted' ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {req.status.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Metadata */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                    <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>Due: {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</span>
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                    <Clock className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>Posted: {new Date(project.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                    <Users className="h-5 w-5 mr-3 text-gray-400" />
                                    <span>{project.assignedTo?.length || 0} Members</span>
                                </div>
                            </div>

                            {/* Action Button */}
                            {!isOwner && !isMember && (
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">Interested?</h3>
                                    {myRequest ? (
                                        <div className={`p-4 rounded-lg text-center ${myRequest.status === 'pending' ? 'bg-yellow-50 text-yellow-800' :
                                            myRequest.status === 'accepted' ? 'bg-green-50 text-green-800' :
                                                'bg-red-50 text-red-800'
                                            }`}>
                                            <p className="font-medium">Request {myRequest.status}</p>
                                            {myRequest.status === 'pending' && <p className="text-xs mt-1">Waiting for approval</p>}
                                        </div>
                                    ) : showRequestForm ? (
                                        <form onSubmit={handleJoinRequest} className="space-y-4">
                                            <textarea
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                                rows="3"
                                                placeholder="Why are you a good fit?"
                                                value={requestMessage}
                                                onChange={(e) => setRequestMessage(e.target.value)}
                                                required
                                            />
                                            <div className="flex gap-2">
                                                <Button type="submit" className="w-full">Send</Button>
                                                <Button type="button" variant="secondary" onClick={() => setShowRequestForm(false)}>Cancel</Button>
                                            </div>
                                        </form>
                                    ) : (
                                        <Button className="w-full" onClick={() => setShowRequestForm(true)}>
                                            Request to Join
                                        </Button>
                                    )}
                                </div>
                            )}

                            {/* Team Members */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">Team</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        {project.createdBy?.avatar ? (
                                            <img src={(project.createdBy.avatar.startsWith('http') ? project.createdBy.avatar : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${project.createdBy.avatar}`)} alt={project.createdBy.name} className="h-8 w-8 rounded-full" />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                {project.createdBy?.name?.charAt(0) || 'O'}
                                            </div>
                                        )}
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{project.createdBy?.name}</p>
                                            <p className="text-xs text-gray-500">Owner</p>
                                        </div>
                                    </div>
                                    {project.assignedTo?.map((member) => (
                                        <div key={member._id} className="flex items-center">
                                            {member.avatar ? (
                                                <img src={(member.avatar.startsWith('http') ? member.avatar : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${member.avatar}`)} alt={member.name} className="h-8 w-8 rounded-full" />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-xs">
                                                    {member.name?.charAt(0)}
                                                </div>
                                            )}
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</p>
                                                <p className="text-xs text-gray-500">Member</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!project.assignedTo || project.assignedTo.length === 0) && (
                                        <p className="text-sm text-gray-500 italic">No members yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Kanban Board Tab */
                    <KanbanBoard
                        projectId={id}
                        tasks={project.tasks || []}
                        onTaskUpdate={fetchProjectData}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
