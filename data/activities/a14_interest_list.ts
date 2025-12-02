import { ActivityDefinition } from '@/types/activity';

export const a14_interest_list: ActivityDefinition = {
    id: 'a14-interest-list',
    title: '気になる進路リストを作って保存する',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: 'ここまで見てきて、特に気になった仕事や進路を3つ挙げてみましょう。',
            placeholder: '例：Webデザイナー、編集者、広報',
            multiline: true,
            nextStepId: 'reason',
        },
        reason: {
            id: 'reason',
            type: 'text',
            message: 'それぞれの「気になる理由」を一言ずつメモしておきましょう。',
            placeholder: '例：Webデザイナー：作るのが好きだから',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'リストを作成しました！\n興味のアンテナを張っておくと、情報が入ってきやすくなりますよ。',
            isFinal: true,
        },
    },
};
