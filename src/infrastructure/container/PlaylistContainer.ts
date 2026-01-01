import { PrismaClient } from "@prisma/client";

import { PlaylistController } from "@/presentation/http/controllers/PlaylistController";
import { PrismaPlaylistRepository } from "../database/repositories/PrismaPlaylistRepository";
import {
  AddTrackToPlaylist,
  CreatePlaylist,
  GetPlaylistById,
  RemoveTrackFromPlaylist,
} from "@/application/use-cases/playlist";

export class PlaylistContainer {
  public readonly controller: PlaylistController;

  constructor(prisma: PrismaClient) {
    const playlistRepository = new PrismaPlaylistRepository(prisma);

    this.controller = new PlaylistController(
      new CreatePlaylist(playlistRepository),
      new GetPlaylistById(playlistRepository),
      new AddTrackToPlaylist(playlistRepository),
      new RemoveTrackFromPlaylist(playlistRepository)
    );
  }
}
