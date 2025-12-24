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
}
