import { SongRepository } from "./song.repository";

export class SongUseCase {
  constructor(private readonly songRepo: SongRepository) {}

  async getSongs(query: any) {
    return this.songRepo.findMany(query);
  }
}
