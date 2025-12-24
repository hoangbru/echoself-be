import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    userName: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6),
    displayName: z.string().optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    identifier: z.string().min(3),
    password: z.string().min(6),
  }),
});
