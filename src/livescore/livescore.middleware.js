import { DateTime } from 'luxon';
import { ResourceFormatException } from '../common/app-exception.js';

export const checklivescoreMiddleware = (request, response, next) => {
  if (!request.body.title || typeof request.body.title !== 'string'
    || !request.body.publication || typeof request.body.publication !== 'string' || !DateTime.fromISO(request.body.publication).isValid) {
    next(new ResourceFormatException());
  } else {
    next();
  }
};

export const checkPartiallivescoreMiddleware = (request, response, next) => {
  if (request.body.title && typeof request.body.title !== 'string'
    || request.body.publication && (typeof request.body.publication !== 'string' || !DateTime.fromISO(request.body.publication).isValid)) {
    next(new ResourceFormatException());
  } else {
    next();
  }
};
