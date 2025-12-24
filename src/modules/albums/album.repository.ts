import { GetAlbumsInput, AlbumListResult } from "./album.types";

export interface AlbumRepository {
  findMany(input: GetAlbumsInput): Promise<AlbumListResult>;
  findById(id: string): Promise<any | null>;
}
