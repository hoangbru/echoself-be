export interface CreateTrackDTO {
  artistId: string;
  title: string;
  duration: number;
  albumId?: string;
  trackNumber?: number;
  lyrics?: string;
  isrc?: string;
  explicit?: boolean;
  genreIds?: string[];
}

export interface TrackResponseDTO {
  id: string;
  artistId: string;
  title: string;
  duration: number;
  audioUrl: string;
  audioQuality: string;
  fileSize: number;
  albumId?: string;
  trackNumber?: number;
  explicit: boolean;
  isPublished: boolean;
  playCount: number;
  likeCount: number;
  createdAt: Date;
  artist?: {
    id: string;
    stageName: string;
    avatar?: string;
  };
  album?: {
    id: string;
    title: string;
    coverImage: string;
  };
}
