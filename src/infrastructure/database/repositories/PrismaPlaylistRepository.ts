import { PrismaClient } from "@prisma/client";
import { Playlist } from "@/domain/entities/Playlist";
import { IPlaylistRepository } from "@/domain/repositories/IPlaylistRepository";

export class PrismaPlaylistRepository implements IPlaylistRepository {
  constructor(private readonly prisma: PrismaClient) {}

  save(playlist: Playlist): Promise<Playlist> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<Playlist | null> {
    throw new Error("Method not implemented.");
  }
  findByUser(userId: string): Promise<Playlist[]> {
    throw new Error("Method not implemented.");
  }
  update(playlist: Playlist): Promise<Playlist> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  addTrack(playlistId: string, trackId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  removeTrack(playlistId: string, trackId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
