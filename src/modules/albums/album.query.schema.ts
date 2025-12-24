import { z } from "zod";
import { AlbumSortType } from "./album.types";

export const getAlbumsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(50).default(20),
    artistId: z.string().uuid().optional(),
    search: z.string().optional(),
    sort: z.nativeEnum(AlbumSortType).optional(),
  }),
});
