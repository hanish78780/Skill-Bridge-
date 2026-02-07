import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useChat } from '../context/ChatContext';
import axios from 'axios';
import Button from '../components/UI/Button';
import Skeleton from '../components/UI/Skeleton';
import { Github, Linkedin, Globe, MapPin, MessageSquare, Star, CheckCircle, Share2, Briefcase, Calendar, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import TrustBadge from '../components/UI/TrustBadge';
import EmptyState from '../components/UI/EmptyState';

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { success, error: toastError } = useToast();
    const { startChat } = useChat();

    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get(`/users/${id}`);
            setProfile(data);
            if (data._id) {
                fetchReviews(data._id);
            }
        } catch (err) {
            console.error(err);
            toastError("Failed to load profile");
            navigate('/talent');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async (userId) => {
        try {
            const { data } = await axios.get(`/reviews/${userId}`);
            setReviews(data);
        } catch (err) {
            console.error('Failed to fetch reviews', err);
        }
    };

    const handleMessage = async () => {
        if (!profile) return;
        await startChat(profile._id);
        navigate('/chat');
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        success('Profile link copied to clipboard!');
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-pulse p-4 pt-8">
                <Skeleton className="h-64 w-full rounded-2xl" />
                <div className="px-4 flex flex-col md:flex-row gap-8">
                    <div className="md:w-1/3 -mt-20">
                        <Skeleton className="h-48 w-48 rounded-full border-4 border-white mx-auto md:mx-0" />
                    </div>
                    <div className="md:w-2/3 space-y-4 pt-4">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                </div>
            </div>
        )
    }

    if (!profile) return null;

    // Generate a deterministic gradient based on user ID for the cover
    const getCoverGradient = (uid) => {
        const hash = uid.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        const hue1 = hash % 360;
        const hue2 = (hue1 + 40) % 360;
        return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 80%, 40%))`;
    };

    const getCoverStyle = () => {
        if (profile.coverImage) {
            // Handle both absolute and relative URLs
            const imgUrl = profile.coverImage.startsWith('http')
                ? profile.coverImage
                : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${profile.coverImage}`;
            return { backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
        }
        return { background: getCoverGradient(profile._id) };
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12"
        >
            {/* Cover Image Area */}
            <div
                className="h-64 md:h-80 w-full relative"
                style={getCoverStyle()}
            >
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start mb-8">

                    {/* Avatar */}
                    <div className="flex-shrink-0 -mt-20 md:-mt-24 mx-auto md:mx-0">
                        {profile.avatar ? (
                            <img
                                src={profile.avatar.startsWith('http') ? profile.avatar : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${profile.avatar}`}
                                alt={profile.name}
                                className="h-40 w-40 md:h-48 md:w-48 rounded-full border-[6px] border-white dark:border-gray-800 shadow-xl object-cover bg-white"
                            />
                        ) : (
                            <div className="h-40 w-40 md:h-48 md:w-48 rounded-full border-[6px] border-white dark:border-gray-800 shadow-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-5xl font-bold text-gray-400">
                                {profile.name.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 text-center md:text-left pt-2 md:pt-0">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-3">
                                    {profile.name}
                                    {profile.isVerified && (
                                        <CheckCircle className="h-6 w-6 text-blue-500 fill-current" />
                                    )}
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 font-medium mt-1">{profile.title || 'Full Stack Developer'}</p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                                    {profile.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" /> {profile.location}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="h-4 w-4" /> Member since {new Date(profile.createdAt).getFullYear()}
                                    </div>
                                    <TrustBadge rank={profile.rank} size="sm" />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={handleShare}
                                    className="px-4"
                                    title="Share Profile"
                                >
                                    <Share2 className="h-5 w-5" />
                                </Button>
                                <Button
                                    onClick={handleMessage}
                                    className="px-6 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
                                >
                                    <MessageSquare className="h-5 w-5" /> Hire / Message
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT SIDEBAR */}
                    <div className="space-y-6">

                        {/* Availability & Quick Stats */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Availability</h3>
                            <div className={`p-4 rounded-xl flex items-center gap-3 mb-6 ${profile.availabilityStatus === 'Available' ? 'bg-green-50 text-green-700 border border-green-100' :
                                profile.availabilityStatus === 'Open to Work' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                    'bg-red-50 text-red-700 border border-red-100'
                                }`}>
                                <div className={`w-3 h-3 rounded-full ${profile.availabilityStatus === 'Available' ? 'bg-green-500' :
                                    profile.availabilityStatus === 'Open to Work' ? 'bg-blue-500' :
                                        'bg-red-500'
                                    }`}></div>
                                <span className="font-semibold">{profile.availabilityStatus || 'Available'}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile.reviewCount || 0}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Projects</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                                        {profile.averageRating?.toFixed(1) || 'N/A'} <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Rating</div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Connect</h3>
                            <div className="space-y-2">
                                {profile.githubUrl && (
                                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Github className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">GitHub</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                )}
                                {profile.linkedinUrl && (
                                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Linkedin className="h-5 w-5 text-blue-600" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">LinkedIn</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                )}
                                {profile.portfolioUrl && (
                                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-5 w-5 text-purple-600" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Portfolio</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                )}
                                {!profile.githubUrl && !profile.linkedinUrl && !profile.portfolioUrl && (
                                    <div className="text-center py-4 text-gray-500 text-sm">No social links added.</div>
                                )}
                            </div>
                        </div>

                        {/* Skills - Moved to sidebar for compact view */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills?.map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                                        title={skill.proficiency}
                                    >
                                        {skill.name}
                                    </span>
                                ))}
                                {(!profile.skills || profile.skills.length === 0) && (
                                    <div className="text-gray-500 text-sm">No skills listed.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT MAIN CONTENT */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">
                                    <Briefcase className="h-5 w-5" />
                                </span>
                                About
                            </h2>
                            <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                {profile.bio || <span className="text-gray-400 italic">This user has not written a bio yet.</span>}
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <span className="bg-yellow-100 text-yellow-600 p-2 rounded-lg">
                                        <Star className="h-5 w-5 fill-current" />
                                    </span>
                                    Client Reviews
                                </h2>
                                <span className="text-sm text-gray-500 font-medium">
                                    {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
                                </span>
                            </div>

                            <div className="space-y-6">
                                {reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review._id} className="border-b border-gray-100 dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                                        {review.reviewer?.name?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white text-sm">{review.reviewer?.name || 'Anonymous User'}</h4>
                                                        <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 dark:text-gray-700'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed pl-14">
                                                "{review.comment}"
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <EmptyState
                                        icon={MessageSquare}
                                        title="No reviews yet"
                                        description="This user hasn't received any reviews yet."
                                        className="py-8 border-0 bg-transparent shadow-none"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PublicProfile;
