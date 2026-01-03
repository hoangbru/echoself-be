import { PrismaClient } from "@prisma/client";
import { Playlist } from "@/domain/entities/Playlist";
import { IPlaylistRepository } from "@/domain/repositories/IPlaylistRepository";

export class PrismaPlaylistRepository implements IPlaylistRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(playlist: Playlist): Promise<Playlist> {
    const created = await this.prisma.playlist.create({
      data: {
        id: playlist.id,
        userId: playlist.userId,
        title: playlist.title,
        description: playlist.description,
        coverImage: playlist.coverImage,
        visibility: playlist.visibility as any,
        totalTracks: playlist.totalTracks,
        followerCount: playlist.followerCount,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Playlist | null> {
    const playlist = await this.prisma.playlist.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
        tracks: {
          include: {
            track: {
              include: {
                artist: {
                  select: {
                    id: true,
                    stageName: true,
                  },
                },
              },
            },
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return playlist ? this.toDomain(playlist) : null;
  }

  async findByUser(userId: string): Promise<Playlist[]> {
    const playlists = await this.prisma.playlist.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return playlists.map(this.toDomain);
  }

  async findPublicPlaylists(limit: number = 20): Promise<Playlist[]> {
    const playlists = await this.prisma.playlist.findMany({
      where: {
        visibility: "PUBLIC",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        followerCount: "desc",
      },
      take: limit,
    });

    return playlists.map(this.toDomain);
  }

  async update(playlist: Playlist): Promise<Playlist> {
    const updated = await this.prisma.playlist.update({
      where: { id: playlist.id },
      data: {
        title: playlist.title,
        description: playlist.description,
        coverImage: playlist.coverImage,
        visibility: playlist.visibility as any,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            displayName: true,
            avatar: true,
          },
        },
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.playlist.delete({
      where: { id },
    });
  }

  async addTrack(playlistId: string, trackId: string): Promise<void> {
    // Get current max position
    const maxPosition = await this.prisma.playlistTrack.findFirst({
      where: { playlistId },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const newPosition = (maxPosition?.position || 0) + 1;

    await this.prisma.playlistTrack.create({
      data: {
        playlistId,
        trackId,
        position: newPosition,
      },
    });

    // Update total tracks count
    await this.prisma.playlist.update({
      where: { id: playlistId },
      data: {
        totalTracks: {
          increment: 1,
        },
      },
    });
  }

  async removeTrack(playlistId: string, trackId: string): Promise<void> {
    await this.prisma.playlistTrack.deleteMany({
      where: {
        playlistId,
        trackId,
      },
    });

    // Update total tracks count
    await this.prisma.playlist.update({
      where: { id: playlistId },
      data: {
        totalTracks: {
          decrement: 1,
        },
      },
    });
  }

  private toDomain(playlist: any): Playlist {
    return new Playlist(
      playlist.id,
      playlist.userId,
      playlist.title,
      playlist.visibility,
      playlist.description,
      playlist.coverImage,
      playlist.totalTracks,
      playlist.followerCount,
      playlist.createdAt
    );
  }
}
