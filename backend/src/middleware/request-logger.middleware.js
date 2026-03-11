import { logger } from "../utils/logger.js";

export const requestLogger = (req, res, next) => {
  const start = performance.now();

  res.on("finish", () => {
    const durationMs = Number((performance.now() - start).toFixed(1));

    logger.info("HTTP request", {
      method: req.method,
      route: req.originalUrl,
      statusCode: res.statusCode,
      durationMs,
      ip: req.ip,
    });
  });

  next();
};
