import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { PasswordHelper } from "@/shared/utils/passwordHelper";
import { NotFoundError, ValidationError } from "@/shared/errors";
import { IEmailService } from "@/application/interfaces/IEmailService";

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export class ResetPassword {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute(input: ResetPasswordInput): Promise<void> {
    const user = await this.userRepository.findByResetPasswordToken(
      input.token
    );

    if (!user) {
      throw new NotFoundError("Invalid or expired reset token");
    }

    // Validate new password
    const passwordValidation = PasswordHelper.validateStrength(
      input.newPassword
    );
    if (!passwordValidation.isValid) {
      throw new ValidationError(passwordValidation.errors.join(", "));
    }

    // Hash new password
    const hashedPassword = await PasswordHelper.hash(input.newPassword);

    // Update password
    await this.userRepository.updatePassword(user.id, hashedPassword);

    // Clear reset token
    await this.userRepository.setResetPasswordToken(user.id, "", new Date());

    // Send notification email
    await this.emailService.sendPasswordChangedNotification(
      user.email,
      user.username
    );
  }
}
