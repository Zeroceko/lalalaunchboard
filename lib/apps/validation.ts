import { z } from "zod";

import { appMessages } from "@/lib/apps/messages";

const launchDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, appMessages.launchDateInvalid)
  .refine(
    (value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)),
    appMessages.launchDateInvalid
  );

export const createAppSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, appMessages.appNameRequired)
    .max(80, appMessages.appNameTooLong),
  platform: z.enum(["ios", "android", "web"], {
    message: appMessages.platformInvalid
  }),
  launchDate: launchDateSchema
});

export const updateAppSchema = z.object({
  launchDate: launchDateSchema
});

export type CreateAppInput = z.infer<typeof createAppSchema>;
export type UpdateAppInput = z.infer<typeof updateAppSchema>;
