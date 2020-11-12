import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';
import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ email, name, password }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExits = await userRepository.findOne({
      where: { email },
    });

    if (checkUserExits) {
      throw new AppError('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    const user = userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
