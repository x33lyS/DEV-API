import { UserModel } from './user.model.js';

class UserRepository {
  findByCredentials = (login, pwd) => UserModel.findOne({ where: { login, pwd }, rejectOnEmpty: true });
}

export const userRepository = new UserRepository();
