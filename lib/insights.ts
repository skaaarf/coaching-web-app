import { ModuleProgress, UserInsights, Message } from '@/types';

export async function generateInsights(
  allProgress: Record<string, ModuleProgress>
): Promise<UserInsights> {
  // Collect all messages from all modules
  const allMessages: { moduleId: string; messages: Message[] }[] = [];

  Object.entries(allProgress).forEach(([moduleId, progress]) => {
    if (progress.messages.length > 0) {
      allMessages.push({ moduleId, messages: progress.messages });
    }
  });

  if (allMessages.length === 0) {
    return {
      careerThinking: [],
      currentConcerns: [],
      thoughtFlow: [],
      patterns: [],
      lastAnalyzed: new Date()
    };
  }

  // Build context for AI analysis
  const context = allMessages.map(({ moduleId, messages }) => {
    const userMessages = messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join('\n');

    return `[${moduleId}]\n${userMessages}`;
  }).join('\n\n');

  try {
    const response = await fetch('/api/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ context })
    });

    if (!response.ok) {
      throw new Error('Failed to generate insights');
    }

    const data = await response.json();

    return {
      careerThinking: data.careerThinking || [],
      currentConcerns: data.currentConcerns || [],
      thoughtFlow: data.thoughtFlow || [],
      patterns: data.patterns || [],
      lastAnalyzed: new Date()
    };
  } catch (error) {
    console.error('Error generating insights:', error);

    // Fallback: simple keyword-based insights
    return generateSimpleInsights(allMessages);
  }
}

function generateSimpleInsights(
  allMessages: { moduleId: string; messages: Message[] }[]
): UserInsights {
  const userMessages = allMessages.flatMap(({ messages }) =>
    messages.filter(m => m.role === 'user').map(m => m.content)
  );

  const allText = userMessages.join(' ').toLowerCase();

  // Simple keyword detection
  const careerThinking: string[] = [];
  const currentConcerns: string[] = [];
  const thoughtFlow: string[] = [];

  if (allText.includes('大学') || allText.includes('進学')) {
    careerThinking.push('大学進学について考えている');
  }
  if (allText.includes('就職') || allText.includes('働く')) {
    careerThinking.push('就職や働くことについて関心がある');
  }
  if (allText.includes('不安') || allText.includes('心配')) {
    currentConcerns.push('進路について不安を感じている');
  }
  if (allText.includes('好き') || allText.includes('興味')) {
    thoughtFlow.push('自分の興味・関心を探っている');
  }
  if (allText.includes('将来') || allText.includes('未来')) {
    thoughtFlow.push('将来のことを考えている');
  }

  return {
    careerThinking: careerThinking.length > 0 ? careerThinking : ['まだデータが少ないです。もっとモジュールを進めてみましょう。'],
    currentConcerns: currentConcerns.length > 0 ? currentConcerns : [],
    thoughtFlow: thoughtFlow.length > 0 ? thoughtFlow : [],
    patterns: [],
    lastAnalyzed: new Date()
  };
}
