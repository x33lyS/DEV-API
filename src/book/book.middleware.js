import { DateTime } from 'luxon';
import { ResourceFormatException } from '../common/app-exception.js';

export const checkBookMiddleware = (request, response, next) => {
  if (!request.body.title || typeof request.body.title !== 'string'
    || !request.body.publication || typeof request.body.publication !== 'string' || !DateTime.fromISO(request.body.publication).isValid) {
    next(new ResourceFormatException());
  } else {
    next();
  }
};

export const checkPartialBookMiddleware = (request, response, next) => {
  if (request.body.title && typeof request.body.title !== 'string'
    || request.body.publication && (typeof request.body.publication !== 'string' || !DateTime.fromISO(request.body.publication).isValid)) {
    next(new ResourceFormatException());
  } else {
    next();
  }
};
