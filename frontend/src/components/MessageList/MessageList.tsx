import { useEffect, useRef } from "react";

import type { ChatMessage } from "../../types/chat";
import { MessageBubble } from "../MessageBubble/MessageBubble";
import { TypingIndicator } from "../TypingIndicator/TypingIndicator";

type MessageListProps = {
  messages: ChatMessage[];
  isLoading: boolean;
};

export const MessageList = ({ messages, isLoading }: MessageListProps) => {
  const bottomAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isLoading]);

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-12 text-center">
        <div className="max-w-sm rounded-2xl border border-slate-200/80 bg-white/60 p-6 shadow-sm backdrop-blur-sm">
          <p className="font-display text-lg font-semibold text-slate-700">Здравствуйте!</p>
          <p className="mt-2 text-sm text-slate-500">
            Что вы хотите узнать? Напишите сообщение.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && <TypingIndicator />}

      <div ref={bottomAnchorRef} aria-hidden="true" />
    </div>
  );
};
