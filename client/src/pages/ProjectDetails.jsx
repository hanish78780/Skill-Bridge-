import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/UI/Button';
import { Calendar, Clock, Users, CheckCircle, AlertCircle, Edit, Trash2, Layout, Kanban, FileText } from 'lucide-react';
import KanbanBoard from '../components/Projects/KanbanBoard';
import ActivityFeed from '../components/Projects/ActivityFeed';
import ReportModal from '../components/UI/ReportModal';
import clsx from 'clsx';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { success, error: toastError } = useToast();

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
            success('Request sent successfully!');
            fetchProjectData();
        } catch (err) {
            toastError(err.response?.data?.message || 'Failed to send request');
        }
    };

    const handleRequestAction = async (requestId, status) => {
        try {
            await axios.put(`/requests/${requestId}`, { status });
            success(`Request ${status} successfully`);
            fetchProjectData();
        } catch (err) {
            toastError('Failed to update request');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await axios.delete(`/projects/${id}`);
            success('Project deleted successfully');
            navigate('/dashboard');
        } catch (err) {
            toastError('Failed to delete project');
        }
    };

    const isOwner = user && project && project.createdBy?._id === (user.id || user._id);
    const isMember = user && project && project.assignedTo?.some(m => m._id === (user.id || user._id));
    const canViewBoard = isOwner || isMember;

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-8 animate-pulse space-y-8">
                <div className="h-10 w-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 h-64 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
                    <div className="h-64 bg-gray-100 dark:bg-gray-800 rounded-xl"></div>
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
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{project.title}</h1>
                        <span className={`px-2.5 py-0.5 text-xs rounded-full uppercase font-bold tracking-wide shadow-sm ${project.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                            project.status === 'active' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                            }`}>
                            {project.status}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2">
                    {user && !isOwner && (
                        <Button variant="secondary" onClick={() => setShowReportModal(true)} className="text-gray-500 hover:text-red-500 border-gray-200 dark:border-gray-700 hover:border-red-200 dark:hover:border-red-900/50">
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
            <div className="flex border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={clsx(
                        "px-6 py-3 font-medium text-sm flex items-center transition-all relative",
                        activeTab === 'overview'
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    )}
                >
                    <FileText className="h-4 w-4 mr-2" /> Overview
                    {activeTab === 'overview' && (
                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('board')}
                    className={clsx(
                        "px-6 py-3 font-medium text-sm flex items-center transition-all relative",
                        activeTab === 'board'
                            ? "text-indigo-600 dark:text-indigo-400"
                            : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    )}
                >
                    <Kanban className="h-4 w-4 mr-2" /> Project Board
                    {activeTab === 'board' && (
                        <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
                    )}
                </button>
            </div>


            {/* Tab Content */}
            <div className="flex-1 min-h-0 overflow-y-auto">
                {activeTab === 'overview' ? (
                    <div className="grid md:grid-cols-3 gap-8 pb-10">
                        <div className="md:col-span-2 space-y-8">
                            {/* Description */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Description</h2>
                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed text-lg">
                                    {project.description}
                                </p>
                            </div>

                            {/* Required Skills */}
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Required Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {project.requiredSkills?.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-medium border border-indigo-100 dark:border-indigo-800/50">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Incoming Requests (Owner Only) */}
                            {isOwner && requests.length > 0 && (
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h2 className="text-xl font-bold mb-4 flex items-center text-gray-900 dark:text-white">
                                        <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-lg mr-2">
                                            <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        Join Requests ({requests.length})
                                    </h2>
                                    <div className="space-y-4">
                                        {requests.map((req) => (
                                            <div key={req._id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                        {req.user?.name}
                                                        <span className="text-xs font-normal text-gray-500 bg-white dark:bg-gray-700 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-600">{req.user?.title}</span>
                                                    </p>
                                                    {req.message && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 italic">"{req.message}"</p>}
                                                </div>
                                                {req.status === 'pending' ? (
                                                    <div className="flex gap-2">
                                                        <Button size="sm" onClick={() => handleRequestAction(req._id, 'accepted')} className="bg-green-600 hover:bg-green-700 shadow-sm border-transparent text-white">
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
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-5">
                                <div className="flex items-center text-gray-700 dark:text-gray-200">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                                        <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Deadline</p>
                                        <span className="font-medium">{project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700 dark:text-gray-200">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                                        <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Posted On</p>
                                        <span className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-gray-700 dark:text-gray-200">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                                        <Users className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Team Size</p>
                                        <span className="font-medium">{project.assignedTo?.length || 0} Members</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            {!isOwner && !isMember && (
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                                    <AnimatePresence mode='wait'>
                                        {myRequest ? (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className={`p-4 rounded-xl text-center border ${myRequest.status === 'pending' ? 'bg-yellow-50 border-yellow-100 text-yellow-800 dark:bg-yellow-900/10 dark:border-yellow-900/30 dark:text-yellow-400' :
                                                    myRequest.status === 'accepted' ? 'bg-green-50 border-green-100 text-green-800 dark:bg-green-900/10 dark:border-green-900/30 dark:text-green-400' :
                                                        'bg-red-50 border-red-100 text-red-800 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400'
                                                    }`}>
                                                <p className="font-bold text-lg">Request {myRequest.status}</p>
                                                {myRequest.status === 'pending' && <p className="text-sm mt-1 opacity-80">Waiting for project owner approval</p>}
                                            </motion.div>
                                        ) : showRequestForm ? (
                                            <motion.form
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -20 }}
                                                onSubmit={handleJoinRequest} className="space-y-4"
                                            >
                                                <h3 className="font-bold text-gray-900 dark:text-white">Apply to join</h3>
                                                <textarea
                                                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white transition-all shadow-sm"
                                                    rows="4"
                                                    placeholder="Why are you a good fit for this project? Highlight your relevant skills."
                                                    value={requestMessage}
                                                    onChange={(e) => setRequestMessage(e.target.value)}
                                                    required
                                                />
                                                <div className="flex gap-2">
                                                    <Button type="submit" className="w-full shadow-lg shadow-indigo-500/20">Send Application</Button>
                                                    <Button type="button" variant="secondary" onClick={() => setShowRequestForm(false)}>Cancel</Button>
                                                </div>
                                            </motion.form>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Interested?</h3>
                                                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Join this project to collaborate and build your skills.</p>
                                                <Button className="w-full h-12 text-lg shadow-lg shadow-indigo-500/20" onClick={() => setShowRequestForm(true)}>
                                                    Request to Join
                                                </Button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Team Members */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
                                    Team <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-500">{project.assignedTo?.length + (project.createdBy ? 1 : 0)}</span>
                                </h3>
                                <div className="space-y-4">
                                    {/* Creator */}
                                    <div className="flex items-center group cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                                        {project.createdBy?.avatar ? (
                                            <img src={(project.createdBy.avatar.startsWith('http') ? project.createdBy.avatar : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${project.createdBy.avatar}`)} alt={project.createdBy.name} className="h-10 w-10 rounded-full border-2 border-indigo-100 dark:border-indigo-900" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-sm">
                                                {project.createdBy?.name?.charAt(0) || 'O'}
                                            </div>
                                        )}
                                        <div className="ml-3">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.createdBy?.name}</p>
                                            <div className="flex items-center gap-1">
                                                <span className="px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-[10px] font-bold uppercase">Owner</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    {project.assignedTo?.length > 0 && <div className="h-px bg-gray-100 dark:bg-gray-700 my-2"></div>}

                                    {/* Members */}
                                    {project.assignedTo?.map((member) => (
                                        <div key={member._id} className="flex items-center group cursor-pointer p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
                                            {member.avatar ? (
                                                <img src={(member.avatar.startsWith('http') ? member.avatar : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${member.avatar}`)} alt={member.name} className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-600" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-sm">
                                                    {member.name?.charAt(0)}
                                                </div>
                                            )}
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{member.name}</p>
                                                <p className="text-xs text-gray-500">{member.title || 'Member'}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {(!project.assignedTo || project.assignedTo.length === 0) && (
                                        <p className="text-sm text-gray-500 italic p-2 text-center">No other members yet</p>
                                    )}
                                </div>
                            </div>

                            {/* Activity Feed */}
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                                <ActivityFeed projectId={id} />
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Kanban Board Tab */
                    <KanbanBoard
                        projectId={id}
                        tasks={project.tasks || []}
                        members={[project.createdBy, ...(project.assignedTo || [])].filter(Boolean)}

                        onTaskUpdate={fetchProjectData}
                        readOnly={!isOwner && !isMember}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectDetails;
