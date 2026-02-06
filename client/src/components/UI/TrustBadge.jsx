
import { Shield, ShieldCheck, Award } from 'lucide-react';

const TrustBadge = ({ rank = 'Newcomer', size = 'md' }) => {
    const configs = {
        Newcomer: {
            icon: Shield,
            color: 'text-gray-400',
            bg: 'bg-gray-100 dark:bg-gray-800',
            label: 'Newcomer'
        },
        Trusted: {
            icon: ShieldCheck,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            label: 'Trusted'
        },
        Expert: {
            icon: Award,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            label: 'Expert'
        }
    };

    const config = configs[rank] || configs.Newcomer;
    const Icon = config.icon;

    const sizeClasses = {
        sm: 'h-6 px-2 text-xs',
        md: 'h-8 px-3 text-sm',
        lg: 'h-10 px-4 text-base'
    };

    const iconSizes = {
        sm: 'w-3 h-3 mr-1',
        md: 'w-4 h-4 mr-1.5',
        lg: 'w-5 h-5 mr-2'
    };

    return (
        <div className={`inline-flex items-center rounded-full font-medium ${config.color} ${config.bg} ${sizeClasses[size]} border border-transparent`}>
            <Icon className={iconSizes[size]} />
            {config.label}
        </div>
    );
};

export default TrustBadge;
