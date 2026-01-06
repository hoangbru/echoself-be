import { execSync } from "child_process";

import { FFmpegAudioProcessingService } from "./FFmpegAudioProcessingService";
import { IAudioProcessingService } from "@/application/interfaces";
import { logger } from "@/shared/utils/logger";
import { MockAudioProcessingService } from "./MockAudioProcessingService";

export class AudioProcessingServiceFactory {
  static create(): IAudioProcessingService {
    // Auto-detect if FFmpeg is installed
    if (this.isFFmpegInstalled()) {
      logger.info("FFmpeg detected - using FFmpegAudioProcessingService");
      return new FFmpegAudioProcessingService();
    } else {
      logger.warn("  FFmpeg not found - using MockAudioProcessingService");
      logger.warn("  Install FFmpeg for accurate audio metadata:");
      logger.warn("   - macOS: brew install ffmpeg");
      logger.warn("   - Ubuntu: sudo apt install ffmpeg");
      logger.warn("   - Windows: choco install ffmpeg");
      return new MockAudioProcessingService();
    }
  }

  private static isFFmpegInstalled(): boolean {
    try {
      execSync("ffprobe -version", { stdio: "ignore" });
      return true;
    } catch {
      return false;
    }
  }
}
