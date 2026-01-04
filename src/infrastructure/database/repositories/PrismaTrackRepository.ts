import { Track } from "@/domain/entities";
import { ITrackRepository } from "@/domain/repositories";
import {
  PrismaClient,
  AudioQuality as PrismaAudioQuality,
} from "@prisma/client";

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
        publishedAt: track.publishedAt,
        playCount: track.playCount,
        likeCount: track.likeCount,
        shareCount: track.shareCount,
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

  async findByArtist(
    artistId: string,
    includeUnpublished: boolean = false
  ): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany({
      where: {
        artistId,
        ...(includeUnpublished ? {} : { isPublished: true }),
      },
      orderBy: [{ isPublished: "desc" }, { createdAt: "desc" }],
    });

    return tracks.map(this.toDomain);
  }

  async update(track: Track): Promise<Track> {
    const updated = await this.prisma.track.update({
      where: { id: track.id },
      data: {
        title: track.title,
        lyrics: track.lyrics,
        explicit: track.explicit,
        albumId: track.albumId,
        trackNumber: track.trackNumber,
        isPublished: track.isPublished,
        publishedAt: track.publishedAt,
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
          mode: "insensitive",
        },
      },
    });

    return count > 0;
  }

  async attachGenres(trackId: string, genreIds: string[]): Promise<void> {
    // Delete existing genres
    await this.prisma.trackGenre.deleteMany({
      where: { trackId },
    });

    // Attach new genres
    await this.prisma.trackGenre.createMany({
      data: genreIds.map((genreId) => ({
        trackId,
        genreId,
      })),
    });
  }

  async getTrackWithDetails(trackId: string): Promise<any> {
    return await this.prisma.track.findUnique({
      where: { id: trackId },
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            avatar: true,
            verified: true,
          },
        },
        album: {
          select: {
            id: true,
            title: true,
            coverImage: true,
          },
        },
        genres: {
          include: {
            genre: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        },
      },
    });
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
      track.publishedAt,
      track.playCount,
      track.likeCount,
      track.shareCount,
      track.createdAt,
      track.updatedAt
    );
  }
}
