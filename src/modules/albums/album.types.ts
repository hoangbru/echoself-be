export enum AlbumSortType {
  LATEST = "latest",
  POPULAR = "popular",
}

export interface GetAlbumsInput {
  page: number;
  limit: number;
  artistId?: string;
  search?: string;
  sort?: AlbumSortType;
}

export interface AlbumListResult {
  albums: any[];
  total: number;
}
