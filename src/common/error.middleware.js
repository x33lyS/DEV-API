import { AppException, UnexpectedException } from './app-exception.js';
import { logger } from './logger.config.js';

// do not remove next parameter even if it is unused
// eslint-disable-next-line no-unused-vars
export const errorMiddleware = (error, request, response, next) => {
  const isException = error instanceof AppException;
  const exception = isException ? error : new UnexpectedException();
  response.status(exception.statusCode).json({
    code: exception.statusCode,
    message: exception.message
  });
  if (!isException) {
    logger.error(error);
  }
};
