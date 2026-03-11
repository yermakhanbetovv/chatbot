import { app } from "./app.js";
import { env } from "../utils/env.js";
import { logger } from "../utils/logger.js";

export const startServer = () => {
  const server = app.listen(env.PORT, () => {
    logger.info("Server started", {
      port: env.PORT,
      nodeEnv: env.NODE_ENV,
    });
  });

  server.on("error", (error) => {
    logger.error("Server failed to start", {
      message: error.message,
      code: error.code,
    });

    process.exit(1);
  });
};
