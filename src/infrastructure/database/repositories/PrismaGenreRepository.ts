import { PrismaClient } from "@prisma/client";
import { Genre } from "@/domain/entities";
import { IGenreRepository } from "@/domain/repositories";

export class PrismaGenreRepository implements IGenreRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Genre | null> {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
    });

    return genre ? this.toDomain(genre) : null;
  }

  async findByIds(ids: string[]): Promise<Genre[]> {
    const genres = await this.prisma.genre.findMany({
      where: {
        id: { in: ids },
      },
    });

    return genres.map(this.toDomain);
  }

  async findAll(): Promise<Genre[]> {
    const genres = await this.prisma.genre.findMany({
      orderBy: { name: "asc" },
    });

    return genres.map(this.toDomain);
  }

  async findBySlug(slug: string): Promise<Genre | null> {
    const genre = await this.prisma.genre.findUnique({
      where: { slug },
    });

    return genre ? this.toDomain(genre) : null;
  }

  private toDomain(genre: any): Genre {
    return new Genre(
      genre.id,
      genre.name,
      genre.slug,
      genre.description,
      genre.imageUrl,
      genre.createdAt
    );
  }
}
