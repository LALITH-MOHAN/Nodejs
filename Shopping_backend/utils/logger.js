import winston from 'winston';
import fs from 'fs';
import path from 'path';

const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), logFormat),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'app.log') }),
    new winston.transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
    new winston.transports.Console({
      format: combine(colorize(), timestamp(), logFormat)
    })
  ]
});

export const getModuleLogger = (moduleName) => {
  const moduleLogPath = path.join(logDir, `${moduleName}.log`);
  return winston.createLogger({
    level: 'info',
    format: combine(timestamp(), logFormat),
    transports: [
      new winston.transports.File({ filename: moduleLogPath }),
      new winston.transports.Console({
        format: combine(colorize(), timestamp(), logFormat)
      })
    ]
  });
};

export default logger;
