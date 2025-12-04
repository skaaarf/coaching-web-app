export type QuestionType = 'button' | 'text' | 'multi-input' | 'message_only' | 'summary';

export interface Option {
    label: string;
    value: string;
    icon?: string;
    nextStepId?: string; // For branching logic
}

export interface ActivityStep {
    id: string;
    type: QuestionType;
    message: string; // Message from Mikata-kun
    options?: Option[]; // For 'button' type
    placeholder?: string; // For 'text' type
    multiline?: boolean; // For 'text' type (textarea)
    inputs?: { label: string; placeholder: string }[]; // For 'multi-input' type
    summaryContent?: { // For 'summary' type
        title: string;
        items: { label: string; value: string }[];
    };
    nextStepId?: string; // Default next step
    isFinal?: boolean; // If true, shows completion screen
}

export interface ActivityDefinition {
    id: string;
    title: string;
    style: 'chat' | 'selection';
    initialStepId: string;
    steps: Record<string, ActivityStep>;
    // Optional display properties
    summary?: string;
    description?: string;
    emoji?: string;
    duration?: string;
    category?: string;
    tags?: string[];
    // Dynamic Chat Mode
    mode?: 'static' | 'dynamic_chat';
    systemPrompt?: string;
}

export interface Module {
    id: string;
    title: string;
    duration: string;
    summary: string;
    description: string;
    emoji: string;
    activityIds: string[];
    progress: number;
    level?: string;
    imageUrl?: string;
    link?: string;
}
