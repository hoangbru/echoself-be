import { FFmpegAudioProcessingService } from "../audio/FFmpegAudioProcessingService";
import { S3StorageService } from "../storage/S3StorageService";

export class ServiceContainer {
  public readonly storageService = new S3StorageService();
  public readonly audioProcessingService = new FFmpegAudioProcessingService();
}
