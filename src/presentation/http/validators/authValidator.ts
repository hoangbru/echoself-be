import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").toLowerCase().trim(),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .trim(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must be at most 100 characters"),
    displayName: z
      .string()
      .min(1, "Display name is required")
      .max(100, "Display name must be at most 100 characters")
      .trim()
      .optional(),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    identifier: z
      .string()
      .min(3, "Email or username must be at least 3 characters")
      .max(100, "Email or username must be at most 100 characters")
      .trim(),
    password: z.string().min(1, "Password is required"),
  }),
});

// Alternative: More specific validation
export const loginSchemaDetailed = z.object({
  body: z.object({
    identifier: z
      .string()
      .trim()
      .refine(
        (val) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
          return emailRegex.test(val) || usernameRegex.test(val);
        },
        {
          message:
            "Must be a valid email or username (3-30 characters, letters, numbers, underscores)",
        }
      ),
    password: z.string().min(1, "Password is required"),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),
});

export const verifyEmailSchema = z.object({
  body: z.object({
    token: z.string().min(1, "Verification token is required"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").toLowerCase().trim(),
  }),
});

export const resetPasswordSchema = z
  .object({
    body: z.object({
      token: z.string().min(1, "Reset token is required"),
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(100, "Password must be at most 100 characters"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
    }),
  })
  .refine((data) => data.body.newPassword === data.body.confirmPassword, {
    message: "Passwords don't match",
    path: ["body", "confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    body: z.object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters")
        .max(100, "New password must be at most 100 characters"),
      confirmPassword: z.string().min(1, "Please confirm your new password"),
    }),
  })
  .refine((data) => data.body.newPassword === data.body.confirmPassword, {
    message: "Passwords don't match",
    path: ["body", "confirmPassword"],
  })
  .refine((data) => data.body.currentPassword !== data.body.newPassword, {
    message: "New password must be different from current password",
    path: ["body", "newPassword"],
  });
