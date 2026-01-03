import { IEmailService } from "@/application/interfaces/IEmailService";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/shared/errors";
import { PasswordHelper } from "@/shared/utils/passwordHelper";

export interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export class ChangePassword {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute(input: ChangePasswordInput): Promise<void> {
    const user = await this.userRepository.findById(input.userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    // Verify current password
    const isPasswordValid = await PasswordHelper.compare(
      input.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedError("Current password is incorrect");
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

    // Send notification email
    await this.emailService.sendPasswordChangedNotification(
      user.email,
      user.username
    );
  }
}
