import cors from "cors";
import express from "express";

import { errorHandler, notFoundHandler } from "../middleware/error.middleware.js";
import { requestLogger } from "../middleware/request-logger.middleware.js";
import { chatRouter } from "../routes/chat.routes.js";
import { env } from "../utils/env.js";

const corsOrigin = env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

export const app = express();

app.disable("x-powered-by");
app.use(
  cors({
    origin: corsOrigin,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/chat", chatRouter);

app.use(notFoundHandler);
app.use(errorHandler);
