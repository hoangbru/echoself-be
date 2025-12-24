import { AlbumRepository } from "./album.repository";
import { AppError } from "@/shared/errors/app-error";

export class AlbumUseCase {
  constructor(private readonly albumRepo: AlbumRepository) {}

  async getAlbums(input: any) {
    return this.albumRepo.findMany(input);
  }

  async getAlbumById(id: string) {
    const album = await this.albumRepo.findById(id);

    if (!album) {
      throw new AppError(404, "Album not found");
    }

    return album;
  }
}
