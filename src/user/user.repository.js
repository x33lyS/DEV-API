import { UserModel } from './user.model.js';

class UserRepository {
  findByCredentials = (email, password) => UserModel.findOne({ where: { email, password }, rejectOnEmpty: true });
}

export const userRepository = new UserRepository();
