import { ReactNode } from 'react';

interface BadgeProps {
    children: ReactNode;
    variant?: 'default' | 'outline' | 'secondary' | 'accent';
    className?: string;
}

export default function Badge({
    children,
    variant = 'default',
    className = '',
}: BadgeProps) {
    const variants = {
        default: 'bg-blue-50 text-blue-700 border border-blue-200',
        outline: 'border border-gray-300 text-gray-700 bg-white',
        secondary: 'bg-teal-50 text-teal-700 border border-teal-200',
        accent: 'bg-orange-50 text-orange-700 border border-orange-200',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
