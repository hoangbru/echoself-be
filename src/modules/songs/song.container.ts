import { prisma } from "@/infrastructure/prisma/prisma.client";
import { PrismaSongRepository } from "@/infrastructure/prisma/song.repository.impl";
import { SongUseCase } from "./song.usecase";
import { SongController } from "./song.controller";

const songRepository = new PrismaSongRepository(prisma);
const songUseCase = new SongUseCase(songRepository);

export const songController = new SongController(songUseCase);
