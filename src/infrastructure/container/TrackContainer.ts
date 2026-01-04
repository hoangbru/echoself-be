import { PrismaClient } from "@prisma/client";

import { TrackController } from "@/presentation/http/controllers/TrackController";
import { ServiceContainer } from "./ServiceContainer";
import {
  CreateTrack,
  DeleteTrack,
  GetTrackById,
  PublishTrack,
  UnpublishTrack,
} from "@/application/use-cases/track";
import {
  PrismaArtistRepository,
  PrismaGenreRepository,
  PrismaTrackRepository,
} from "../database/repositories";

export class TrackContainer {
  public readonly controller: TrackController;

  constructor(prisma: PrismaClient, services: ServiceContainer) {
    const trackRepository = new PrismaTrackRepository(prisma);
    const artistRepository = new PrismaArtistRepository(prisma);
    const genreRepository = new PrismaGenreRepository(prisma);

    const createTrack = new CreateTrack(
      trackRepository,
      artistRepository,
      genreRepository,
      services.storageService,
      services.audioProcessingService
    );

    const publishTrack = new PublishTrack(trackRepository);
    const unpublishTrack = new UnpublishTrack(trackRepository);
    const getTrackById = new GetTrackById(trackRepository);
    const deleteTrack = new DeleteTrack(
      trackRepository,
      services.storageService
    );

    this.controller = new TrackController(
      createTrack,
      publishTrack,
      unpublishTrack,
      getTrackById,
      deleteTrack
    );
  }
}
