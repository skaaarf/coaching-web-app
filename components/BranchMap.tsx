'use client';

import React, { useState } from 'react';

interface Branch {
  id: string;
  level: number;
  label: string;
  description: string;
  parent?: string;
  eventType?: 'career' | 'life' | 'unexpected' | 'choice';
  tags?: string[]; // For pattern analysis: 'stability', 'challenge', 'money', 'passion', 'family', 'career'
}

const BRANCHES: Branch[] = [
  {
    id: 'start',
    level: 0,
    label: '18歳・高校卒業',
    description: 'あなたの人生が始まる。進路を決める時。まだ何者にもなっていない。でも、可能性は無限大。',
    eventType: 'choice'
  },

  // Level 1 - Post high school (4 choices)
  { id: '1a', level: 1, label: '大学進学（国立）', description: '学費は抑えめ。真面目に4年間学ぶ。親は喜んでいる。', parent: 'start', eventType: 'choice', tags: ['stability', 'education'] },
  { id: '1b', level: 1, label: '大学進学（私立）', description: '学費は高いが設備充実。自由な雰囲気。親は心配そうだが応援してくれた。', parent: 'start', eventType: 'choice', tags: ['challenge', 'education'] },
  { id: '1c', level: 1, label: '専門学校', description: '2年で実践的スキル。即戦力を目指す。周りは大学に行く中、自分の道を選んだ。', parent: 'start', eventType: 'choice', tags: ['challenge', 'career'] },
  { id: '1d', level: 1, label: '就職（高卒）', description: '18歳から社会人。同級生より4年早くキャリアスタート。不安もあるが、早く自立したかった。', parent: 'start', eventType: 'choice', tags: ['challenge', 'career', 'money'] },

  // Level 2 - University specialization (from 国立大学)
  { id: '2a1', level: 2, label: '経済学部', description: 'サークル活動充実。就活に強い学部。友達も多くできた。大学生活を満喫している。', parent: '1a', eventType: 'choice', tags: ['stability', 'career'] },
  { id: '2a2', level: 2, label: '工学部', description: '課題多い。でも技術が身につく。徹夜も多いが、やりがいはある。', parent: '1a', eventType: 'choice', tags: ['challenge', 'career'] },
  { id: '2a3', level: 2, label: '教育学部', description: '教員免許取得。安定志向の仲間が多い。先生になる夢に向かって歩み始めた。', parent: '1a', eventType: 'choice', tags: ['stability', 'passion'] },

  // Level 2 - from 私立大学
  { id: '2b1', level: 2, label: '経営学部', description: '実践的。企業とのつながり多い。インターンシップも充実。将来が楽しみ。', parent: '1b', eventType: 'choice', tags: ['challenge', 'career', 'money'] },
  { id: '2b2', level: 2, label: '芸術学部', description: '好きなことに没頭。就職は不安。でも、創作する喜びは何にも代えがたい。', parent: '1b', eventType: 'choice', tags: ['passion', 'challenge'] },
  { id: '2b3', level: 2, label: '国際学部', description: '留学チャンスあり。語学力が伸びる。世界が広がっていくのを感じる。', parent: '1b', eventType: 'choice', tags: ['challenge', 'education'] },

  // Level 2 - from 専門学校
  { id: '2c1', level: 2, label: 'IT専門', description: 'プログラミング漬け。2年後には即戦力。毎日コードを書き続ける日々。', parent: '1c', eventType: 'choice', tags: ['career', 'challenge'] },
  { id: '2c2', level: 2, label: 'デザイン専門', description: 'ポートフォリオ制作に明け暮れる。クリエイターとしての第一歩。', parent: '1c', eventType: 'choice', tags: ['passion', 'career'] },
  { id: '2c3', level: 2, label: '医療専門', description: '資格取得で安定。勉強はハード。人の役に立てる仕事を目指して。', parent: '1c', eventType: 'choice', tags: ['stability', 'passion'] },

  // Level 2 - from 高卒就職
  { id: '2d1', level: 2, label: '地元の製造業', description: '工場勤務。先輩が優しい。給料普通。地に足がついた生活。', parent: '1d', eventType: 'choice', tags: ['stability', 'family'] },
  { id: '2d2', level: 2, label: '大手企業（一般職）', description: '大卒と差を感じる。でも安定。悔しさをバネに頑張っている。', parent: '1d', eventType: 'choice', tags: ['stability', 'career'] },
  { id: '2d3', level: 2, label: '接客業', description: '人と話すのは楽しい。将来は不安。でも今は毎日が充実している。', parent: '1d', eventType: 'choice', tags: ['passion', 'challenge'] },

  // Level 3 - 22歳 First job (from 経済学部)
  { id: '3a1', level: 3, label: '大手メーカー営業職', description: '初任給25万。転勤あり。福利厚生◎。安定の道を選んだ。', parent: '2a1', eventType: 'career', tags: ['stability', 'career', 'money'] },
  { id: '3a2', level: 3, label: 'ベンチャー企業', description: '初任給22万。裁量大。成長できる。リスクを取って挑戦の道へ。', parent: '2a1', eventType: 'career', tags: ['challenge', 'career'] },
  { id: '3a3', level: 3, label: '公務員', description: '初任給20万。安定。土日休み確実。親も安心している。', parent: '2a1', eventType: 'career', tags: ['stability', 'family'] },

  // Level 3 - from 工学部
  { id: '3b1', level: 3, label: 'IT企業エンジニア', description: '初任給28万。技術が活かせる。残業多い。でもやりがいがある。', parent: '2a2', eventType: 'career', tags: ['career', 'money', 'challenge'] },
  { id: '3b2', level: 3, label: '大学院進学', description: '研究を続ける。2年後の就職は有利？　専門性を深めたい。', parent: '2a2', eventType: 'choice', tags: ['education', 'challenge'] },
  { id: '3b3', level: 3, label: 'メーカー技術職', description: '初任給26万。工場配属。ものづくり。実際に作る喜びを知った。', parent: '2a2', eventType: 'career', tags: ['stability', 'passion'] },

  // Level 3 - from 教育学部
  { id: '3c1', level: 3, label: '公立学校教員', description: '初任給23万。やりがいあり。忙しい。でも子どもたちの笑顔が支え。', parent: '2a3', eventType: 'career', tags: ['passion', 'stability'] },
  { id: '3c2', level: 3, label: '私立学校教員', description: '初任給21万。落ち着いた環境。じっくり教育に向き合える。', parent: '2a3', eventType: 'career', tags: ['passion', 'stability'] },
  { id: '3c3', level: 3, label: '教育系企業', description: '初任給24万。土日休み。営業要素あり。教育を別の形で支える。', parent: '2a3', eventType: 'career', tags: ['career', 'stability'] },

  // Level 3 - from 経営学部（私立）
  { id: '3d1', level: 3, label: 'コンサル業界', description: '初任給35万。激務。成長スピード速い。毎日が試練。でも成長を実感。', parent: '2b1', eventType: 'career', tags: ['challenge', 'money', 'career'] },
  { id: '3d2', level: 3, label: '金融業界', description: '初任給28万。ノルマあり。安定。数字と向き合う日々。', parent: '2b1', eventType: 'career', tags: ['stability', 'money'] },

  // Level 3 - from 芸術学部
  { id: '3e1', level: 3, label: 'デザイン会社', description: '初任給20万。好きな仕事。残業代なし。でも創作できる幸せ。', parent: '2b2', eventType: 'career', tags: ['passion', 'challenge'] },
  { id: '3e2', level: 3, label: 'フリーランス挑戦', description: '収入不安定。自由。孤独。でも自分の力で生きていきたい。', parent: '2b2', eventType: 'career', tags: ['challenge', 'passion'] },

  // Level 3 - from IT専門
  { id: '3f1', level: 3, label: 'Web制作会社', description: '20歳で就職。給料23万。スキル伸びる。同級生より早くプロに。', parent: '2c1', eventType: 'career', tags: ['career', 'challenge'] },
  { id: '3f2', level: 3, label: 'SIer', description: '20歳で就職。給料26万。大企業の案件。大きなシステムに携われる。', parent: '2c1', eventType: 'career', tags: ['career', 'stability'] },

  // Level 4 - 24-25歳 予期せぬ転機 (Life events)
  { id: '4a1', level: 4, label: '25歳・社内で認められ昇進打診', description: '主任への昇進。責任が増える。給料30万。でも転勤が条件。', parent: '3a1', eventType: 'unexpected', tags: ['career', 'money'] },
  { id: '4a2', level: 4, label: '25歳・ヘッドハントされる', description: 'ベンチャーから声がかかった。給料28万。リスクもあるが可能性も。', parent: '3a1', eventType: 'unexpected', tags: ['challenge', 'career'] },
  { id: '4a3', level: 4, label: '25歳・恋人との結婚を考える', description: '地元に戻る選択。地方支社へ異動。給料27万。愛を取るか、キャリアを取るか。', parent: '3a1', eventType: 'life', tags: ['family', 'stability'] },
  { id: '4a4', level: 4, label: '25歳・海外赴任のチャンス', description: 'アメリカ支社への異動。給料35万。英語は不安。でも一度きりの人生。', parent: '3a1', eventType: 'unexpected', tags: ['challenge', 'career', 'money'] },

  { id: '4b1', level: 4, label: '26歳・マネージャーに昇格', description: 'チーム持つ。給料35万。忙しい。責任が重くなってきた。', parent: '3a2', eventType: 'career', tags: ['career', 'money', 'challenge'] },
  { id: '4b2', level: 4, label: '26歳・大手に転職', description: '安定求めて。給料33万。裁量減る。ベンチャーの激務に疲れた。', parent: '3a2', eventType: 'choice', tags: ['stability', 'money'] },
  { id: '4b3', level: 4, label: '26歳・副業を始める', description: '本業は続けながら、自分の事業を。睡眠時間は減るが、夢がある。', parent: '3a2', eventType: 'choice', tags: ['challenge', 'passion', 'money'] },

  { id: '4c1', level: 4, label: '27歳・係長に昇進', description: '順調に昇進。給料26万。安定。このまま定年まで？', parent: '3a3', eventType: 'career', tags: ['stability'] },
  { id: '4c2', level: 4, label: '27歳・民間転職を決意', description: '給料アップ狙う。給料32万。不安もある。安定を捨てる決断。', parent: '3a3', eventType: 'choice', tags: ['challenge', 'money'] },

  { id: '4d1', level: 4, label: '26歳・リードエンジニアに', description: '技術力が認められた。給料38万。後輩の育成も任された。', parent: '3b1', eventType: 'career', tags: ['career', 'money'] },
  { id: '4d2', level: 4, label: '26歳・外資IT企業へ転職', description: '給料60万。英語必須。成果主義。大きな挑戦。', parent: '3b1', eventType: 'choice', tags: ['challenge', 'money'] },
  { id: '4d3', level: 4, label: '26歳・スタートアップに誘われる', description: '創業メンバーとして。給料25万+ストックオプション。ギャンブル？', parent: '3b1', eventType: 'unexpected', tags: ['challenge', 'passion'] },

  { id: '4e1', level: 4, label: '24歳・修士卒で研究職', description: '企業研究所。給料32万。専門性活かす。研究者としての道が開けた。', parent: '3b2', eventType: 'career', tags: ['career', 'stability', 'passion'] },
  { id: '4e2', level: 4, label: '24歳・博士課程へ', description: '研究者の道。給料ほぼなし。奨学金。極めたい。', parent: '3b2', eventType: 'choice', tags: ['passion', 'education'] },

  // Level 5 - 28-30歳 キャリアの方向性
  { id: '5a1', level: 5, label: '29歳・管理職への道', description: '課長候補。給料40万。部下を持つ。プレイヤーからマネージャーへ。', parent: '4a1', eventType: 'career', tags: ['career', 'money'] },
  { id: '5a2', level: 5, label: '29歳・専門職として極める', description: '管理職を断り、現場のスペシャリストに。給料35万。', parent: '4a1', eventType: 'choice', tags: ['passion', 'career'] },

  { id: '5a3', level: 5, label: '30歳・海外で視野が広がる', description: '海外赴任3年目。英語も上達。給料45万。グローバルな視点を持てた。', parent: '4a4', eventType: 'career', tags: ['career', 'money', 'challenge'] },
  { id: '5a4', level: 5, label: '30歳・日本に戻りたい', description: '家族と離れた生活に限界。本社に戻る希望を出した。', parent: '4a4', eventType: 'life', tags: ['family'] },

  { id: '5b1', level: 5, label: '30歳・起業を決意', description: '貯金500万で独立。副業が軌道に。不安と期待。', parent: '4b3', eventType: 'choice', tags: ['challenge', 'passion', 'money'] },
  { id: '5b2', level: 5, label: '30歳・執行役員に', description: '会社の中核。給料55万。株式もらう。ベンチャーの成長と共に。', parent: '4b1', eventType: 'career', tags: ['career', 'money'] },
  { id: '5b3', level: 5, label: '30歳・大企業で安定', description: '転職して正解だった。給料40万。ワークライフバランス◎。', parent: '4b2', eventType: 'career', tags: ['stability', 'family'] },

  { id: '5c1', level: 5, label: '30歳・マネージャー昇格', description: '外資で昇進。給料90万。激務。家族との時間ゼロ。', parent: '4d2', eventType: 'career', tags: ['money', 'career'] },
  { id: '5c2', level: 5, label: '30歳・日系大手に戻る', description: '燃え尽きた。給料45万。ワークライフバランス重視。', parent: '4d2', eventType: 'choice', tags: ['stability', 'family'] },

  { id: '5d1', level: 5, label: '28歳・スタートアップIPO成功', description: '株式が大きな財産に。年収1000万超。でも次の目標は？', parent: '4d3', eventType: 'unexpected', tags: ['money', 'challenge'] },
  { id: '5d2', level: 5, label: '28歳・スタートアップ苦戦', description: '会社は続くが、給料カット。給料20万。それでも諦めない。', parent: '4d3', eventType: 'unexpected', tags: ['challenge', 'passion'] },

  // Level 6 - 32-35歳 人生の転換期
  { id: '6a1', level: 6, label: '34歳・課長として部門を率いる', description: '管理職。給料50万。部下20人。責任が重い。', parent: '5a1', eventType: 'career', tags: ['career', 'money'] },
  { id: '6a2', level: 6, label: '34歳・燃え尽き症候群', description: '昇進したが、心が疲れた。このまま走り続けるのか。', parent: '5a1', eventType: 'life', tags: ['challenge'] },

  { id: '6a3', level: 6, label: '34歳・匠への道', description: 'スペシャリストとして社内で唯一の存在に。給料45万。誇りがある。', parent: '5a2', eventType: 'career', tags: ['passion', 'career'] },

  { id: '6a4', level: 6, label: '34歳・グローバルリーダー', description: 'アジア統括責任者に。給料70万。世界を舞台に働いている。', parent: '5a3', eventType: 'career', tags: ['career', 'money', 'challenge'] },

  { id: '6b1', level: 6, label: '34歳・事業が軌道に乗る', description: '従業員10人。年収800万。自分の力で会社を作った。', parent: '5b1', eventType: 'career', tags: ['challenge', 'money', 'passion'] },
  { id: '6b2', level: 6, label: '34歳・事業苦戦、方向転換', description: '売上不振。給料30万。ピボットを検討中。', parent: '5b1', eventType: 'unexpected', tags: ['challenge'] },

  { id: '6b3', level: 6, label: '35歳・役員へ昇進', description: '執行役員として経営に参画。給料80万。責任は重い。', parent: '5b2', eventType: 'career', tags: ['career', 'money'] },

  { id: '6c1', level: 6, label: '34歳・高給だが心は空っぽ', description: '給料120万。でも家族は崩壊寸前。何のために働いている？', parent: '5c1', eventType: 'life', tags: ['money', 'challenge'] },
  { id: '6c2', level: 6, label: '34歳・ワークライフバランス確立', description: '給料50万。子育ても仕事も両立。満足している。', parent: '5c2', eventType: 'life', tags: ['stability', 'family'] },

  { id: '6d1', level: 6, label: '32歳・セミリタイア生活', description: '投資で生活。年収500万。自由な時間。新しい人生。', parent: '5d1', eventType: 'choice', tags: ['money', 'family'] },
  { id: '6d2', level: 6, label: '32歳・次のチャレンジへ', description: '成功体験を活かして、新事業立ち上げ。まだ終わらない。', parent: '5d1', eventType: 'choice', tags: ['challenge', 'passion'] },

  // Level 7 - 38-40歳 ミドルキャリアの選択
  { id: '7a1', level: 7, label: '40歳・部長昇進', description: '給料80万。役員候補。家庭は妻任せ。頂点が見えてきた。', parent: '6a1', eventType: 'career', tags: ['career', 'money'] },
  { id: '7a2', level: 7, label: '40歳・課長で留まる選択', description: '昇進を辞退。給料55万。家族との時間を優先した。', parent: '6a1', eventType: 'choice', tags: ['family', 'stability'] },

  { id: '7a3', level: 7, label: '38歳・休職して自分を見つめ直す', description: '3ヶ月の休職。カウンセリングも受けた。何が大切なのか。', parent: '6a2', eventType: 'life', tags: ['family', 'passion'] },
  { id: '7a4', level: 7, label: '38歳・転職してやり直す', description: '給料40万。中小企業へ。肩書より、やりがいを求めた。', parent: '6a2', eventType: 'choice', tags: ['passion', 'challenge'] },

  { id: '7a5', level: 7, label: '38歳・伝説の職人に', description: '給料50万。業界で知られる存在。後進の育成も。', parent: '6a3', eventType: 'career', tags: ['passion', 'career'] },

  { id: '7a6', level: 7, label: '39歳・グローバル役員', description: '本社役員に。給料100万。世界中を飛び回る日々。', parent: '6a4', eventType: 'career', tags: ['career', 'money'] },

  { id: '7b1', level: 7, label: '40歳・事業拡大成功', description: '従業員50人。年収2000万。次のステージへ。', parent: '6b1', eventType: 'career', tags: ['money', 'challenge'] },
  { id: '7b2', level: 7, label: '40歳・事業売却を検討', description: '買収オファーあり。1億円。でも、手放すのか。', parent: '6b1', eventType: 'unexpected', tags: ['money', 'passion'] },

  { id: '7b3', level: 7, label: '40歳・会社員に戻る', description: '事業畳んだ。給料45万。挑戦したことに後悔なし。', parent: '6b2', eventType: 'choice', tags: ['stability'] },

  { id: '7c1', level: 7, label: '40歳・離婚危機からの再生', description: '給料60万に減給してでも、家族と向き合う。', parent: '6c1', eventType: 'life', tags: ['family'] },

  { id: '7d1', level: 7, label: '38歳・投資家として活動', description: 'スタートアップ支援。年収800万。経験を還元している。', parent: '6d1', eventType: 'career', tags: ['money', 'passion'] },

  { id: '7d2', level: 7, label: '38歳・シリアルアントレプレナー', description: '2社目立ち上げ。年収1500万。挑戦し続ける人生。', parent: '6d2', eventType: 'career', tags: ['challenge', 'passion', 'money'] },

  // Level 8 - 45歳 人生の成熟期
  { id: '8a1', level: 8, label: '45歳・取締役へ', description: '給料120万。経営の中枢。ここまで来た。', parent: '7a1', eventType: 'career', tags: ['career', 'money'] },
  { id: '8a2', level: 8, label: '45歳・子会社社長に', description: '給料90万。新しいチャレンジ。まだ成長できる。', parent: '7a1', eventType: 'career', tags: ['career', 'challenge'] },

  { id: '8a3', level: 8, label: '45歳・家族との時間が宝物', description: '給料60万。子どもの成長を見守れた。正解だった。', parent: '7a2', eventType: 'life', tags: ['family', 'stability'] },

  { id: '8a4', level: 8, label: '43歳・第二の人生スタート', description: '給料45万。新しい会社で活き活きしている。', parent: '7a4', eventType: 'career', tags: ['passion', 'career'] },

  { id: '8a5', level: 8, label: '43歳・独立して工房を開く', description: '給料40万。弟子も取った。技を伝えていく。', parent: '7a5', eventType: 'choice', tags: ['passion', 'challenge'] },

  { id: '8b1', level: 8, label: '45歳・上場を果たす', description: '会社を上場。資産10億。夢を実現した。', parent: '7b1', eventType: 'unexpected', tags: ['money', 'challenge'] },

  { id: '8b2', level: 8, label: '45歳・事業売却して次へ', description: '売却益で新事業。まだ挑戦は続く。', parent: '7b2', eventType: 'choice', tags: ['money', 'challenge'] },

  { id: '8b3', level: 8, label: '45歳・安定した会社員生活', description: '給料50万。起業の経験が活きている。', parent: '7b3', eventType: 'career', tags: ['stability', 'career'] },

  { id: '8c1', level: 8, label: '45歳・家族再生成功', description: '給料70万。仕事も家庭も大切に。バランスを見つけた。', parent: '7c1', eventType: 'life', tags: ['family', 'stability'] },

  { id: '8d1', level: 8, label: '45歳・ベンチャーキャピタリスト', description: '年収1500万。若者の挑戦を支えている。', parent: '7d1', eventType: 'career', tags: ['money', 'passion'] },

  { id: '8d2', level: 8, label: '43歳・3社目の挑戦', description: '年収2000万。まだまだ終わらない。', parent: '7d2', eventType: 'career', tags: ['challenge', 'passion', 'money'] },

  // Level 9 - 50歳 人生の集大成
  { id: '9a1', level: 9, label: '50歳・代表取締役社長', description: '年収2000万。トップに立った。責任と誇り。', parent: '8a1', eventType: 'career', tags: ['career', 'money'] },
  { id: '9a2', level: 9, label: '50歳・次世代に託す', description: '役員を退き、相談役に。年収800万。若い力を信じる。', parent: '8a1', eventType: 'choice', tags: ['family', 'career'] },

  { id: '9a3', level: 9, label: '50歳・充実の日々', description: '給料65万。仕事も家族も趣味も。バランスが取れた人生。', parent: '8a3', eventType: 'life', tags: ['family', 'stability', 'passion'] },

  { id: '9a4', level: 9, label: '50歳・天職を見つけた', description: '給料50万。毎日が楽しい。これが自分の道だった。', parent: '8a4', eventType: 'life', tags: ['passion', 'career'] },

  { id: '9a5', level: 9, label: '50歳・伝統を継承する', description: '給料45万。技術を次世代へ。生きた証を残している。', parent: '8a5', eventType: 'life', tags: ['passion', 'family'] },

  { id: '9b1', level: 9, label: '50歳・大成功の経営者', description: '資産50億。複数事業展開。社会貢献も始めた。', parent: '8b1', eventType: 'career', tags: ['money', 'career', 'passion'] },

  { id: '9b2', level: 9, label: '50歳・シリアル経営者', description: '資産10億。4社目設立。挑戦が生きがい。', parent: '8b2', eventType: 'career', tags: ['challenge', 'money', 'passion'] },

  { id: '9b3', level: 9, label: '50歳・平凡だが幸せな日々', description: '給料55万。家族に囲まれ、健康で働ける。それが幸せ。', parent: '8b3', eventType: 'life', tags: ['family', 'stability'] },

  { id: '9c1', level: 9, label: '50歳・愛する家族と共に', description: '給料75万。仕事の成功より大切なものがある。', parent: '8c1', eventType: 'life', tags: ['family', 'stability', 'career'] },

  { id: '9d1', level: 9, label: '50歳・エンジェル投資家', description: '年収3000万。100社以上支援。レガシーを作っている。', parent: '8d1', eventType: 'career', tags: ['money', 'passion'] },

  { id: '9d2', level: 9, label: '48歳・伝説の起業家', description: '年収5000万。業界のレジェンド。でも、まだ走り続ける。', parent: '8d2', eventType: 'career', tags: ['challenge', 'money', 'passion'] },
];

