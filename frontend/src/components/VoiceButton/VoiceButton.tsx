import { useEffect, useRef, useState } from "react";

interface SpeechRecognitionResultEventLike extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error: string;
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionResultEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

type VoiceButtonProps = {
  disabled: boolean;
  onTranscript: (transcript: string) => void;
};

export const VoiceButton = ({ disabled, onTranscript }: VoiceButtonProps) => {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    const speechWindow = window as SpeechWindow;
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = navigator.language || "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ")
        .trim();

      if (transcript) {
        onTranscript(transcript);
      }
    };
    recognition.onerror = () => {
      setIsRecording(false);
    };
    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [onTranscript]);

  const handleToggleRecording = () => {
    const recognition = recognitionRef.current;

    if (!recognition || disabled) {
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);

    try {
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleRecording}
      disabled={disabled || !isSupported}
      aria-label={isRecording ? "Остановить голосовой ввод" : "Начать голосовой ввод"}
      aria-pressed={isRecording}
      className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50 ${
        isRecording
          ? "border-rose-300 bg-rose-50 text-rose-600 shadow-sm"
          : "border-slate-200 bg-white/90 text-slate-500 hover:border-slate-300 hover:text-slate-700"
      }`}
      title={isSupported ? "Голосовой ввод" : "Голосовой ввод не поддерживается в этом браузере"}
    >
      {isRecording && <span className="absolute inset-0 rounded-xl border border-rose-300 animate-ping" />}
      <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 14.5a3.5 3.5 0 0 0 3.5-3.5V7a3.5 3.5 0 1 0-7 0v4a3.5 3.5 0 0 0 3.5 3.5Z" />
        <path d="M5.5 10.5v.5a6.5 6.5 0 0 0 13 0v-.5" strokeLinecap="round" />
        <path d="M12 17.5V21" strokeLinecap="round" />
      </svg>
    </button>
  );
};
