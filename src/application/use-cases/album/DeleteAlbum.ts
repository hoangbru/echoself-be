import { IAlbumRepository } from "@/domain/repositories/IAlbumRepository";
import { NotFoundError } from "@/shared/errors";

export class DeleteAlbum {
  constructor(private readonly albumRepository: IAlbumRepository) {}

  async execute(albumId: string, userId: string): Promise<void> {
    const album = await this.albumRepository.findById(albumId);

    if (!album) {
      throw new NotFoundError("Album not found");
    }

    // Check ownership (simplified - should check if user owns the artist)
    // if (album.artistId !== userId) {
    //   throw new ForbiddenError('Not authorized to delete this album');
    // }

    await this.albumRepository.delete(albumId);
  }
}
