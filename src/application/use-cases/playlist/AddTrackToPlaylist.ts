import { IPlaylistRepository } from "@/domain/repositories/IPlaylistRepository";
import { ForbiddenError, NotFoundError } from "@/shared/errors";

export class AddTrackToPlaylist {
  constructor(private readonly playlistRepository: IPlaylistRepository) {}

  async execute(
    playlistId: string,
    trackId: string,
    userId: string
  ): Promise<void> {
    const playlist = await this.playlistRepository.findById(playlistId);

    if (!playlist) {
      throw new NotFoundError("Playlist not found");
    }

    if (playlist.userId !== userId) {
      throw new ForbiddenError("Not authorized to modify this playlist");
    }

    await this.playlistRepository.addTrack(playlistId, trackId);
  }
}
