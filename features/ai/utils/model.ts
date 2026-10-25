import { createOpenAI } from '@ai-sdk/openai';

export const DEFAULT_CHAT_MODEL = "gpt-4o-mini";

export const getChatModel = (modelId?: string | null) => {
    const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY || process.env.OPEN_AI_API_KEY,
    });
    return openai(modelId || DEFAULT_CHAT_MODEL);
};
