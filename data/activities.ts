import { ActivityDefinition, Module } from '@/types/activity';

// Module 1: Strength Discovery
import { a1_immersion } from './activities/m1_strength_discovery/a1_immersion';
import { a2_excitement } from './activities/m1_strength_discovery/a2_excitement';
import { a3_unconscious_strength } from './activities/m1_strength_discovery/a3_unconscious_strength';
import { a4_effort_source } from './activities/m1_strength_discovery/a4_effort_source';

// Module 2: Value Discovery
import { a1_negative_values } from './activities/m2_value_discovery/a1_negative_values';
import { a2_money_value } from './activities/m2_value_discovery/a2_money_value';
import { a3_origin_experience } from './activities/m2_value_discovery/a3_origin_experience';
import { a4_legacy_values } from './activities/m2_value_discovery/a4_legacy_values';
// Keeping original ones as extras if needed, but user requested reconfiguration.
// Merging "Binary Choice" and "Environment Diagnosis" as requested by user note: "can be integrated here".
// For now, I will append them as optional/extra steps or just replace if the new flow covers it.
// User said "Target Reconfigured Activities: 2-1...2-4". I will stick to these 4 for the main flow.
// I will keep the old files in the codebase but remove them from the module list for now to match the request exactly.

// Module 3: Role Models
import { a1_role_model_analysis } from './activities/m3_role_model/a1_role_model_analysis';
import { a2_motto_analysis } from './activities/m3_role_model/a2_motto_analysis';
import { a3_life_direction } from './activities/m3_role_model/a3_life_direction';

// Module 4: Future Vision
import { a1_anchor_diagnosis } from './activities/m4_future_vision/a1_anchor_diagnosis';
import { a2_future_3_years } from './activities/m4_future_vision/a2_future_3_years';
import { a3_future_10_years } from './activities/m4_future_vision/a3_future_10_years';
import { a4_non_negotiable_conditions } from './activities/m4_future_vision/a4_non_negotiable_conditions';

// Module 5: Job Matching
import { a1_skill_to_job } from './activities/m5_job_matching/a1_skill_to_job';
import { a2_industry_matching } from './activities/m5_job_matching/a2_industry_matching';
import { a3_industry_simulation } from './activities/m5_job_matching/a3_industry_simulation';

export const activities: Record<string, ActivityDefinition> = {
    // Module 1
    'a1-immersion': a1_immersion,
    'a2-excitement': a2_excitement,
    'a3-unconscious-strength': a3_unconscious_strength,
    'a4-effort-source': a4_effort_source,

    // Module 2
    'a1-negative-values': a1_negative_values,
    'a2-money-value': a2_money_value,
    'a3-origin-experience': a3_origin_experience,
    'a4-legacy-values': a4_legacy_values,

    // Module 3
    'a1-role-model-analysis': a1_role_model_analysis,
    'a2-motto-analysis': a2_motto_analysis,
    'a3-life-direction': a3_life_direction,

    // Module 4
    'a1-anchor-diagnosis': a1_anchor_diagnosis,
    'a2-future-3-years': a2_future_3_years,
    'a3-future-10-years': a3_future_10_years,
    'a4-non-negotiable-conditions': a4_non_negotiable_conditions,

    // Module 5
    'a1-skill-to-job': a1_skill_to_job,
    'a2-industry-matching': a2_industry_matching,
    'a3-industry-simulation': a3_industry_simulation,
};

export const modules: Module[] = [
    {
        id: 'mod-1',
        title: '自分の強みを発見する',
        duration: '25-40 分',
        summary: '強みの核心、行動特性の抽出',
        description: '没頭体験や無意識の行動から、あなただけの「強み」とそれを裏付けるエピソードを見つけるコース。',
        emoji: '💪',
        activityIds: ['a1-immersion', 'a2-excitement', 'a3-unconscious-strength', 'a4-effort-source'],
        progress: 0,
    },
    {
        id: 'mod-2',
        title: '大切にしたい価値観を見つける',
        duration: '20-35 分',
        summary: '価値観・譲れない条件の抽出',
        description: '許せないことやお金の使い方、原体験を通じて、あなたが仕事や人生で大切にしたい「価値観」と「譲れない軸」を探るコース。',
        emoji: '🧭',
        activityIds: ['a1-negative-values', 'a2-money-value', 'a3-origin-experience', 'a4-legacy-values'],
        progress: 0,
    },
    {
        id: 'mod-3',
        title: '憧れの人からキャリア志向を学ぶ',
        duration: '20-30 分',
        summary: 'キャリア・アンカー、理想像の抽出',
        description: '憧れの人や座右の銘を分析することで、あなたのキャリアの核となる「キャリア・アンカー」と「理想の生き方」を見つけるコース。',
        emoji: '✨',
        activityIds: ['a1-role-model-analysis', 'a2-motto-analysis', 'a3-life-direction'],
        progress: 0,
    },
    {
        id: 'mod-4',
        title: '未来の自分を描く',
        duration: '30-45 分',
        summary: 'キャリアビジョンの明確化、キャリア・アンカー診断',
        description: '3年後・10年後の理想の姿を想像し、譲れない条件を整理することで、具体的な「キャリアビジョン」を描くコース。',
        emoji: '🔭',
        activityIds: ['a1-anchor-diagnosis', 'a2-future-3-years', 'a3-future-10-years', 'a4-non-negotiable-conditions'],
        progress: 0,
    },
    {
        id: 'mod-5',
        title: '自分に合う仕事を探る',
        duration: '25-40 分',
        summary: '適職マッチング、業界・職種の理解',
        description: 'あなたの強み・価値観・ビジョンを総合的に分析し、本当に向いている業界・職種をマッチングするコース。',
        emoji: '🧩',
        activityIds: ['a1-skill-to-job', 'a2-industry-matching', 'a3-industry-simulation'],
        progress: 0,
    },
];
