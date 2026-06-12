import type { RegisterInput, User } from '../types/user.js';
import { UserModel } from '../models/User.js';
import { mapUser } from './mappers.js';

class UserRepository {
  async findById(id: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ id });
    return user ? mapUser(user.toObject()) : undefined;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    return user ? mapUser(user.toObject()) : undefined;
  }

  async create(input: RegisterInput & { passwordHash: string }): Promise<User> {
    const user = await UserModel.create({
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      role: input.role,
      passwordHash: input.passwordHash,
    });
    return mapUser(user.toObject());
  }
}

export const userRepository = new UserRepository();
