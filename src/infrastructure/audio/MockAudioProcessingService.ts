import { AudioQuality } from "@prisma/client";

import { IAudioProcessingService } from "@/application/interfaces";
import { logger } from "@/shared/utils/logger";

export class MockAudioProcessingService implements IAudioProcessingService {
  async getMetadata(file: Buffer): Promise<{
    duration: number;
    bitrate: number;
    sampleRate: number;
  }> {
    logger.warn(
      "Using MockAudioProcessingService - install FFmpeg for real metadata"
    );

    // Mock metadata based on file size
    const fileSizeMB = file.length / (1024 * 1024);

    // Rough estimation:
    // - MP3 320kbps ≈ 2.4MB per minute
    // - MP3 128kbps ≈ 1MB per minute
    const estimatedDuration = Math.round((fileSizeMB / 1.5) * 60); // seconds

    return {
      duration: estimatedDuration > 0 ? estimatedDuration : 180, // default 3 minutes
      bitrate: 192, // default 192kbps
      sampleRate: 44100, // standard CD quality
    };
  }

  async transcode(file: Buffer, quality: AudioQuality): Promise<Buffer> {
    logger.warn("Using MockAudioProcessingService - skipping transcoding");

    // Return original file without transcoding
    return file;
  }

  async generateWaveform(file: Buffer): Promise<number[]> {
    logger.warn("Using MockAudioProcessingService - generating mock waveform");

    // Generate mock waveform data
    const samples = 100;
    return Array.from({ length: samples }, () => Math.random());
  }
}
