'use client';

import { useState } from 'react';

interface Props {
  onComplete: (pastLetter: string, futureLetter: string) => void;
}

export default function TimeMachine({ onComplete }: Props) {
  const [step, setStep] = useState<'intro' | 'past' | 'generating' | 'future'>('intro');
  const [pastLetter, setPastLetter] = useState('');
  const [futureLetter, setFutureLetter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              1年前の自分へ
            </h2>
            <p className="text-gray-600">
              今の気持ちを素直に書いてみよう
            </p>
          </div>

          <div className="mb-6">
            <textarea
              value={pastLetter}
              onChange={(e) => setPastLetter(e.target.value)}
              placeholder="1年前のあなたへ...

あの時は進路で悩んでたよね。
今もまだ答えは出てないけど、でも少しずつ考えられるようになってきたよ。"
              className="w-full h-64 p-4 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:outline-none resize-none text-gray-800"
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-500 mt-2">
              {pastLetter.length} / 500
            </div>
          </div>

          <button
            onClick={handlePastSubmit}
            disabled={!pastLetter.trim()}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-colors duration-200 ${
              pastLetter.trim()
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            次へ（10年後の自分からの手紙）
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
