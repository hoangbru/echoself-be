import { PrismaContainer } from "./PrismaContainer";
import { ServiceContainer } from "./ServiceContainer";
import { TrackContainer } from "./TrackContainer";
import { UserContainer } from "./UserContainer";
import { AlbumContainer } from "./AlbumContainer";
import { PlaylistContainer } from "./PlaylistContainer";
import { AuthContainer } from "./AuthContainer";

export class AppContainer {
  private static instance: AppContainer;

  public readonly prismaContainer = new PrismaContainer();
  public readonly serviceContainer = new ServiceContainer();

  public readonly track: TrackContainer;
  public readonly user: UserContainer;
  public readonly album: AlbumContainer;
  public readonly playlist: PlaylistContainer;
  public readonly auth: AuthContainer;

  private constructor() {
    const prisma = this.prismaContainer.prisma;

    this.track = new TrackContainer(prisma, this.serviceContainer);
    this.user = new UserContainer(prisma);
    this.album = new AlbumContainer(prisma);
    this.playlist = new PlaylistContainer(prisma);
    this.auth = new AuthContainer(
      prisma,
      this.serviceContainer.emailService,
      this.serviceContainer.tokenBlacklistService
    );
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AppContainer();
    }
    return this.instance;
  }
}
