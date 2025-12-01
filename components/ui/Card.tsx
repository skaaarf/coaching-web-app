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
                <div className={`relative overflow-hidden bg-gray-100 ${isHorizontal ? 'mr-4 h-16 w-16 flex-shrink-0 rounded-xl' : 'h-40 w-full'}`}>
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                </div>
            );
        }
        if (emoji) {
            return (
                <div className={`flex items-center justify-center bg-gray-50 text-4xl ${isHorizontal ? 'mr-4 h-16 w-16 flex-shrink-0 rounded-xl' : 'h-40 w-full'}`}>
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
                className={`group relative flex w-full overflow-hidden rounded-2xl bg-white p-4 shadow-sm transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''
                    } ${className}`}
            >
                {renderVisual(true)}
                <div className="flex flex-1 flex-col justify-center">
                    {tags && <div className="mb-1 flex flex-wrap gap-2">{tags}</div>}
                    <h3 className="text-base font-bold text-gray-900 line-clamp-1">{title}</h3>
                    {description && (
                        <p className="mt-1 text-xs text-gray-600 line-clamp-2">{description}</p>
                    )}
                    {footer && <div className="mt-2">{footer}</div>}
                </div>
            </div>
        );
    }

    return (
        <div
            onClick={onClick}
            className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-md ${onClick ? 'cursor-pointer' : ''
                } ${className}`}
        >
            {renderVisual(false)}
            <div className="flex flex-1 flex-col p-4">
                {tags && <div className="mb-2 flex flex-wrap gap-2">{tags}</div>}
                <h3 className="mb-1 text-lg font-bold text-gray-900 line-clamp-2">{title}</h3>
                {description && (
                    <p className="mb-4 text-sm text-gray-600 line-clamp-2">{description}</p>
                )}
                {footer && <div className="mt-auto pt-2">{footer}</div>}
            </div>
        </div>
    );
}
