import { CheckCircle2 } from 'lucide-react';

interface SummaryCardProps {
    title: string;
    items: { label: string; value: string }[];
    onConfirm?: () => void; // Optional if we want a button inside
}

export default function SummaryCard({ title, items }: SummaryCardProps) {
    return (
        <div className="w-full overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="bg-primary/5 px-4 py-3 border-b border-primary/10">
                <h3 className="flex items-center gap-2 font-bold text-primary">
                    <CheckCircle2 className="h-5 w-5" />
                    {title}
                </h3>
            </div>
            <div className="p-4 space-y-6">
                {items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                        {/* Number Badge */}
                        <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                            {index + 1}
                        </div>

                        <div className="flex flex-col gap-1">
                            {/* Title */}
                            <dt className="font-bold text-gray-900">{item.label}</dt>

                            {/* Content */}
                            <dd className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">
                                {item.value}
                            </dd>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
