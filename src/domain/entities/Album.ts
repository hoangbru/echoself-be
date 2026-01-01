export class Album {
  constructor(
    public readonly id: string,
    public readonly artistId: string,
    public readonly title: string,
    public readonly coverImage: string,
    public readonly albumType: string,
    public readonly releaseDate: Date,
    public readonly description?: string,
    public readonly totalTracks: number = 0,
    public readonly duration: number = 0,
    public readonly playCount: number = 0,
    public readonly createdAt: Date = new Date()
  ) {}

  static create(props: any): Album {
    return new Album(
      props.id,
      props.artistId,
      props.title,
      props.coverImage,
      props.albumType,
      props.releaseDate,
      props.description
    );
  }
}
