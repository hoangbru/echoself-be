import { AudioQuality } from "@prisma/client";

export interface IAudioProcessingService {
  getMetadata(file: Buffer): Promise<{
    duration: number;
    bitrate: number;
    sampleRate: number;
  }>;
  transcode(file: Buffer, quality: AudioQuality): Promise<Buffer>;
  generateWaveform(file: Buffer): Promise<number[]>;
}
