import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Link as LinkIcon, Mail, Calendar, Star, Award, Briefcase, User } from 'lucide-react';
import Button from '../components/UI/Button';
import PageTransition from '../components/PageTransition';

const PublicProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Determine if ID is valid MongoID or assume it might be username if implemented
                // For now assuming ID
                const { data } = await axios.get(`/users/${id}`); // Adjust endpoint if needed
                setProfile(data);

                // Fetch reviews
                try {
                    const reviewsRes = await axios.get(`/reviews/user/${id}`);
                    setReviews(reviewsRes.data);
                } catch (reviewErr) {
                    console.log('Failed to fetch reviews', reviewErr);
                }

            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('User not found');
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProfile();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (error || !profile) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <User className="h-16 w-16 text-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User not found</h1>
            <p className="text-gray-500">The profile you are looking for does not exist.</p>
        </div>
    );

    return (
        <PageTransition>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    {/* Cover Image */}
                    <div className="h-48 w-full bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                        {profile.coverImage && (
                            <img
                                src={profile.coverImage}
                                alt="Cover"
                                className="w-full h-full object-cover opacity-80"
                            />
                        )}
                    </div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-16 mb-6">
                            <div className="flex items-end gap-6">
                                <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 overflow-hidden shadow-lg">
                                    {profile.avatar ? (
                                        <img
                                            src={profile.avatar.startsWith('http') ? profile.avatar : `http://localhost:5000${profile.avatar}`}
                                            alt={profile.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 text-4xl font-bold">
                                            {profile.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="mb-2">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {profile.name}
                                        {profile.isVerified && <CheckCircle className="h-5 w-5 text-blue-500" />}
                                    </h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-300">{profile.title || 'Developer'}</p>
                                </div>
                            </div>
                            <div className="mb-2">
                                {/* Action buttons like 'Message' could go here */}
                            </div>
                        </div>

                        {/* Bio & Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-8">
                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">About</h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                        {profile.bio || "No bio provided."}
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                        <Award className="h-5 w-5 text-indigo-500" />
                                        Skills
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills?.length > 0 ? (
                                            profile.skills.map((skill, index) => (
                                                <span key={index} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
                                                    {skill.name} <span className="text-indigo-400 text-xs ml-1">• {skill.proficiency}</span>
                                                </span>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic">No skills listed.</p>
                                        )}
                                    </div>
                                </section>

                                {/* Reviews Section */}
                                <section>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        <Star className="h-5 w-5 text-yellow-500" />
                                        Reviews ({reviews.length})
                                    </h3>
                                    <div className="space-y-4">
                                        {reviews.length > 0 ? (
                                            reviews.map((review) => (
                                                <div key={review._id} className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-xl">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-semibold text-gray-900 dark:text-white">{review.reviewer?.name || 'Anonymous'}</div>
                                                            <span className="text-xs text-gray-400">• {new Date(review.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{review.comment}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic">No reviews yet.</p>
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Sidebar Stats */}
                            <div className="space-y-6">
                                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 space-y-4">
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                        <span>{profile.location || 'Remote'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <Calendar className="h-5 w-5 text-gray-400" />
                                        <span>Joined {new Date(profile.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {profile.githubUrl && (
                                        <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-indigo-600 hover:text-indigo-700 transition-colors">
                                            <LinkIcon className="h-5 w-5" />
                                            <span>GitHub Profile</span>
                                        </a>
                                    )}
                                    {profile.linkedinUrl && (
                                        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-blue-600 hover:text-blue-700 transition-colors">
                                            <LinkIcon className="h-5 w-5" />
                                            <span>LinkedIn Profile</span>
                                        </a>
                                    )}
                                </div>

                                <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                                            {profile.averageRating?.toFixed(1) || '0.0'}
                                        </div>
                                        <div className="flex justify-center text-yellow-400 mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`h-5 w-5 ${i < Math.round(profile.averageRating || 0) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Average Rating</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default PublicProfile;
