import { z } from "zod";

export const getSongsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(20),
    genre: z.string().optional(),
    artistId: z.string().uuid().optional(),
    search: z.string().optional(),
    sort: z.enum(["trending", "latest", "popular"]).optional(),
  }),
});
