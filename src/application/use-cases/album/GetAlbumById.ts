import { Album } from "@/domain/entities/Album";
import { IAlbumRepository } from "@/domain/repositories/IAlbumRepository";

export class GetAlbumById {
  constructor(private readonly albumRepository: IAlbumRepository) {}

  async execute(albumId: string): Promise<Album | null> {
    return await this.albumRepository.findById(albumId);
  }
}
