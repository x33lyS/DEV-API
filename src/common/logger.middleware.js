import { DateTime } from 'luxon';
import { logger } from './logger.config.js';

export const loggerMiddleware = (request, response, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  const start = process.hrtime();
  const date = new Date();
  response.on('finish', () => {
    const diff = process.hrtime(start);
    const durationNs = diff[0] * 1e9 + diff[1];
    const durationMs = durationNs / 1e6;

    const message = [
      ['datetime', DateTime.fromJSDate(date).startOf('second').toISO({ suppressMilliseconds: true })],
      ['method', request.method],
      ['url', request.originalUrl],
      ['query-params', JSON.stringify(request.query)],
      ['body', JSON.stringify(request.body)],
      ['content-type', request.headers['content-type']],
      ['duration',`${durationMs}ms`],
    ]
      .map(([ key, value ]) => [key, value].join('='))
      .join('\t');
    logger.info(message);
  });
  next();
};
