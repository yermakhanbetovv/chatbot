import { generateAssistantReply } from "../services/openai.service.js";
import { asyncHandler } from "../utils/async-handler.js";
import { AppError } from "../utils/app-error.js";

export const createChatCompletion = asyncHandler(async (req, res) => {
  const { message } = req.body ?? {};

  if (typeof message !== "string" || !message.trim()) {
    throw new AppError(400, "Требуется поле message");
  }

  const answer = await generateAssistantReply(message.trim());

  res.status(200).json({ answer });
});
