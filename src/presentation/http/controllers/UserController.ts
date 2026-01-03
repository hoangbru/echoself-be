import { Request, Response, NextFunction } from "express";

import { GetUserById, UpdateUserProfile } from "@/application/use-cases/user";

export class UserController {
  constructor(
    private readonly getUserById: GetUserById,
    private readonly updateUserProfile: UpdateUserProfile
  ) {}

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await this.getUserById.execute(req.params.id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await this.getUserById.execute(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          bio: user.bio,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const user = await this.updateUserProfile.execute({
        userId,
        displayName: req.body.displayName,
        bio: req.body.bio,
        avatar: req.body.avatar,
      });

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: {
          id: user.id,
          displayName: user.displayName,
          bio: user.bio,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
