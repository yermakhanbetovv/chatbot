import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import type { ChatMessage } from "../../types/chat";

type MessageBubbleProps = {
  message: ChatMessage;
};

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopied(false), 1400);

    return () => window.clearTimeout(timeoutId);
  }, [copied]);

  const isUser = message.role === "user";
  const isError = message.role === "error";
  const isAssistant = message.role === "assistant";

  const bubbleClasses = isUser
    ? "border border-slate-900 bg-slate-900 text-slate-50"
    : isError
      ? "border border-rose-200 bg-rose-50 text-rose-700"
      : "border border-slate-200 bg-white/90 text-slate-700";

  const copyButtonClasses = isUser
    ? "text-slate-300 hover:bg-white/10 hover:text-white"
    : isError
      ? "text-rose-500 hover:bg-rose-100"
      : "text-slate-500 hover:bg-slate-100";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <article
        className={`group max-w-[86%] rounded-2xl px-4 py-3 shadow-sm transition-all animate-fade-in-up ${bubbleClasses}`}
      >
        {isAssistant ? (
          <div className="prose max-w-none break-words text-sm leading-6 text-inherit [&_h1]:mb-2 [&_h1]:mt-1 [&_h1]:text-xl [&_h1]:font-semibold [&_h2]:mb-2 [&_h2]:mt-1 [&_h2]:text-lg [&_h2]:font-semibold [&_h3]:mb-1 [&_h3]:mt-1 [&_h3]:text-base [&_h3]:font-semibold [&_p]:my-2 [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_strong]:font-semibold">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        ) : (
          <p className="whitespace-pre-wrap break-words text-sm leading-6">{message.text}</p>
        )}

        <div className="mt-2 flex justify-end">
          <button
            type="button"
            onClick={handleCopy}
            className={`rounded-lg px-2 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 group-hover:opacity-100 group-focus-within:opacity-100 sm:opacity-0 ${copyButtonClasses}`}
            aria-label="Копировать сообщение"
          >
            {copied ? "Скопировано" : "Копировать"}
          </button>
        </div>
      </article>
    </div>
  );
};
