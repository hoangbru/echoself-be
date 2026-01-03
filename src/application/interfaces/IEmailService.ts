export interface IEmailService {
  sendVerificationEmail(
    email: string,
    token: string,
    username: string
  ): Promise<void>;
  sendPasswordResetEmail(
    email: string,
    token: string,
    username: string
  ): Promise<void>;
  sendPasswordChangedNotification(
    email: string,
    username: string
  ): Promise<void>;
  sendWelcomeEmail(email: string, username: string): Promise<void>;
}
