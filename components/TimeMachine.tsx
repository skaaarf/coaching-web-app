'use client';

import { useState } from 'react';

interface Props {
  onComplete: (pastLetter: string, futureLetter: string) => void;
}

const LETTER_TEMPLATES = [
  {
    title: '進路の悩み',
    content: `1年前のあなたへ。

あの時は進路で悩んでたよね。
大学に行くべきか、やりたいことを優先すべきか、毎日考えてた。

今もまだ答えは出てないけど、でも少しずつ自分のペースで考えられるようになってきたよ。
焦らなくていいんだって、ちょっとずつわかってきた。`
  },
  {
    title: '将来への不安',
    content: `1年前の自分へ。

あの頃は将来が不安で、何も決められなかったよね。
周りはどんどん決めていくのに、自分だけ取り残されてる気がしてた。

今もまだ完全には不安は消えてないけど、不安を感じることは悪いことじゃないって思えるようになった。
ゆっくり進んでいこう。`
  },
  {
    title: '親との関係',
    content: `1年前のあなたへ。

親の期待と自分の気持ちの間で、すごく悩んでたよね。
どちらも大切だから、答えが見つからなくて苦しかった。

今もまだ完全には解決してないけど、親も自分も大事にする方法を少しずつ探せるようになってきたよ。
一緒に考えていこう。`
  },
  {
    title: '自分で書く',
    content: ''
  }
];

export default function TimeMachine({ onComplete }: Props) {
  const [step, setStep] = useState<'intro' | 'past' | 'generating' | 'future'>('intro');
  const [pastLetter, setPastLetter] = useState('');
  const [futureLetter, setFutureLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showTemplates, setShowTemplates] = useState(true);

  const handlePastSubmit = async () => {
    if (!pastLetter.trim()) return;

    setStep('generating');
    setIsGenerating(true);

    try {
      // Call API to generate future letter
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `私が1年前の自分に書いた手紙です：\n\n${pastLetter}\n\n10年後の私から今の私への手紙を書いてください。温かく、励ますような内容で、150文字程度でお願いします。`
            }
          ],
          systemPrompt: `あなたは10年後の未来から今の自分に手紙を書く役割です。

温かく、励まし、そして今の迷いを肯定するような内容にしてください。
「10年後のあなたから」という形式で書いてください。
日本語で、敬語を使わず、親しみやすい口調で書いてください。`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate future letter');
      }

      const data = await response.json();
      setFutureLetter(data.message);
      setStep('future');
    } catch (error) {
      console.error('Error generating future letter:', error);
      // Fallback letter
      setFutureLetter(
        '10年後のあなたから。\n\n今のあなたへ。迷っているのは当然だよ。でも、その迷いが今後の人生を豊かにするから。焦らず、自分のペースで考えていこう。未来のあなたは、今のあなたの選択を応援しているよ。'
      );
      setStep('future');
    } finally {
      setIsGenerating(false);
    }
  };

  if (step === 'intro') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              タイムマシン
            </h2>
            <p className="text-gray-600 leading-relaxed">
              時間を行き来して、過去と未来の自分と対話してみよう。
              <br />
              まずは、1年前の自分に手紙を書きます。
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">こんな内容でOK：</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• あの時悩んでいたこと</li>
              <li>• 今どうなっているか</li>
              <li>• 変わったこと、変わっていないこと</li>
              <li>• 当時の自分に伝えたいこと</li>
            </ul>
          </div>

          <button
            onClick={() => setStep('past')}
            className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors duration-200"
          >
            手紙を書き始める
          </button>
        </div>
      </div>
    );
  }

  if (step === 'past') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
          <div className="text-center mb-6">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              1年前の自分へ
            </h2>
            <p className="text-gray-600">
              テンプレートを選ぶか、自分で書いてみよう
            </p>
          </div>

          {/* Templates */}
          {showTemplates && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">💡 テンプレートから選ぶ（タップで使用）</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {LETTER_TEMPLATES.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setPastLetter(template.content);
                      if (template.content) {
                        setShowTemplates(false);
                      }
                    }}
                    className="p-4 text-left bg-gradient-to-br from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-2 border-purple-300 hover:border-purple-500 rounded-xl transition-all shadow-sm hover:shadow-md touch-manipulation"
                  >
                    <div className="text-sm font-bold text-gray-900 mb-1">
                      {template.title === '自分で書く' ? '✍️' : '📋'} {template.title}
                    </div>
                    {template.content && (
                      <div className="text-xs text-gray-600 line-clamp-2">
                        {template.content.substring(0, 40)}...
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Textarea */}
          {(!showTemplates || pastLetter) && (
            <div className="mb-6">
              {showTemplates && (
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-xs text-blue-600 hover:text-blue-700 mb-2 font-medium"
                >
                  テンプレートを隠す
                </button>
              )}
              {!showTemplates && (
                <button
                  onClick={() => setShowTemplates(true)}
                  className="text-xs text-blue-600 hover:text-blue-700 mb-2 font-medium"
                >
                  📋 テンプレートを表示
                </button>
              )}
              <textarea
                value={pastLetter}
                onChange={(e) => setPastLetter(e.target.value)}
                placeholder="ここに自分の言葉で書いてみよう...

（テンプレートを使った場合は、自由に編集できます）"
                className="w-full h-64 p-4 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-gray-900 leading-relaxed"
                maxLength={500}
              />
              <div className="text-right text-sm text-gray-500 mt-2">
                {pastLetter.length} / 500
              </div>
            </div>
          )}

          <button
            onClick={handlePastSubmit}
            disabled={!pastLetter.trim()}
            className={`w-full py-4 px-6 rounded-xl font-bold text-base transition-all shadow-md touch-manipulation ${
              pastLetter.trim()
                ? 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            次へ（10年後の自分からの手紙） →
          </button>
        </div>
      </div>
    );
  }

  if (step === 'generating') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-bounce">⏳</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              10年後の自分が手紙を書いています...
            </h2>
            <p className="text-gray-600">少々お待ちください</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            2つの手紙
          </h2>
          <p className="text-gray-600">
            過去と未来から届いたメッセージ
          </p>
        </div>

        {/* Past letter */}
        <div className="mb-6">
          <div className="flex items-center mb-3">
            <div className="text-2xl mr-2">📤</div>
            <h3 className="font-bold text-gray-900">1年前の自分へ</h3>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {pastLetter}
            </p>
          </div>
        </div>

        {/* Future letter */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <div className="text-2xl mr-2">📥</div>
            <h3 className="font-bold text-gray-900">10年後の自分から</h3>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-6">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {futureLetter}
            </p>
          </div>
        </div>

        {/* Prompt */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
          <p className="text-gray-700 text-center leading-relaxed">
            この2つの手紙を見て、何を感じた？
            <br />
            一緒に話してみよう。
          </p>
        </div>

        {/* Action */}
        <button
          onClick={() => onComplete(pastLetter, futureLetter)}
          className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors duration-200"
        >
          対話を始める
        </button>
      </div>
    </div>
  );
}
