import { CloudinaryStorageService } from "../storage/CloudinaryStorageService";
import { MockEmailService } from "../email/MockEmailService";
import { InMemoryTokenBlacklistService } from "../cache/InMemoryTokenBlacklistService";
import { AudioProcessingServiceFactory } from "../audio/AudioProcessingServiceFactory";

export class ServiceContainer {
  public readonly storageService = new CloudinaryStorageService();
  public readonly audioProcessingService =
    AudioProcessingServiceFactory.create();
  public readonly emailService = new MockEmailService();
  public readonly tokenBlacklistService = new InMemoryTokenBlacklistService();
}
