import { IEmailService } from "@/application/interfaces/IEmailService";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { NotFoundError, BadRequestError } from "@/shared/errors";

export interface VerifyEmailInput {
  token: string;
}

export class VerifyEmail {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute(input: VerifyEmailInput): Promise<void> {
    const user = await this.userRepository.findByVerificationToken(input.token);

    if (!user) {
      throw new NotFoundError("Invalid or expired verification token");
    }

    if (user.isVerified) {
      throw new BadRequestError("Email already verified");
    }

    await this.userRepository.updateVerificationStatus(user.id, true);

    // Send welcome email
    await this.emailService.sendWelcomeEmail(user.email, user.username);
  }
}
