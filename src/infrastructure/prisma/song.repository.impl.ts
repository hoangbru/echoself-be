import { Prisma } from "@prisma/client";
import { SongRepository } from "@/modules/songs/song.repository";
import { prisma } from "../prisma/prisma.client";
import { GetSongsInput } from "@/modules/songs/song.types";

export class PrismaSongRepository implements SongRepository {
  async findMany(input: GetSongsInput) {
    const { page, limit, genre, artistId, search, sort } = input;

    const where: any = {};

    if (search) {
      where.title = { contains: search, mode: "insensitive" };
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
            name: { equals: genre, mode: "insensitive" },
          },
        },
      };
    }

    const orderBy: Prisma.SongOrderByWithRelationInput | undefined =
      sort === "latest"
        ? { releaseDate: Prisma.SortOrder.desc }
        : sort === "popular"
        ? { views: Prisma.SortOrder.desc }
        : undefined;

    const [songs, total] = await Promise.all([
      prisma.song.findMany({
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
      prisma.song.count({ where }),
    ]);

    return { songs, total };
  }
}
