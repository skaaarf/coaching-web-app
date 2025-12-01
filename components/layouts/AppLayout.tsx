'use client';

import { ReactNode } from 'react';
import SidebarNavigation from './SidebarNavigation';
import BottomNavigation from './BottomNavigation';

interface AppLayoutProps {
    children: ReactNode;
    showNavigation?: boolean;
    showChat?: boolean;
    chatContent?: ReactNode;
}

export default function AppLayout({
    children,
    showNavigation = true,
    showChat = false,
    chatContent,
}: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Desktop Sidebar */}
            {showNavigation && (
                <div className="hidden lg:block">
                    <SidebarNavigation />
                </div>
            )}

            {/* Main Content */}
            <main className={`relative min-h-screen ${showNavigation ? 'lg:pl-64' : ''} ${showChat ? 'lg:pr-96' : ''} pb-20 lg:pb-0`}>
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>

            {/* Desktop Chat Sidebar (Right) */}
            {showChat && chatContent && (
                <div className="hidden lg:block fixed right-0 top-0 z-40 h-screen w-96 border-l border-gray-200 bg-white shadow-lg">
                    {chatContent}
                </div>
            )}

            {/* Mobile Bottom Navigation */}
            {showNavigation && (
                <div className="lg:hidden">
                    <BottomNavigation />
                </div>
            )}
        </div>
    );
}
