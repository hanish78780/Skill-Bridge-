import { useState, useEffect } from 'react';
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

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-8 animate-pulse">
                <Skeleton className="h-64 w-full rounded-b-3xl" />
                <div className="px-8 -mt-20 flex gap-6 items-end">
                    <Skeleton className="h-40 w-40 rounded-full border-4 border-white" />
                    <div className="space-y-2 mb-4">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto pb-12"
        >
            {/* 1. Header & Banner */}
            <div className="relative mb-20 group">
                <div className="h-64 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-b-3xl shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                </div>

                <div className="absolute -bottom-16 left-8 md:left-12 flex items-end">
                    <AvatarUpload currentAvatar={profile?.avatar} onUploadSuccess={onAvatarUploadSuccess} />

                    <div className="ml-6 mb-4 hidden md:block">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {profile?.name}
                            <TrustBadge rank={profile?.rank} size="sm" />
                            {profile?.isVerified && (
                                <span title="Verified Developer" className="text-blue-500">
                                    <CheckCircle className="h-6 w-6 fill-blue-500 text-white" />
                                </span>
                            )}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">{profile?.title}</p>
                        {profile?.location && (
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <MapPin className="h-4 w-4 mr-1" /> {profile.location}
                            </div>
                        )}
                    </div>
                </div>

                <div className="absolute -bottom-16 right-8 md:right-12 mb-4">
                    <Button
                        variant={isEditing ? 'secondary' : 'primary'}
                        onClick={() => setIsEditing(!isEditing)}
                        className="shadow-lg"
                    >
                        {isEditing ? 'Cancel Edit' : <><Edit2 className="h-4 w-4 mr-2" /> Edit Profile</>}
                    </Button>
                </div>
            </div>

            {/* Mobile Name (visible only on small) */}
            <div className="md:hidden px-6 mb-8 text-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                    {profile?.name}
                    {profile?.isVerified && <CheckCircle className="h-5 w-5 text-blue-500 fill-current" />}
                </h1>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium">{profile?.title}</p>
                {profile?.location && (
                    <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 gap-1 mt-1">
                        <MapPin className="h-3 w-3" /> {profile.location}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 sm:px-8">

                {/* LEFT COLUMN: Stats & Socials */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-900 dark:text-white">Status</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${profile?.availabilityStatus === 'Available' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                profile?.availabilityStatus === 'Open to Work' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                {profile?.availabilityStatus}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center">
                                <div className="font-bold text-lg text-gray-900 dark:text-white">{profile?.reviewCount}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Projects</div>
                            </div>
                            <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl text-center">
                                <div className="font-bold text-lg flex items-center justify-center gap-1 text-gray-900 dark:text-white">
                                    {profile?.averageRating?.toFixed(1)} <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* Links Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-4">On the web</h3>
                        <div className="space-y-3">
                            {profile?.githubUrl && (
                                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group text-gray-600 dark:text-gray-300">
                                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-3 group-hover:bg-white dark:group-hover:bg-gray-600 transition-colors">
                                        <Github className="h-5 w-5" />
                                    </div>
                                    <span className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">GitHub</span>
                                    <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            )}
                            {profile?.linkedinUrl && (
                                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group text-gray-600 dark:text-gray-300">
                                    <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg mr-3 group-hover:bg-white dark:group-hover:bg-blue-900/30 transition-colors">
                                        <Linkedin className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">LinkedIn</span>
                                    <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            )}
                            {profile?.portfolioUrl && (
                                <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group text-gray-600 dark:text-gray-300">
                                    <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded-lg mr-3 group-hover:bg-white dark:group-hover:bg-purple-900/30 transition-colors">
                                        <Globe className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <span className="font-medium group-hover:text-purple-600 dark:group-hover:text-purple-400">Portfolio</span>
                                    <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                                </a>
                            )}
                            {!profile?.githubUrl && !profile?.linkedinUrl && !profile?.portfolioUrl && (
                                <p className="text-gray-400 text-sm italic">No links added yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Bio, Skills, Reviews (or Edit Form) */}
                <div className="lg:col-span-2 space-y-8">
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
                                <section className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About Me</h2>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {profile?.bio || <span className="text-gray-400 italic">No bio added yet. Click edit to add one.</span>}
                                    </p>
                                </section>

                                {/* Skills Section */}
                                <section>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                                        Skills <span className="ml-2 text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400 px-2 py-0.5 rounded-full">{profile?.skills?.length || 0}</span>
                                    </h2>
                                    <div className="flex flex-wrap gap-3">
                                        {profile?.skills?.map((skill, i) => (
                                            <motion.div
                                                whileHover={{ y: -2 }}
                                                key={i}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium border flex items-center gap-2 ${skill.proficiency === 'Advanced' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800' :
                                                    skill.proficiency === 'Intermediate' ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' :
                                                        'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'
                                                    }`}
                                            >
                                                {skill.name}
                                                <div className={`w-1.5 h-1.5 rounded-full ${skill.proficiency === 'Advanced' ? 'bg-indigo-500' :
                                                    skill.proficiency === 'Intermediate' ? 'bg-blue-500' :
                                                        'bg-gray-400'
                                                    }`}></div>
                                                <span className="text-[10px] uppercase opacity-60 ml-1 font-bold">{skill.proficiency}</span>
                                            </motion.div>
                                        ))}
                                        {(!profile?.skills || profile.skills.length === 0) && (
                                            <p className="text-gray-500 dark:text-gray-400 italic">No skills added.</p>
                                        )}
                                    </div>
                                </section>

                                {/* Reviews Section */}
                                <section>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Reviews</h2>
                                    </div>

                                    {reviews.length === 0 ? (
                                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 text-center border border-dashed border-gray-200 dark:border-gray-700">
                                            <Star className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
                                        </div>
                                    ) : (
                                        <div className="grid gap-4">
                                            {reviews.map((review) => (
                                                <div key={review._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-3">
                                                            {review.reviewer?.avatar ? (
                                                                <img
                                                                    src={review.reviewer.avatar.startsWith('http') ? review.reviewer.avatar : `${(import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '')}${review.reviewer.avatar}`}
                                                                    alt={review.reviewer.name}
                                                                    className="h-10 w-10 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                                    {review.reviewer?.name?.charAt(0)}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <h4 className="font-bold text-gray-900 dark:text-white text-sm">{review.reviewer?.name}</h4>
                                                                <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-200 dark:text-gray-700'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">"{review.comment}"</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </section>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
