import { z } from "zod";

import { authMessages } from "@/lib/auth/messages";

export const loginSchema = z.object({
  email: z.string().trim().email(authMessages.emailInvalid),
  password: z.string().min(8, authMessages.passwordTooShort)
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(8, authMessages.passwordTooShort),
    captchaToken: z.string().min(1, authMessages.captchaRequired)
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: authMessages.passwordsMismatch
      });
    }
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;

export function flattenFieldErrors(error: z.ZodError) {
  const fieldErrors = error.flatten().fieldErrors;

  return Object.fromEntries(
    Object.entries(fieldErrors).flatMap(([key, value]) => {
      const firstError = value?.[0];
      return firstError ? [[key, firstError]] : [];
    })
  );
}
