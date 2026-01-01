import { Request, Response, NextFunction } from "express";
import { CreateAlbum } from "@/application/use-cases/album/CreateAlbum";
import { GetAlbumById } from "@/application/use-cases/album/GetAlbumById";
import { GetAlbumsByArtist } from "@/application/use-cases/album/GetAlbumsByArtist";
import { DeleteAlbum } from "@/application/use-cases/album/DeleteAlbum";

export class AlbumController {
  constructor(
    private readonly createAlbum: CreateAlbum,
    private readonly getAlbumById: GetAlbumById,
    private readonly getAlbumsByArtist: GetAlbumsByArtist,
    private readonly deleteAlbum: DeleteAlbum
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const artistId = req.user!.artistId;

      if (!artistId) {
        res.status(403).json({
          success: false,
          message: "Only artists can create albums",
        });
        return;
      }

      const album = await this.createAlbum.execute({
        artistId,
        title: req.body.title,
        description: req.body.description,
        coverImage: req.body.coverImage,
        albumType: req.body.albumType,
        releaseDate: new Date(req.body.releaseDate),
      });

      res.status(201).json({
        success: true,
        message: "Album created successfully",
        data: album,
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
      const album = await this.getAlbumById.execute(req.params.id);

      if (!album) {
        res.status(404).json({
          success: false,
          message: "Album not found",
        });
        return;
      }

      res.json({
        success: true,
        data: album,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const artistId = req.query.artistId as string;

      if (!artistId) {
        res.status(400).json({
          success: false,
          message: "Artist ID is required",
        });
        return;
      }

      const albums = await this.getAlbumsByArtist.execute(artistId);

      res.json({
        success: true,
        data: albums,
        meta: {
          total: albums.length,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: Implement update logic
      res.status(501).json({
        success: false,
        message: "Update album not implemented yet",
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      await this.deleteAlbum.execute(req.params.id, userId);

      res.json({
        success: true,
        message: "Album deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
