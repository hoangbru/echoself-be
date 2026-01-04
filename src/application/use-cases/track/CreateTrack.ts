import { v4 as uuidv4 } from "uuid";

import { AudioQuality } from "@prisma/client";
import { Track } from "@/domain/entities";
import {
  ITrackRepository,
  IArtistRepository,
  IGenreRepository,
} from "@/domain/repositories";
import {
  ValidationError,
  ConflictError,
  ForbiddenError,
} from "@/shared/errors";
import { logger } from "@/shared/utils/logger";
import {
  IAudioProcessingService,
  IStorageService,
} from "@/application/interfaces";
import { CreateTrackDTO, TrackResponseDTO } from "@/application/dto/TrackDTO";

interface CreateTrackInput {
  file: Buffer;
  filename: string;
  mimeType: string;
  data: CreateTrackDTO;
}

export class CreateTrack {
  constructor(
    private readonly trackRepository: ITrackRepository,
    private readonly artistRepository: IArtistRepository,
    private readonly genreRepository: IGenreRepository,
    private readonly storageService: IStorageService,
    private readonly audioProcessingService: IAudioProcessingService
  ) {}

  async execute(input: CreateTrackInput): Promise<TrackResponseDTO> {
    logger.info(`Starting track creation for artist: ${input.data.artistId}`);

    await this.validateArtist(input.data.artistId);

    this.validateInput(input);

    await this.checkDuplicateTitle(input.data.artistId, input.data.title);

    if (input.data.albumId) {
      await this.validateAlbum(input.data.albumId, input.data.artistId);
    }

    if (input.data.genreIds && input.data.genreIds.length > 0) {
      await this.validateGenres(input.data.genreIds);
    }

    // Process audio file - extract metadata
    logger.info("Processing audio file...");
    const metadata = await this.audioProcessingService.getMetadata(input.file);
    logger.info(
      `Audio metadata: duration=${metadata.duration}s, bitrate=${metadata.bitrate}kbps`
    );

    // Determine audio quality
    const audioQuality = this.determineAudioQuality(metadata.bitrate);
    logger.info(`Audio quality determined: ${audioQuality}`);

    // Transcode if necessary (optimize for streaming)
    let processedFile = input.file;
    if (this.shouldTranscode(audioQuality, input.mimeType)) {
      logger.info("Transcoding audio...");
      processedFile = await this.audioProcessingService.transcode(
        input.file,
        AudioQuality.HIGH
      );
    }

    logger.info("Uploading to Cloudinary...");
    const { url, size } = await this.storageService.uploadAudio(
      processedFile,
      input.filename,
      input.mimeType
    );
    logger.info(`Upload successful: ${url}`);

    const track = Track.create({
      id: uuidv4(),
      artistId: input.data.artistId,
      title: input.data.title.trim(),
      duration: Math.floor(metadata.duration),
      audioUrl: url,
      audioQuality,
      fileSize: size,
      mimeType: input.mimeType,
      albumId: input.data.albumId,
      trackNumber: input.data.trackNumber,
      lyrics: input.data.lyrics?.trim(),
      isrc: input.data.isrc?.trim(),
      explicit: input.data.explicit || false,
    });

    // Save to database
    logger.info("Saving track to database...");
    let savedTrack = await this.trackRepository.save(track);

    // Attach genres if provided
    if (input.data.genreIds && input.data.genreIds.length > 0) {
      logger.info(`Attaching ${input.data.genreIds.length} genres...`);
      await this.trackRepository.attachGenres(
        savedTrack.id,
        input.data.genreIds
      );
    }

    // Auto-publish if requested
    if (input.data.autoPublish) {
      logger.info("Auto-publishing track...");
      savedTrack = savedTrack.publish();
      savedTrack = await this.trackRepository.update(savedTrack);
    }

    // Get full track details with relations
    const trackDetails = await this.trackRepository.getTrackWithDetails(
      savedTrack.id
    );

    logger.info(`Track created successfully: ${savedTrack.id}`);

    return this.toDTO(trackDetails);
  }

  private async validateArtist(artistId: string): Promise<void> {
    const exists = await this.artistRepository.existsById(artistId);
    if (!exists) {
      throw new ForbiddenError("You must be an artist to upload tracks");
    }
  }

