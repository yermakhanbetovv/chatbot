import { FormEvent, KeyboardEvent, useEffect, useRef } from "react";

import { VoiceButton } from "../VoiceButton/VoiceButton";

type ChatInputProps = {
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onTranscript: (text: string) => void;
};

const MAX_TEXTAREA_HEIGHT = 220;

export const ChatInput = ({ value, disabled, onChange, onSubmit, onTranscript }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "0px";
    textarea.style.height = `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [value]);

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (disabled || !value.trim()) {
      return;
    }

    onSubmit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!disabled && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <form onSubmit={handleSend} className="border-t border-slate-200/80 bg-white/60 px-3 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
      <div className="flex items-end gap-2">
        <VoiceButton disabled={disabled} onTranscript={onTranscript} />

        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введите сообщение..."
          disabled={disabled}
          className="max-h-[220px] min-h-[48px] flex-1 resize-none rounded-xl border border-slate-200 bg-white/90 px-4 py-3 text-sm leading-6 text-slate-700 shadow-sm transition-all placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100/80"
        />

        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Отправить сообщение"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm transition-all hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12h14" strokeLinecap="round" />
            <path d="m12 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <p className="mt-2 px-1 text-xs text-slate-500">Enter для отправки, Shift + Enter для новой строки.</p>
    </form>
  );
};
