import { PrismaClient } from "@prisma/client";
import { Album } from "@/domain/entities/Album";
import { IAlbumRepository } from "@/domain/repositories/IAlbumRepository";

export class PrismaAlbumRepository implements IAlbumRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(album: Album): Promise<Album> {
    const created = await this.prisma.album.create({
      data: {
        id: album.id,
        artistId: album.artistId,
        title: album.title,
        description: album.description,
        coverImage: album.coverImage,
        albumType: album.albumType as any,
        releaseDate: album.releaseDate,
        totalTracks: album.totalTracks,
        duration: album.duration,
        playCount: album.playCount,
      },
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            avatar: true,
          },
        },
      },
    });

    return this.toDomain(created);
  }

  async findById(id: string): Promise<Album | null> {
    const album = await this.prisma.album.findUnique({
      where: { id },
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            avatar: true,
          },
        },
        tracks: {
          select: {
            id: true,
            title: true,
            duration: true,
            trackNumber: true,
          },
          orderBy: {
            trackNumber: "asc",
          },
        },
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });

    return album ? this.toDomain(album) : null;
  }

  async findByArtist(artistId: string): Promise<Album[]> {
    const albums = await this.prisma.album.findMany({
      where: { artistId },
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        releaseDate: "desc",
      },
    });

    return albums.map(this.toDomain);
  }

  async update(album: Album): Promise<Album> {
    const updated = await this.prisma.album.update({
      where: { id: album.id },
      data: {
        title: album.title,
        description: album.description,
        coverImage: album.coverImage,
        updatedAt: new Date(),
      },
      include: {
        artist: {
          select: {
            id: true,
            stageName: true,
            avatar: true,
          },
        },
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.album.delete({
      where: { id },
    });
  }

  async incrementPlayCount(id: string): Promise<void> {
    await this.prisma.album.update({
      where: { id },
      data: {
        playCount: {
          increment: 1,
        },
      },
    });
  }

  private toDomain(album: any): Album {
    return new Album(
      album.id,
      album.artistId,
      album.title,
      album.coverImage,
      album.albumType,
      album.releaseDate,
      album.description,
      album.totalTracks,
      album.duration,
      album.playCount,
      album.createdAt
    );
  }
}
