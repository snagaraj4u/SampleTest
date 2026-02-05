import winston from 'winston';
import path from 'path';
import fs from 'fs';

const logsDir = path.join(process.cwd(), 'reports', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        customFormat
      ),
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
    }),
  ],
});

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatMessage(message: string): string {
    return `[${this.context}] ${message}`;
  }

  info(message: string, meta?: object): void {
    logger.info(this.formatMessage(message), meta);
  }

  debug(message: string, meta?: object): void {
    logger.debug(this.formatMessage(message), meta);
  }

  warn(message: string, meta?: object): void {
    logger.warn(this.formatMessage(message), meta);
  }

  error(message: string, meta?: object): void {
    logger.error(this.formatMessage(message), meta);
  }

  step(stepNumber: number, description: string): void {
    logger.info(this.formatMessage(`Step ${stepNumber}: ${description}`));
  }

  testStart(testName: string): void {
    logger.info(this.formatMessage(`Starting test: ${testName}`));
  }

  testEnd(testName: string, status: 'passed' | 'failed' | 'skipped'): void {
    logger.info(this.formatMessage(`Test ${testName} - ${status.toUpperCase()}`));
  }
}

export const createLogger = (context: string): Logger => new Logger(context);

export default logger;
