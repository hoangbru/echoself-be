import { Track } from "@/domain/entities";
import { ITrackRepository } from "@/domain/repositories";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/shared/errors";

export class UnpublishTrack {
  constructor(private readonly trackRepository: ITrackRepository) {}

  async execute(trackId: string, artistId: string): Promise<Track> {
    const track = await this.trackRepository.findById(trackId);

    if (!track) {
      throw new NotFoundError("Track not found");
    }

    if (track.artistId !== artistId) {
      throw new ForbiddenError("You can only unpublish your own tracks");
    }

    if (!track.isPublished) {
      throw new ValidationError("Track is already unpublished");
    }

    const unpublishedTrack = track.unpublish();
    return await this.trackRepository.update(unpublishedTrack);
  }
}
