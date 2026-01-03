// import sgMail from '@sendgrid/mail';

// import { IEmailService } from '@/application/interfaces/IEmailService';
// import { logger } from '@/shared/utils/logger';

// export class SendGridEmailService implements IEmailService {
//   constructor() {
//     const apiKey = process.env.SENDGRID_API_KEY;
//     if (!apiKey) {
//       throw new Error('SENDGRID_API_KEY is not configured');
//     }
//     sgMail.setApiKey(apiKey);
//   }

//   async sendVerificationEmail(email: string, token: string, username: string): Promise<void> {
//     const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
//     const msg = {
//       to: email,
//       from: process.env.FROM_EMAIL || 'noreply@echoself.com',
//       subject: 'Verify Your Email - EchoSelf',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2>Welcome to EchoSelf, ${username}!</h2>
//           <p>Thank you for signing up. Please verify your email address to get started.</p>
//           <a href="${verificationUrl}" 
//              style="display: inline-block; background-color: #4CAF50; color: white; 
//                     padding: 12px 24px; text-decoration: none; border-radius: 4px; 
//                     margin: 20px 0;">
//             Verify Email
//           </a>
//           <p>Or copy and paste this link into your browser:</p>
//           <p style="color: #666; font-size: 14px;">${verificationUrl}</p>
//           <p style="color: #999; font-size: 12px; margin-top: 40px;">
//             This link will expire in 24 hours. If you didn't create an account, please ignore this email.
//           </p>
//         </div>
//       `,
//     };

//     try {
//       await sgMail.send(msg);
//       logger.info(`Verification email sent to ${email}`);
//     } catch (error) {
//       logger.error('Failed to send verification email:', error);
//       throw error;
//     }
//   }

//   async sendPasswordResetEmail(email: string, token: string, username: string): Promise<void> {
//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
//     const msg = {
//       to: email,
//       from: process.env.FROM_EMAIL || 'noreply@echoself.com',
//       subject: 'Reset Your Password - EchoSelf',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2>Password Reset Request</h2>
//           <p>Hi ${username},</p>
//           <p>We received a request to reset your password. Click the button below to create a new password:</p>
//           <a href="${resetUrl}" 
//              style="display: inline-block; background-color: #2196F3; color: white; 
//                     padding: 12px 24px; text-decoration: none; border-radius: 4px; 
//                     margin: 20px 0;">
//             Reset Password
//           </a>
//           <p>Or copy and paste this link into your browser:</p>
//           <p style="color: #666; font-size: 14px;">${resetUrl}</p>
//           <p style="color: #999; font-size: 12px; margin-top: 40px;">
//             This link will expire in 24 hours. If you didn't request a password reset, 
//             please ignore this email or contact support if you have concerns.
//           </p>
//         </div>
//       `,
//     };

//     try {
//       await sgMail.send(msg);
//       logger.info(`Password reset email sent to ${email}`);
//     } catch (error) {
//       logger.error('Failed to send password reset email:', error);
//       throw error;
//     }
//   }

//   async sendPasswordChangedNotification(email: string, username: string): Promise<void> {
//     const msg = {
//       to: email,
//       from: process.env.FROM_EMAIL || 'noreply@echoself.com',
//       subject: 'Password Changed - EchoSelf',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h2>Password Changed Successfully</h2>
//           <p>Hi ${username},</p>
//           <p>Your password has been successfully changed.</p>
//           <p>If you didn't make this change, please contact our support team immediately.</p>
//           <p style="color: #999; font-size: 12px; margin-top: 40px;">
//             This is an automated message, please do not reply to this email.
//           </p>
//         </div>
//       `,
//     };

//     try {
//       await sgMail.send(msg);
//       logger.info(`Password changed notification sent to ${email}`);
//     } catch (error) {
//       logger.error('Failed to send password changed notification:', error);
//       throw error;
//     }
//   }

//   async sendWelcomeEmail(email: string, username: string): Promise<void> {
//     const msg = {
//       to: email,
//       from: process.env.FROM_EMAIL || 'noreply@echoself.com',
//       subject: 'Welcome to EchoSelf! 🎵',
//       html: `
//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//           <h1 style="color: #4CAF50;">Welcome to EchoSelf! 🎵</h1>
//           <p>Hi ${username},</p>
//           <p>Thank you for verifying your email! Your account is now fully activated.</p>
//           <h3>Get Started:</h3>
//           <ul>
//             <li>🎧 Discover millions of tracks</li>
//             <li>📝 Create your own playlists</li>
//             <li>❤️ Like your favorite songs</li>
//             <li>👥 Follow your favorite artists</li>
//           </ul>
//           <a href="${process.env.FRONTEND_URL}" 
//              style="display: inline-block; background-color: #4CAF50; color: white; 
//                     padding: 12px 24px; text-decoration: none; border-radius: 4px; 
//                     margin: 20px 0;">
//             Start Listening
//           </a>
//           <p>Happy listening!</p>
//           <p style="color: #999; font-size: 12px; margin-top: 40px;">
//             The EchoSelf Team
//           </p>
//         </div>
//       `,
//     };

//     try {
//       await sgMail.send(msg);
//       logger.info(`Welcome email sent to ${email}`);
//     } catch (error) {
//       logger.error('Failed to send welcome email:', error);
//       // Don't throw error for welcome email - it's not critical
//     }
//   }
// }