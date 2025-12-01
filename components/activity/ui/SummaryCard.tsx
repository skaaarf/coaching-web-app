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
            <div className="divide-y divide-gray-100">
                {items.map((item, index) => (
                    <div key={index} className="flex flex-col gap-1 p-4 sm:flex-row sm:gap-4">
                        <dt className="min-w-[5rem] text-sm font-bold text-gray-500">{item.label}</dt>
                        <dd className="text-sm text-gray-900 whitespace-pre-wrap">{item.value}</dd>
                    </div>
                ))}
            </div>
        </div>
    );
}
