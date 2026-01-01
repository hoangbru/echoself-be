import { Track } from "../entities/Track";

export interface ITrackRepository {
  save(track: Track): Promise<Track>;
  findById(id: string): Promise<Track | null>;
  findByArtist(artistId: string): Promise<Track[]>;
  update(track: Track): Promise<Track>;
  delete(id: string): Promise<void>;
  existsByTitle(artistId: string, title: string): Promise<boolean>;
}
