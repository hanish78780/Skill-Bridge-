import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, User, Image as ImageIcon, FileText, Code, Globe, FolderPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../UI/Button';
import { usePayment } from '../../context/PaymentContext';

const ProfileCompletionWidget = ({ user, hasProjects }) => {
    const { handleCreateProjectClick } = usePayment();

    if (!user) return null;

    // Memoize calculation to avoid re-renders
    const { percentage, nextSteps } = useMemo(() => {
        const criteria = [
            {
                id: 'bio',
                label: 'Add a Bio',
                description: 'Tell others about yourself',
                icon: FileText,
                isMet: !!user.bio && user.bio.length > 10,
                weight: 10,
                link: '/profile',
                actionText: 'Edit Profile'
            },
            {
                id: 'avatar',
                label: 'Upload Avatar',
                description: 'Make your profile recognizable',
                icon: User,
                isMet: !!user.avatar,
                weight: 10,
                link: '/profile',
                actionText: 'Upload'
            },
            {
                id: 'cover',
                label: 'Add Cover Image',
                description: 'Personalize your profile header',
                icon: ImageIcon,
                isMet: !!user.coverImage,
                weight: 10,
                link: '/profile',
                actionText: 'Upload'
            },
            {
                id: 'skills',
                label: 'Add Skills (3+)',
                description: 'Showcase your expertise',
                icon: Code,
                isMet: user.skills && user.skills.length >= 3,
                weight: 20,
                link: '/profile',
                actionText: 'Add Skills'
            },
            {
                id: 'socials',
                label: 'Link Socials',
                description: 'Connect GitHub or LinkedIn',
                icon: Globe,
                isMet: !!(user.githubUrl || user.linkedinUrl),
                weight: 20,
                link: '/profile',
                actionText: 'Connect'
            },
            {
                id: 'project',
                label: 'Join or Create Project',
                description: 'Start collaborating',
                icon: FolderPlus,
                // Check if user has participated in any project (active or completed)
                isMet: hasProjects,
                weight: 30,
                link: '/projects/new',
                actionText: 'Create Project'
            }
        ];

        const completedWeight = criteria.reduce((acc, item) => item.isMet ? acc + item.weight : acc, 0);
        // Cap at 100 just in case
        const percentage = Math.min(100, Math.round(completedWeight));
        const nextSteps = criteria.filter(item => !item.isMet);

        return { percentage, nextSteps };
    }, [user, hasProjects]);


    if (percentage === 100) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden"
            >
                <div className="absolute -top-10 -right-10 p-8 opacity-10">
                    <CheckCircle className="w-48 h-48" />
                </div>
                <div className="relative z-10 flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                        <CheckCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">All Set!</h3>
                        <p className="text-green-100 text-sm opacity-90">Your profile is 100% complete.</p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-8"
        >
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Profile Complete
                </h3>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{percentage}%</span>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-6 relative">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative z-10"
                />
            </div>

            {/* Next Steps List */}
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3"> Recommended Actions</h4>
                {nextSteps.slice(0, 3).map((step) => {
                    const Icon = step.icon;
                    // Logic to handle project creation limits
                    const isProjectStep = step.id === 'project';

                    const handleClick = (e) => {
                        if (isProjectStep) {
                            e.preventDefault();
                            handleCreateProjectClick();
                        }
                    };

                    return (
                        <div key={step.id} className="group flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-700/30 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/20 transition-all">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white dark:bg-gray-700 rounded-lg text-gray-400 group-hover:text-indigo-500 transition-colors shadow-sm">
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white text-sm">{step.label}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{step.description}</p>
                                </div>
                            </div>
                            {isProjectStep ? (
                                <Button
                                    size="xs"
                                    variant="secondary"
                                    onClick={handleClick}
                                    className="group-hover:bg-white dark:group-hover:bg-gray-800 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 border-0 shadow-sm text-xs px-3 h-8"
                                >
                                    {step.actionText} <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                            ) : (
                                <Link to={step.link}>
                                    <Button size="xs" variant="secondary" className="group-hover:bg-white dark:group-hover:bg-gray-800 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 border-0 shadow-sm text-xs px-3 h-8">
                                        {step.actionText} <ArrowRight className="w-3 h-3 ml-1" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default ProfileCompletionWidget;
