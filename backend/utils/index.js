import pino from "pino";

export const utils = {
    logger: pino({
        transport: {
            target: "pino-pretty",
        }
    })
}

