import { Request, Response, NextFunction } from "express";
import { UploadTrack } from "@/application/use-cases/track/UploadTrack";
import { CreateTrackDTO } from "@/application/dto/TrackDTO";

// Extend Express Request type to include 'user'
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      artistId?: string;
      role: string;
      // add other properties if needed
    }
    interface Request {
      user?: User;
    }
  }
}

export class TrackController {
  constructor(private readonly uploadTrack: UploadTrack) {}

  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Audio file is required",
        });
        return;
      }

      // Get authenticated user's artist ID
      const artistId = req.user?.artistId;
      if (!artistId) {
        res.status(403).json({
          success: false,
          message: "Only artists can upload tracks",
        });
        return;
      }

      const data: CreateTrackDTO = {
        artistId,
        title: req.body.title,
        duration: 0, // Will be calculated from file
        albumId: req.body.albumId,
        trackNumber: req.body.trackNumber
          ? parseInt(req.body.trackNumber)
          : undefined,
        lyrics: req.body.lyrics,
        isrc: req.body.isrc,
        explicit: req.body.explicit === "true",
        genreIds: req.body.genreIds ? JSON.parse(req.body.genreIds) : [],
      };

      const result = await this.uploadTrack.execute({
        file: req.file.buffer,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        data,
      });

      res.status(201).json({
        success: true,
        message: "Track uploaded successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
