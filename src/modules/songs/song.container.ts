import { PrismaSongRepository } from "@/infrastructure/prisma/song.repository.impl";
import { SongUseCase } from "./song.usecase";
import { SongController } from "./song.controller";

const songRepository = new PrismaSongRepository();
const songUseCase = new SongUseCase(songRepository);

export const songController = new SongController(songUseCase);
