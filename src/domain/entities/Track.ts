import { AudioQuality } from "@prisma/client";

export class Track {
  constructor(
    public readonly id: string,
    public readonly artistId: string,
    public readonly title: string,
    public readonly duration: number,
    public readonly audioUrl: string,
    public readonly audioQuality: AudioQuality,
    public readonly fileSize: number,
    public readonly mimeType: string,
    public readonly albumId: string | null = null,
    public readonly trackNumber: number | null = null,
    public readonly lyrics: string | null = null,
    public readonly isrc: string | null = null,
    public readonly explicit: boolean = false,
    public readonly isPublished: boolean = false,
    public readonly publishedAt: Date | null = null,
    public readonly playCount: number = 0,
    public readonly likeCount: number = 0,
    public readonly shareCount: number = 0,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  static create(props: {
    id: string;
    artistId: string;
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
    explicit?: boolean;
  }): Track {
    return new Track(
      props.id,
      props.artistId,
      props.title,
      props.duration,
      props.audioUrl,
      props.audioQuality,
      props.fileSize,
      props.mimeType,
      props.albumId || null,
      props.trackNumber || null,
      props.lyrics || null,
      props.isrc || null,
      props.explicit || false,
      false, // isPublished
      null, // publishedAt
      0, // playCount
      0, // likeCount
      0, // shareCount
      new Date(),
      new Date()
    );
  }

  publish(): Track {
    return new Track(
      this.id,
      this.artistId,
      this.title,
      this.duration,
      this.audioUrl,
      this.audioQuality,
      this.fileSize,
      this.mimeType,
      this.albumId,
      this.trackNumber,
      this.lyrics,
      this.isrc,
      this.explicit,
      true, // isPublished
      new Date(), // publishedAt
      this.playCount,
      this.likeCount,
      this.shareCount,
      this.createdAt,
      new Date() // updatedAt
    );
  }

  unpublish(): Track {
    return new Track(
      this.id,
      this.artistId,
      this.title,
      this.duration,
      this.audioUrl,
      this.audioQuality,
      this.fileSize,
      this.mimeType,
      this.albumId,
      this.trackNumber,
      this.lyrics,
      this.isrc,
      this.explicit,
      false, // isPublished
      null, // publishedAt
      this.playCount,
      this.likeCount,
      this.shareCount,
      this.createdAt,
      new Date()
    );
  }

  updateMetadata(props: {
    title?: string;
    lyrics?: string;
    explicit?: boolean;
    albumId?: string | null;
    trackNumber?: number | null;
  }): Track {
    return new Track(
      this.id,
      this.artistId,
      props.title || this.title,
      this.duration,
      this.audioUrl,
      this.audioQuality,
      this.fileSize,
      this.mimeType,
      props.albumId !== undefined ? props.albumId : this.albumId,
      props.trackNumber !== undefined ? props.trackNumber : this.trackNumber,
      props.lyrics !== undefined ? props.lyrics : this.lyrics,
      this.isrc,
      props.explicit !== undefined ? props.explicit : this.explicit,
      this.isPublished,
      this.publishedAt,
      this.playCount,
      this.likeCount,
      this.shareCount,
      this.createdAt,
      new Date()
    );
  }
}
