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
        default: 'bg-primary/10 text-primary',
        outline: 'border border-gray-200 text-gray-600',
        secondary: 'bg-gray-100 text-gray-700',
        accent: 'bg-accent/10 text-accent',
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
