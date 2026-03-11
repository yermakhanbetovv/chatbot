import { useCallback, useState } from "react";

import { ChatContainer } from "./components/ChatContainer/ChatContainer";
import type { ChatMessage } from "./types/chat";
import { createMessage } from "./utils/message";

const getErrorMessage = (status: number, payload: unknown) => {
  if (payload && typeof payload === "object" && "error" in payload) {
    const apiError = (payload as { error?: unknown }).error;

    if (typeof apiError === "string" && apiError.trim()) {
      return apiError;
    }
  }

  return `Запрос завершился с ошибкой ${status}. Попробуйте ещё раз.`;
};

const App = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("assistant", "Здравствуйте! Я готов помочь с вашими вопросами."),
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = useCallback(async () => {
    if (isLoading) {
      return;
    }

    const content = inputValue.trim();

    if (!content) {
      return;
    }

    setInputValue("");
    setIsLoading(true);
    setMessages((prev) => [...prev, createMessage("user", content)]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: content }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(getErrorMessage(response.status, payload));
      }

      const answer =
        payload && typeof payload === "object" && "answer" in payload
          ? (payload as { answer?: unknown }).answer
          : undefined;

      if (typeof answer !== "string" || !answer.trim()) {
        throw new Error("Ассистент вернул пустой ответ.");
      }

      setMessages((prev) => [...prev, createMessage("assistant", answer)]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Неожиданная ошибка API.";

      setMessages((prev) => [...prev, createMessage("error", errorMessage)]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading]);

  const handleTranscript = useCallback((transcript: string) => {
    setInputValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-6 sm:px-6 sm:py-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-200/50 blur-3xl" />
        <div className="absolute -right-20 bottom-16 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] items-center justify-center">
        <ChatContainer
          messages={messages}
          inputValue={inputValue}
          isLoading={isLoading}
          onInputChange={setInputValue}
          onSubmit={handleSendMessage}
          onTranscript={handleTranscript}
        />
      </div>
    </main>
  );
};

export default App;
