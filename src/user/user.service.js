import { userRepository } from './user.repository.js';
import { mapToDto } from './user.mapper.js';

class UserService {
  findByCredentials = (login, pwd) => userRepository
    .findByCredentials(login, pwd)
    .then(model => mapToDto(model));
}

export const userService = new UserService();
