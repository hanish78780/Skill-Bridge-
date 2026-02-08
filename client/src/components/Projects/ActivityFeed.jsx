import { Activity, Clock, CheckCircle, UserPlus, FileText, MessageSquare } from 'lucide-react';

const ActivityFeed = ({ activities = [] }) => {
    if (!activities || activities.length === 0) {
        return (
            <div className="text-center py-8 text-gray-400">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No recent activity</p>
            </div>
        );
    }

    const getIcon = (action) => {
        switch (action) {
            case 'project_created': return <FileText className="h-4 w-4" />;
            case 'task_created': return <CheckCircle className="h-4 w-4" />;
            case 'member_added': return <UserPlus className="h-4 w-4" />;
            case 'comment_added': return <MessageSquare className="h-4 w-4" />;
            default: return <Clock className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {activities.map((activity, index) => (
                <div key={activity._id || index} className="flex gap-4 relative">
                    {index !== activities.length - 1 && (
                        <div className="absolute left-[15px] top-8 bottom-[-24px] w-0.5 bg-gray-100 dark:bg-gray-800" />
                    )}
                    <div className="relative z-10">
                        <div className="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border-2 border-white dark:border-gray-900">
                            {getIcon(activity.action)}
                        </div>
                    </div>
                    <div className="flex-1 py-1">
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                <span className="font-bold">{activity.user?.name}</span> {activity.description || activity.action.replace('_', ' ')}
                            </p>
                            <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                {new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            </span>
                        </div>
                        {activity.details && (
                            <p className="text-xs text-gray-500 mt-1 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                                {Json.stringify(activity.details)}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityFeed;
