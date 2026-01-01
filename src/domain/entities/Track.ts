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
    public readonly albumId?: string,
    public readonly trackNumber?: number,
    public readonly lyrics?: string,
    public readonly isrc?: string,
    public readonly explicit: boolean = false,
    public readonly isPublished: boolean = false,
    public readonly playCount: number = 0,
    public readonly likeCount: number = 0,
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
    albumId?: string;
    trackNumber?: number;
    lyrics?: string;
    isrc?: string;
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
      props.albumId,
      props.trackNumber,
      props.lyrics,
      props.isrc,
      props.explicit || false,
      false, // isPublished
      0, // playCount
      0, // likeCount
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
      this.playCount,
      this.likeCount,
      this.createdAt,
      new Date()
    );
  }
}
