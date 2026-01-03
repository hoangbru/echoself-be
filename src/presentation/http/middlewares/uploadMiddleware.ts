import { Request } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";

interface UploadOptions {
  allowedMimeTypes: string[];
  maxFileSize: number;
  fieldName: string;
}

const createUploadMiddleware = (options: UploadOptions) => {
  const uploadDir = "uploads/temp";
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  
  const upload = multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
          null,
          file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
        );
      },
    }),
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
  allowedMimeTypes: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/flac"],
});

export const uploadImageMiddleware = createUploadMiddleware({
  fieldName: "image",
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
});
