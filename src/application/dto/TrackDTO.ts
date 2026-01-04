import { AudioQuality } from "@prisma/client";

export interface CreateTrackDTO {
  artistId: string;
  title: string;
  albumId?: string;
  trackNumber?: number;
  lyrics?: string;
  isrc?: string;
  explicit?: boolean;
  genreIds?: string[];
  autoPublish?: boolean;
}

export interface UpdateTrackDTO {
  title?: string;
  lyrics?: string;
  explicit?: boolean;
  albumId?: string | null;
  trackNumber?: number | null;
  genreIds?: string[];
}

export interface TrackResponseDTO {
  id: string;
  title: string;
  duration: number;
  audioUrl: string;
  audioQuality: AudioQuality;
  fileSize: number;
  mimeType: string;
  albumId?: string | null;
  trackNumber?: number | null;
  lyrics?: string | null;
  isrc?: string | null;
  explicit: boolean;
  isPublished: boolean;
  publishedAt?: Date | null;
  playCount: number;
  likeCount: number;
  shareCount: number;
  createdAt: Date;
  updatedAt: Date;
  artist: {
    id: string;
    stageName: string;
    avatar?: string;
    verified: boolean;
  };
  album?: {
    id: string;
    title: string;
    coverImage: string;
  };
  genres?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}
