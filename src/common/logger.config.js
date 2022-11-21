import expressWinston from 'express-winston';
import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

export const requestLogger = process.env.NODE_ENV === 'test'
  ? (request, response, next) => next()
  : expressWinston.logger({
    winstonInstance: logger,
    msg: 'HTTP {{res.statusCode}} {{req.url}} {{req.url}} {{res.responseTime}}ms'
  });
