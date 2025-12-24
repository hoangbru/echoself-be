import { BaseController } from "@/shared/base/base.controller";
import { AuthUseCase } from "./auth.usecase";

export class AuthController extends BaseController {
  constructor(private authUseCase: AuthUseCase) {
    super();
  }

  register = this.asyncHandler(async (req, res) => {
    const result = await this.authUseCase.register(req.body);
    this.ok(res, result);
  });

  login = this.asyncHandler(async (req, res) => {
    const result = await this.authUseCase.login(req.body);
    this.ok(res, result);
  });

  refresh = this.asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    const result = await this.authUseCase.refresh(refreshToken);
    res.json(result);
  });

  logout = this.asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;
    await this.authUseCase.logout(refreshToken);
    this.noContent(res);
  });

  logoutAll = this.asyncHandler(async (req, res) => {
    const { userId } = req.user as { userId: string };
    await this.authUseCase.logoutAll(userId);
    this.noContent(res);
  });
}
