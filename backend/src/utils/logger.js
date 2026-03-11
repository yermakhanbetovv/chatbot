const buildPayload = (level, message, meta = {}) => {
  const payload = {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...meta,
  };

  return JSON.stringify(payload);
};

export const logger = {
  info: (message, meta) => {
    console.log(buildPayload("info", message, meta));
  },
  warn: (message, meta) => {
    console.warn(buildPayload("warn", message, meta));
  },
  error: (message, meta) => {
    console.error(buildPayload("error", message, meta));
  },
};
