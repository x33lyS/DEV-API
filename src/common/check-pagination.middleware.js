import { PaginationParamException } from './app-exception.js';

export const checkPaginationMiddleware = (request, response, next) => {
  if (!request.query.pageIndex && !request.query.pageSize) {
    next();
    return;
  }
  const pageIndex = parseInt(request.query.pageIndex);
  const pageSize = parseInt(request.query.pageSize);
  if (isNaN(pageIndex) || isNaN(pageSize) || pageIndex < 0 || pageSize <= 0) {
    next(new PaginationParamException());
    return;
  }
  next();
};
