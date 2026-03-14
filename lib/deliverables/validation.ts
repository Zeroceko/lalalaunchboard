import { z } from "zod";

import { deliverableMessages } from "@/lib/deliverables/messages";

const maxFileSize = 10 * 1024 * 1024;

export const deliverableJsonSchema = z
  .object({
    type: z.enum(["link", "note"], {
      message: deliverableMessages.typeRequired
    }),
    content: z.string().trim().min(1, deliverableMessages.contentRequired)
  })
  .superRefine((value, ctx) => {
    if (value.type === "link") {
      const parsed = z.string().url().safeParse(value.content);

      if (!parsed.success) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["content"],
          message: deliverableMessages.invalidUrl
        });
      }
    }
  });

export const deliverableFileMetadataSchema = z.object({
  type: z.literal("file"),
  fileName: z.string().trim().min(1, deliverableMessages.fileRequired),
  fileSize: z
    .number()
    .min(1, deliverableMessages.fileRequired)
    .max(maxFileSize, deliverableMessages.fileTooLarge)
});

export type DeliverableJsonInput = z.infer<typeof deliverableJsonSchema>;

export function getMaxDeliverableFileSize() {
  return maxFileSize;
}
