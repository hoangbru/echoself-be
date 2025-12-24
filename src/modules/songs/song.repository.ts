import { GetSongsInput } from "./song.types";

export interface SongRepository {
  findMany(input: GetSongsInput): Promise<{
    songs: any[];
    total: number;
  }>;
}
