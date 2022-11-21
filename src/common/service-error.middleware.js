import { EmptyResultError } from 'sequelize';
import { ResourceNotFoundException } from './app-exception.js';

export const serviceErrorMiddleware = (error, request, response, next) => {
  if (error instanceof EmptyResultError) {
    return next(new ResourceNotFoundException());
  }
  next(error);
};
