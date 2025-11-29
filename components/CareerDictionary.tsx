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
    <section className="max-w-6xl mx-auto px-4 py-8 sm:py-12 font-sans">
      {viewMode === "list" && (
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-bold tracking-wide uppercase shadow-sm">
              <span>📚</span>
              <span>Career Dictionary</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              進路図鑑
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              多様なキャリアを歩む先輩たちのストーリー。<br className="hidden sm:block" />
              あなたの未来のヒントが見つかるかもしれません。
            </p>
          </div>

          {/* Search & Filter Section */}
          <div className="sticky top-4 z-10 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 p-4 mb-8 transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:max-w-md group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  id="career-search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  type="text"
                  placeholder="気になる職業やキーワードで検索..."
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-none rounded-xl text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-200 outline-none"
                />
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500 whitespace-nowrap">
                <span className="hidden sm:inline">表示:</span>
                <span className="px-3 py-1.5 bg-blue-50 text-blue-700 font-medium rounded-lg">
                  {filteredProfiles.length}件
                </span>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 gap-4 sm:gap-8">
            {filteredProfiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => handleSelectProfile(profile)}
                className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 text-left h-full"
              >
                {/* Card Top Gradient */}
                <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs font-medium opacity-80 mb-1">{profile.kana}</p>
                    <h3 className="text-xl font-bold leading-tight whitespace-nowrap">{profile.name}</h3>
                  </div>
                  <div className="absolute bottom-4 right-4 text-5xl transform translate-y-1/2 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                    {profile.avatar}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 pt-8 flex-1 flex flex-col">
                  <p className="text-xs font-bold text-blue-600 mb-3 uppercase tracking-wide">
                    {profile.headline}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {profile.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4 flex-1">
                    {profile.summary}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-xs font-medium text-gray-400">詳細を見る</span>
                    <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredProfiles.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="text-6xl mb-4">🤔</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">見つかりませんでした</h3>
              <p className="text-gray-500">
                別のキーワードで検索してみてください。
              </p>
            </div>
          )}
        </div>
      )}

      {viewMode === "detail" && selectedProfile && (
        <article className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto sm:max-w-5xl">
          {/* Navigation */}
          <button
            onClick={() => {
              setViewMode("list");
              setSelectedProfile(null);
            }}
            className="group mb-6 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors pl-2"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-blue-200 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            一覧に戻る
          </button>

          <div className="flex flex-col gap-8">
            {/* Trading Card Main View */}
            <div className="relative w-full aspect-[3/5] sm:aspect-auto sm:h-[600px] bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] rounded-[2.5rem] shadow-2xl overflow-hidden text-white p-6 sm:p-10 flex flex-col justify-between">
              {/* Background Effects */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

              {/* Top Section: Score & Meta */}
              <div className="relative z-10 flex justify-between items-start">
                <div className="bg-white/20 backdrop-blur-md rounded-2xl p-3 border border-white/20">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-xl flex items-center justify-center text-4xl sm:text-5xl shadow-inner">
                    {selectedProfile.avatar}
                  </div>
                </div>
                <div className="text-right">
                  {/* Date removed */}
                </div>
              </div>

              {/* Middle Section: Horizontal Text */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
                {/* Headline */}
                <div className="text-lg sm:text-2xl font-bold tracking-wider text-blue-100/90 leading-relaxed mb-6 max-w-2xl">
                  {selectedProfile.headline}
                </div>

                {/* Name Group */}
                <div className="flex flex-col items-center gap-2">
                  <div className="text-4xl sm:text-6xl font-black tracking-widest leading-tight drop-shadow-lg text-white whitespace-nowrap">
                    {selectedProfile.name}
                  </div>
                  <div className="text-sm sm:text-base font-medium tracking-[0.2em] opacity-80 text-blue-100">
                    {selectedProfile.kana}
                  </div>
                </div>
              </div>

              {/* Bottom Section: Tags */}
              <div className="relative z-10">
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedProfile.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-medium shadow-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Details (Below Card) */}
            <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-6 sm:p-10 space-y-10">
              {/* Introduction */}
              <section>
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
                  <span className="w-1 h-6 bg-blue-500 rounded-full" />
                  歩みと背景
                </h3>
                <div className="prose prose-blue max-w-none">
                  <p className="text-gray-700 leading-loose text-base">
                    {selectedProfile.introduction}
                  </p>
                  <blockquote className="mt-6 pl-4 border-l-4 border-blue-200 italic text-gray-600 bg-gray-50 py-4 pr-4 rounded-r-xl">
                    "{selectedProfile.quote}"
                  </blockquote>
                </div>
              </section>

              {/* Timeline */}
              <section>
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
                  <span className="w-1 h-6 bg-purple-500 rounded-full" />
                  人生年表
                </h3>
                <div className="relative pl-4 space-y-8">
                  <div className="absolute left-[27px] top-2 bottom-2 w-0.5 bg-gray-100" />
                  {selectedProfile.timeline.map((entry, idx) => (
                    <div key={idx} className="relative flex gap-4 sm:gap-6 group">
                      {/* Timeline Connector */}
                      <div className="flex-col items-center flex flex-shrink-0 w-12 sm:w-14 pt-1 relative z-10">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-white border-4 border-blue-100 flex items-center justify-center shadow-sm z-10 group-hover:scale-110 transition-transform duration-300">
                          <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full" />
                        </div>
                        <div className="text-[10px] font-bold text-blue-300 mt-1 tracking-widest">STEP</div>
                        <div className="text-lg sm:text-xl font-black text-blue-500/20 leading-none">{String(idx + 1).padStart(2, '0')}</div>
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 bg-white rounded-xl p-4 sm:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 mb-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-50 rounded-bl-full -mr-10 -mt-10 opacity-50" />

                        <div className="relative z-10">
                          <div className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-bold rounded-full mb-2">
                            {entry.label}
                          </div>
                          <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-2 leading-snug">{entry.description}</h4>

                          <div className="space-y-3 mt-4">
                            {entry.reason && (
                              <div className="bg-gray-50/80 rounded-lg p-3 border border-gray-100/50">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="text-xs">💡</span>
                                  <span className="text-[10px] sm:text-xs font-bold text-gray-500">選んだ理由</span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                  {entry.reason}
                                </p>
                              </div>
                            )}

                            {entry.episode && (
                              <div className="bg-blue-50/30 rounded-lg p-3 border border-blue-100/30">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="text-xs">📖</span>
                                  <span className="text-[10px] sm:text-xs font-bold text-blue-600/80">エピソード</span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                  {entry.episode}
                                </p>
                              </div>
                            )}

                            {entry.learnings && (
                              <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100/50">
                                <div className="flex items-center gap-1.5 mb-1">
                                  <span className="text-xs">✨</span>
                                  <span className="text-[10px] sm:text-xs font-bold text-amber-600/80">気づき</span>
                                </div>
                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                                  {entry.learnings}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Interview */}
              <section>
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-6">
                  <span className="w-1 h-6 bg-green-500 rounded-full" />
                  インタビュー
                </h3>
                <div className="grid gap-6 sm:gap-8">
                  {selectedProfile.interview.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-3xl p-6 sm:p-8 border border-gray-100 relative overflow-hidden group hover:shadow-md transition-all duration-300">
                      {/* Decorative Background Number */}
                      <div className="absolute top-0 right-0 text-[100px] sm:text-[120px] leading-none font-black text-gray-100 select-none pointer-events-none -mr-4 -mt-8 opacity-60 group-hover:text-blue-50/80 group-hover:scale-110 transition-all duration-500">
                        {idx + 1}
                      </div>

                      {/* Question */}
                      <div className="relative z-10 mb-6">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-100/50 px-2 py-1 rounded-md uppercase tracking-wider">
                            QUESTION {String(idx + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 leading-snug">
                          {item.question}
                        </h4>
                      </div>

                      {/* Answer */}
                      <div className="relative z-10 flex gap-4 sm:gap-5 pt-5 border-t border-gray-200/60">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-xl sm:text-2xl border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                            {selectedProfile.avatar}
                          </div>
                        </div>
                        <div className="flex-1 pt-1">
                          <p className="text-sm sm:text-base text-gray-700 leading-loose font-medium">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row pt-6 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => onSelectCareer(selectedProfile)}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <span>このストーリーと話す</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode("list");
                    setSelectedProfile(null);
                  }}
                  className="flex-1 border border-gray-200 text-sm font-bold text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  他のストーリーも見る
                </button>
              </div>
            </div>
          </div>
        </article>
      )}
    </section>
  );
});

CareerDictionary.displayName = "CareerDictionary";

export default CareerDictionary;
