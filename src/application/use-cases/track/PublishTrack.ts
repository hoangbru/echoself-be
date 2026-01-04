import { Track } from "@/domain/entities/Track";
import { ITrackRepository } from "@/domain/repositories/ITrackRepository";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/shared/errors";

export class PublishTrack {
  constructor(private readonly trackRepository: ITrackRepository) {}

  async execute(trackId: string, artistId: string): Promise<Track> {
    const track = await this.trackRepository.findById(trackId);

    if (!track) {
      throw new NotFoundError("Track not found");
    }

    if (track.artistId !== artistId) {
      throw new ForbiddenError("You can only publish your own tracks");
    }

    if (track.isPublished) {
      throw new ValidationError("Track is already published");
    }

    const publishedTrack = track.publish();
    return await this.trackRepository.update(publishedTrack);
  }
}
