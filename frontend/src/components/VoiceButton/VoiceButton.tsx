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
  onstart: (() => void) | null;
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
  const pendingTranscriptRef = useRef("");
  const shouldCommitTranscriptRef = useRef(false);
  const [isSupported, setIsSupported] = useState(false);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const speechWindow = window as SpeechWindow;
    const SpeechRecognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "ru-RU";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => {
      setListening(true);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim() ?? "";
      pendingTranscriptRef.current = transcript;
    };
    recognition.onerror = () => {
      shouldCommitTranscriptRef.current = false;
      pendingTranscriptRef.current = "";
      setListening(false);
    };
    recognition.onend = () => {
      const transcript = pendingTranscriptRef.current;
      const shouldCommit = shouldCommitTranscriptRef.current;

      pendingTranscriptRef.current = "";
      shouldCommitTranscriptRef.current = false;
      setListening(false);

      if (shouldCommit && transcript) {
        onTranscript(transcript);
      }
    };

    recognitionRef.current = recognition;
    setIsSupported(true);

    return () => {
      shouldCommitTranscriptRef.current = false;
      pendingTranscriptRef.current = "";
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [onTranscript]);

  const handleToggleRecording = () => {
    if (!isSupported) {
      window.alert("Голосовой ввод не поддерживается в этом браузере.");
      return;
    }

    const recognition = recognitionRef.current;

    if (!recognition || disabled) {
      return;
    }

    if (listening) {
      shouldCommitTranscriptRef.current = true;
      recognition.stop();
      setListening(false);
      return;
    }

    pendingTranscriptRef.current = "";
    shouldCommitTranscriptRef.current = true;

    try {
      recognition.start();
      setListening(true);
    } catch {
      shouldCommitTranscriptRef.current = false;
      pendingTranscriptRef.current = "";
      setListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggleRecording}
      disabled={disabled}
      aria-label={listening ? "Остановить голосовой ввод" : "Начать голосовой ввод"}
      aria-pressed={listening}
      className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:cursor-not-allowed disabled:opacity-50 ${
        listening
          ? "border-red-500 bg-red-500 text-white shadow-sm animate-pulse"
          : "border-slate-200 bg-white/90 text-slate-500 hover:border-slate-300 hover:text-slate-700"
      }`}
      title={isSupported ? "Голосовой ввод" : "Голосовой ввод не поддерживается в этом браузере"}
    >
      {listening && <span className="absolute inset-0 rounded-xl border border-red-400 animate-ping" />}
      <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 14.5a3.5 3.5 0 0 0 3.5-3.5V7a3.5 3.5 0 1 0-7 0v4a3.5 3.5 0 0 0 3.5 3.5Z" />
        <path d="M5.5 10.5v.5a6.5 6.5 0 0 0 13 0v-.5" strokeLinecap="round" />
        <path d="M12 17.5V21" strokeLinecap="round" />
      </svg>
    </button>
  );
};
