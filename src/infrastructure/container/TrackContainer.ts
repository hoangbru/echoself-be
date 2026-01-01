import { UploadTrack } from "@/application/use-cases/track/UploadTrack";
import { TrackController } from "@/presentation/http/controllers/TrackController";
import { PrismaClient } from "@prisma/client";
import { ServiceContainer } from "./ServiceContainer";
import { PrismaTrackRepository } from "../database/repositories/PrismaTrackRepository";

export class TrackContainer {
  public readonly controller: TrackController;

  constructor(prisma: PrismaClient, services: ServiceContainer) {
    const trackRepository = new PrismaTrackRepository(prisma);

    const uploadTrack = new UploadTrack(
      trackRepository,
      services.storageService,
      services.audioProcessingService
    );

    this.controller = new TrackController(uploadTrack);
  }
}
