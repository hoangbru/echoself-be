export class User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly username: string,
    public readonly password: string,
    public readonly displayName: string,
    public readonly avatar?: string,
    public readonly bio?: string,
    public readonly role: string = "USER",
    public readonly isVerified: boolean = false,
    public readonly createdAt: Date = new Date(),
    public readonly updatedAt: Date = new Date()
  ) {}

  static create(props: any): User {
    return new User(
      props.id,
      props.email,
      props.username,
      props.password,
      props.displayName,
      props.avatar,
      props.bio,
      props.role,
      props.isVerified
    );
  }

  updateProfile(props: any): User {
    return new User(
      this.id,
      this.email,
      this.username,
      this.password,
      props.displayName || this.displayName,
      props.avatar || this.avatar,
      props.bio || this.bio,
      this.role,
      this.isVerified,
      this.createdAt,
      new Date()
    );
  }
}
