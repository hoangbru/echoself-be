import { Request, Response, NextFunction } from "express";

import {
  RegisterUser,
  LoginUser,
  RefreshToken,
  VerifyEmail,
  ForgotPassword,
  ResetPassword,
  ChangePassword,
  LogoutUser,
} from "@/application/use-cases/auth";

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser,
    private readonly refreshToken: RefreshToken,
    private readonly logoutUser: LogoutUser,
    private readonly verifyUserEmail: VerifyEmail,
    private readonly forgotUserPassword: ForgotPassword,
    private readonly resetUserPassword: ResetPassword,
    private readonly changeUserPassword: ChangePassword
  ) {}

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.registerUser.execute({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        displayName: req.body.displayName,
      });

      res.status(201).json({
        success: true,
        message:
          "Registration successful! Please check your email to verify your account.",
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.loginUser.execute({
        identifier: req.body.identifier,
        password: req.body.password,
      });

      res.json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this.refreshToken.execute({
        refreshToken: req.body.refreshToken,
      });

      res.json({
        success: true,
        message: "Token refreshed successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.headers.authorization?.substring(7) || "";

      await this.logoutUser.execute({ token });

      res.json({
        success: true,
        message: "Logout successful",
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this.verifyUserEmail.execute({
        token: req.body.token,
      });

      res.json({
        success: true,
        message: "Email verified successfully! You can now log in.",
      });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this.forgotUserPassword.execute({
        email: req.body.email,
      });

      res.json({
        success: true,
        message: "If the email exists, a password reset link has been sent.",
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      await this.resetUserPassword.execute({
        token: req.body.token,
        newPassword: req.body.newPassword,
      });

      res.json({
        success: true,
        message:
          "Password reset successfully! You can now log in with your new password.",
      });
    } catch (error) {
      next(error);
    }
  }

  async changePassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;

      await this.changeUserPassword.execute({
        userId,
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
      });

      res.json({
        success: true,
        message: "Password changed successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
