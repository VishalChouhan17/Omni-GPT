import { loadChatMessages, saveChatMessages } from "@/features/ai/actions/chat-store";
import { webSearchTool } from "@/features/ai/tools/web-search";
import { getChatModel } from "@/features/ai/utils/model";
import { requireUser } from "@/features/auth/action/require-user";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { convertToModelMessages, createIdGenerator, stepCountIs, streamText, type UIMessage } from "ai";

/**
 * POST /api/chat — Streams an AI assistant reply for a conversation.
 *
 * Validates auth and ownership, persists the user message, then streams the
 * assistant response via the AI SDK. Final messages are saved when the stream ends.
 */
export async function POST(req: Request) {
    try {
        await auth.protect();

        const { message, id }: { message: UIMessage; id: string } = await req.json();

        if (!message || !id) {
            return new Response("Missing message or conversation id", { status: 400 });
        }

        const user = await requireUser();

        const conversation = await prisma.conversation.findFirst({
            where: {
                id,
                userId: user.id,
            },
        });

        if (!conversation) {
            return new Response("Conversation not found", { status: 404 });
        }

        const previousMessages = await loadChatMessages(id);

        const alreadySaved = previousMessages.some(
            (storedMessage) => storedMessage.id === message.id
        );

        const messages = alreadySaved ? previousMessages : [...previousMessages, message];

        if (!alreadySaved) {
            await saveChatMessages(id, [message]);
        }

        const modelMessages = await convertToModelMessages(messages);

        const result = streamText({
            model: getChatModel(conversation.model),
            system:
                conversation.systemPrompt ??
                `You are OmniGPT, an intelligent, helpful, and highly skilled AI assistant.
Always format your answers with clean, beautiful GitHub-flavored Markdown:
- Code: Always enclose code in fenced code blocks with the language tag (e.g., \`\`\`javascript, \`\`\`python, \`\`\`typescript, \`\`\`json, \`\`\`html, \`\`\`css, \`\`\`sql).
- Mathematics: Always format math formulas using LaTeX with dollar sign delimiters: use $...$ for inline formulas (e.g. $45 \\times 12 + \\sqrt{16} = 544$) and $$...$$ for block formulas. Never output math inside plain parentheses like ( \\sqrt{16} ) or brackets [ 45 \\times 12 ].
- Structure: Use markdown headers (##, ###), bullet lists (- or *), bold text (**term**), and tables when comparing or organizing data.
- Real-time queries: When asked about current events, real-time facts, recent news, or live weather/temperatures, use the searchWeb tool to retrieve current information before answering.`,
            messages: modelMessages,
            tools: {
                searchWeb: webSearchTool,
            },
            stopWhen: stepCountIs(5),
        });

        return result.toUIMessageStreamResponse({
            originalMessages: messages,
            generateMessageId: createIdGenerator({ prefix: "msg", size: 16 }),
            onEnd: async ({ messages: finalMessages }) => {
                try {
                    await saveChatMessages(id, finalMessages, { updateTitle: false });
                } catch (error) {
                    console.error("Error saving chat messages onEnd:", error);
                }
            },
            onError: (error) => {
                console.error("Stream error in /api/chat:", error);
                return error instanceof Error ? error.message : "Internal Server Error";
            },
        });
    } catch (error: any) {
        console.error("POST /api/chat error:", error);
        return new Response(error?.message || "Internal Server Error", { status: 500 });
    }
}
