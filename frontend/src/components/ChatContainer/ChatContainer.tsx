import { ChatInput } from "../ChatInput/ChatInput";
import { MessageList } from "../MessageList/MessageList";
import type { ChatMessage } from "../../types/chat";

type ChatContainerProps = {
  messages: ChatMessage[];
  inputValue: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onTranscript: (transcript: string) => void;
};

export const ChatContainer = ({
  messages,
  inputValue,
  isLoading,
  onInputChange,
  onSubmit,
  onTranscript,
}: ChatContainerProps) => {
  return (
    <section className="flex h-[min(90vh,860px)] w-full max-w-[720px] flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/55 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl">
      <header className="flex items-center justify-between border-b border-slate-200/70 bg-white/70 px-5 py-4 sm:px-6">
        <div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-slate-800 sm:text-2xl">Мини-чат</h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">Ассистент с текстовым и голосовым вводом</p>
        </div>

        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${isLoading
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700"
            }`}
        >
          <span
            className={`mr-1.5 h-1.5 w-1.5 rounded-full ${isLoading ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}
            aria-hidden="true"
          />
          {isLoading ? "Генерация" : "Готово"}
        </span>
      </header>

      <MessageList messages={messages} isLoading={isLoading} />

      <ChatInput
        value={inputValue}
        disabled={isLoading}
        onChange={onInputChange}
        onSubmit={onSubmit}
        onTranscript={onTranscript}
      />
    </section>
  );
};