interface Props {
  onComplete: (path: Branch[]) => void;
}

export default function BranchMap({ onComplete }: Props) {
  const [selectedPath, setSelectedPath] = useState<Branch[]>([
    BRANCHES.find(b => b.id === 'start')!
  ]);
  const [canExplore, setCanExplore] = useState(false);
  const [showTreeView, setShowTreeView] = useState(false);
  const [showJourneyReview, setShowJourneyReview] = useState(false);

  const currentBranch = selectedPath[selectedPath.length - 1];
  const nextOptions = BRANCHES.filter(b => b.parent === currentBranch.id);

  // Analyze decision patterns
  const analyzePattern = () => {
    const tags: Record<string, number> = {};
    const eventTypes: Record<string, number> = {};

    selectedPath.slice(1).forEach(branch => {
      // Count tags
      branch.tags?.forEach(tag => {
        tags[tag] = (tags[tag] || 0) + 1;
      });

      // Count event types
      if (branch.eventType) {
        eventTypes[branch.eventType] = (eventTypes[branch.eventType] || 0) + 1;
      }
    });

    return { tags, eventTypes };
  };

  const pattern = analyzePattern();

  // Get pattern description
  const getPatternDescription = () => {
    const { tags } = pattern;
    const tagEntries = Object.entries(tags).sort((a, b) => b[1] - a[1]);

    if (tagEntries.length === 0) return '';

    const topTag = tagEntries[0][0];
    const descriptions: Record<string, string> = {
      stability: 'あなたは安定を重視する傾向にあります',
      challenge: 'あなたは挑戦を恐れない勇気を持っています',
      money: 'あなたは経済的な成功を重視しています',
      passion: 'あなたは情熱とやりがいを大切にしています',
      family: 'あなたは家族との時間を何よりも大切にしています',
      career: 'あなたはキャリアの成長を重視しています',
    };

    return descriptions[topTag] || '';
  };

  // Helper function to render tree recursively
  const renderTreeNode = (branchId: string, depth: number = 0): React.ReactElement[] => {
    const branch = BRANCHES.find(b => b.id === branchId);
    if (!branch) return [];

    const isSelected = selectedPath.some(p => p.id === branchId);
    const isCurrent = currentBranch.id === branchId;
    const children = BRANCHES.filter(b => b.parent === branchId);

    const result: React.ReactElement[] = [
      <div key={branchId} className={`flex items-start ${depth > 0 ? 'ml-6' : ''}`}>
        <div className="flex-shrink-0 w-1 bg-gray-300 mr-2" style={{ height: '100%' }} />
        <div className={`flex-1 mb-2 p-3 rounded-lg border-2 transition-all ${
          isCurrent ? 'bg-blue-100 border-blue-500 shadow-md' :
          isSelected ? 'bg-green-50 border-green-400' :
          'bg-white border-gray-200'
        }`}>
          <div className="font-semibold text-sm text-gray-900">
            {branch.label}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {branch.description.substring(0, 50)}
            {branch.description.length > 50 ? '...' : ''}
          </div>
          {isCurrent && (
            <div className="mt-1 text-xs font-bold text-blue-600">
              ← 現在地
            </div>
          )}
        </div>
      </div>
    ];

    // Only show children if this branch is in the selected path or is current
    if ((isSelected || isCurrent) && children.length > 0) {
      children.forEach(child => {
        result.push(...renderTreeNode(child.id, depth + 1));
      });
    }

    return result;
  };

  const handleSelect = (branch: Branch) => {
    const newPath = [...selectedPath, branch];
    setSelectedPath(newPath);

    // Check if we've reached the end (level 9 or no more options)
    const hasNextOptions = BRANCHES.some(b => b.parent === branch.id);
    if (branch.level === 9 || !hasNextOptions) {
      setCanExplore(true);
    }
  };

  const handleReset = (toLevel: number) => {
    setSelectedPath(selectedPath.slice(0, toLevel + 1));
    setCanExplore(false);
  };

  const handleExploreOther = () => {
    // Reset to start to explore other paths
    setSelectedPath([BRANCHES.find(b => b.id === 'start')!]);
    setCanExplore(false);
  };

  const handleComplete = () => {
    onComplete(selectedPath);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🗺️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            IF分岐マップ
          </h2>
          <p className="text-gray-600">
            これからの選択で、未来はどう変わる？
          </p>
        </div>

        {/* Path visualization */}
        <div className="mb-6">
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-300">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-xl mr-2">🔮</span>
              あなたが選んでいる未来
            </h3>
            <div className="space-y-3">
              {selectedPath.map((branch, index) => (
                <div key={branch.id} className="flex items-center">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                      index === selectedPath.length - 1
                        ? 'bg-blue-500'
                        : 'bg-green-500'
                    }`}
                  >
                    {index}
                  </div>
                  <div className="ml-4 flex-grow">
                    <div className="font-semibold text-gray-900">
                      {branch.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {branch.description}
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      onClick={() => handleReset(index - 1)}
                      className="ml-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      やり直す
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tree View Toggle */}
        <div className="mb-6">
          <button
            onClick={() => setShowTreeView(!showTreeView)}
            className="w-full p-4 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-2 border-purple-300 rounded-xl transition-all shadow-sm hover:shadow-md touch-manipulation"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-xl mr-2">🌳</span>
                <span className="font-bold text-gray-900">分岐ツリーを見る</span>
              </div>
              <svg className={`w-5 h-5 text-gray-600 transition-transform ${showTreeView ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>
        </div>

        {/* Tree View */}
        {showTreeView && (
          <div className="mb-8">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-300 max-h-96 overflow-y-auto">
              <div className="mb-3 pb-3 border-b-2 border-gray-200">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center">
                  <span className="text-lg mr-2">🌳</span>
                  全体の道筋
                </h3>
                <p className="text-xs text-gray-600">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>選択済み
                  <span className="inline-block w-3 h-3 bg-blue-500 rounded-full ml-3 mr-1"></span>現在地
                  <span className="inline-block w-3 h-3 bg-gray-200 rounded-full ml-3 mr-1"></span>未選択
                </p>
              </div>
              <div className="space-y-1">
                {renderTreeNode('start')}
              </div>
            </div>
          </div>
        )}

        {/* Next options */}
        {nextOptions.length > 0 && !canExplore && (
          <div className="mb-6">
            <h3 className="font-bold text-gray-900 mb-4 text-lg">
              ⤴️ 次の分岐点を選んで：
            </h3>
            <div className="space-y-3">
              {nextOptions.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => handleSelect(branch)}
                  className="w-full p-5 text-left bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 rounded-xl transition-all shadow-sm hover:shadow-md touch-manipulation"
                >
                  <div className="font-bold text-gray-900 mb-2 text-base">
                    {branch.label}
                  </div>
                  <div className="text-sm text-gray-600 leading-relaxed">
                    {branch.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* End of path */}
        {canExplore && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 rounded-xl p-6 text-center shadow-md">
              <div className="text-4xl mb-3">✨</div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">
                一つの未来が見えた！
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {selectedPath.length - 1}個の選択を経て、ここまで来ました。
                <br />
                {getPatternDescription()}
              </p>
            </div>

            {/* Pattern Analysis */}
            <div className="bg-white border-2 border-gray-300 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <span className="text-xl mr-2">📊</span>
                あなたの選択パターン
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(pattern.tags)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 4)
                  .map(([tag, count]) => {
                    const tagLabels: Record<string, string> = {
                      stability: '🛡️ 安定',
                      challenge: '🚀 挑戦',
                      money: '💰 お金',
                      passion: '❤️ 情熱',
                      family: '👨‍👩‍👧‍👦 家族',
                      career: '📈 キャリア',
                    };
                    return (
                      <div
                        key={tag}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <div className="text-sm font-semibold text-gray-900">
                          {tagLabels[tag]}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {count}回選択
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Journey Review Button */}
            <button
              onClick={() => setShowJourneyReview(true)}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg touch-manipulation"
            >
              📖 人生を振り返る
            </button>

            <div className="space-y-3">
              <button
                onClick={handleExploreOther}
                className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg touch-manipulation"
              >
                🔄 別の未来を探索する
              </button>
              <button
                onClick={handleComplete}
                className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg touch-manipulation"
              >
                💬 この未来について話す
              </button>
            </div>
          </div>
        )}

        {/* Instruction */}
        {!canExplore && nextOptions.length > 0 && (
          <div className="text-center text-sm text-gray-500 mt-6">
            どの道にも正解はない。大事なのは、納得して選べるかどうか。
          </div>
        )}
      </div>

      {/* Journey Review Modal */}
      {showJourneyReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <span className="text-3xl mr-3">📖</span>
                あなたの人生を振り返る
              </h2>
              <button
                onClick={() => setShowJourneyReview(false)}
                className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Journey Timeline */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🛤️</span>
                  あなたが歩んだ道
                </h3>
                <div className="space-y-4">
                  {selectedPath.map((branch, index) => {
                    const eventIcons = {
                      career: '💼',
                      life: '🌟',
                      unexpected: '⚡',
                      choice: '🔀',
                    };
                    const icon = branch.eventType ? eventIcons[branch.eventType] : '📍';

                    return (
                      <div
                        key={branch.id}
                        className={`relative pl-8 pb-4 ${
                          index < selectedPath.length - 1 ? 'border-l-4 border-blue-300' : ''
                        }`}
                      >
                        <div className="absolute left-0 top-0 -ml-3 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
                          {index}
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200">
                          <div className="flex items-start justify-between mb-2">
                            <div className="font-bold text-gray-900 text-lg">
                              {icon} {branch.label}
                            </div>
                            {branch.eventType && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {branch.eventType === 'career' && 'キャリア'}
                                {branch.eventType === 'life' && '人生'}
                                {branch.eventType === 'unexpected' && '予期せぬ'}
                                {branch.eventType === 'choice' && '選択'}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {branch.description}
                          </p>
                          {branch.tags && branch.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {branch.tags.map(tag => {
                                const tagEmojis: Record<string, string> = {
                                  stability: '🛡️',
                                  challenge: '🚀',
                                  money: '💰',
                                  passion: '❤️',
                                  family: '👨‍👩‍👧‍👦',
                                  career: '📈',
                                };
                                return (
                                  <span
                                    key={tag}
                                    className="text-xs bg-white border border-gray-300 px-2 py-0.5 rounded-full"
                                  >
                                    {tagEmojis[tag]}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pattern Insights */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">💡</span>
                  パターン分析
                </h3>
                <div className="space-y-3">
                  <p className="text-gray-800 font-semibold">
                    {getPatternDescription()}
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(pattern.tags)
                      .sort((a, b) => b[1] - a[1])
                      .map(([tag, count]) => {
                        const tagLabels: Record<string, string> = {
                          stability: '🛡️ 安定',
                          challenge: '🚀 挑戦',
                          money: '💰 お金',
                          passion: '❤️ 情熱',
                          family: '👨‍👩‍👧‍👦 家族',
                          career: '📈 キャリア',
                        };
                        return (
                          <div
                            key={tag}
                            className="bg-white rounded-lg p-3 border border-gray-200 text-center"
                          >
                            <div className="text-sm font-semibold text-gray-900">
                              {tagLabels[tag]}
                            </div>
                            <div className="text-2xl font-bold text-blue-600 mt-1">
                              {count}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Reflection Questions */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="text-2xl mr-2">🤔</span>
                  振り返りの問いかけ
                </h3>
                <div className="space-y-3 text-gray-800">
                  <p className="font-semibold">💭 一番難しかった選択はどれでしたか？</p>
                  <p className="font-semibold">💎 何を大切にして選んできましたか？</p>
                  <p className="font-semibold">😲 意外だったことは何ですか？</p>
                  <p className="font-semibold">⭐ どの選択が今の自分に一番影響しましたか？</p>
                  <p className="font-semibold">🔄 やり直せるなら変えたい選択はありますか？</p>
                  <p className="font-semibold">💌 この道を選んだ自分に伝えたいことは？</p>
                </div>
                <div className="mt-4 p-4 bg-white rounded-lg border border-amber-300">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    これらの問いかけについて、AIコーチと対話してみませんか？
                    <br />
                    下の「この未来について話す」ボタンから、深い対話を始められます。
                  </p>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={() => setShowJourneyReview(false)}
                className="w-full py-4 px-6 bg-gray-600 hover:bg-gray-700 text-white font-bold text-base rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
