import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

type ChatBody = {
  message?: unknown;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not configured" });
  }

  const body: ChatBody = req.body ?? {};
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!message) {
    return res.status(400).json({ error: "message is required" });
  }

  try {
    const completion = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are a helpful AI assistant. Always reply in the same language as the user's message.",
        },
        { role: "user", content: message },
      ],
    });

    const answer = completion.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      return res.status(502).json({ error: "OpenAI returned an empty response" });
    }

    return res.status(200).json({ answer });
  } catch (error: any) {
    const status = Number(error?.status) || Number(error?.statusCode) || 502;
    const safeStatus = status >= 400 && status <= 599 ? status : 502;
    const message =
      error?.error?.message || error?.message || "Failed to generate chat completion";

    return res.status(safeStatus).json({ error: message });
  }
}
