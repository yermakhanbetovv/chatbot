const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV?.trim() || "development",
  PORT: parseNumber(process.env.PORT, 3001),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY?.trim() || "",
  OPENAI_MODEL: process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini",
  RATE_LIMIT_WINDOW_MS: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 60_000),
  RATE_LIMIT_MAX_REQUESTS: parseNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 30),
  CORS_ORIGIN: process.env.CORS_ORIGIN?.trim() || "*",
};

if (!env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set. Add it to backend/.env");
}
