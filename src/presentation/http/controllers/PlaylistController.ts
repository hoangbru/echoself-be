import { Request, Response, NextFunction } from "express";
import { CreatePlaylist } from "@/application/use-cases/playlist/CreatePlaylist";
import { GetPlaylistById } from "@/application/use-cases/playlist/GetPlaylistById";
import { AddTrackToPlaylist } from "@/application/use-cases/playlist/AddTrackToPlaylist";
import { RemoveTrackFromPlaylist } from "@/application/use-cases/playlist/RemoveTrackFromPlaylist";

export class PlaylistController {
  constructor(
    private readonly createPlaylist: CreatePlaylist,
    private readonly getPlaylistById: GetPlaylistById,
    private readonly addTrackToPlaylist: AddTrackToPlaylist,
    private readonly removeTrackFromPlaylist: RemoveTrackFromPlaylist
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;

      const playlist = await this.createPlaylist.execute({
        userId,
        title: req.body.title,
        description: req.body.description,
        coverImage: req.body.coverImage,
        visibility: req.body.visibility,
      });

      res.status(201).json({
        success: true,
        message: "Playlist created successfully",
        data: playlist,
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
      const playlist = await this.getPlaylistById.execute(req.params.id);

      if (!playlist) {
        res.status(404).json({
          success: false,
          message: "Playlist not found",
        });
        return;
      }

      res.json({
        success: true,
        data: playlist,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserPlaylists(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // TODO: Implement get user playlists
      res.status(501).json({
        success: false,
        message: "Get user playlists not implemented yet",
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublicPlaylists(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // TODO: Implement get public playlists
      res.status(501).json({
        success: false,
        message: "Get public playlists not implemented yet",
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
        message: "Update playlist not implemented yet",
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: Implement delete logic
      res.status(501).json({
        success: false,
        message: "Delete playlist not implemented yet",
      });
    } catch (error) {
      next(error);
    }
  }

  async addTrack(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const playlistId = req.params.id;
      const trackId = req.body.trackId;

      await this.addTrackToPlaylist.execute(playlistId, trackId, userId);

      res.json({
        success: true,
        message: "Track added to playlist successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async removeTrack(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.id;
      const playlistId = req.params.id;
      const trackId = req.params.trackId;

      await this.removeTrackFromPlaylist.execute(playlistId, trackId, userId);

      res.json({
        success: true,
        message: "Track removed from playlist successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
