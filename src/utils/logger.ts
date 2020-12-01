import { createLogger, format, transports, Logger } from "winston";

const { combine, colorize, simple, timestamp } = format;

const level: string = process.env.NODE_ENV === "production" ? "error" : "debug";
const formatOpt: any = combine(colorize(), simple(), timestamp());

const loggerOptions = {
	level,
	format: formatOpt,
	transports: [
		new transports.Console({ level, format: formatOpt, silent: false }),
	],
};

const logger: Logger = createLogger(loggerOptions);

logger.info(`Logging initialised on ${process.env.NODE_ENV} server`);

export { logger };
