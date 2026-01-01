export interface IStorageService {
  uploadAudio(
    file: Buffer,
    filename: string,
    mimeType: string
  ): Promise<{
    url: string;
    size: number;
  }>;
  deleteAudio(url: string): Promise<void>;
}
