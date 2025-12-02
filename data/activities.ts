import { ActivityDefinition, Module } from '@/types/activity';
import { a1_moyamoya } from './activities/a1_moyamoya';
import { a2_recent_success } from './activities/a2_recent_success';
import { a3_likes_dislikes } from './activities/a3_likes_dislikes';
import { a4_holiday_diagnosis } from './activities/a4_holiday_diagnosis';
import { a5_compass } from './activities/a5_compass';
import { a6_options_overview } from './activities/a6_options_overview';
import { a7_options_pro_con } from './activities/a7_options_pro_con';
import { a8_fit_compass } from './activities/a8_fit_compass';
import { a9_first_choice_next_step } from './activities/a9_first_choice_next_step';
import { a10_role_models } from './activities/a10_role_models';
import { a11_common_points } from './activities/a11_common_points';
import { a12_day_story } from './activities/a12_day_story';
import { a13_my_day } from './activities/a13_my_day';
import { a14_interest_list } from './activities/a14_interest_list';
import { a15_job_image } from './activities/a15_job_image';
import { a16_work_env } from './activities/a16_work_env';
import { a17_job_suggestions } from './activities/a17_job_suggestions';
import { a18_prep_check } from './activities/a18_prep_check';
import { a19_consult_memo } from './activities/a19_consult_memo';
import { b1_gakuchika_list } from './activities/b1_gakuchika_list';
import { b2_gakuchika_draft } from './activities/b2_gakuchika_draft';
import { b3_reason_structure } from './activities/b3_reason_structure';
import { b4_pr_draft } from './activities/b4_pr_draft';
import { b5_feedback } from './activities/b5_feedback';
import { c1_status_check } from './activities/c1_status_check';
import { c2_axis } from './activities/c2_axis';
import { c3_candidates } from './activities/c3_candidates';
import { c4_focus } from './activities/c4_focus';
import { c5_action_plan } from './activities/c5_action_plan';
import { d1_goals } from './activities/d1_goals';
import { d2_connect } from './activities/d2_connect';
import { d3_type_fit } from './activities/d3_type_fit';
import { d4_requirements } from './activities/d4_requirements';
import { d5_apply_plan } from './activities/d5_apply_plan';
import { e1_time_audit } from './activities/e1_time_audit';
import { e2_small_steps } from './activities/e2_small_steps';
import { e3_self_intro } from './activities/e3_self_intro';
import { e4_contact_msg } from './activities/e4_contact_msg';
import { e5_reflection } from './activities/e5_reflection';

export const activities: Record<string, ActivityDefinition> = {
    'a1-moyamoya': a1_moyamoya,
    'a2-recent-success': a2_recent_success,
    'a3-likes-dislikes': a3_likes_dislikes,
    'a4-holiday-diagnosis': a4_holiday_diagnosis,
    'a5-compass': a5_compass,
    'a6-options-overview': a6_options_overview,
    'a7-options-pro-con': a7_options_pro_con,
    'a8-fit-compass': a8_fit_compass,
    'a9-first-choice-next-step': a9_first_choice_next_step,
    'a10-role-models': a10_role_models,
    'a11-common-points': a11_common_points,
    'a12-day-story': a12_day_story,
    'a13-my-day': a13_my_day,
    'a14-interest-list': a14_interest_list,
    'a15-job-image': a15_job_image,
    'a16-work-env': a16_work_env,
    'a17-job-suggestions': a17_job_suggestions,
    'a18-prep-check': a18_prep_check,
    'a19-consult-memo': a19_consult_memo,
    'b1-gakuchika-list': b1_gakuchika_list,
    'b2-gakuchika-draft': b2_gakuchika_draft,
    'b3-reason-structure': b3_reason_structure,
    'b4-pr-draft': b4_pr_draft,
    'b5-feedback': b5_feedback,
    'c1-status-check': c1_status_check,
    'c2-axis': c2_axis,
    'c3-candidates': c3_candidates,
    'c4-focus': c4_focus,
    'c5-action-plan': c5_action_plan,
    'd1-goals': d1_goals,
    'd2-connect': d2_connect,
    'd3-type-fit': d3_type_fit,
    'd4-requirements': d4_requirements,
    'd5-apply-plan': d5_apply_plan,
    'e1-time-audit': e1_time_audit,
    'e2-small-steps': e2_small_steps,
    'e3-self-intro': e3_self_intro,
    'e4-contact-msg': e4_contact_msg,
    'e5-reflection': e5_reflection,
};

