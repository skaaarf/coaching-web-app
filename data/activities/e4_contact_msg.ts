import { ActivityDefinition } from '@/types/activity';

export const e4_contact_msg: ActivityDefinition = {
    id: 'e4-contact-msg',
    title: '一人だけ話してみたい人を決める',
    style: 'chat',
    initialStepId: 'intro',
    steps: {
        intro: {
            id: 'intro',
            type: 'text',
            message: '話を聞いてみたい人はいますか？\n具体的な名前か、どんな人か（例：OBの先輩）を教えてください。',
            placeholder: '例：サークルの先輩の佐藤さん',
            nextStepId: 'topic',
        },
        topic: {
            id: 'topic',
            type: 'text',
            message: 'その人に何を聞いてみたいですか？',
            placeholder: '例：就活の時の軸について聞きたい',
            multiline: true,
            nextStepId: 'message',
        },
        message: {
            id: 'message',
            type: 'text',
            message: '連絡するためのメッセージ案を作ってみましょう。\n「ご無沙汰しています...」から始めてみてください。',
            placeholder: 'ご無沙汰しています。相談がありまして...',
            multiline: true,
            nextStepId: 'complete',
        },
        complete: {
            id: 'complete',
            type: 'message_only',
            message: 'メッセージの下書きができました。\n送信ボタンを押す勇気が出れば、新しい扉が開きます！',
            isFinal: true,
        },
    },
};
