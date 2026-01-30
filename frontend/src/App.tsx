import React, { useCallback, useEffect, useRef, useState } from "react";

type Message = {
  id: number;
  from: "user" | "bot";
  text: string;
};

type RecognitionType = (Window & typeof globalThis) & {
  webkitSpeechRecognition?: any;
};

const App: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const nextId = useRef(1);

  useEffect(() => {
    const win = window as RecognitionType;
    const SpeechRecognition =
      (win as any).SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.lang = "ru-RU";
      recog.interimResults = false;
      recog.maxAlternatives = 1;

      recog.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? prev + " " + transcript : transcript));
      };

      recog.onerror = (event: any) => {
        console.error("Speech error:", event.error);
      };

      recog.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recog;
    }
  }, []);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content) return;

      setError(null);
      setLoading(true);
      setInput("");

      const idUser = nextId.current++;
      setMessages((prev) => [
        ...prev,
        { id: idUser, from: "user", text: content }
      ]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ message: content })
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || data.details || res.statusText);
        }

        const data = await res.json();

        const answer: string =
          data.answer ||
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Gemini молчит";

        const idBot = nextId.current++;
        setMessages((prev) => [
          ...prev,
          { id: idBot, from: "bot", text: answer }
        ]);
      } catch (e: any) {
        setError(e.message || "Неизвестная ошибка");
      } finally {
        setLoading(false);
      }
    },
    [input]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleListening = () => {
    const recog = recognitionRef.current;
    if (!recog) {
      alert("SpeechRecognition не поддерживается в этом браузере");
      return;
    }

    if (listening) {
      recog.stop();
      setListening(false);
    } else {
      setListening(true);
      recog.start();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-slate-800 rounded-2xl shadow-xl border border-slate-700 flex flex-col overflow-hidden">
        <header className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">Mini ChatGPT</h1>
            <p className="text-xs text-slate-400">
              Введи текст или продиктуй голосом
            </p>
          </div>
          {loading && (
            <div className="text-xs text-emerald-400 animate-pulse">
              Модель думает...
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-slate-900/40">
          {messages.length === 0 && (
            <div className="text-sm text-slate-500 text-center mt-4">
              Начни диалог: спроси что-нибудь у модели
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${m.from === "user"
                    ? "bg-emerald-600 text-white rounded-br-sm"
                    : "bg-slate-700 text-slate-50 rounded-bl-sm"
                  }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="px-4 py-2 text-xs text-red-400 border-t border-slate-700 bg-slate-900/60">
            Ошибка: {error}
          </div>
        )}

        <div className="border-t border-slate-700 bg-slate-900/60 px-4 py-3">
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center text-sm ${listening
                  ? "border-rose-500 text-rose-400 bg-rose-500/10"
                  : "border-slate-600 text-slate-300 hover:border-slate-400"
                }`}
            >
              🎤
            </button>

            <textarea
              className="flex-1 resize-none rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 max-h-32"
              rows={2}
              placeholder="Напиши сообщение и нажми Enter..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />

            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="flex-shrink-0 inline-flex items-center justify-center rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 disabled:cursor-not-allowed px-4 py-2 text-sm font-medium text-white transition-colors"
            >
              {loading ? "..." : "Отправить"}
            </button>
          </div>
          <div className="mt-1 text-[11px] text-slate-500">
            Enter — отправка, Shift+Enter — новая строка
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
