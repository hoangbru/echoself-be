export class Playlist {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly title: string,
    public readonly visibility: string,
    public readonly description?: string,
    public readonly coverImage?: string,
    public readonly totalTracks: number = 0,
    public readonly followerCount: number = 0,
    public readonly createdAt: Date = new Date()
  ) {}

  static create(props: any): Playlist {
    return new Playlist(
      props.id,
      props.userId,
      props.title,
      props.visibility,
      props.description,
      props.coverImage
    );
  }
}
