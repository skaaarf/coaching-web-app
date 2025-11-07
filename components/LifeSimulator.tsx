'use client';

import { useState } from 'react';
import { LifePath } from '@/types';

const LIFE_PATHS: LifePath[] = [
  {
    id: 'A',
    title: 'Aの人生（大企業・安定キャリア）',
    timeline: [
      { age: 18, event: '国立大学経済学部入学。親が喜んでくれた' },
      { age: 22, event: '就活で30社受けて大手メーカーに内定。年収400万' },
      { age: 25, event: '大阪支社に転勤。恋人と遠距離になったが結婚を決意' },
      { age: 27, event: '結婚。配偶者の仕事のため東京本社に異動願い' },
      { age: 30, event: '主任に昇進。年収550万。35年ローンでマイホーム購入' },
      { age: 32, event: '第一子誕生。育児と仕事の両立に苦悩' },
      { age: 35, event: '課長に昇進。年収700万。部下10人のマネジメントで休日も仕事' },
      { age: 40, event: '第二子の中学受験。教育費がかさむが貯金できている' },
      { age: 45, event: '部長に昇進。年収950万。でも出張が増えて家族との時間激減' },
      { age: 50, event: '役員の道か、子会社への出向か。人生の岐路' },
      { age: 55, event: '子会社の社長として出向。年収1100万。責任は重い' },
      { age: 60, event: '定年退職。退職金2500万。年金と貯金で老後は安心' }
    ],
    aspects: [
      '毎月の給料が確実。家族を養える安心感',
      '会社の名刺で自己紹介できる社会的信用',
      '福利厚生充実。住宅補助や育児支援',
      '定年まで働ける。老後の計画が立てやすい',
      '大きな組織の一員として社会に貢献',
      'キャリアパスが見える。昇進のロードマップ'
    ]
  },
  {
    id: 'B',
    title: 'Bの人生（ベンチャー・スタートアップ）',
    timeline: [
      { age: 18, event: '私立大学ビジネス学部。学費は奨学金とバイトで' },
      { age: 20, event: '学生起業のイベントで仲間と出会う。何か始めたい' },
      { age: 22, event: '創業3年のベンチャー企業に入社。年収350万。オフィスは雑居ビル' },
      { age: 24, event: '会社が急成長。忙しすぎて恋人と別れる' },
      { age: 26, event: 'マネージャーに。年収550万。株式もらう。でも毎日終電' },
      { age: 28, event: '会社がIPO（上場）。ストックオプションで800万円の利益' },
      { age: 30, event: '役員に。年収900万。だが激務で体調崩す' },
      { age: 32, event: '別のスタートアップに転職。年収700万→すぐ年収1000万に' },
      { age: 35, event: '自分でもスタートアップ起業。資金調達1億円' },
      { age: 38, event: '事業撤退。失敗。でもまた別の会社を立ち上げる' },
      { age: 42, event: '2社目が軌道に乗る。年収1500万。やっと結婚' },
      { age: 50, event: '会社を売却。2億円の利益。次は何する？人生まだこれから' }
    ],
    aspects: [
      '20代から裁量大。自分の判断で動ける',
      '急成長の興奮。毎日が刺激的',
      'ストックオプションで大金の可能性',
      '優秀な仲間との切磋琢磨',
      '失敗しても再挑戦できる環境',
      '若くして経営に近い位置で働ける'
    ]
  },
  {
    id: 'C',
    title: 'Cの人生（クリエイティブ・フリーランス）',
    timeline: [
      { age: 18, event: '美大受験に失敗。専門学校デザイン科へ' },
      { age: 20, event: '学校の課題で賞を取る。少し自信がついた' },
      { age: 21, event: '制作会社にインターン。厳しいけど勉強になる' },
      { age: 22, event: '正社員として就職。年収280万。残業代なし。でも好きな仕事' },
      { age: 25, event: '副業でフリーランス開始。会社の給料より稼げるように' },
      { age: 27, event: '独立を決意。収入不安定だが自由。年収400万（変動大）' },
      { age: 30, event: '大手企業から案件受注。信用が上がる。年収600万' },
      { age: 33, event: '結婚。配偶者は会社員で安定。自分はフリーで挑戦続ける' },
      { age: 35, event: '海外クライアントとも仕事。年収800万。でも休みなし' },
      { age: 40, event: '若手を雇ってチーム制作へ。収入安定。年収1000万' },
      { age: 45, event: 'デザインより経営。これは望んだ形？悩む' },
      { age: 50, event: 'またひとりに戻る。小さく好きなことだけやる。年収500万で充分' }
    ],
    aspects: [
      '好きなことを仕事に。朝起きるのが楽しい',
      '自分のペースで働ける。通勤なし',
      '嫌な仕事・嫌な人とは付き合わない自由',
      '作ったものが形に残る。ポートフォリオが誇り',
      '収入は自分次第。上限なし',
      '会社の政治とは無縁。純粋に腕で勝負'
    ]
  },
  {
    id: 'D',
    title: 'Dの人生（地元・地域密着）',
    timeline: [
      { age: 18, event: '大学進学せず。地元の中小企業に就職' },
      { age: 20, event: '高卒同期は地元に残ったのは自分だけ。寂しい' },
      { age: 22, event: '大卒の同級生が帰ってきた。給料差を感じる' },
      { age: 25, event: '地元で結婚。式は同級生みんな来てくれた' },
      { age: 28, event: '第一子誕生。両親が近くにいて子育て助かる' },
      { age: 30, event: '実家の近くに家を建てる。ローンは余裕で組めた' },
      { age: 35, event: '係長に昇進。年収450万。地元では十分生活できる' },
      { age: 40, event: '子どもの運動会、PTA、地域の祭り。忙しいけど充実' },
      { age: 45, event: '親の介護が始まる。でも近くにいてよかった' },
      { age: 50, event: '課長に。年収550万。同級生とは今も飲み友達' },
      { age: 55, event: '地域の商工会の役員に。会社外でも頼られる存在' },
      { age: 60, event: '定年後は地域活動に専念。孫の面倒見るのが楽しみ' }
    ],
    aspects: [
      '家族・親族が近くにいる安心感',
      '子どもの頃からの友人がそばにいる',
      '通勤時間短い。毎日家に帰れる',
      '生活費が安い。同じ給料でも豊かに暮らせる',
      '地域に根ざした人生。顔の見える関係',
      '親の介護にすぐ対応できる'
    ]
  },
  {
    id: 'E',
    title: 'Eの人生（専門職・手に職）',
    timeline: [
      { age: 18, event: '医療系専門学校入学。3年間みっちり勉強' },
      { age: 21, event: '国家資格取得。病院に就職。夜勤あり。年収350万' },
      { age: 25, event: '経験積んで転職。年収480万。夜勤手当が大きい' },
      { age: 28, event: '結婚・出産で一時離職。資格あるから復帰は容易' },
      { age: 31, event: 'パートで復帰。週3日勤務で年収250万' },
      { age: 35, event: '子育て落ち着いてフルタイムに。年収500万' },
      { age: 40, event: '専門性を活かして大学病院へ転職。年収600万' },
      { age: 45, event: '認定資格を追加取得。専門分野で頼られる存在' },
      { age: 50, event: '後輩の指導にも力を入れる。年収650万' },
      { age: 55, event: '嘱託で大学の講師も兼任。年収700万' },
      { age: 60, event: '定年後も非常勤で働ける。資格は一生の武器' },
      { age: 65, event: '完全リタイア。医療現場で多くの人の役に立てた人生' }
    ],
    aspects: [
      '資格があるから失業しない。一生食べていける',
      '転職・復職が容易。ライフステージに合わせて働ける',
      '人の役に立つ実感。やりがいが目に見える',
      '夜勤・休日手当で意外と稼げる',
      '専門性を極められる。スペシャリストの道',
      '全国どこでも働ける。引っ越しに強い'
    ]
  }
];

