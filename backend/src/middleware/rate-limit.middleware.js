import rateLimit from "express-rate-limit";

import { env } from "../utils/env.js";

export const chatRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Слишком много запросов. Попробуйте снова через минуту.",
  },
});
