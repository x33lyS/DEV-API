import { authService } from './auth.service.js';
import { AuthenticationFailException } from '../common/app-exception.js';
import { EmptyResultError } from 'sequelize';

class AuthController {
  login = (request, response, next) => authService.login(request.body)
    .then(token => response.status(201).json(({ token })))
    .catch(error => {
      if (error instanceof EmptyResultError) {
        next(new AuthenticationFailException());
        return;
      }
      next(error);
    });
}

export const authController = new AuthController();
