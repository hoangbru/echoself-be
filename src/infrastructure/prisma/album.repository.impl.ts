import { Prisma, PrismaClient } from "@prisma/client";
import { AlbumRepository } from "@/modules/albums/album.repository";
import { GetAlbumsInput, AlbumSortType } from "@/modules/albums/album.types";

export class PrismaAlbumRepository implements AlbumRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(input: GetAlbumsInput) {
    const { page, limit, artistId, search, sort } = input;

    const where: Prisma.AlbumWhereInput = {};

    if (search) {
      where.title = {
        contains: search,
        mode: "insensitive",
      };
    }

    if (artistId) {
      where.artists = {
        some: { artistId },
      };
    }

    const orderBy: Prisma.AlbumOrderByWithRelationInput | undefined =
      sort === AlbumSortType.LATEST ? { releaseDate: "desc" } : undefined;

    const [albums, total] = await Promise.all([
      this.prisma.album.findMany({
        where,
        include: {
          artists: {
            include: { artist: true },
          },
          songs: {
            select: {
              id: true,
              title: true,
              duration: true,
            },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.album.count({ where }),
    ]);

    return { albums, total };
  }

  async findById(id: string) {
    return this.prisma.album.findUnique({
      where: { id },
      include: {
        artists: {
          include: { artist: true },
        },
        songs: {
          orderBy: { trackNumber: "asc" },
        },
      },
    });
  }
}
