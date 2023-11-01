import pino from "pino";

export const utils = {
  logger: pino({
    transport: {
      target: "pino-pretty",
    },
  }),
};

export const getChunkProps = (range, fileSize) => {
  const parts = range.replace(/bytes=/, "").split("-");

  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunkSize = end - start + 1;

  return {
    start,
    end,
    chunkSize,
  };
};

