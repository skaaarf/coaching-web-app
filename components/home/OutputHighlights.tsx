import Badge from '@/components/ui/Badge';
import { AudienceConfig } from '@/data/audienceVariants';

interface OutputHighlightsProps {
    config: AudienceConfig;
}

export default function OutputHighlights({ config }: OutputHighlightsProps) {
    return (
        <section className="mb-8 rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-sm shadow-sm">
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-blue-600">
                        <Badge variant="accent">{config.label}の出口</Badge>
                        <span className="text-gray-500">アウトプットを明示</span>
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-gray-900">
                        ここで得られるもの
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                        {config.purpose}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        {config.toneNote}
                    </p>
                </div>
                {config.switchLink && (
                    <a
                        href={config.switchLink.href}
                        className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-white hover:shadow-sm"
                    >
                        {config.switchLink.label}
                    </a>
                )}
            </div>

            <div className="grid gap-3 border-t border-gray-100 p-6 sm:grid-cols-2">
                {config.outputs.map((item) => (
                    <div
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 text-sm text-gray-800 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
                    >
                        <span className="mt-1 h-6 w-6 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                            •
                        </span>
                        <div className="leading-relaxed">{item}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
