import { IEmailService } from "@/application/interfaces/IEmailService";
import { logger } from "@/shared/utils/logger";

export class MockEmailService implements IEmailService {
  async sendVerificationEmail(
    email: string,
    token: string,
    username: string
  ): Promise<void> {
    logger.info(`[MOCK] Verification email to ${email}`);
    logger.info(
      `[MOCK] Verification URL: ${process.env.FRONTEND_URL}/verify-email?token=${token}`
    );
  }

  async sendPasswordResetEmail(
    email: string,
    token: string,
    username: string
  ): Promise<void> {
    logger.info(`[MOCK] Password reset email to ${email}`);
    logger.info(
      `[MOCK] Reset URL: ${process.env.FRONTEND_URL}/reset-password?token=${token}`
    );
  }

  async sendPasswordChangedNotification(
    email: string,
    username: string
  ): Promise<void> {
    logger.info(`[MOCK] Password changed notification to ${email}`);
  }

  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    logger.info(`[MOCK] Welcome email to ${email}`);
  }
}
