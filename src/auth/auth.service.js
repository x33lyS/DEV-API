import { userService } from '../user/user.service.js';
import { generateToken } from '../common/jwt.util.js';

class AuthService {
  login = (credentials) => userService.findByCredentials(credentials.username, credentials.password)
    .then(user => generateToken({
      id: user.id,
      role: user.role
    }));
}

export const authService = new AuthService();
