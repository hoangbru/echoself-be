import { BaseController } from "@/shared/base/base.controller";
import { SongUseCase } from "./song.usecase";

export class SongController extends BaseController {
  constructor(private readonly songUseCase: SongUseCase) {
    super();
  }

  getSongs = this.asyncHandler(async (req, res) => {
    const result = await this.songUseCase.getSongs(req.query);
    this.ok(res, result);
  });
}
