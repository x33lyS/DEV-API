import { RouteNotFoundException } from './app-exception.js';

export const routeNotFoundMiddleware = (request, response, next) => {
  next(new RouteNotFoundException());
};