  private validateInput(input: CreateTrackInput): void {
    const allowedMimeTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/flac",
      "audio/aac",
      "audio/ogg",
      "audio/m4a",
    ];

    if (!allowedMimeTypes.includes(input.mimeType)) {
      throw new ValidationError(
        `Invalid audio format. Allowed: ${allowedMimeTypes.join(", ")}`
      );
    }

    if (!input.data.title || input.data.title.trim().length === 0) {
      throw new ValidationError("Track title is required");
    }

    if (input.data.title.length > 200) {
      throw new ValidationError("Track title too long (max 200 characters)");
    }

    // Max file size: 500MB
    const maxSize = 500 * 1024 * 1024;
    if (input.file.length > maxSize) {
      throw new ValidationError(`File size too large (max 500MB)`);
    }

    // Validate ISRC format if provided
    if (input.data.isrc) {
      const isrcRegex = /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/;
      if (!isrcRegex.test(input.data.isrc)) {
        throw new ValidationError("Invalid ISRC format (e.g., USRC17607839)");
      }
    }

    // Validate track number if provided
    if (input.data.trackNumber !== undefined) {
      if (input.data.trackNumber < 1 || input.data.trackNumber > 999) {
        throw new ValidationError("Track number must be between 1 and 999");
      }
    }

    // Validate genres limit
    if (input.data.genreIds && input.data.genreIds.length > 5) {
      throw new ValidationError("Maximum 5 genres allowed per track");
    }
  }

  private async checkDuplicateTitle(
    artistId: string,
    title: string
  ): Promise<void> {
    const exists = await this.trackRepository.existsByTitle(artistId, title);
    if (exists) {
      throw new ConflictError("You already have a track with this title");
    }
  }

  private async validateAlbum(
    albumId: string,
    artistId: string
  ): Promise<void> {
    // This would check if album exists and belongs to the artist
    // Placeholder implementation
    logger.info(`Validating album ${albumId} for artist ${artistId}`);
  }

  private async validateGenres(genreIds: string[]): Promise<void> {
    const genres = await this.genreRepository.findByIds(genreIds);

    if (genres.length !== genreIds.length) {
      const foundIds = genres.map((g) => g.id);
      const missingIds = genreIds.filter((id) => !foundIds.includes(id));
      throw new ValidationError(`Invalid genre IDs: ${missingIds.join(", ")}`);
    }
  }

  private determineAudioQuality(bitrate: number): AudioQuality {
    if (bitrate >= 1411) return AudioQuality.LOSSLESS;
    if (bitrate >= 256) return AudioQuality.HIGH;
    if (bitrate >= 128) return AudioQuality.MEDIUM;
    return AudioQuality.LOW;
  }

  private shouldTranscode(quality: AudioQuality, mimeType: string): boolean {
    // Transcode if:
    // 1. Quality is too low (< MEDIUM)
    // 2. Format is not MP3 (for better streaming compatibility)
    return quality === AudioQuality.LOW || mimeType !== "audio/mpeg";
  }

  private toDTO(track: any): TrackResponseDTO {
    return {
      id: track.id,
      title: track.title,
      duration: track.duration,
      audioUrl: track.audioUrl,
      audioQuality: track.audioQuality,
      fileSize: track.fileSize,
      mimeType: track.mimeType,
      albumId: track.albumId,
      trackNumber: track.trackNumber,
      lyrics: track.lyrics,
      isrc: track.isrc,
      explicit: track.explicit,
      isPublished: track.isPublished,
      publishedAt: track.publishedAt,
      playCount: track.playCount,
      likeCount: track.likeCount,
      shareCount: track.shareCount,
      createdAt: track.createdAt,
      updatedAt: track.updatedAt,
      artist: {
        id: track.artist.id,
        stageName: track.artist.stageName,
        avatar: track.artist.avatar,
        verified: track.artist.verified,
      },
      album: track.album
        ? {
            id: track.album.id,
            title: track.album.title,
            coverImage: track.album.coverImage,
          }
        : undefined,
      genres: track.genres?.map((tg: any) => ({
        id: tg.genre.id,
        name: tg.genre.name,
        slug: tg.genre.slug,
      })),
    };
  }
}
