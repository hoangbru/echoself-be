import { Prisma, PrismaClient } from "@prisma/client";
import { SongRepository } from "@/modules/songs/song.repository";
import { GetSongsInput, SongSortType } from "@/modules/songs/song.types";

export class PrismaSongRepository implements SongRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(input: GetSongsInput) {
    const { page, limit, genre, artistId, search, sort } = input;

    const where: Prisma.SongWhereInput = {};

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

    if (genre) {
      where.genres = {
        some: {
          genre: {
            name: {
              equals: genre,
              mode: "insensitive",
            },
          },
        },
      };
    }

    const orderBy: Prisma.SongOrderByWithRelationInput | undefined =
      sort === SongSortType.LATEST
        ? { releaseDate: "desc" }
        : sort === SongSortType.POPULAR
        ? { views: "desc" }
        : undefined;

    const [songs, total] = await Promise.all([
      this.prisma.song.findMany({
        where,
        include: {
          album: true,
          artists: {
            include: { artist: true },
          },
        },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.song.count({ where }),
    ]);

    return { songs, total };
  }
}
