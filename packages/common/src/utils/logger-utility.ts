import * as winston from 'winston';

const {
  splat: win_splat,
  combine,
  timestamp: win_timestamp,
  label: win_label,
  printf,
  errors
} = winston.format;
const loggerInstances = new Map<string, winston.Logger>();

const errorsFormat = errors({ stack: true });

const formatMeta = (meta: any) => {
  // format the splat yourself
  const splat = meta[Symbol.for('splat')];
  if (splat && splat.length) {
    return splat.length === 1
      ? JSON.stringify(splat[0])
      : JSON.stringify(splat);
  }
  return '';
};

const customFormatter = printf(args => {
  const { level, message, label, timestamp, ...metadata } = args;
  return `${timestamp} [${label}] ${level}: ${message} ${formatMeta(metadata)}`;
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
      win_label({ label: tag }),
      win_timestamp(),
      customFormatter,
      win_splat()
    ),
    transports: [new winston.transports.Console({ level: getLogLevel(tag) })]
  });
  loggerInstances.set(tag, logger);
  return logger;
};
