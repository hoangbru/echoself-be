import { Album } from "@/domain/entities/Album";
import { IAlbumRepository } from "@/domain/repositories/IAlbumRepository";

export class GetAlbumsByArtist {
  constructor(private readonly albumRepository: IAlbumRepository) {}

  async execute(artistId: string): Promise<Album[]> {
    return await this.albumRepository.findByArtist(artistId);
  }
}
