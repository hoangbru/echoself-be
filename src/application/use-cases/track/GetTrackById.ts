import { TrackResponseDTO } from "@/application/dto/TrackDTO";
import { ITrackRepository } from "@/domain/repositories";

export class GetTrackById {
  constructor(private readonly trackRepository: ITrackRepository) {}

  async execute(trackId: string): Promise<TrackResponseDTO | null> {
    const track = await this.trackRepository.getTrackWithDetails(trackId);

    if (!track) {
      return null;
    }

    // Check if track is published or return null for unpublished tracks
    // (unless user is the owner - would need userId parameter for that)
    if (!track.isPublished) {
      // For now, return null for unpublished tracks
      // You can extend this to allow owners to view their unpublished tracks
      return null;
    }

    return this.toDTO(track);
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
