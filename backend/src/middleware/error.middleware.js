import { AppError } from "../utils/app-error.js";
import { env } from "../utils/env.js";
import { logger } from "../utils/logger.js";

export const notFoundHandler = (req, _res, next) => {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export const errorHandler = (error, req, res, _next) => {
  const statusCode = error.statusCode && Number.isInteger(error.statusCode) ? error.statusCode : 500;
  const isOperational = error instanceof AppError;

  logger.error("Request failed", {
    method: req.method,
    route: req.originalUrl,
    statusCode,
    error: error.message,
    stack: env.NODE_ENV === "development" ? error.stack : undefined,
  });

  res.status(statusCode).json({
    error: isOperational ? error.message : "Internal server error",
  });
};
