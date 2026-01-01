import { Playlist } from "@/domain/entities/Playlist";
import { IPlaylistRepository } from "@/domain/repositories/IPlaylistRepository";

export class GetPlaylistById {
  constructor(private readonly playlistRepository: IPlaylistRepository) {}

  async execute(playlistId: string): Promise<Playlist | null> {
    return await this.playlistRepository.findById(playlistId);
  }
}
