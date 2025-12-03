'use client';

import Image from 'next/image';
import { ReactNode } from 'react';

interface CardProps {
    title: string;
    description?: string;
    imageUrl?: string;
    emoji?: string;
    tags?: ReactNode;
    footer?: ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'vertical' | 'horizontal';
}

export default function Card({
    title,
    description,
    imageUrl,
    emoji,
    tags,
    footer,
    onClick,
    className = '',
    variant = 'vertical',
}: CardProps) {
    const renderVisual = (isHorizontal: boolean) => {
        if (imageUrl) {
            return (
                <div className={`relative overflow-hidden bg-gradient-to-br from-blue-50 to-teal-50 ${isHorizontal ? 'mr-4 h-20 w-20 flex-shrink-0 rounded-2xl' : 'h-48 w-full rounded-t-2xl'}`}>
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                </div>
            );
        }
        if (emoji) {
            return (
                <div className={`flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 text-5xl ${isHorizontal ? 'mr-4 h-20 w-20 flex-shrink-0 rounded-2xl' : 'h-48 w-full rounded-t-2xl'}`}>
                    {emoji}
                </div>
            );
        }
        return null;
    };

    if (variant === 'horizontal') {
        return (
            <div
                onClick={onClick}
                className={`group relative flex w-full overflow-hidden rounded-2xl bg-white border border-gray-200 p-4 transition-all hover:shadow-lg hover:border-blue-300 hover:-translate-y-1 ${onClick ? 'cursor-pointer' : ''
                    } ${className}`}
            >
                {renderVisual(true)}
                <div className="flex flex-1 flex-col justify-center">
                    {tags && <div className="mb-2 flex flex-wrap gap-2">{tags}</div>}
                    <h3 className="text-base font-bold text-gray-900 line-clamp-1">{title}</h3>
                    {description && (
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{description}</p>
                    )}
                    {footer && <div className="mt-2">{footer}</div>}
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200 transition-all hover:shadow-xl hover:border-blue-300 hover:-translate-y-2 ${onClick ? 'cursor-pointer' : ''
                } ${className}`}
        >
            {renderVisual(false)}
            <div className="flex flex-1 flex-col p-5">
                {tags && <div className="mb-3 flex flex-wrap gap-2">{tags}</div>}
                <h3 className="mb-2 text-lg font-bold text-gray-900 line-clamp-2">{title}</h3>
                {description && (
                    <p className="mb-4 text-sm text-gray-600 line-clamp-3">{description}</p>
                )}
                {footer && <div className="mt-auto pt-2">{footer}</div>}
            </div>
        </div>
    );
}
