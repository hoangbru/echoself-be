import { prisma } from "@/infrastructure/prisma/prisma.client";
import { PrismaAlbumRepository } from "@/infrastructure/prisma/album.repository.impl";
import { AlbumUseCase } from "./album.usecase";
import { AlbumController } from "./album.controller";

const albumRepository = new PrismaAlbumRepository(prisma);
const albumUseCase = new AlbumUseCase(albumRepository);

export const albumController = new AlbumController(albumUseCase);
