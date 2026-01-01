import { Playlist } from "../entities/Playlist";

export interface IPlaylistRepository {
  save(playlist: Playlist): Promise<Playlist>;
  findById(id: string): Promise<Playlist | null>;
  findByUser(userId: string): Promise<Playlist[]>;
  update(playlist: Playlist): Promise<Playlist>;
  delete(id: string): Promise<void>;
  addTrack(playlistId: string, trackId: string): Promise<void>;
  removeTrack(playlistId: string, trackId: string): Promise<void>;
}
