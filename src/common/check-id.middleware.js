import { ResourceIdFormatException } from './app-exception.js';

export const checkIdMiddleware = (request, response, next) => {
  const id = parseInt(request.params.id);
  if (isNaN(id) || id <= 0) {
    next(new ResourceIdFormatException());
  } else {
    next();
  }
};
