import { ActivityDefinition } from '@/types/activity';

export const a1_select_role_model: ActivityDefinition = {
    id: 'a1-select-role-model',
    title: '憧れの人を選ぶ',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '様々な分野で活躍する人物の中から、「気になる人」や「憧れる人」を3人教えてください。\n有名人、歴史上の人物、身近な人、誰でも構いません。',
            placeholder: '',
            options: [
                { label: 'スティーブ・ジョブズ', value: 'スティーブ・ジョブズ' },
                { label: '坂本龍馬', value: '坂本龍馬' },
                { label: '部活の先輩', value: '部活の先輩' },
            ],
            nextStepId: 'reason',
        },
        reason: {
            id: 'reason',
            type: 'text',
            message: 'その人たちのどこに惹かれますか？共通点はありますか？',
            placeholder: '',
            options: [
                { label: '自分の信念を貫いているところ', value: '自分の信念を貫いているところ' },
                { label: '周りに流されない強さ', value: '周りに流されない強さ' },
            ],
            nextStepId: 'lifestyle',
        },
        lifestyle: {
            id: 'lifestyle',
            type: 'text',
            message: 'その人たちのどんな生き方が良いと思いますか？',
            placeholder: '',
            options: [
                { label: '自由に世界を飛び回っているところ', value: '自由に世界を飛び回っているところ' },
                { label: '好きなことに没頭しているところ', value: '好きなことに没頭しているところ' },
            ],
            nextStepId: 'emulate',
        },
        emulate: {
            id: 'emulate',
            type: 'text',
            message: 'その人のようになりたいですか？それとも、一部だけ真似したいですか？',
            placeholder: '',
            options: [
                { label: '考え方は真似したい', value: '考え方は真似したい' },
                { label: '生活スタイルは違っていい', value: '生活スタイルは違っていい' },
            ],
            nextStepId: 'analysis',
        },
        analysis: {
            id: 'analysis',
            type: 'message_only',
            message: 'ありがとうございます。\nあなたは『起業家的創造性』や『自律』を重視するタイプかもしれません。\n憧れの人には、あなたの理想が投影されています。',
            isFinal: true,
        },
    },
};
