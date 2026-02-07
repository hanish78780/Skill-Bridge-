import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import axios from 'axios';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';
import AvatarUpload from '../components/AvatarUpload';
import Skeleton from '../components/UI/Skeleton';
import { Github, Linkedin, Globe, MapPin, Edit2, Save, Star, Award, CheckCircle, Plus, X as XIcon, Camera, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TrustBadge from '../components/UI/TrustBadge';
import SkillAutocompleteInput from '../components/UI/SkillAutocompleteInput';

const Profile = () => {
    const { user, setUser } = useAuth();
    const { success, error: toastError } = useToast();

    // State
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingCover, setUploadingCover] = useState(false);
    const coverInputRef = useRef(null);

    // Form Data
    const [formData, setFormData] = useState({
        title: '',
        bio: '',
        location: '',
        availabilityStatus: 'Available',
        githubUrl: '',
        linkedinUrl: '',
        portfolioUrl: '',
        skills: []
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        if (profile?._id) {
            fetchReviews();
        }
    }, [profile]);

    const fetchProfile = async () => {
        try {
            const { data } = await axios.get('/auth/me');
            setProfile(data);
            setFormData({
                title: data.title || '',
                bio: data.bio || '',
                location: data.location || '',
                availabilityStatus: data.availabilityStatus || 'Available',
                githubUrl: data.githubUrl || '',
                linkedinUrl: data.linkedinUrl || '',
                portfolioUrl: data.portfolioUrl || '',
                skills: data.skills || []
            });
        } catch (err) {
            console.error(err);
            toastError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const { data } = await axios.get(`/reviews/${profile._id}`);
            setReviews(data);
        } catch (err) {
            console.error(err);
        }
    };

    // --- Helpers ---
    const addSkill = () => {
        setFormData({
            ...formData,
            skills: [...formData.skills, { name: '', proficiency: 'Intermediate' }]
        });
    };

    const removeSkill = (index) => {
        const newSkills = formData.skills.filter((_, i) => i !== index);
        setFormData({ ...formData, skills: newSkills });
    };

    const updateSkill = (index, field, value) => {
        const newSkills = formData.skills.map((skill, i) => {
            if (i === index) return { ...skill, [field]: value };
            return skill;
        });
        setFormData({ ...formData, skills: newSkills });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                skills: formData.skills.filter(s => s.name.trim() !== '')
            };
            const { data } = await axios.put('/auth/updatedetails', payload);
            setProfile(data);
            setIsEditing(false);
            success('Profile updated successfully');
        } catch (err) {
            console.error(err);
            toastError('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const onAvatarUploadSuccess = (newAvatarPath) => {
        setProfile((prev) => ({ ...prev, avatar: newAvatarPath }));
        // Update global user state so Navbar updates immediately
        if (user && setUser) {
            setUser({ ...user, avatar: newAvatarPath });
        }
        success('Avatar updated!');
    };

    // Generate a deterministic gradient based on user ID for the cover
    const getCoverGradient = (uid) => {
        if (!uid) return 'linear-gradient(135deg, #6366f1, #8b5cf6)'; // Default fallback
        const hash = uid.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
        const hue1 = hash % 360;
        const hue2 = (hue1 + 40) % 360;
        return `linear-gradient(135deg, hsl(${hue1}, 70%, 50%), hsl(${hue2}, 80%, 40%))`;
    };

    const handleCoverClick = () => {
        coverInputRef.current.click();
    };

    const handleCoverChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('coverImage', file);

        setUploadingCover(true);
        try {
            // Optimistic update
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, coverImage: reader.result }));
            };
            reader.readAsDataURL(file);

            const { data } = await axios.post('/auth/upload-cover', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update with server response
            setProfile(prev => ({ ...prev, coverImage: data.coverImage }));
            success('Cover image updated successfully!');

        } catch (error) {
            console.error(error);
            toastError('Failed to upload cover image');
        } finally {
            setUploadingCover(false);
        }
    };

    const getCoverStyle = (userProfile) => {
        if (userProfile?.coverImage) {
            // Handle both absolute and relative URLs
            const imgUrl = userProfile.coverImage.startsWith('http')
                ? userProfile.coverImage
                : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${userProfile.coverImage}`;
            return { backgroundImage: `url(${imgUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' };
        }
        return { background: getCoverGradient(userProfile?._id) };
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

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12"
        >
            {/* Cover Image Area */}
            <div
                className="h-64 md:h-80 w-full relative group"
                style={getCoverStyle(profile)}
            >
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>

                {/* Change Cover Button - FIXED POSITION */}
                <div className="absolute top-4 right-4 z-20">
                    <input
                        type="file"
                        ref={coverInputRef}
                        hidden
                        accept="image/*"
                        onChange={handleCoverChange}
                    />
                    <Button
                        variant="secondary"
                        className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:bg-white text-gray-700 h-8 text-xs font-medium opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0"
                        size="sm"
                        onClick={handleCoverClick}
                        disabled={uploadingCover}
                    >
                        <Camera className="h-3 w-3 mr-2" />
                        {uploadingCover ? 'Uploading...' : 'Change Cover'}
                    </Button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start mb-8 relative">

                    {/* Avatar with Edit Overlay */}
                    <div className="flex-shrink-0 -mt-20 md:-mt-24 mx-auto md:mx-0 relative group">
                        <AvatarUpload currentAvatar={profile?.avatar} onUploadSuccess={onAvatarUploadSuccess} />
                    </div>

                    {/* Main Info */}
                    <div className="flex-1 text-center md:text-left pt-2 md:pt-0 w-full">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center md:justify-start gap-3">
                                    {profile?.name}
                                    {profile?.isVerified && (
                                        <CheckCircle className="h-6 w-6 text-blue-500 fill-current" />
                                    )}
                                    <TrustBadge rank={profile?.rank} size="sm" />
                                </h1>
                                <p className="text-xl text-gray-600 dark:text-gray-300 font-medium mt-1">{profile?.title || 'No title set'}</p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                                    {profile?.location && (
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" /> {profile.location}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${profile?.availabilityStatus === 'Available' ? 'bg-green-50 text-green-700 border-green-200' :
                                            profile?.availabilityStatus === 'Open to Work' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                            {profile?.availabilityStatus}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-center md:justify-end gap-3 min-w-max">
                                <Button
                                    variant={isEditing ? 'secondary' : 'primary'}
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="shadow-md"
                                >
                                    {isEditing ? 'Cancel Edit' : <><Edit2 className="h-4 w-4 mr-2" /> Edit Profile</>}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT SIDEBAR - Stats & Links */}
                    <div className="space-y-6">

                        {/* Quick Stats */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Dashboard</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{profile?.reviewCount || 0}</div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Projects</div>
                                </div>
                                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-1">
                                        {profile?.averageRating?.toFixed(1) || '0.0'} <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Rating</div>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Connect</h3>
                            <div className="space-y-2">
                                {profile?.githubUrl && (
                                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Github className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">GitHub</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                )}
                                {profile?.linkedinUrl && (
                                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Linkedin className="h-5 w-5 text-blue-600" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">LinkedIn</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                )}
                                {profile?.portfolioUrl && (
                                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 group transition-colors">
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-5 w-5 text-purple-600" />
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Portfolio</span>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                    </a>
                                )}
                                {!profile?.githubUrl && !profile?.linkedinUrl && !profile?.portfolioUrl && (
                                    <div className="text-center py-4 text-gray-500 text-sm">No social links added.</div>
                                )}
                            </div>
                        </div>

                        {/* Skills - Read Only View */}
                        {!isEditing && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profile?.skills?.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                                            title={skill.proficiency}
                                        >
                                            {skill.name}
                                        </span>
                                    ))}
                                    {(!profile?.skills || profile?.skills.length === 0) && (
                                        <div className="text-gray-500 text-sm">No skills listed.</div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT MAIN CONTENT - Edit Form or View Mode */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {isEditing ? (
                                <motion.form
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    key="edit-form"
                                    onSubmit={handleUpdate}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-6"
                                >
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-4">
                                        <Edit2 className="h-5 w-5 text-indigo-600" /> Edit Details
                                    </h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Input
                                            label="Professional Title" id="title" value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        <div className="w-full">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Availability</label>
                                            <select
                                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                                value={formData.availabilityStatus}
                                                onChange={e => setFormData({ ...formData, availabilityStatus: e.target.value })}
                                            >
                                                <option>Available</option>
                                                <option>Busy</option>
                                                <option>Open to Work</option>
                                            </select>
                                        </div>
                                        <Input
                                            label="Location" id="location" value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            placeholder="San Francisco, CA"
                                            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">About Me</label>
                                        <textarea
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                            rows="4"
                                            value={formData.bio}
                                            onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="Tell us about yourself..."
                                        />
                                    </div>

                                    {/* Skills Editor */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Skills</label>
                                        <div className="space-y-3">
                                            {formData.skills.map((skill, index) => (
                                                <div key={index} className="flex gap-2 items-center">
                                                    <SkillAutocompleteInput
                                                        placeholder="Skill Name"
                                                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                                        value={skill.name}
                                                        onChange={val => updateSkill(index, 'name', val)}
                                                    />
                                                    <select
                                                        className="p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                                                        value={skill.proficiency} onChange={e => updateSkill(index, 'proficiency', e.target.value)}
                                                    >
                                                        <option>Beginner</option>
                                                        <option>Intermediate</option>
                                                        <option>Advanced</option>
                                                    </select>
                                                    <button type="button" onClick={() => removeSkill(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
                                                        <XIcon className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <button type="button" onClick={addSkill} className="mt-3 text-sm flex items-center text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                                            <Plus className="h-4 w-4 mr-1" /> Add Skill
                                        </button>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-4">
                                        <Input label="GitHub" value={formData.githubUrl} onChange={e => setFormData({ ...formData, githubUrl: e.target.value })} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        <Input label="LinkedIn" value={formData.linkedinUrl} onChange={e => setFormData({ ...formData, linkedinUrl: e.target.value })} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        <Input label="Portfolio" value={formData.portfolioUrl} onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                    </div>

                                    <div className="pt-4 flex justify-end gap-4">
                                        <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</Button>
                                    </div>
                                </motion.form>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    key="view-mode"
                                    className="space-y-8"
                                >
                                    {/* About Section */}
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                            About Me
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {profile?.bio || <span className="text-gray-400 italic">No bio added yet. Click edit to add one.</span>}
                                        </p>
                                    </div>

                                    {/* Reviews Section */}
                                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                Client Reviews
                                            </h2>
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
                                                                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{review.reviewer?.name || 'Anonymous'}</h4>
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
                                                <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                                                    <Star className="h-8 w-8 text-gray-300 mx-auto mb-3" />
                                                    <p className="text-gray-500 dark:text-gray-400 font-medium">No reviews yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
