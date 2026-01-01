import { IUserRepository } from '@/domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { ConflictError, ValidationError } from '../../../shared/errors';
import { PasswordHelper } from '../../../shared/utils/passwordHelper';
import { v4 as uuidv4 } from 'uuid';

export interface RegisterUserInput {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export class RegisterUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: RegisterUserInput): Promise<User> {
    // Validate password strength
    const passwordValidation = PasswordHelper.validateStrength(input.password);
    if (!passwordValidation.isValid) {
      throw new ValidationError(passwordValidation.errors.join(', '));
    }

    // Check if email exists
    const existingEmail = await this.userRepository.findByEmail(input.email);
    if (existingEmail) {
      throw new ConflictError('Email already registered');
    }

    // Check if username exists
    const existingUsername = await this.userRepository.findByUsername(input.username);
    if (existingUsername) {
      throw new ConflictError('Username already taken');
    }

    // Hash password
    const hashedPassword = await PasswordHelper.hash(input.password);

    // Create user
    const user = User.create({
      id: uuidv4(),
      email: input.email,
      username: input.username,
      password: hashedPassword,
      displayName: input.displayName || input.username,
    });

    return await this.userRepository.save(user);
  }
}