interface Props {
  onComplete: (selectedAspects: Record<string, string[]>) => void;
}

export default function LifeSimulator({ onComplete }: Props) {
  const [currentPath, setCurrentPath] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const handleAspectToggle = (pathId: string, aspect: string) => {
    const currentSelections = selections[pathId] || [];
    let newSelections: string[];

    if (currentSelections.includes(aspect)) {
      newSelections = currentSelections.filter(a => a !== aspect);
    } else {
      if (currentSelections.length < 3) {
        newSelections = [...currentSelections, aspect];
      } else {
        return; // Already selected 3
      }
    }

    setSelections({
      ...selections,
      [pathId]: newSelections
    });
  };

  const handleNext = () => {
    if (currentPath < LIFE_PATHS.length - 1) {
      setCurrentPath(currentPath + 1);
    } else {
      onComplete(selections);
    }
  };

  const path = LIFE_PATHS[currentPath];
  const currentSelections = selections[path.id] || [];
  const canProceed = currentSelections.length >= 1 && currentSelections.length <= 3;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-center space-x-3 mb-4">
          {LIFE_PATHS.map((_, index) => (
            <div
              key={index}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                index === currentPath
                  ? 'bg-blue-500 text-white shadow-lg'
                  : index < currentPath
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {String.fromCharCode(65 + index)}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-gray-600 font-medium">
          {currentPath + 1} / {LIFE_PATHS.length} の人生
        </p>
      </div>

      <div className="bg-white rounded-2xl border-2 border-gray-300 p-5 shadow-lg">
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {path.title}
          </h2>
        </div>

        {/* Timeline - AT THE TOP */}
        <div className="mb-6 bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
            <span className="text-lg mr-2">📖</span>
            人生の詳細
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {path.timeline.map((event, index) => (
              <div key={index} className="flex items-start text-sm">
                <div className="flex-shrink-0 w-12 font-semibold text-blue-600">
                  {event.age}歳:
                </div>
                <div className="flex-grow text-gray-700">{event.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Selection Counter - PROMINENT */}
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 rounded-xl p-4">
          <div className="text-center">
            <p className="text-base font-bold text-gray-900 mb-2">
              💡 好きなポイントを1〜3つ選んでください
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className={`text-3xl font-bold ${currentSelections.length >= 1 ? 'text-green-600' : 'text-blue-600'}`}>
                {currentSelections.length}
              </div>
              <span className="text-sm text-gray-700">/ 最大3つ</span>
            </div>
          </div>
        </div>

        {/* Aspects selection */}
        <div className="mb-6">
          <div className="space-y-3">
            {path.aspects.map((aspect) => {
              const isSelected = currentSelections.includes(aspect);
              const isDisabled = !isSelected && currentSelections.length >= 3;

              return (
                <button
                  key={aspect}
                  onClick={() => handleAspectToggle(path.id, aspect)}
                  disabled={isDisabled}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 touch-manipulation ${
                    isSelected
                      ? 'bg-blue-100 border-blue-500 text-blue-900 shadow-md'
                      : isDisabled
                      ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                      : 'bg-white border-gray-300 hover:border-blue-300 text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center mr-3 flex-shrink-0 ${
                        isSelected
                          ? 'bg-blue-500 border-blue-500'
                          : 'bg-white border-gray-400'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium leading-relaxed">{aspect}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`w-full py-4 rounded-xl font-bold text-white text-base transition-all shadow-md touch-manipulation ${
            canProceed
              ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {canProceed ? (
            currentPath < LIFE_PATHS.length - 1 ? '次の人生へ →' : '完了'
          ) : (
            currentSelections.length === 0 ? '1つ以上選んでください' : ''
          )}
        </button>
      </div>
    </div>
  );
}
