export type SongSortType = "trending" | "latest" | "popular";

export interface GetSongsInput {
  page: number;
  limit: number;
  genre?: string;
  artistId?: string;
  search?: string;
  sort?: SongSortType;
}
