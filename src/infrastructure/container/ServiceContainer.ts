import { FFmpegAudioProcessingService } from "../audio/FFmpegAudioProcessingService";
import { CloudinaryStorageService } from "../storage/CloudinaryStorageService";
import { MockEmailService } from "../email/MockEmailService";
import { InMemoryTokenBlacklistService } from "../cache/InMemoryTokenBlacklistService";

export class ServiceContainer {
  public readonly storageService = new CloudinaryStorageService();
  public readonly audioProcessingService = new FFmpegAudioProcessingService();
  public readonly emailService = new MockEmailService();
  public readonly tokenBlacklistService = new InMemoryTokenBlacklistService();
}
