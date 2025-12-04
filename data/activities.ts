import { ActivityDefinition, Module } from '@/types/activity';

// Module 1: Strength Discovery
import { a1_immersion } from './activities/m1_strength_discovery/a1_immersion';
import { a2_excitement } from './activities/m1_strength_discovery/a2_excitement';

// Module 2: Value Discovery
import { a1_negative_values } from './activities/m2_value_discovery/a1_negative_values';
// Keeping original ones as extras if needed, but user requested reconfiguration.
// Merging "Binary Choice" and "Environment Diagnosis" as requested by user note: "can be integrated here".
// For now, I will append them as optional/extra steps or just replace if the new flow covers it.
// User said "Target Reconfigured Activities: 2-1...2-4". I will stick to these 4 for the main flow.
// I will keep the old files in the codebase but remove them from the module list for now to match the request exactly.



import { a4_praise_strength } from './activities/m1_strength_discovery/a4_praise_strength';
import { a5_role_model } from './activities/m2_value_discovery/a5_role_model';

export const activities: Record<string, ActivityDefinition> = {
    'a1-immersion': a1_immersion,
    'a1-negative-values': a1_negative_values,
    'a2-excitement': a2_excitement,
    'a4-praise-strength': a4_praise_strength,
    'a5-role-model': a5_role_model,
};

export const modules: Module[] = [
    {
        id: 'mod-self-discovery',
        title: '自分を知る',
        duration: '30-60 分',
        summary: '自己分析の決定版',
        description: '強み、価値観、キャリア志向。就活に必要な「自己分析」がこれ1つで完結します。',
        emoji: '💎',
        activityIds: ['a1-immersion', 'a1-negative-values', 'a2-excitement', 'a4-praise-strength', 'a5-role-model'],
        progress: 0,
    },
];
