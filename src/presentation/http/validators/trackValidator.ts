import { z } from "zod";

export const uploadTrackSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    albumId: z.string().uuid().optional(),
    trackNumber: z.string().regex(/^\d+$/).optional(),
    lyrics: z.string().optional(),
    isrc: z
      .string()
      .regex(/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/)
      .optional(),
    explicit: z.enum(["true", "false"]).optional(),
    genreIds: z.string().optional(),
  }),
});
