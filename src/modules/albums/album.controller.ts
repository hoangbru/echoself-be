import { BaseController } from "@/shared/base/base.controller";
import { AlbumUseCase } from "./album.usecase";

export class AlbumController extends BaseController {
  constructor(private readonly albumUseCase: AlbumUseCase) {
    super();
  }

  getAlbums = this.asyncHandler(async (req, res) => {
    const result = await this.albumUseCase.getAlbums(req.query);
    this.ok(res, result);
  });

  getAlbumById = this.asyncHandler(async (req, res) => {
    const album = await this.albumUseCase.getAlbumById(req.params.id);
    this.ok(res, album);
  });
}
