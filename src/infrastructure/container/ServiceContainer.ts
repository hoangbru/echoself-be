import { FFmpegAudioProcessingService } from "../audio/FFmpegAudioProcessingService";
import { S3StorageService } from "../storage/S3StorageService";
import { MockEmailService } from "../email/MockEmailService";
import { InMemoryTokenBlacklistService } from "../cache/InMemoryTokenBlacklistService";

export class ServiceContainer {
  public readonly storageService = new S3StorageService();
  public readonly audioProcessingService = new FFmpegAudioProcessingService();
  public readonly emailService = new MockEmailService();
  public readonly tokenBlacklistService = new InMemoryTokenBlacklistService();
}
