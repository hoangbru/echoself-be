export interface SongResponseDTO {
  id: string;
  title: string;
  duration: number;
  coverUri: string | null;
  views: number;

  album: {
    id: string;
    title: string;
    coverUri: string | null;
  };

  artists: {
    id: string;
    name: string;
  }[];
}
