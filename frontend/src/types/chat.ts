export type MessageRole = "user" | "assistant" | "error";

export type ChatMessage = {
  id: string;
  role: MessageRole;
  text: string;
  createdAt: number;
};
