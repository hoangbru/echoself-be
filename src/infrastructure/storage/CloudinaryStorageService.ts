import { Readable } from "stream";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

import { IStorageService } from "@/application/interfaces";
import { logger } from "@/shared/utils/logger";
import { InternalServerError } from "@/shared/errors";

export class CloudinaryStorageService implements IStorageService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      throw new Error("Cloudinary credentials are not configured");
    }

    logger.info("Cloudinary configured successfully");
  }

  /**
   * Upload audio file to Cloudinary
   * Cloudinary automatically handles audio files and provides streaming URLs
   */
  async uploadAudio(
    file: Buffer,
    filename: string,
    mimeType: string
  ): Promise<{ url: string; size: number }> {
    try {
      // Convert buffer to stream for Cloudinary upload
      const stream = Readable.from(file);

      // Determine resource type and format
      const resourceType = "video"; // Cloudinary uses 'video' for audio files
      const format = this.getFormatFromMimeType(mimeType);

      // Upload to Cloudinary
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: resourceType,
            folder: `${process.env.CLOUDINARY_FOLDER}/tracks`,
            public_id: this.generatePublicId(filename),
            format: format,
            // Audio-specific options
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            // Quality settings
            quality: "auto",
            // Access control
            type: "upload",
            access_mode: "public",
            // Metadata
            context: {
              filename: filename,
              upload_date: new Date().toISOString(),
            },
            // Tags for organization
            tags: ["track", "audio"],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as UploadApiResponse);
            }
          }
        );

        stream.pipe(uploadStream);
      });

      logger.info(`Audio uploaded to Cloudinary: ${result.public_id}`);

      return {
        url: result.secure_url,
        size: result.bytes,
      };
    } catch (error) {
      logger.error("Failed to upload audio to Cloudinary:", error);
      throw new InternalServerError("Failed to upload audio file");
    }
  }

  async uploadImage(
    file: Buffer,
    filename: string,
    folder: "covers" | "avatars" | "banners" = "covers"
  ): Promise<{ url: string; size: number }> {
    try {
      const stream = Readable.from(file);

      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "image",
            folder: `${process.env.CLOUDINARY_FOLDER}/${folder}`,
            public_id: this.generatePublicId(filename),
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            // Image transformations
            transformation: [
              {
                quality: "auto",
                fetch_format: "auto", // Auto format selection (WebP, AVIF, etc.)
              },
            ],
            // Generate thumbnails
            eager: [
              { width: 300, height: 300, crop: "fill" }, // Thumbnail
              { width: 600, height: 600, crop: "fill" }, // Medium
            ],
            eager_async: true,
            tags: [folder, "image"],
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result as UploadApiResponse);
            }
          }
        );

        stream.pipe(uploadStream);
      });

      logger.info(`Image uploaded to Cloudinary: ${result.public_id}`);

      return {
        url: result.secure_url,
        size: result.bytes,
      };
    } catch (error) {
      logger.error("Failed to upload image to Cloudinary:", error);
      throw new InternalServerError("Failed to upload image file");
    }
  }

  /**
   * Delete audio file from Cloudinary
   */
  async deleteAudio(url: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(url);

      if (!publicId) {
        logger.warn("Could not extract public_id from URL:", url);
        return;
      }

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "video", // audio files are stored as 'video' type
        invalidate: true, // Invalidate CDN cache
      });

      if (result.result === "ok") {
        logger.info(`Audio deleted from Cloudinary: ${publicId}`);
      } else {
        logger.warn(
          `Failed to delete audio from Cloudinary: ${publicId}`,
          result
        );
      }
    } catch (error) {
      logger.error("Failed to delete audio from Cloudinary:", error);
      throw new InternalServerError("Failed to delete audio file");
    }
  }

  /**
   * Delete image from Cloudinary
   */
  async deleteImage(url: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(url);

      if (!publicId) {
        logger.warn("Could not extract public_id from URL:", url);
        return;
      }

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: "image",
        invalidate: true,
      });

      if (result.result === "ok") {
        logger.info(`Image deleted from Cloudinary: ${publicId}`);
      } else {
        logger.warn(
          `Failed to delete image from Cloudinary: ${publicId}`,
          result
        );
      }
    } catch (error) {
      logger.error("Failed to delete image from Cloudinary:", error);
      throw new InternalServerError("Failed to delete image file");
    }
  }

  /**
   * Get audio file info
   */
  async getAudioInfo(url: string): Promise<any> {
    try {
      const publicId = this.extractPublicId(url);

      if (!publicId) {
        throw new Error("Invalid Cloudinary URL");
      }

      const result = await cloudinary.api.resource(publicId, {
        resource_type: "video",
      });

      return {
        publicId: result.public_id,
        format: result.format,
        duration: result.duration,
        bitrate: result.bit_rate,
        size: result.bytes,
        width: result.width,
        height: result.height,
        createdAt: result.created_at,
        url: result.secure_url,
      };
    } catch (error) {
      logger.error("Failed to get audio info from Cloudinary:", error);
      throw new InternalServerError("Failed to get audio file info");
    }
  }

  /**
   * Generate streaming URL with transformations
   */
  getStreamingUrl(
    url: string,
    quality: "low" | "medium" | "high" = "high"
  ): string {
    const publicId = this.extractPublicId(url);

    if (!publicId) {
      return url;
    }

    const qualityMap = {
      low: { audio_codec: "mp3", audio_frequency: 22050 },
      medium: { audio_codec: "mp3", audio_frequency: 44100 },
      high: { audio_codec: "mp3", audio_frequency: 48000 },
    };

    return cloudinary.url(publicId, {
      resource_type: "video",
      ...qualityMap[quality],
      secure: true,
    });
  }

  /**
   * Generate responsive image URL
   */
  getResponsiveImageUrl(
    url: string,
    width: number,
    height: number,
    crop: "fill" | "fit" | "scale" = "fill"
  ): string {
    const publicId = this.extractPublicId(url);

    if (!publicId) {
      return url;
    }

    return cloudinary.url(publicId, {
      resource_type: "image",
      transformation: [
        {
          width,
          height,
          crop,
          quality: "auto",
          fetch_format: "auto",
        },
      ],
      secure: true,
    });
  }

  /**
   * Extract public_id from Cloudinary URL
   */
  private extractPublicId(url: string): string | null {
    try {
      // Cloudinary URL format:
      // https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/v{version}/{public_id}.{format}
      const regex = /\/upload\/(?:v\d+\/)?(.+)\.\w+$/;
      const match = url.match(regex);
      return match ? match[1] : null;
    } catch (error) {
      logger.error("Failed to extract public_id:", error);
      return null;
    }
  }

  /**
   * Generate unique public_id from filename
   */
    private generatePublicId(filename: string): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const ext = filename.split('.').pop()?.toLowerCase() || 'mp3';
    
    return `track_${timestamp}_${randomString}`;
  }


  /**
   * Get format from MIME type
   */
  private getFormatFromMimeType(mimeType: string): string {
    const mimeToFormat: Record<string, string> = {
      "audio/mpeg": "mp3",
      "audio/mp3": "mp3",
      "audio/wav": "wav",
      "audio/flac": "flac",
      "audio/aac": "aac",
      "audio/ogg": "ogg",
      "audio/m4a": "m4a",
    };

    return mimeToFormat[mimeType] || "mp3";
  }
}