export const modules: Module[] = [
    {
        id: 'mod-1',
        title: '自分コンパスを作る',
        duration: '45-90 分',
        summary: '自己理解の土台を作る。',
        description: '悩み・強み・好き嫌い・働き方スタイルを整理して、「自分はどんな人か」を一行で言える状態にするコース。',
        emoji: '🧭',
        activityIds: ['a1-moyamoya', 'a2-recent-success', 'a3-likes-dislikes', 'a4-holiday-diagnosis', 'a5-compass'],
        progress: 0,
    },
    {
        id: 'mod-2',
        title: '進路の大きな方向を決める',
        duration: '40-75 分',
        summary: '進路の方向性を定める。',
        description: 'いくつかの進路候補を並べ、良い点・不安・自分とのフィットを整理して、現時点の第一候補と「次の一歩」を決めるコース。',
        emoji: '🗺️',
        activityIds: ['a6-options-overview', 'a7-options-pro-con', 'a8-fit-compass', 'a9-first-choice-next-step'],
        progress: 0,
    },
    {
        id: 'mod-3',
        title: '進路図鑑ツアー',
        duration: '60-90 分',
        summary: 'ロールモデルから学ぶ。',
        description: 'ロールモデルや職業ストーリーを読みながら、「どんな生き方・働き方に惹かれるか」を掴むコース。',
        emoji: '📖',
        activityIds: ['a10-role-models', 'a11-common-points', 'a12-day-story', 'a13-my-day', 'a14-interest-list'],
        progress: 0,
    },
    {
        id: 'mod-4',
        title: '高卒就職スタートガイド',
        duration: '45-60 分',
        summary: '高卒就職の準備。',
        description: '高卒就職を考える高校生向けに、「どんな仕事が合いそうか」と「今からの準備」を整理するコース。',
        emoji: '🔰',
        activityIds: ['a15-job-image', 'a16-work-env', 'a17-job-suggestions', 'a18-prep-check', 'a19-consult-memo'],
        progress: 0,
    },
    {
        id: 'mod-5',
        title: 'ES・自己PRを作る',
        duration: '60-120 分',
        summary: '選考書類の下書き作成。',
        description: 'ガクチカ・志望理由・自己PRの「使える下書き」を、対話を通じて形にしていくコース。',
        emoji: '📝',
        activityIds: ['b1-gakuchika-list', 'b2-gakuchika-draft', 'b3-reason-structure', 'b4-pr-draft', 'b5-feedback'],
        progress: 0,
    },
    {
        id: 'mod-6',
        title: '就活・転職戦略を立てる',
        duration: '60-90 分',
        summary: '戦略的な活動計画。',
        description: 'エントリー先や業界をなんとなく増やすのではなく、「軸」と「優先順位」を決めて動ける状態を作るコース。',
        emoji: '♟️',
        activityIds: ['c1-status-check', 'c2-axis', 'c3-candidates', 'c4-focus', 'c5-action-plan'],
        progress: 0,
    },
    {
        id: 'mod-7',
        title: '大学生インターン・バイト設計',
        duration: '45-60 分',
        summary: '経験をキャリアに繋げる。',
        description: '「なんとなくバイトを探す」ではなく、「将来につながるインターン・バイト」を選ぶ視点を整えるコース。',
        emoji: '💼',
        activityIds: ['d1-goals', 'd2-connect', 'd3-type-fit', 'd4-requirements', 'd5-apply-plan'],
        progress: 0,
    },
    {
        id: 'mod-8',
        title: 'キャリア開発スキルを鍛える',
        duration: '60-90 分',
        summary: 'ポータブルスキルの向上。',
        description: 'どの進路を選んでも効く「時間管理・自己紹介・つながり作り・振り返り」の基礎をトレーニングするコース。',
        emoji: '💪',
        activityIds: ['e1-time-audit', 'e2-small-steps', 'e3-self-intro', 'e4-contact-msg', 'e5-reflection'],
        progress: 0,
    },
];
