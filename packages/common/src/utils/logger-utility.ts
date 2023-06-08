import * as winston from 'winston';

const { splat, combine, timestamp, label, printf, errors } = winston.format;
const loggerInstances = new Map<string, winston.Logger>();

const errorsFormat = errors({ stack: true });

const formatMeta = (meta: any) => {
  // format the splat yourself
  const splat_format = meta[Symbol.for('splat')];
  if (splat_format && splat_format.length) {
    return splat_format.length === 1
      ? JSON.stringify(splat_format[0])
      : JSON.stringify(splat_format);
  }
  return '';
};

const customFormatter = printf(args => {
  const { level, message, label_formatter, timestamp_formatter, ...metadata } =
    args;
  return `${timestamp} [${label}] ${label_formatter}: ${timestamp_formatter} ${formatMeta(
    metadata
  )}`;
});

const getLogLevel = (tag: string): string => {
  let logLevel: string = process.env.LOG_LEVEL ?? 'info';
  const envVariableName = `${tag}_log_level`.toUpperCase();
  const allowedModuleLevel: string | undefined = process.env[envVariableName];
  logLevel = allowedModuleLevel === undefined ? logLevel : allowedModuleLevel;
  return logLevel.toLowerCase();
};

export const LoggerFactory = (tag: string) => {
  let logger = loggerInstances.get(tag);
  if (logger != null) {
    return logger;
  }

  logger = winston.createLogger({
    format: combine(
      errorsFormat,
      label({ label: tag }),
      timestamp(),
      customFormatter,
      splat()
    ),
    transports: [new winston.transports.Console({ level: getLogLevel(tag) })]
  });
  loggerInstances.set(tag, logger);
  return logger;
};
