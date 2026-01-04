import { Request, Response, NextFunction } from "express";

import { CreateTrackDTO } from "@/application/dto/TrackDTO";
import {
  CreateTrack,
  DeleteTrack,
  GetTrackById,
  PublishTrack,
  UnpublishTrack,
} from "@/application/use-cases/track";

export class TrackController {
  constructor(
    private readonly createTrack: CreateTrack,
    private readonly publishTrack: PublishTrack,
    private readonly unpublishTrack: UnpublishTrack,
    private readonly getTrackById: GetTrackById,
    private readonly deleteTrack: DeleteTrack
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: "Audio file is required",
        });
        return;
      }

      const artistId = req.user?.artistId;
      if (!artistId) {
        res.status(403).json({
          success: false,
          message: "Only artists can upload tracks",
        });
        return;
      }

      let genreIds: string[] = [];
      if (req.body.genreIds) {
        if (Array.isArray(req.body.genreIds)) {
          genreIds = req.body.genreIds;
        } else if (typeof req.body.genreIds === 'string') {
          try {
            const parsed = JSON.parse(req.body.genreIds);
            genreIds = Array.isArray(parsed) ? parsed : [req.body.genreIds];
          } catch {
            genreIds = [req.body.genreIds];
          }
        }
      }

      const data: CreateTrackDTO = {
        artistId,
        title: req.body.title,
        albumId: req.body.albumId,
        trackNumber: req.body.trackNumber
          ? parseInt(req.body.trackNumber)
          : undefined,
        lyrics: req.body.lyrics,
        isrc: req.body.isrc,
        explicit: req.body.explicit === "true",
        genreIds: genreIds,
        autoPublish: req.body.autoPublish === "true",
      };

      const result = await this.createTrack.execute({
        file: req.file.buffer,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        data,
      });

      res.status(201).json({
        success: true,
        message: result.isPublished
          ? "Track uploaded and published successfully"
          : "Track uploaded as draft successfully",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async publish(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const artistId = req.user?.artistId;
      if (!artistId) {
        res.status(403).json({
          success: false,
          message: "Only artists can publish tracks",
        });
        return;
      }

      const track = await this.publishTrack.execute(req.params.id, artistId);

      res.json({
        success: true,
        message: "Track published successfully",
        data: { id: track.id, isPublished: track.isPublished },
      });
    } catch (error) {
      next(error);
    }
  }

  async unpublish(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const artistId = req.user?.artistId;
      if (!artistId) {
        res.status(403).json({
          success: false,
          message: "Only artists can unpublish tracks",
        });
        return;
      }

      const track = await this.unpublishTrack.execute(req.params.id, artistId);

      res.json({
        success: true,
        message: "Track unpublished successfully",
        data: { id: track.id, isPublished: track.isPublished },
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const track = await this.getTrackById.execute(req.params.id);

      if (!track) {
        res.status(404).json({
          success: false,
          message: "Track not found",
        });
        return;
      }

      res.json({
        success: true,
        data: track,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const artistId = req.user?.artistId;
      if (!artistId) {
        res.status(403).json({
          success: false,
          message: "Only artists can delete tracks",
        });
        return;
      }

      await this.deleteTrack.execute(req.params.id, artistId);

      res.json({
        success: true,
        message: "Track deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
