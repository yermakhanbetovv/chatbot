import { Router } from "express";

import { createChatCompletion } from "../controllers/chat.controller.js";
import { chatRateLimiter } from "../middleware/rate-limit.middleware.js";

export const chatRouter = Router();

chatRouter.post("/", chatRateLimiter, createChatCompletion);
