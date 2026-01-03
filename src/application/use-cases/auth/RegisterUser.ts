import { v4 as uuidv4 } from "uuid";

import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { User } from "@/domain/entities/User";
import { ConflictError, ValidationError } from "@/shared/errors";
import { PasswordHelper } from "@/shared/utils/passwordHelper";
import { TokenHelper } from "@/shared/utils/tokenHelper";
import { IEmailService } from "@/application/interfaces/IEmailService";

export interface RegisterUserInput {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const passwordValidation = PasswordHelper.validateStrength(input.password);
    if (!passwordValidation.isValid) {
      throw new ValidationError(passwordValidation.errors.join(", "));
    }

    const existingEmail = await this.userRepository.findByEmail(input.email);
    if (existingEmail) {
      throw new ConflictError("Email already registered");
    }

    const existingUsername = await this.userRepository.findByUsername(
      input.username
    );
    if (existingUsername) {
      throw new ConflictError("Username already taken");
    }

    const hashedPassword = await PasswordHelper.hash(input.password);

    const user = User.create({
      id: uuidv4(),
      email: input.email,
      username: input.username,
      password: hashedPassword,
      displayName: input.displayName || input.username,
    });

    const savedUser = await this.userRepository.save(user);

    // Generate verification token
    const verificationToken = TokenHelper.generateVerificationToken();
    await this.userRepository.setVerificationToken(
      savedUser.id,
      verificationToken
    );

    // Send verification email
    await this.emailService.sendVerificationEmail(
      savedUser.email,
      verificationToken,
      savedUser.username
    );

    return savedUser;
  }
}
