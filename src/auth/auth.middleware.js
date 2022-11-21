import {
  BadAuthenticationTokenException,
  MissingAuthenticationTokenException,
  MissingCredentialsException, RoleNotAllowedException
} from '../common/app-exception.js';
import { checkToken } from '../common/jwt.util.js';

export const checkLoginCredentialsMiddleware = (request, response, next) => {
  if (!request.body?.username || !request.body?.password) {
    next(new MissingCredentialsException());
    return;
  }
  next();
};

const getToken = request => request.headers.authorization?.split('Bearer ')[1];

export const checkAuthorizationToken = (request, response, next) => {
  const token = getToken(request);
  if (!token) {
    next(new MissingAuthenticationTokenException());
    return;
  }
  checkToken(token)
    .then(() => next())
    .catch(error => {
      if (error) {
        next(new BadAuthenticationTokenException());
        return;
      }
      next(error);
    });
};

export const checkRoleToken = role => (request, response, next) => {
  const token = getToken(request);
  checkToken(token)
    .then(user => {
      if (user.role !== role) {
        next(new RoleNotAllowedException());
        return;
      }
      next();
    });
};

