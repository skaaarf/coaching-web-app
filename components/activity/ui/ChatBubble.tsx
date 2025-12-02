import { Sparkles } from 'lucide-react';

interface ChatBubbleProps {
    message: string;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
    return (
        <div className="flex w-full items-start gap-4">
            {/* Avatar */}
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#5B50E6] text-xs font-bold text-white shadow-sm">
                AI
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 max-w-[90%] pt-1">
                <div className="text-gray-900 whitespace-pre-wrap leading-relaxed">
                    {message}
                </div>
            </div>
        </div>
    );
}
