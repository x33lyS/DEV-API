import { userRepository } from './user.repository.js';
import { mapToDto } from './user.mapper.js';

class UserService {
  findByCredentials = (email, password) => userRepository
    .findByCredentials(email, password)
    .then(model => mapToDto(model));
}

export const userService = new UserService();
