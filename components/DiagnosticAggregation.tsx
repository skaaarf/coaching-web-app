'use client';

import { InteractiveModuleProgress } from '@/types';

interface Props {
  interactiveProgress: Record<string, InteractiveModuleProgress>;
}

export default function DiagnosticAggregation({ interactiveProgress }: Props) {
  // Extract insights from modules with progress (not just completed)
  const insights: Array<{
    moduleId: string;
    moduleName: string;
    icon: string;
    findings: string[];
    color: string;
  }> = [];

  // Value Battle - show if result or dialogue phase
  if (interactiveProgress['value-battle']) {
    const data = interactiveProgress['value-battle'].data as any;
    if (data.phase === 'dialogue' || data.phase === 'result') {
      const results = data.data as Record<string, number>;

      // Analyze patterns
      const moneyRelated = ['年収800万・興味ない業界の大手企業', '年収1200万・週6勤務、休暇なし', '東京本社勤務・給与1.5倍', '年収1500万・社会貢献度低い', '営業成績で年収2000万可能・ノルマきつい'];
      const nonMoneyRelated = ['年収400万・憧れていた業界のベンチャー', '年収600万・週4勤務、長期休暇OK', '地元支社勤務・給与普通', '年収500万・社会問題の解決', '固定給700万・ノルマなし'];

      const moneyCount = Object.keys(results).filter(k => moneyRelated.includes(k)).length;
      const nonMoneyCount = Object.keys(results).filter(k => nonMoneyRelated.includes(k)).length;

      const othersApproval = ['親が喜ぶ公務員・毎日同じルーティン', '誰もが知る大企業の歯車として働く', '同窓会で自慢できる・実はつらい'];
      const selfSatisfaction = ['親は反対・夢だったクリエイティブ職', '無名だが自分のアイデアが活きる会社', '同窓会で説明しにくい・実は楽しい'];

      const othersCount = Object.keys(results).filter(k => othersApproval.includes(k)).length;
      const selfCount = Object.keys(results).filter(k => selfSatisfaction.includes(k)).length;

      const tendency1 = moneyCount > nonMoneyCount + 1 ? '経済的安定重視' : nonMoneyCount > moneyCount + 1 ? 'やりがい重視' : 'バランス型';
      const tendency2 = othersCount > selfCount ? '他者評価を気にする' : selfCount > othersCount ? '自分軸で生きる' : '';

      const findings: string[] = [];

      // 経済面の傾向
      if (tendency1 === '経済的安定重視') {
        findings.push('💰 経済的安定を最優先: 高年収や待遇の良さを重視する傾向が強く、給与面での満足度がキャリア選択の重要な判断基準になっています。安定した収入基盤を築くことで、将来の不安を軽減したいという価値観が見られます。');
      } else if (tendency1 === 'やりがい重視') {
        findings.push('💰 やりがいを最優先: 収入よりも仕事の内容や興味、自己実現を重視する傾向が強いです。給与が低くても、自分が情熱を持てる分野や成長できる環境を選ぶことに価値を置いています。ワークライフバランスや仕事の質を大切にする姿勢が見られます。');
      } else {
        findings.push('💰 経済とやりがいのバランス型: 収入も大事だが、やりがいも捨てられないというバランス感覚を持っています。極端な選択を避け、両方の要素を適度に満たせる選択肢を探す傾向があります。現実的かつ柔軟な判断ができるタイプです。');
      }

      // 他者評価の傾向
      if (tendency2 === '他者評価を気にする') {
        findings.push('👥 他者からの評価を重視: 親や友人、社会からどう見られるかを気にする傾向があります。有名企業や安定した職業など、周囲に説明しやすく理解されやすい選択を好む傾向が見られます。周りの期待に応えたいという思いが、キャリア選択に影響を与えています。');
      } else if (tendency2 === '自分軸で生きる') {
        findings.push('👥 自分の価値観を優先: 他者からの評価よりも、自分が納得できるか、楽しめるかを重視する傾向が強いです。周囲に理解されにくい選択でも、自分の信念に基づいて決断できる強さがあります。他人の期待よりも自分の幸福度を優先する姿勢が見られます。');
      }

      // 選択パターンの詳細分析
      const totalChoices = Object.keys(results).length;
      if (totalChoices >= 15) {
        const workLifeBalance = ['年収600万・週4勤務、長期休暇OK', '固定給700万・ノルマなし'];
        const balanceCount = Object.keys(results).filter(k => workLifeBalance.includes(k)).length;
        if (balanceCount >= 2) {
          findings.push('⚖️ ワークライフバランス重視: 長時間労働や過度なプレッシャーを避け、プライベートの時間や心の余裕を大切にしたいという価値観が見られます。仕事は人生の一部であり、全てではないという考え方を持っているようです。');
        }

        const locationChoices = ['地元支社勤務・給与普通', '東京本社勤務・給与1.5倍'];
        const localChoice = results['地元支社勤務・給与普通'];
        const tokyoChoice = results['東京本社勤務・給与1.5倍'];
        if (localChoice && !tokyoChoice) {
          findings.push('🏡 生活基盤を重視: 給与アップよりも住み慣れた環境や人間関係を大切にする傾向があります。地域とのつながりや家族との時間を犠牲にしたくないという価値観が見られます。');
        } else if (tokyoChoice && !localChoice) {
          findings.push('🏙️ キャリア機会を重視: 生活環境の変化を厭わず、より大きなチャンスや高い給与を求める傾向があります。新しい環境への適応力と向上心が見られます。');
        }
      }

      insights.push({
        moduleId: 'value-battle',
        moduleName: '価値観バトル',
        icon: '⚔️',
        color: 'from-blue-500 to-purple-600',
        findings
      });
    }
  }

  // Life Simulator - show if result or dialogue phase
  if (interactiveProgress['life-simulator']) {
    const data = interactiveProgress['life-simulator'].data as any;
    if (data.phase === 'dialogue' || data.phase === 'result') {
      const selections = data.data as Record<string, string[]>;

      const pathCounts = {
        A: selections.A?.length || 0,
        B: selections.B?.length || 0,
        C: selections.C?.length || 0,
        D: selections.D?.length || 0,
        E: selections.E?.length || 0
      };

      const findings: string[] = [];
      const totalSelections = Object.values(pathCounts).reduce((sum, count) => sum + count, 0);

      // 最も選ばれたパス
      const maxCount = Math.max(pathCounts.A, pathCounts.B, pathCounts.C, pathCounts.D, pathCounts.E);

      if (pathCounts.A === maxCount && pathCounts.A > 0) {
        const percentage = Math.round((pathCounts.A / totalSelections) * 100);
        findings.push(`🏢 大企業・安定志向（${percentage}%）: 安定した組織で確実にキャリアを積んでいく人生に魅力を感じています。福利厚生の充実や社会的信用、長期的なキャリアパスが保証された環境を好む傾向があります。リスクを最小限に抑えながら、着実に成長していきたいという価値観が見られます。`);
      }

      if (pathCounts.B === maxCount && pathCounts.B > 0) {
        const percentage = Math.round((pathCounts.B / totalSelections) * 100);
        findings.push(`🚀 ベンチャー志向（${percentage}%）: 変化の激しい環境で、自分の力を試しながら成長していく人生に魅力を感じています。裁量権が大きく、意思決定のスピードが速い環境で働くことに価値を置いています。不確実性を楽しみ、挑戦を通じて自己実現を目指す傾向が見られます。`);
      }

      if (pathCounts.C === maxCount && pathCounts.C > 0) {
        const percentage = Math.round((pathCounts.C / totalSelections) * 100);
        findings.push(`🎨 クリエイティブ志向（${percentage}%）: 自分のアイデアや創造性を活かせる人生に魅力を感じています。独自の表現や新しい価値を生み出すことに喜びを感じ、画一的な仕事よりも個性を発揮できる環境を好みます。自分らしさを大切にしながら働きたいという価値観が見られます。`);
      }

      if (pathCounts.D === maxCount && pathCounts.D > 0) {
        const percentage = Math.round((pathCounts.D / totalSelections) * 100);
        findings.push(`🏡 地元密着志向（${percentage}%）: 住み慣れた環境で、地域や家族とのつながりを大切にしながら働く人生に魅力を感じています。キャリアアップよりも生活の質や人間関係の安定を重視し、地域社会に貢献することに価値を置いています。ライフワークバランスを最優先する傾向が見られます。`);
      }

      if (pathCounts.E === maxCount && pathCounts.E > 0) {
        const percentage = Math.round((pathCounts.E / totalSelections) * 100);
        findings.push(`📚 専門職志向（${percentage}%）: 特定の分野で深い expertise を磨いていく人生に魅力を感じています。スペシャリストとして認められることに価値を置き、継続的な学習と技術向上を楽しめるタイプです。組織での昇進よりも、専門性の深化を重視する傾向が見られます。`);
      }

      // 選択の多様性分析
      const selectedPaths = Object.entries(pathCounts).filter(([_, count]) => count > 0).length;
      if (selectedPaths >= 3) {
        findings.push(`🌈 多様なキャリアへの興味: ${selectedPaths}つの異なるキャリアパスに関心を示しており、柔軟で多面的な価値観を持っています。一つの道に絞り込むのではなく、様々な可能性を探りながら自分に合った道を見つけたいという姿勢が見られます。`);
      } else if (selectedPaths === 1) {
        findings.push(`🎯 明確なキャリアビジョン: 特定のキャリアパスに強く惹かれており、自分の進みたい方向性が比較的明確です。迷いが少なく、目標に向かって集中して取り組めるタイプと言えます。`);
      }

      insights.push({
        moduleId: 'life-simulator',
        moduleName: '人生シミュレーター',
        icon: '🎬',
        color: 'from-cyan-500 to-blue-600',
        findings
      });
    }
  }

  // Parent Self Scale - show if result or dialogue phase
  if (interactiveProgress['parent-self-scale']) {
    const data = interactiveProgress['parent-self-scale'].data as any;
    if (data.phase === 'dialogue' || data.phase === 'result') {
      const responses = data.data as Record<number, number>;
      const values = Object.values(responses);
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;

      const findings: string[] = [];

      if (average < 30) {
        findings.push(`👨‍👩‍👦 親の期待を強く意識（平均値: ${Math.round(average)}）: 親の意見や期待が自分の選択に大きな影響を与えています。親に喜んでもらいたい、心配をかけたくないという思いが強く、自分の本当の気持ちよりも親の希望を優先する傾向があります。家族の期待に応えることが自分の幸せにつながると考えているかもしれません。`);
        findings.push(`💭 自己主張の葛藤: 自分の本当にやりたいことと親の期待との間で葛藤を感じている可能性があります。自分の意見を主張することに罪悪感や不安を感じることがあるかもしれません。`);
      } else if (average < 50) {
        findings.push(`👨‍👩‍👦 親の期待を意識しつつ（平均値: ${Math.round(average)}）: 親の意見や期待を大切にしながらも、自分の気持ちも無視できないというバランスを取ろうとしています。親の期待に応えたい気持ちと、自分らしく生きたい気持ちの両方を持っており、どちらも大切にしたいと考えています。`);
        findings.push(`⚖️ 調和を求める姿勢: 親の期待と自分の希望の両立を模索する傾向があります。完全に親の言う通りでもなく、完全に自分勝手でもない、中間的な選択を好むかもしれません。`);
      } else if (average < 70) {
        findings.push(`🌱 自分の気持ちをやや優先（平均値: ${Math.round(average)}）: 親の意見も聞きつつ、最終的には自分の気持ちや判断を優先する傾向があります。親の期待は理解しているものの、自分の人生は自分で決めたいという意識が強くなっています。親との関係は大切にしながらも、自分の道を歩む準備ができています。`);
        findings.push(`💪 自立した判断力: 親の意見に流されず、自分なりの価値観に基づいて判断できる力が育っています。親との対話は続けつつも、最終決定権は自分にあると考えています。`);
      } else {
        findings.push(`🌟 自分の気持ちを強く優先（平均値: ${Math.round(average)}）: 親の期待よりも、自分が本当にやりたいこと、納得できることを最優先する傾向が非常に強いです。親の意見は参考程度に聞きますが、自分の人生の主導権は完全に自分にあると考えています。自分の幸せの定義を自分で決められる強い自己軸があります。`);
        findings.push(`🎯 明確な自己決定: 他者の期待や評価に左右されず、自分の信念に従って決断できる強さがあります。親との意見の相違があっても、自分の選択に自信を持てるタイプです。`);
      }

      // 質問間のばらつきを分析
      const variance = values.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / values.length;
      const stdDev = Math.sqrt(variance);

      if (stdDev > 25) {
        findings.push(`📊 状況によって判断が変わる: 場面や質問内容によって、親の期待と自分の気持ちのどちらを優先するかが大きく変わっています。一貫性のある軸を持つというよりは、状況に応じて柔軟に判断しているタイプかもしれません。`);
      } else if (stdDev < 15) {
        findings.push(`📐 一貫した価値観: どの場面でも同じような判断基準で選択しており、自分の価値観が明確で一貫しています。迷いが少なく、自分の軸がしっかりしているタイプです。`);
      }

      insights.push({
        moduleId: 'parent-self-scale',
        moduleName: '親の期待 vs 自分',
        icon: '⚖️',
        color: 'from-orange-500 to-purple-600',
        findings
      });
    }
  }

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          あなたについて分かったこと
        </h2>
        <span className="text-sm text-gray-500 font-medium">
          {insights.length}個
        </span>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div
            key={insight.moduleId}
            className="animate-slide-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className={`bg-gradient-to-r ${insight.color} rounded-xl p-[2px]`}>
              <div className="bg-white rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="text-4xl">{insight.icon}</span>
                  <h3 className="font-bold text-gray-900 text-lg">
                    {insight.moduleName}
                  </h3>
                </div>
                <div className="space-y-2">
                  {insight.findings.map((finding, i) => (
                    <div key={i} className="flex items-start">
                      <span className="text-blue-600 mr-2 flex-shrink-0 text-lg">•</span>
                      <span className="text-gray-700 text-base leading-relaxed">{finding}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.4s ease-out both;
        }
      `}</style>
    </div>
  );
}
