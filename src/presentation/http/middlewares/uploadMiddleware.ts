import multer from "multer";
import { Request } from "express";

interface UploadOptions {
  allowedMimeTypes: string[];
  maxFileSize: number;
  fieldName: string;
}

const createUploadMiddleware = (options: UploadOptions) => {
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: options.maxFileSize,
    },
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: multer.FileFilterCallback
    ) => {
      if (options.allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(
          new Error(
            `Invalid file type. Allowed: ${options.allowedMimeTypes.join(", ")}`
          )
        );
      }
    },
  });

  return upload.single(options.fieldName);
};

export const uploadTrackMiddleware = createUploadMiddleware({
  fieldName: "audio",
  maxFileSize: 500 * 1024 * 1024, // 500MB
  allowedMimeTypes: [
    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/flac",
    "audio/aac",
    "audio/ogg",
    "audio/m4a",
  ],
});

export const uploadImageMiddleware = createUploadMiddleware({
  fieldName: "image",
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/gif",
  ],
});
