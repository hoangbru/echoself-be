import {
  PrismaClient,
  AudioQuality as PrismaAudioQuality,
} from '@prisma/client';
import { Track } from '@/domain/entities/Track';
import { ITrackRepository } from '@/domain/repositories/ITrackRepository';

export class PrismaTrackRepository implements ITrackRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(track: Track): Promise<Track> {
    const created = await this.prisma.track.create({
      data: {
        id: track.id,
        artistId: track.artistId,
        title: track.title,
        duration: track.duration,
        audioUrl: track.audioUrl,
        audioQuality: track.audioQuality as PrismaAudioQuality,
        fileSize: track.fileSize,
        mimeType: track.mimeType,
        albumId: track.albumId,
        trackNumber: track.trackNumber,
        lyrics: track.lyrics,
        isrc: track.isrc,
        explicit: track.explicit,
        isPublished: track.isPublished,
        playCount: track.playCount,
        likeCount: track.likeCount,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Track | null> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    return track ? this.toDomain(track) : null;
  }

  async findByArtist(artistId: string): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany({
      where: { artistId },
      orderBy: { createdAt: 'desc' },
    });

    return tracks.map(this.toDomain);
  }

  async update(track: Track): Promise<Track> {
    const updated = await this.prisma.track.update({
      where: { id: track.id },
      data: {
        title: track.title,
        duration: track.duration,
        albumId: track.albumId,
        trackNumber: track.trackNumber,
        lyrics: track.lyrics,
        explicit: track.explicit,
        isPublished: track.isPublished,
        updatedAt: new Date(),
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.track.delete({
      where: { id },
    });
  }

  async existsByTitle(artistId: string, title: string): Promise<boolean> {
    const count = await this.prisma.track.count({
      where: {
        artistId,
        title: {
          equals: title,
          mode: 'insensitive',
        },
      },
    });

    return count > 0;
  }

  private toDomain(track: any): Track {
    return new Track(
      track.id,
      track.artistId,
      track.title,
      track.duration,
      track.audioUrl,
      track.audioQuality,
      track.fileSize,
      track.mimeType,
      track.albumId,
      track.trackNumber,
      track.lyrics,
      track.isrc,
      track.explicit,
      track.isPublished,
      track.playCount,
      track.likeCount,
      track.createdAt,
      track.updatedAt,
    );
  }
}
