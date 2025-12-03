import Image from 'next/image';

interface ChatBubbleProps {
    message: string;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
    return (
        <div className="flex w-full items-start gap-4 animate-fade-in">
            {/* Avatar */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-teal-50 shadow-md">
                <Image
                    src="/mascot/coach-standing.png"
                    alt="AI進路くん"
                    width={48}
                    height={48}
                    className="object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 max-w-[85%]">
                <div className="text-sm font-semibold text-gray-900">AI進路くん</div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="text-gray-900 whitespace-pre-wrap leading-relaxed text-base">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
}
