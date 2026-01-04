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
  uploadImage?(
    file: Buffer,
    filename: string,
    folder?: string
  ): Promise<{
    url: string;
    size: number;
  }>;
  deleteImage?(url: string): Promise<void>;
  getStreamingUrl?(url: string, quality?: "low" | "medium" | "high"): string;
  getResponsiveImageUrl?(
    url: string,
    width: number,
    height: number,
    crop?: string
  ): string;
}
