import { Sparkles } from 'lucide-react';

interface ChatBubbleProps {
    message: string;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
    return (
        <div className="flex w-full items-start gap-4">
            {/* Avatar */}
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#FF5722] text-white shadow-sm">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M12 3L2 21h20L12 3z" />
                </svg>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 max-w-[85%]">
                <span className="font-bold text-gray-900">Coach</span>
                <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {message}
                </div>
            </div>
        </div>
    );
}
