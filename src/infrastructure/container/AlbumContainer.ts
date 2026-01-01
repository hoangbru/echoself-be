import { PrismaClient } from "@prisma/client";

import { AlbumController } from "@/presentation/http/controllers/AlbumController";
import { PrismaAlbumRepository } from "../database/repositories/PrismaAlbumRepository";
import {
  CreateAlbum,
  DeleteAlbum,
  GetAlbumById,
  GetAlbumsByArtist,
} from "@/application/use-cases/album";

export class AlbumContainer {
  public readonly controller: AlbumController;

  constructor(prisma: PrismaClient) {
    const albumRepository = new PrismaAlbumRepository(prisma);

    this.controller = new AlbumController(
      new CreateAlbum(albumRepository),
      new GetAlbumById(albumRepository),
      new GetAlbumsByArtist(albumRepository),
      new DeleteAlbum(albumRepository)
    );
  }
}
