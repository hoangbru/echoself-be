import { z } from "zod";

export const createTrackSchema = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be at most 200 characters")
      .trim(),
    albumId: z.string().uuid("Invalid album ID").optional(),
    trackNumber: z
      .string()
      .regex(/^\d+$/, "Track number must be a number")
      .refine((val) => parseInt(val) >= 1 && parseInt(val) <= 999, {
        message: "Track number must be between 1 and 999",
      })
      .optional(),
    lyrics: z
      .string()
      .max(10000, "Lyrics too long (max 10,000 characters)")
      .optional(),
    isrc: z
      .string()
      .regex(
        /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/,
        "Invalid ISRC format (e.g., USRC17607839)"
      )
      .optional(),
    explicit: z.enum(["true", "false"]).optional(),
    genreIds: z
      .union([
        z.string(), // Single genre ID or JSON string
        z.array(z.string()), // Array (if sent as JSON body)
      ])
      .optional()
      .transform((val) => {
        if (Array.isArray(val)) {
          return val;
        }

        if (typeof val === "string") {
          try {
            const parsed = JSON.parse(val);
            return Array.isArray(parsed) ? parsed : [val];
          } catch {
            return [val];
          }
        }

        return [];
      })
      .refine((val) => val.length <= 5, {
        message: "Maximum 5 genres allowed",
      })
      .refine(
        (val) =>
          val.every((id) =>
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
              id
            )
          ),
        {
          message: "All genre IDs must be valid UUIDs",
        }
      ),
    autoPublish: z.enum(["true", "false"]).optional(),
  }),
});

export const updateTrackSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid track ID"),
  }),
  body: z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be at most 200 characters")
      .trim()
      .optional(),
    lyrics: z.string().max(10000, "Lyrics too long").optional(),
    explicit: z.boolean().optional(),
    albumId: z.string().uuid("Invalid album ID").nullable().optional(),
    trackNumber: z.number().int().min(1).max(999).nullable().optional(),
    genreIds: z
      .array(z.string().uuid())
      .max(5, "Maximum 5 genres allowed")
      .optional(),
  }),
});

export const trackIdSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid track ID"),
  }),
});
