import Image from 'next/image';

interface ChatBubbleProps {
    message: string;
}

export default function ChatBubble({ message }: ChatBubbleProps) {
    return (
        <div className="flex w-full items-start gap-3 animate-fade-in group">
            {/* Avatar */}
            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl overflow-hidden border border-white/50 bg-gradient-to-br from-blue-100 to-teal-50 shadow-sm transition-transform group-hover:scale-105 duration-300">
                <Image
                    src="/mascot/coach-standing.png"
                    alt="AI進路くん"
                    width={48}
                    height={48}
                    className="object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-1 max-w-[85%]">
                <div className="text-[11px] font-bold text-gray-400 ml-3">AI進路くん</div>
                <div className="bg-white rounded-[20px] rounded-tl-none px-5 py-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="text-slate-800 whitespace-pre-wrap leading-relaxed text-[15px] tracking-wide">
                        {message}
                    </div>
                </div>
            </div>
        </div>
    );
}
