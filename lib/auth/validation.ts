import { z } from "zod";

import { getAuthMessages } from "@/lib/auth/messages";
import {
  DEFAULT_LOCALE,
  type Locale
} from "@/lib/i18n/config";

export function getLoginSchema(locale: Locale = DEFAULT_LOCALE) {
  const authMessages = getAuthMessages(locale);

  return z.object({
    email: z.string().trim().email(authMessages.emailInvalid),
    password: z.string().min(8, authMessages.passwordTooShort)
  });
}

export function getRegisterSchema(locale: Locale = DEFAULT_LOCALE) {
  const authMessages = getAuthMessages(locale);

  return getLoginSchema(locale)
    .extend({
      confirmPassword: z.string().min(8, authMessages.passwordTooShort),
      captchaToken: z.string().optional().default("")
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
}

export const loginSchema = getLoginSchema();
export const registerSchema = getRegisterSchema();

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
