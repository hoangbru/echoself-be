import { v4 as uuidv4 } from 'uuid';
import { Track } from '@/domain/entities/Track';
import { ITrackRepository } from '@/domain/repositories/ITrackRepository';
import { ValidationError, ConflictError } from '@/shared/errors/';
import { AudioQuality } from '@prisma/client';
import { IAudioProcessingService } from '@/application/interfaces/IAudioProcessingService';
import {
  CreateTrackDTO,
  TrackResponseDTO,
} from '@/application/dto/TrackDTO';
import { IStorageService } from '@/application/interfaces/IStorageService';

interface UploadTrackInput {
  file: Buffer;
  filename: string;
  mimeType: string;
  data: CreateTrackDTO;
}

export class UploadTrack {
  constructor(
    private readonly trackRepository: ITrackRepository,
    private readonly storageService: IStorageService,
    private readonly audioProcessingService: IAudioProcessingService,
  ) {}

  async execute(input: UploadTrackInput): Promise<TrackResponseDTO> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Check if track already exists
    const exists = await this.trackRepository.existsByTitle(
      input.data.artistId,
      input.data.title,
    );

    if (exists) {
      throw new ConflictError(
        'Track with this title already exists for this artist',
      );
    }

    // 3. Process audio file - get metadata
    const metadata = await this.audioProcessingService.getMetadata(input.file);

    // 4. Determine audio quality based on bitrate
    const audioQuality = this.determineAudioQuality(metadata.bitrate);

    // 5. Transcode if necessary
    let processedFile = input.file;
    if (audioQuality !== AudioQuality.HIGH) {
      processedFile = await this.audioProcessingService.transcode(
        input.file,
        audioQuality,
      );
    }

    // 6. Upload to storage
    const { url, size } = await this.storageService.uploadAudio(
      processedFile,
      input.filename,
      input.mimeType,
    );

    // 7. Create track entity
    const track = Track.create({
      id: uuidv4(),
      artistId: input.data.artistId,
      title: input.data.title,
      duration: Math.floor(metadata.duration),
      audioUrl: url,
      audioQuality,
      fileSize: size,
      mimeType: input.mimeType,
      albumId: input.data.albumId,
      trackNumber: input.data.trackNumber,
      lyrics: input.data.lyrics,
      isrc: input.data.isrc,
      explicit: input.data.explicit,
    });

    // 8. Save to database
    const savedTrack = await this.trackRepository.save(track);

    // 9. Return DTO
    return this.toDTO(savedTrack);
  }

  private validateInput(input: UploadTrackInput): void {
    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/mp3',
      'audio/wav',
      'audio/flac',
    ];

    if (!allowedMimeTypes.includes(input.mimeType)) {
      throw new ValidationError('Invalid audio file type');
    }

    if (!input.data.title || input.data.title.trim().length === 0) {
      throw new ValidationError('Track title is required');
    }

    if (input.data.title.length > 200) {
      throw new ValidationError('Track title too long (max 200 characters)');
    }

    // Max file size: 500MB
    if (input.file.length > 500 * 1024 * 1024) {
      throw new ValidationError('File size too large (max 500MB)');
    }
  }

  private determineAudioQuality(bitrate: number): AudioQuality {
    if (bitrate >= 1411) return AudioQuality.LOSSLESS; // FLAC quality
    if (bitrate >= 256) return AudioQuality.HIGH;
    if (bitrate >= 128) return AudioQuality.MEDIUM;
    return AudioQuality.LOW;
  }

  private toDTO(track: Track): TrackResponseDTO {
    return {
      id: track.id,
      artistId: track.artistId,
      title: track.title,
      duration: track.duration,
      audioUrl: track.audioUrl,
      audioQuality: track.audioQuality,
      fileSize: track.fileSize,
      albumId: track.albumId,
      trackNumber: track.trackNumber,
      explicit: track.explicit,
      isPublished: track.isPublished,
      playCount: track.playCount,
      likeCount: track.likeCount,
      createdAt: track.createdAt,
    };
  }
}
