import { IEmailService } from "@/application/interfaces/IEmailService";
import { IUserRepository } from "@/domain/repositories/IUserRepository";
import { DateHelper } from "@/shared/utils/dateHelper";
import { TokenHelper } from "@/shared/utils/tokenHelper";

export type ForgotPasswordInput = {
  email: string;
};

export class ForgotPassword {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly emailService: IEmailService
  ) {}

  async execute(input: ForgotPasswordInput): Promise<void> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      return;
    }

    const resetToken = TokenHelper.generateResetPasswordToken();
    const expires = DateHelper.addDays(new Date(), 1);

    await this.userRepository.setResetPasswordToken(user.id, resetToken, expires);

    await this.emailService.sendPasswordResetEmail(
      user.email,
      resetToken,
      user.username
    );
  }
}