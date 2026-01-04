export class Genre {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly description: string | null = null,
    public readonly imageUrl: string | null = null,
    public readonly createdAt: Date = new Date()
  ) {}

  static create(props: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
  }): Genre {
    return new Genre(
      props.id,
      props.name,
      props.slug,
      props.description || null,
      props.imageUrl || null,
      new Date()
    );
  }
}
