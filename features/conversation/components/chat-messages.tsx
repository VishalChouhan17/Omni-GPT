"use client";

import { isTextUIPart, type UIMessage } from "ai";
import type { ChatStatus } from "ai";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Loader } from "@/components/ai-elements/loader";

/** Extracts plain text from a `UIMessage` by joining all text parts. */
function getMessageText(message: UIMessage) {
  return message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("");
}

type ChatMessagesProps = {
  messages: UIMessage[];
  status: ChatStatus;
};

/**
 * Renders the conversation message list with markdown responses and a loading indicator.
 */
export function ChatMessages({ messages, status }: ChatMessagesProps) {
  const lastMessage = messages.at(-1);
  const isWaiting = status === "submitted" && lastMessage?.role === "user";

  return (
    <Conversation>
      <ConversationContent className="mx-auto w-full max-w-3xl px-4 py-8 md:px-6">
        {messages.map((message) => {
          const text = getMessageText(message);
          if (!text && message.role === "assistant" && (status === "streaming" || status === "submitted")) {
            return (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  <div className="flex items-center gap-2 py-1 text-sm text-muted-foreground animate-pulse">
                    <Loader size={15} />
                    <span>Searching the web & analyzing results...</span>
                  </div>
                </MessageContent>
              </Message>
            );
          }

          if (!text && message.role === "assistant") return null;

          return (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                <MessageResponse>{text}</MessageResponse>
              </MessageContent>
            </Message>
          );
        })}

        {isWaiting ? (
          <Message from="assistant">
            <MessageContent>
              <Loader />
            </MessageContent>
          </Message>
        ) : null}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  );
}
