import { PrismaClient } from "@prisma/client";
import { IArtistRepository } from "@/domain/repositories";

export class PrismaArtistRepository implements IArtistRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<any> {
    return await this.prisma.artist.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            username: true,
          },
        },
      },
    });
  }

  async existsById(id: string): Promise<boolean> {
    const count = await this.prisma.artist.count({
      where: { id },
    });

    return count > 0;
  }
}
