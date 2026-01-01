import { PrismaClient } from "@prisma/client";
import { Album } from "@/domain/entities/Album";
import { IAlbumRepository } from "@/domain/repositories/IAlbumRepository";

export class PrismaAlbumRepository implements IAlbumRepository {
  constructor(private readonly prisma: PrismaClient) {}

  save(album: Album): Promise<Album> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<Album | null> {
    throw new Error("Method not implemented.");
  }
  findByArtist(artistId: string): Promise<Album[]> {
    throw new Error("Method not implemented.");
  }
  update(album: Album): Promise<Album> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
