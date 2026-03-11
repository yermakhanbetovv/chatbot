import type { ChatMessage, MessageRole } from "../types/chat";

const FALLBACK_RANDOM = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const createMessage = (role: MessageRole, text: string): ChatMessage => ({
  id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : FALLBACK_RANDOM(),
  role,
  text,
  createdAt: Date.now(),
});
