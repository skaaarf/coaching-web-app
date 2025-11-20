"use client";

import {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState
} from "react";
import type { CareerProfile } from "@/types";
import { INTERVIEW_QUESTIONS, PROFILE_INPUTS } from "@/lib/data/career-profiles";

export interface CareerDictionaryHandle {
  canGoBack: () => boolean;
  goBack: () => void;
}

interface Props {
  onSelectCareer: (profile: CareerProfile) => void;
}


const CAREER_PROFILES: CareerProfile[] = PROFILE_INPUTS.map(({ interviewAnswers, ...profile }) => ({
  ...profile,
  interview: INTERVIEW_QUESTIONS.map((question, index) => ({
    question,
    answer: interviewAnswers[index] || ""
  }))
}));

const CareerDictionary = forwardRef<CareerDictionaryHandle, Props>(({ onSelectCareer }, ref) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "detail">("list");
  const [selectedProfile, setSelectedProfile] = useState<CareerProfile | null>(null);

  const sortedProfiles = useMemo(() => {
    return [...CAREER_PROFILES].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, []);

  const filteredProfiles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) return sortedProfiles;

    return sortedProfiles.filter((profile) => {
      const haystack = [
        profile.name,
        profile.kana,
        profile.headline,
        profile.summary,
        profile.introduction,
        profile.tags.join(" "),
        profile.keywords.join(" "),
        profile.timeline.map((entry) => `${entry.label} ${entry.description} ${entry.reason}`).join(" ")
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [searchQuery, sortedProfiles]);

  useImperativeHandle(
    ref,
    () => ({
      canGoBack: () => viewMode === "detail",
      goBack: () => {
        setViewMode("list");
        setSelectedProfile(null);
      }
    }),
    [viewMode]
  );

  const handleSelectProfile = (profile: CareerProfile) => {
    setSelectedProfile(profile);
    setViewMode("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {viewMode === "list" && (
        <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-6 border-b border-gray-100">
            <p className="text-xs font-semibold text-blue-600 tracking-wide uppercase mb-2">進路図鑑</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">更新順</h2>
                <p className="text-sm text-gray-500">全{CAREER_PROFILES.length}件中、{filteredProfiles.length}件を表示</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100">
                  <span>⏱</span>
                  <span>最新投稿を優先</span>
                </span>
              </div>
            </div>
            <div className="mt-5">
              <label htmlFor="career-search" className="sr-only">
                名前・キーワードで検索
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                <input
                  id="career-search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  type="text"
                  placeholder="名前・キーワードで検索"
                  className="w-full rounded-2xl border border-gray-200 px-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredProfiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => handleSelectProfile(profile)}
                className="w-full text-left px-6 py-5 hover:bg-gray-50 focus-visible:bg-gray-50 transition-colors"
              >
                <div className="flex gap-4">
                  <div className="text-4xl" aria-hidden>
                    {profile.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-lg font-semibold text-gray-900 truncate">
                        {profile.name}
                      </p>
                      <span className="text-xs text-gray-400">
                        {new Date(profile.updatedAt).toLocaleDateString("ja-JP", {
                          month: "numeric",
                          day: "numeric"
                        })}
                        更新
                      </span>
                    </div>
                    <p className="text-xs text-blue-600 font-medium mt-0.5">{profile.headline}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profile.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 mt-3 line-clamp-2">
                      {profile.summary}
                    </p>
                  </div>
                </div>
              </button>
            ))}

            {filteredProfiles.length === 0 && (
              <p className="px-6 py-12 text-center text-sm text-gray-500">
                条件に合うストーリーが見つかりませんでした。
              </p>
            )}
          </div>
        </div>
      )}

      {viewMode === "detail" && selectedProfile && (
        <article className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-7 border-b border-gray-100">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="text-5xl" aria-hidden>
                  {selectedProfile.avatar}
                </div>
                <div>
                  <p className="text-sm text-gray-500">{selectedProfile.kana}</p>
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProfile.name}</h2>
                  <p className="text-sm text-blue-600 font-semibold mt-1">{selectedProfile.headline}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedProfile.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">自己採点</p>
                <p className="text-4xl font-bold text-gray-900">{selectedProfile.score}点</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(selectedProfile.updatedAt).toLocaleDateString("ja-JP")}
                  更新
                </p>
              </div>
            </div>
          </div>

          <div className="px-6 py-8 space-y-8">
            <section className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
              <p className="text-xs font-semibold text-gray-500 mb-2">紹介文</p>
              <p className="text-sm text-gray-800 leading-relaxed">{selectedProfile.summary}</p>
            </section>

            <section className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <p className="text-xs font-semibold text-blue-600 mb-2">歩みと背景</p>
              <p className="text-sm text-gray-800 leading-relaxed">{selectedProfile.introduction}</p>
              <p className="text-sm text-blue-900 italic mt-3">“{selectedProfile.quote}”</p>
            </section>

            <section>
              <p className="text-xs font-semibold text-gray-500 mb-3">キーワード</p>
              <div className="flex flex-wrap gap-2">
                {selectedProfile.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-gray-500">人生年表</p>
                <span className="text-xs text-gray-400">選択の背景つき</span>
              </div>
              <div className="space-y-4">
                {selectedProfile.timeline.map((entry) => (
                  <div key={`${selectedProfile.id}-${entry.label}`} className="border border-gray-200 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-blue-600">{entry.label}</p>
                    <p className="text-sm text-gray-900 mt-1">{entry.description}</p>
                    <p className="text-xs text-gray-500 mt-2">選んだ理由：{entry.reason}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold text-gray-500 mb-3">インタビュー</p>
              <div className="space-y-4">
                {selectedProfile.interview.map((item) => (
                  <div key={item.question} className="bg-gray-50 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-blue-600">{item.question}</p>
                    <p className="text-sm text-gray-800 mt-2 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold text-gray-500 mb-3">学んだこと</p>
              <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
                {selectedProfile.lessons.map((lesson) => (
                  <li key={lesson}>{lesson}</li>
                ))}
              </ul>
            </section>

            <section className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => onSelectCareer(selectedProfile)}
                className="flex-1 bg-blue-600 text-white text-sm font-semibold px-6 py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition-colors"
              >
                このストーリーについて話してみる
              </button>
              <button
                type="button"
                onClick={() => {
                  setViewMode("list");
                  setSelectedProfile(null);
                }}
                className="flex-1 border border-gray-200 text-sm font-semibold text-gray-700 px-6 py-4 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                他のストーリーも見る
              </button>
            </section>
          </div>
        </article>
      )}
    </section>
  );
});

CareerDictionary.displayName = "CareerDictionary";

export default CareerDictionary;
