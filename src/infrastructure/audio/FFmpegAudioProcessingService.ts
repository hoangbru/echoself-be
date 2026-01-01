import ffmpeg from "fluent-ffmpeg";
import { Readable } from "stream";
import { IAudioProcessingService } from "@/application/interfaces/IAudioProcessingService";
import { AudioQuality } from "@prisma/client";

export class FFmpegAudioProcessingService implements IAudioProcessingService {
  async getMetadata(file: Buffer): Promise<{
    duration: number;
    bitrate: number;
    sampleRate: number;
  }> {
    return new Promise((resolve, reject) => {
      const stream = Readable.from(file);

      ffmpeg(stream).ffprobe((err, metadata) => {
        if (err) {
          reject(err);
          return;
        }

        const audioStream = metadata.streams.find(
          (s) => s.codec_type === "audio"
        );

        resolve({
          duration: metadata.format.duration || 0,
          bitrate: parseInt(String(metadata.format.bit_rate ?? "0")) / 1000,
          sampleRate: audioStream?.sample_rate || 44100,
        });
      });
    });
  }

  async transcode(file: Buffer, quality: AudioQuality): Promise<Buffer> {
    const bitrate = this.getBitrate(quality);

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      const stream = Readable.from(file);

      ffmpeg(stream)
        .audioBitrate(bitrate)
        .audioCodec("libmp3lame")
        .format("mp3")
        .on("error", reject)
        .on("end", () => resolve(Buffer.concat(chunks)))
        .pipe()
        .on("data", (chunk: Buffer) => chunks.push(chunk));
    });
  }

  async generateWaveform(file: Buffer): Promise<number[]> {
    // Implementation for waveform generation
    // This is a placeholder - you'd use a library like audiowaveform
    return [];
  }

  private getBitrate(quality: AudioQuality): number {
    const bitrateMap = {
      [AudioQuality.LOW]: 96,
      [AudioQuality.MEDIUM]: 128,
      [AudioQuality.HIGH]: 256,
      [AudioQuality.LOSSLESS]: 1411,
    };

    return bitrateMap[quality];
  }
}
