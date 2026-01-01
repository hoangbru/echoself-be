import { Album } from "../entities/Album";

export interface IAlbumRepository {
  save(album: Album): Promise<Album>;
  findById(id: string): Promise<Album | null>;
  findByArtist(artistId: string): Promise<Album[]>;
  update(album: Album): Promise<Album>;
  delete(id: string): Promise<void>;
}
