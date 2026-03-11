import OpenAI from "openai";

import { AppError } from "../utils/app-error.js";
import { env } from "../utils/env.js";
import { logger } from "../utils/logger.js";

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export const generateAssistantReply = async (message) => {
  try {
    const completion = await client.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant. Always reply in the same language as the user's message.",
        },
        { role: "user", content: message },
      ],
    });

    const answer = completion.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new AppError(502, "OpenAI returned an empty response");
    }

    return answer;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    const statusCode = Number(error?.status) || Number(error?.statusCode) || 502;
    const safeStatusCode = statusCode >= 400 && statusCode <= 599 ? statusCode : 502;
    const message = error?.error?.message || error?.message || "Failed to generate chat completion";

    logger.error("OpenAI request failed", {
      statusCode: safeStatusCode,
      detail: message,
    });

    throw new AppError(safeStatusCode, message);
  }
};
