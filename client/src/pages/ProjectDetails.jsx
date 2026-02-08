import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Button from '../components/UI/Button';
import { Calendar, Clock, Users, CheckCircle, AlertCircle, Edit, Trash2, Layout, Kanban, FileText, Star, MessageSquare, MapPin, Tag, Briefcase, Heart, Copy, X } from 'lucide-react';
import KanbanBoard from '../components/Projects/KanbanBoard';
import ReviewModal from '../components/Reviews/ReviewModal';

import ActivityFeed from '../components/Projects/ActivityFeed';
import ReportModal from '../components/UI/ReportModal';
import ConfirmationModal from '../components/UI/ConfirmationModal';
import ProjectComments from '../components/Projects/ProjectComments';
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
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewTargetUser, setReviewTargetUser] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);


    useEffect(() => {
        fetchProjectData();
    }, [id, user]);

    const fetchProjectData = async () => {
        try {
            setLoading(true);

            // Fetch project data
            const projectRes = await axios.get(`/projects/${id}`);
            const projectData = projectRes.data;
            setProject(projectData);

            // Check ownership directly from the fetched data
            const isProjectOwner = user && projectData.createdBy?._id === (user.id || user._id);

            // Fetch requests based on role
            if (user) {
                if (isProjectOwner) {
                    // Owner: Fetch all requests for this project
                    try {
                        const requestsRes = await axios.get(`/requests/project/${id}`);
                        setRequests(requestsRes.data);
                    } catch (err) {
                        console.warn('Failed to fetch project requests', err);
                    }
                } else {
                    // Non-owner: Fetch "my" requests to see status
                    try {
                        const myRequestsRes = await axios.get('/requests/me');
                        const myReq = myRequestsRes.data.find(r => r.project?._id === id || r.project === id);
                        setMyRequest(myReq);
                    } catch (err) {
                        console.warn('Failed to fetch my requests', err);
                    }
                }
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
        try {
            await axios.delete(`/projects/${id}`);
            success('Project deleted successfully');
            navigate('/dashboard');
        } catch (err) {
            toastError('Failed to delete project');
        }
    };

    const handleCompleteProject = async () => {
        try {
            await axios.put(`/projects/${id}`, { status: 'completed' });
            success('Project marked as completed!');
            fetchProjectData();
            setShowCompleteConfirm(false);
        } catch (err) {
            toastError('Failed to update project status');
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
        <div className="max-w-7xl mx-auto animate-fade-in pb-12 min-h-[calc(100vh-100px)] flex flex-col">
            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                targetId={id}
                targetModel="Project"
            />
            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                project={project}
                targetUser={reviewTargetUser}
                onReviewSuccess={() => { }}
            />
            <ConfirmationModal
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                title="Delete Project"
                message="Are you sure you want to delete this project?"
                confirmText="Delete Project"
                variant="danger"
            />
            <ConfirmationModal
                isOpen={showCompleteConfirm}
                onClose={() => setShowCompleteConfirm(false)}
                onConfirm={handleCompleteProject}
                title="Complete Project"
                message="Mark as complete to enable reviews?"
                confirmText="Mark as Complete"
                variant="primary"
            />

            {/* Main Content Area */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">

                {/* Header */}
                <div className="p-8 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-4">
                            <h1 className="text-3xl font-medium text-gray-900 dark:text-white leading-tight">
                                {project.title}
                            </h1>
                            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                                <span>Posted {new Date(project.createdAt).toLocaleDateString()}</span>
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>Worldwide</span>
                                </div>
                            </div>
                        </div>

                        {/* Owner Actions */}
                        <div className="flex gap-2 shrink-0">
                            {isOwner && (
                                <>
                                    <Link to={`/projects/${id}/edit`}>
                                        <Button variant="secondary" className="rounded-full">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Button variant="danger" onClick={() => setShowDeleteConfirm(true)} className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs (if needed, or just keep Overview as main) */}
                <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={clsx("px-8 py-4 font-medium text-sm border-b-2 transition-colors", activeTab === 'overview' ? "border-black dark:border-white text-black dark:text-white" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400")}
                    >
                        View Job
                    </button>
                    <button
                        onClick={() => setActiveTab('board')}
                        className={clsx("px-8 py-4 font-medium text-sm border-b-2 transition-colors", activeTab === 'board' ? "border-black dark:border-white text-black dark:text-white" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400")}
                    >
                        Project Board
                    </button>
                    <button
                        onClick={() => setActiveTab('discussion')}
                        className={clsx("px-8 py-4 font-medium text-sm border-b-2 transition-colors", activeTab === 'discussion' ? "border-black dark:border-white text-black dark:text-white" : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400")}
                    >
                        Discussion
                    </button>
                </div>

                <div className="flex flex-col md:flex-row">
                    {/* Left Column (Details) */}
                    <div className={clsx("flex-1 p-8 border-r border-gray-200 dark:border-gray-800", activeTab !== 'overview' && "hidden")}>

                        {/* Summary */}
                        <section className="mb-10">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Summary</h3>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-[15px]">
                                {project.description}
                            </p>
                        </section>

                        {/* Project Attributes Grid */}
                        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-gray-200 dark:border-gray-800 mb-10">
                            <div className="flex gap-3">
                                <Tag className="h-5 w-5 text-gray-900 dark:text-white mt-1" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-base">₹{project.budget || 'Negotiable'}</p>
                                    <p className="text-sm text-gray-500">Fixed-price</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Briefcase className="h-5 w-5 text-gray-900 dark:text-white mt-1" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-base">{project.difficulty || 'Intermediate'}</p>
                                    <p className="text-sm text-gray-500">Experience Level</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Calendar className="h-5 w-5 text-gray-900 dark:text-white mt-1" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white text-base">One-time project</p>
                                    <p className="text-sm text-gray-500">Project Type</p>
                                </div>
                            </div>
                        </section>

                        {/* Skills */}
                        <section className="mb-10">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Skills and Expertise</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.requiredSkills?.map((skill, idx) => (
                                    <span key={idx} className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-default">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Activity Stats */}
                        <section className="mb-8">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activity on this job</h3>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <p>Proposals: <span className="font-medium text-gray-900 dark:text-white">{requests.length > 0 ? requests.length : 'Less than 5'}</span></p>
                                <p>Last viewed by client: <span className="font-medium text-gray-900 dark:text-white">5 hours ago</span></p>
                                <p>Interviewing: <span className="font-medium text-gray-900 dark:text-white">{project.assignedTo?.length || 0}</span></p>
                                <p>Unanswered invites: <span className="font-medium text-gray-900 dark:text-white">0</span></p>
                            </div>
                        </section>

                    </div>
                    {/* End Left Column */}

                    {/* Content for other tabs */}
                    {activeTab === 'board' && (
                        <div className="flex-1 p-0 overflow-hidden h-[calc(100vh-280px)]">
                            <KanbanBoard
                                projectId={id}
                                tasks={project.tasks || []}
                                members={[project.createdBy, ...(project.assignedTo || [])].filter(Boolean)}
                                onTaskUpdate={fetchProjectData}
                                readOnly={!isOwner && !isMember}
                            />
                        </div>
                    )}
                    {activeTab === 'discussion' && (
                        <div className="flex-1 p-8 h-[calc(100vh-280px)] overflow-y-auto">
                            {(isOwner || isMember) ? (
                                <ProjectComments projectId={id} />
                            ) : (
                                <div className="text-center py-12">
                                    <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-500">Join the project to view discussion.</p>
                                </div>
                            )}
                        </div>
                    )}


                    {/* Right Sidebar (Client Info & Actions) */}
                    {activeTab === 'overview' && (
                        <div className="w-full md:w-80 p-8 shrink-0 bg-gray-50/50 dark:bg-gray-800/20">
                            {/* Action Buttons */}
                            <div className="mb-8 space-y-3">
                                {!isOwner && !isMember && (
                                    <>
                                        <Button onClick={() => setShowRequestForm(true)} className="w-full h-10 shadow-sm bg-green-600 hover:bg-green-700 text-white border-transparent rounded-full font-medium">
                                            Apply Now
                                        </Button>
                                        <Button variant="secondary" className="w-full h-10 rounded-full bg-white dark:bg-gray-800 border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10 flex items-center justify-center gap-2">
                                            <Heart className="h-4 w-4" /> Save Job
                                        </Button>
                                    </>
                                )}
                                {isOwner && (
                                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl mb-4 text-center">
                                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-300">This is your project</p>
                                    </div>
                                )}
                            </div>

                            {/* About Client */}
                            <section>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">About the client</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="h-4 w-4 text-blue-500" />
                                        <span>Payment method verified</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex text-green-600">
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                            <Star className="h-4 w-4 fill-current" />
                                        </div>
                                        <span>5.00 of 12 reviews</span>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-gray-900 dark:text-white text-base">United States</p>
                                        <p className="text-sm text-gray-500">Sarasota 4:12 PM</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-gray-900 dark:text-white text-base">26 Jobs posted</p>
                                        <p className="text-sm text-gray-500">85% Hire rate, 1 open job</p>
                                    </div>
                                    <div className="text-sm text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
                                        Member since {project.createdBy?.createdAt ? new Date(project.createdBy.createdAt).toLocaleDateString() : 'Feb 2023'}
                                    </div>
                                </div>
                            </section>

                            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Job Link</h3>
                                <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                    <input readOnly value={window.location.href} className="w-full bg-transparent px-3 text-xs text-gray-600 dark:text-gray-300 outline-none" />
                                    <button className="px-3 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-500">
                                        <Copy className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                        </div>
                    )}
                    {/* Incoming requests modal overlay or section could be added here if needed, keeping it simple for now */}
                    <AnimatePresence>
                        {showRequestForm && !isOwner && !isMember && activeTab === 'overview' && (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                            >
                                <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-lg p-6 relative">
                                    <button onClick={() => setShowRequestForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-500">
                                        <X className="h-5 w-5" />
                                    </button>
                                    <h2 className="text-xl font-bold mb-4">Submit a Proposal</h2>
                                    <form onSubmit={handleJoinRequest} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Cover Letter</label>
                                            <textarea
                                                className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent focus:ring-2 focus:ring-green-500 h-32 resize-none"
                                                placeholder="Introduce yourself and explain why you're a good fit..."
                                                value={requestMessage}
                                                onChange={(e) => setRequestMessage(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <Button type="button" variant="secondary" onClick={() => setShowRequestForm(false)}>Cancel</Button>
                                            <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white border-transparent">Submit Proposal</Button>
                                        </div>
                                    </form>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
