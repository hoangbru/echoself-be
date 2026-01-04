import { IStorageService } from "@/application/interfaces";
import { ITrackRepository } from "@/domain/repositories";
import { ForbiddenError, NotFoundError } from "@/shared/errors";
import { logger } from "@/shared/utils/logger";


export class DeleteTrack {
  constructor(
    private readonly trackRepository: ITrackRepository,
    private readonly storageService: IStorageService
  ) {}

  async execute(trackId: string, artistId: string): Promise<void> {
    // Find track
    const track = await this.trackRepository.findById(trackId);

    if (!track) {
      throw new NotFoundError('Track not found');
    }

    // Check ownership
    if (track.artistId !== artistId) {
      throw new ForbiddenError('You can only delete your own tracks');
    }

    try {
      // Delete audio file from Cloudinary
      logger.info(`Deleting audio file: ${track.audioUrl}`);
      await this.storageService.deleteAudio(track.audioUrl);
      logger.info('Audio file deleted successfully');
    } catch (error) {
      // Log error but continue with database deletion
      logger.error('Failed to delete audio file from storage:', error);
      // You might want to add this to a cleanup queue
    }

    // Delete track from database (cascade will delete related records)
    await this.trackRepository.delete(trackId);
    logger.info(`Track deleted: ${trackId}`);
  }
}