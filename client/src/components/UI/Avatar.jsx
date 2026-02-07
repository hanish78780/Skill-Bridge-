import React, { useState } from 'react';
import clsx from 'clsx';
import { User } from 'lucide-react';

const Avatar = ({ src, alt, size = 'md', className, ...props }) => {
    const [imgError, setImgError] = useState(false);

    const sizes = {
        xs: 'h-6 w-6 text-xs',
        sm: 'h-8 w-8 text-xs',
        md: 'h-10 w-10 text-sm',
        lg: 'h-12 w-12 text-base',
        xl: 'h-16 w-16 text-lg',
        '2xl': 'h-24 w-24 text-xl'
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const sizeClasses = sizes[size] || sizes.md;

    if (!src || imgError) {
        return (
            <div
                className={clsx(
                    "relative inline-flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 font-medium overflow-hidden border border-white dark:border-gray-800",
                    sizeClasses,
                    className
                )}
                {...props}
            >
                {alt ? (
                    <span>{getInitials(alt)}</span>
                ) : (
                    <User className="h-[60%] w-[60%]" />
                )}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt || "Avatar"}
            className={clsx(
                "object-cover rounded-full border border-white dark:border-gray-800",
                sizeClasses,
                className
            )}
            onError={() => setImgError(true)}
            {...props}
        />
    );
};

export default Avatar;
